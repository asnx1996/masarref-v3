-- ============================================================
--  تبسيط الصناديق: سحب · نقل · إيداع — بلا قروض
-- ------------------------------------------------------------
--  الفكرة الجديدة:
--   • الصندوق إله ثلاث حركات بس: سحب، نقل، إيداع.
--   • السحب دائماً يروح لتصنيف مصاريف، ونوعه ينحدد بـ«تاريخ
--     تثبيت الميزانية» (budgets.fixed_date):
--       - قبل التثبيت (أو ماكو تثبيت): «تغطية» — يغطّي جزء من
--         مخصص التصنيف، فيقل اللي ينستقطع من الراتب (نفس القاعدة
--         القديمة: المتاح = max(المخصص، السحب)).
--         الأنواع: fund_wd (الصندوق) + cat_fund (التصنيف)
--       - بعد التثبيت: «سلفة» — تنضاف فوك المخصص هسه، ومن ينقفل
--         الشهر تترحّل كدين: الفترة الجاية تسدّها للصندوق من
--         ميزانيتها تلقائياً (حركة fund_rep تنقص «الباقي للصرف»
--         وترجّع رصيد الصندوق).
--         الأنواع: fund_adv (الصندوق) + cat_adv (التصنيف)
--   • القروض (add_loan) انشالت. الحركات القديمة تبقى وتنحسب مثل
--     ما هي — بس ماكو قروض جديدة.
--
--  وبنفس الترحيل تصليحات المراجعة:
--   ١) surplus_of تستعمل spend_total (چانت تخصم القرض المحمّل
--      من الفائض، والواجهة ما تخصمه).
--   ٢) delete_expense ما تحذف نص عملية — تحذف الطرفين سوة.
--   ٣) edit_expense ترفض حركات الصناديق وتمنع نقل مصروف لصندوق.
--   ٤) delete/edit_withdrawal ترفض القرض اللي انرجّع أو انعدم.
--   ٥) save_budget تحمي الصندوق اللي عليه حركات بهذي الفترة.
--   ٦) السحب والإيداع يرفضون الصندوق المغلق، والسحب ما يعدّي
--      الرصيد، وتعديل السحب/النقل ما يخلي الصندوق بالسالب.
--   ٧) transfer_category تنقل بس الجزء اللي من الراتب — چانت
--      تخلق فلوس لو السحب يغطّي المخصص.
--
--  نسخة احتياطية من تعريفات الدوال قبل التغيير تنحفظ بجدول
--  backup.fn_before_fund_simplify (سكيما مو مكشوفة للـAPI).
-- ============================================================

begin;

-- ------------------------------------------------------------
-- ٠) نسخة احتياطية من الدوال اللي راح تتغيّر
-- ------------------------------------------------------------
create schema if not exists backup;
revoke all on schema backup from public, anon, authenticated;
drop table if exists backup.fn_before_fund_simplify;
create table backup.fn_before_fund_simplify as
select p.proname, pg_get_function_identity_arguments(p.oid) as args,
       pg_get_functiondef(p.oid) as def, now() as saved_at
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('withdraw_fund','add_loan','add_deposit','spend_total','surplus_of',
                    'close_month','unlock_month','delete_withdrawal','delete_expense',
                    'edit_expense','edit_withdrawal','transfer_category','save_budget','load_month');

-- ------------------------------------------------------------
-- ١) تاريخ تثبيت الميزانية
-- ------------------------------------------------------------
alter table public.budgets add column if not exists fixed_date text;

create or replace function public.set_budget_fixed(p_month text, p_date text)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  v  text := nullif(left(trim(coalesce(p_date, '')), 10), '');
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if exists (select 1 from budgets where household_id = hh and month = p_month and locked) then
    raise exception 'هذه الفترة مقفلة';
  end if;
  insert into budgets (household_id, month) values (hh, p_month)
  on conflict (household_id, month) do nothing;
  update budgets set fixed_date = v where household_id = hh and month = p_month;
end $function$;

-- ------------------------------------------------------------
-- ٢) رصيد صندوق بفترة — مصدر واحد
-- ------------------------------------------------------------
create or replace function public.fund_balance(p_hh uuid, p_month text, p_name text)
 returns numeric
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select coalesce(c.carried, 0) + coalesce(c.amount, 0)
         - coalesce((select sum(e.amount) from expenses e
                     where e.household_id = p_hh and e.month = p_month and e.category = p_name), 0)
  from categories c
  where c.household_id = p_hh and c.month = p_month and c.name = p_name and c.type = 'save'
$function$;
revoke execute on function public.fund_balance(uuid, text, text) from public, anon;

-- ------------------------------------------------------------
-- ٣) load_month — يرجّع fixedDate
-- ------------------------------------------------------------
create or replace function public.load_month(p_month text)
 returns jsonb
 language plpgsql
 stable security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  b  budgets%rowtype;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  select * into b from budgets where household_id = hh and month = p_month;

  return jsonb_build_object(
    'budget', jsonb_build_object(
      'month',     p_month,
      'title',     b.title,
      'startDate', b.start_date,
      'endDate',   b.end_date,
      'fixedDate', b.fixed_date,
      'salary1',   coalesce(b.salary1, 0),
      'salary2',   coalesce(b.salary2, 0),
      'locked',    coalesce(b.locked, false),
      'salaries', coalesce((
        select jsonb_agg(jsonb_build_object('person', s.person, 'amount', s.amount) order by s.sort)
        from salaries s where s.household_id = hh and s.month = p_month
      ), '[]'::jsonb),
      'categories', coalesce((
        select jsonb_agg(jsonb_build_object(
          'name', c.name, 'amount', c.amount, 'carried', c.carried,
          'type', c.type, 'goal', c.goal, 'closed', coalesce(c.closed, false)
        ) order by c.name)
        from categories c where c.household_id = hh and c.month = p_month
      ), '[]'::jsonb),
      'incomes', coalesce((
        select jsonb_agg(jsonb_build_object('desc', i.descr, 'amount', i.amount))
        from budget_incomes i where i.household_id = hh and i.month = p_month
      ), '[]'::jsonb)
    ),
    'expenses', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', e.id, 'month', e.month, 'date', e.date, 'amount', e.amount,
        'desc', e.descr, 'category', e.category,
        'by', coalesce(pr.display_name, e.by_name),
        'byId', e.user_id,
        'linkId', e.link_id,
        'kind', coalesce(e.kind, 'spend')
      ) order by e.created_at desc)
      from expenses e
      left join profiles pr on pr.id = e.user_id
      where e.household_id = hh and e.month = p_month
    ), '[]'::jsonb),
    'debts', '[]'::jsonb
  );
end $function$;

-- ------------------------------------------------------------
-- ٤) withdraw_fund — السحب دائماً لتصنيف، تغطية أو سلفة
--    (نفس التوقيع حتى الواجهة القديمة ما تنكسر؛ p_debt_account مهمل)
-- ------------------------------------------------------------
create or replace function public.withdraw_fund(
  p_month text, p_date text, p_amount numeric, p_descr text, p_fund text,
  p_debt_account text default ''::text, p_to_category text default ''::text
)
 returns uuid
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  v_name  text;
  v_id    uuid;
  v_to    text := trim(coalesce(p_to_category, ''));
  v_date  text := coalesce(nullif(left(coalesce(p_date, ''), 10), ''),
                           to_char(now() at time zone 'Asia/Baghdad', 'YYYY-MM-DD'));
  v_fixed text;
  v_adv   boolean;
  v_bal   numeric;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if coalesce(p_amount, 0) <= 0 then raise exception 'المبلغ لازم يكون أكبر من صفر'; end if;
  if exists (select 1 from budgets where household_id = hh and month = p_month and locked) then
    raise exception 'هذه الفترة مقفلة';
  end if;
  if not exists (select 1 from categories where household_id = hh and month = p_month and name = p_fund and type = 'save') then
    raise exception 'الصندوق غير موجود بهذه الفترة';
  end if;
  if exists (select 1 from categories where household_id = hh and month = p_month and name = p_fund
               and type = 'save' and coalesce(closed, false)) then
    raise exception 'الصندوق «%» مغلق — افتحه أول', p_fund;
  end if;
  if v_to = '' then raise exception 'اختر تصنيف المصاريف اللي يروح له السحب'; end if;
  if not exists (select 1 from categories where household_id = hh and month = p_month and name = v_to and type <> 'save') then
    raise exception 'تصنيف المصروف «%» غير موجود', v_to;
  end if;

  v_bal := coalesce(fund_balance(hh, p_month, p_fund), 0);
  if p_amount > v_bal then
    raise exception 'رصيد «%» بس % — ما تكدر تسحب أكثر', p_fund, to_char(v_bal, 'FM999,999,999,999');
  end if;

  -- قبل تاريخ التثبيت (أو ماكو تثبيت) = تغطية، وإلا = سلفة
  select fixed_date into v_fixed from budgets where household_id = hh and month = p_month;
  v_adv := v_fixed is not null and v_date >= v_fixed;

  select display_name into v_name from profiles where id = auth.uid();

  insert into expenses (household_id, month, date, amount, descr, category, by_name, kind)
  values (hh, p_month, v_date, p_amount,
          coalesce(nullif(trim(p_descr), ''), (case when v_adv then 'سلفة لـ' else 'سحب لـ' end) || v_to),
          p_fund, coalesce(v_name, ''), case when v_adv then 'fund_adv' else 'fund_wd' end)
  returning id into v_id;

  insert into expenses (household_id, month, date, amount, descr, category, by_name, link_id, kind)
  values (hh, p_month, v_date, -p_amount,
          case when v_adv then 'سلفة من صندوق «' else 'تمويل من صندوق «' end || p_fund || '»',
          v_to, coalesce(v_name, ''), v_id, case when v_adv then 'cat_adv' else 'cat_fund' end);

  return v_id;
end $function$;

-- ------------------------------------------------------------
-- ٥) القروض انشالت
-- ------------------------------------------------------------
drop function if exists public.add_loan(text, text, numeric, text, text, text, text, text);

-- ------------------------------------------------------------
-- ٦) add_deposit — يرفض الصندوق المغلق، ويربط طرفي الإيداع من تصنيف
-- ------------------------------------------------------------
create or replace function public.add_deposit(
  p_fund text, p_amount numeric, p_date text default ''::text, p_descr text default ''::text,
  p_from_category text default ''::text, p_month text default ''::text
)
 returns uuid
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  v_name text; v_id uuid; v_date text; v_month text;
  v_cap numeric; v_avail numeric;
  v_from text := trim(coalesce(p_from_category,''));
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if coalesce(p_amount, 0) <= 0 then raise exception 'المبلغ لازم يكون أكبر من صفر'; end if;

  v_date  := coalesce(nullif(left(coalesce(p_date,''), 10), ''), to_char(now() at time zone 'Asia/Baghdad', 'YYYY-MM-DD'));
  v_month := coalesce(nullif(trim(coalesce(p_month,'')), ''), left(v_date, 7));

  if exists (select 1 from budgets where household_id = hh and month = v_month and locked) then
    raise exception 'هذه الفترة مقفلة، ما تكدر تودّع بيها';
  end if;
  if not exists (select 1 from categories where household_id = hh and month = v_month and name = p_fund and type = 'save') then
    raise exception 'الصندوق غير موجود بميزانية %', v_month;
  end if;
  if exists (select 1 from categories where household_id = hh and month = v_month and name = p_fund
               and type = 'save' and coalesce(closed, false)) then
    raise exception 'الصندوق «%» مغلق — افتحه أول', p_fund;
  end if;

  select display_name into v_name from profiles where id = auth.uid();

  if v_from = '' then
    v_cap := surplus_of(hh, v_month);
    if v_cap <= 0 then
      raise exception 'ماكو فائض متاح تودّعه — كل فلوسك موزّعة أو مصروفة';
    end if;
    if p_amount > v_cap then
      raise exception 'الفائض المتاح بس % — ما تكدر تودّع أكثر منه', to_char(v_cap, 'FM999,999,999');
    end if;

    insert into expenses (household_id, month, date, amount, descr, category, by_name, kind)
    values (hh, v_month, v_date, -p_amount,
            'إيداع: ' || coalesce(nullif(trim(p_descr), ''), 'من الفائض'),
            p_fund, coalesce(v_name, ''), 'fund_dep')
    returning id into v_id;
  else
    if not exists (select 1 from categories where household_id = hh and month = v_month and name = v_from and type <> 'save') then
      raise exception 'تصنيف المصروف «%» غير موجود', v_from;
    end if;
    v_avail := cat_avail(hh, v_month, v_from);
    if p_amount > v_avail then
      raise exception 'الفائض بـ«%» بس % — ما تكدر تودّع أكثر', v_from, to_char(v_avail, 'FM999,999,999');
    end if;

    insert into expenses (household_id, month, date, amount, descr, category, by_name, kind)
    values (hh, v_month, v_date, -p_amount,
            'إيداع من «' || v_from || '»' || coalesce(nullif(' — ' || trim(p_descr), ' — '), ''),
            p_fund, coalesce(v_name, ''), 'fund_dep_cat')
    returning id into v_id;

    insert into expenses (household_id, month, date, amount, descr, category, by_name, link_id, kind)
    values (hh, v_month, v_date, p_amount,
            'إيداع لصندوق «' || p_fund || '»', v_from, coalesce(v_name, ''), v_id, 'cat_dep');
  end if;

  return v_id;
end $function$;

-- ------------------------------------------------------------
-- ٧) spend_total + surplus_of — مصدر واحد لـ«الباقي للصرف»
--    fund_rep (سداد سلفة الفترة الماضية) ينقص الباقي مثل الإيداع
-- ------------------------------------------------------------
create or replace function public.spend_total(p_hh uuid, p_month text)
 returns numeric
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select coalesce(sum(
    case
      when coalesce(e.kind,'spend') in ('cat_loan','cat_fix')  then 0
      when coalesce(e.kind,'spend') in ('fund_dep','fund_rep') then -e.amount
      when coalesce(e.kind,'spend') like 'fund\_%'             then 0
      else e.amount
    end
  ), 0)
  from expenses e
  where e.household_id = p_hh and e.month = p_month
$function$;

create or replace function public.surplus_of(p_hh uuid, p_month text)
 returns numeric
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select
      coalesce((select sum(amount) from salaries
                where household_id = p_hh and month = p_month), 0)
    + coalesce((select sum(amount) from budget_incomes
                where household_id = p_hh and month = p_month), 0)
    + coalesce((select sum(carried) from categories
                where household_id = p_hh and month = p_month and type <> 'save'), 0)
    - coalesce((select sum(amount) from categories
                where household_id = p_hh and month = p_month and type = 'save'), 0)
    - spend_total(p_hh, p_month);
$function$;

-- ------------------------------------------------------------
-- ٨) close_month — السلف تترحّل كسداد تلقائي بالفترة الجاية
-- ------------------------------------------------------------
create or replace function public.close_month(p_month text)
 returns text
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  b budgets%rowtype;
  nm text;
  r record;
  v_left numeric;
  v_name text;
  v_title text;
  v_ndate text;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;

  select * into b from budgets where household_id = hh and month = p_month;
  if b.month is null then raise exception 'ماكو ميزانية لهذا الشهر حتى نقفله'; end if;
  if b.locked then raise exception 'هذا الشهر مقفل أصلاً'; end if;
  if coalesce(b.salary1,0) = 0 and coalesce(b.salary2,0) = 0
     and not exists (select 1 from categories where household_id = hh and month = p_month)
     and not exists (select 1 from salaries where household_id = hh and month = p_month) then
    raise exception 'ماكو ميزانية لهذا الشهر حتى نقفله';
  end if;

  nm := to_char(((p_month || '-01')::date + interval '1 month'), 'YYYY-MM');
  if exists (select 1 from budgets where household_id = hh and month = nm and locked) then
    raise exception 'الشهر الجاي مقفل، ما نكدر نرحّل له';
  end if;

  insert into budgets (household_id, month) values (hh, nm)
  on conflict (household_id, month) do nothing;
  update categories set carried = 0 where household_id = hh and month = nm;

  for r in
    select c.name, c.amount, c.carried, c.type, c.goal, coalesce(c.closed, false) as closed,
           coalesce((select sum(e.amount) from expenses e
                     where e.household_id = hh and e.month = p_month and e.category = c.name), 0) as spent
    from categories c where c.household_id = hh and c.month = p_month
  loop
    if r.type = 'save' then
      v_left := (r.amount + r.carried) - r.spent;
    else
      v_left := cat_avail(hh, p_month, r.name);
    end if;

    -- صندوق مغلق ورصيده صفر وما عليه سلفة → ما يترحّل
    if r.type = 'save' and r.closed and v_left = 0
       and not exists (select 1 from expenses e where e.household_id = hh and e.month = p_month
                         and e.category = r.name and e.kind = 'fund_adv') then
      continue;
    end if;

    insert into categories (household_id, month, name, amount, carried, type, goal)
    values (hh, nm, r.name, 0, v_left, r.type, r.goal)
    on conflict (household_id, month, name)
    do update set carried = excluded.carried, goal = excluded.goal;
  end loop;

  -- 🔑 السلف (سحب بعد تثبيت الميزانية) → سداد تلقائي بالفترة الجاية:
  --    يرجّع رصيد الصندوق وينقص «الباقي للصرف» هناك.
  select display_name into v_name from profiles where id = auth.uid();
  v_title := coalesce(nullif(trim(b.title), ''), p_month);
  select coalesce(nullif(start_date, ''), nm || '-01') into v_ndate
  from budgets where household_id = hh and month = nm;

  insert into expenses (household_id, month, date, amount, descr, category, by_name, link_id, kind)
  select hh, nm, v_ndate, -f.amount,
         'سداد سلفة «' || coalesce((select x.category from expenses x where x.link_id = f.id limit 1), '—')
           || '» من «' || v_title || '»',
         f.category, coalesce(v_name, ''), f.id, 'fund_rep'
  from expenses f
  where f.household_id = hh and f.month = p_month and f.kind = 'fund_adv'
    and not exists (select 1 from expenses x where x.household_id = hh and x.link_id = f.id and x.kind = 'fund_rep');

  update budgets set locked = true where household_id = hh and month = p_month;
  return nm;
end $function$;

-- ------------------------------------------------------------
-- ٩) unlock_month — يشيل سداد السلف اللي انخلق بالإقفال
-- ------------------------------------------------------------
create or replace function public.unlock_month(p_month text)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  nm text;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if not exists (select 1 from budgets where household_id = hh and month = p_month and locked) then
    raise exception 'هذا الشهر مو مقفل أصلاً';
  end if;

  nm := to_char(((p_month || '-01')::date + interval '1 month'), 'YYYY-MM');
  if exists (select 1 from budgets where household_id = hh and month = nm and locked) then
    raise exception 'الشهر الجاي (%) مقفل — افتحه هو الأول', nm;
  end if;

  update categories set carried = 0 where household_id = hh and month = nm;
  delete from expenses
  where household_id = hh and month = nm and kind = 'fund_rep'
    and link_id in (select id from expenses where household_id = hh and month = p_month);
  update budgets set locked = false where household_id = hh and month = p_month;
end $function$;

-- ------------------------------------------------------------
-- ١٠) delete_withdrawal — يرفض القرض القديم اللي انقفل
-- ------------------------------------------------------------
create or replace function public.delete_withdrawal(p_id uuid)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  v_old record;
  v_ctid tid;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;

  select e.* into v_old from expenses e
  where e.id = p_id and e.household_id = hh and e.amount > 0;
  if not found then raise exception 'حركة السحب غير موجودة'; end if;

  if not exists (select 1 from categories
                 where household_id = hh and month = v_old.month
                   and name = v_old.category and type = 'save') then
    raise exception 'هذه الحركة مو سحب من صندوق';
  end if;
  if exists (select 1 from budgets where household_id = hh and month = v_old.month and locked) then
    raise exception 'هذه الفترة مقفلة';
  end if;
  if exists (select 1 from debts where household_id = hh and withdrawal_id = p_id and status <> 'مفتوح') then
    raise exception 'هذا قرض قديم انرجّع أو انعدم — حذفه يخرّب رصيد الصندوق';
  end if;

  delete from expenses where household_id = hh and link_id = p_id;
  if not found then
    select ctid into v_ctid from expenses
    where household_id = hh and month = v_old.month
      and link_id is null
      and descr = 'تمويل من صندوق «' || v_old.category || '»'
      and amount = -v_old.amount and date = v_old.date
    limit 1;
    if v_ctid is not null then
      delete from expenses where ctid = v_ctid;
    end if;
  end if;

  delete from debts where household_id = hh and withdrawal_id = p_id;
  delete from expenses where id = p_id and household_id = hh;
end $function$;

-- ------------------------------------------------------------
-- ١١) delete_expense — ما تحذف نص عملية أبداً
-- ------------------------------------------------------------
create or replace function public.delete_expense(p_id uuid)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  v expenses%rowtype;
  k text;
  v_parent uuid;
  v_ctid tid;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  select * into v from expenses where id = p_id and household_id = hh;
  if v.id is null then raise exception 'المصروف غير موجود'; end if;
  if exists (select 1 from budgets where household_id = hh and month = v.month and locked) then
    raise exception 'هذا الشهر مقفل، ما تكدر تحذف منه';
  end if;
  k := coalesce(v.kind, 'spend');

  -- مصروف عادي أو إيداع من الفائض: صف واحد
  if k in ('spend', 'fund_dep') then
    delete from expenses where id = p_id and household_id = hh;
    return;
  end if;

  -- الطرف الطالع من الصندوق (سحب/سلفة/نقل/قرض قديم)
  if k in ('fund_wd', 'fund_adv', 'fund_xfer_out', 'fund_loan') then
    perform delete_withdrawal(p_id);
    return;
  end if;

  -- الطرف المربوط بسحب (تمويل/سلفة على التصنيف، نقل داخل، قرض محمّل)
  if k in ('cat_fund', 'cat_adv', 'fund_xfer_in', 'cat_loan') then
    v_parent := v.link_id;
    if v_parent is null and k = 'cat_fund' then
      select id into v_parent from expenses
      where household_id = hh and month = v.month and kind = 'fund_wd'
        and category = substring(v.descr from 'تمويل من صندوق «(.*)»')
        and amount = -v.amount and date = v.date
      limit 1;
    end if;
    if v_parent is null then
      raise exception 'هاي حركة مربوطة بسحب — احذفها من سجل الصندوق';
    end if;
    perform delete_withdrawal(v_parent);
    return;
  end if;

  -- إيداع من تصنيف: طرفين (الصندوق + التصنيف)
  if k = 'fund_dep_cat' then
    delete from expenses where household_id = hh and link_id = p_id and kind = 'cat_dep';
    if not found then
      select ctid into v_ctid from expenses
      where household_id = hh and month = v.month and kind = 'cat_dep' and link_id is null
        and descr = 'إيداع لصندوق «' || v.category || '»'
        and amount = -v.amount and date = v.date
      limit 1;
      if v_ctid is not null then delete from expenses where ctid = v_ctid; end if;
    end if;
    delete from expenses where id = p_id and household_id = hh;
    return;
  end if;
  if k = 'cat_dep' then
    v_parent := v.link_id;
    if v_parent is null then
      select id into v_parent from expenses
      where household_id = hh and month = v.month and kind = 'fund_dep_cat'
        and descr like 'إيداع من «' || v.category || '»%'
        and category = substring(v.descr from 'إيداع لصندوق «(.*)»')
        and amount = -v.amount and date = v.date
      limit 1;
    end if;
    if v_parent is not null then delete from expenses where id = v_parent and household_id = hh; end if;
    delete from expenses where id = p_id and household_id = hh;
    return;
  end if;

  if k = 'fund_rep' then
    raise exception 'هذا سداد سلفة تلقائي من الفترة الماضية — ينشال بس لو فكّيت قفلها';
  end if;
  raise exception 'هاي حركة قرض قديمة مرتبطة — ما تنحذف لحالها';
end $function$;

-- ------------------------------------------------------------
-- ١٢) edit_expense — المصاريف العادية بس، وما تنتقل لصندوق
-- ------------------------------------------------------------
create or replace function public.edit_expense(p_id uuid, p_date text, p_amount numeric, p_descr text, p_category text)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  v expenses%rowtype;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if coalesce(p_amount,0) <= 0 then raise exception 'المبلغ لازم يكون أكبر من صفر'; end if;

  select * into v from expenses where id = p_id and household_id = hh;
  if v.id is null then raise exception 'المصروف غير موجود'; end if;
  if exists (select 1 from budgets where household_id = hh and month = v.month and locked) then
    raise exception 'هذه الفترة مقفلة، ما تكدر تعدّل منها';
  end if;
  if coalesce(v.kind, 'spend') <> 'spend' then
    raise exception 'هاي حركة صندوق — عدّلها من سجل الصندوق';
  end if;
  if exists (select 1 from categories where household_id = hh and month = v.month
               and name = coalesce(p_category, '') and type = 'save') then
    raise exception 'ما تكدر تحط مصروف على صندوق ادخار — استعمل السحب من الصندوق';
  end if;

  update expenses
  set date = coalesce(p_date,''), amount = p_amount,
      descr = coalesce(p_descr,''), category = coalesce(p_category,'')
  where id = p_id and household_id = hh;
end $function$;

-- ------------------------------------------------------------
-- ١٣) edit_withdrawal — نفس السابق + حراسة الرصيد والقرض المقفول
-- ------------------------------------------------------------
create or replace function public.edit_withdrawal(p_id uuid, p_amount numeric, p_date text, p_descr text default null::text, p_fund text default ''::text)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  v_old record;
  v_ctid tid;
  v_fund text := nullif(trim(coalesce(p_fund, '')), '');
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if coalesce(p_amount,0) <= 0 then raise exception 'المبلغ لازم يكون أكبر من صفر'; end if;

  select e.* into v_old from expenses e
  where e.id = p_id and e.household_id = hh and e.amount > 0;
  if not found then raise exception 'حركة السحب غير موجودة'; end if;

  if not exists (select 1 from categories
                 where household_id = hh and month = v_old.month
                   and name = v_old.category and type = 'save') then
    raise exception 'هذه الحركة مو سحب من صندوق';
  end if;
  if exists (select 1 from budgets where household_id = hh and month = v_old.month and locked) then
    raise exception 'هذه الفترة مقفلة';
  end if;
  if exists (select 1 from debts where household_id = hh and withdrawal_id = p_id and status <> 'مفتوح') then
    raise exception 'هذا قرض قديم انرجّع أو انعدم — ما ينعدّل';
  end if;

  if v_fund is not null and v_fund <> v_old.category then
    if not exists (select 1 from categories
                   where household_id = hh and month = v_old.month
                     and name = v_fund and type = 'save') then
      raise exception 'الصندوق «%» غير موجود بهذه الفترة', v_fund;
    end if;
    if exists (select 1 from categories
               where household_id = hh and month = v_old.month and name = v_fund
                 and type = 'save' and coalesce(closed, false)) then
      raise exception 'الصندوق «%» مغلق — افتحه أول', v_fund;
    end if;
    if exists (select 1 from expenses
               where household_id = hh and link_id = p_id and category = v_fund) then
      raise exception 'هذا هو صندوق الطرف الثاني للنقل — اختر صندوق غيره';
    end if;
  else
    v_fund := null;
  end if;

  update expenses
  set amount   = p_amount,
      date     = coalesce(nullif(p_date,''), date),
      descr    = coalesce(nullif(trim(p_descr), ''), descr),
      category = coalesce(v_fund, category)
  where id = p_id and household_id = hh;

  update debts
  set amount = p_amount,
      date   = coalesce(nullif(p_date,''), date),
      fund   = coalesce(v_fund, fund)
  where household_id = hh and withdrawal_id = p_id and status = 'مفتوح';

  update expenses
  set amount = case when amount < 0 then -p_amount else p_amount end,
      date   = coalesce(nullif(p_date,''), date),
      descr  = case when v_fund is null then descr
                    else replace(descr, '«' || v_old.category || '»', '«' || v_fund || '»') end
  where household_id = hh and link_id = p_id;

  if not found then
    select ctid into v_ctid from expenses
    where household_id = hh and month = v_old.month
      and link_id is null
      and descr = 'تمويل من صندوق «' || v_old.category || '»'
      and amount = -v_old.amount and date = v_old.date
    limit 1;
    if v_ctid is not null then
      update expenses
      set amount  = -p_amount,
          date    = coalesce(nullif(p_date,''), date),
          descr   = case when v_fund is null then descr
                         else 'تمويل من صندوق «' || v_fund || '»' end,
          link_id = p_id
      where ctid = v_ctid;
    end if;
  end if;

  -- 🔒 الزيادة أو النقل لصندوق ثاني ما يخلي الصندوق بالسالب
  if (p_amount > v_old.amount or v_fund is not null)
     and coalesce(fund_balance(hh, v_old.month, coalesce(v_fund, v_old.category)), 0) < 0 then
    raise exception 'رصيد «%» ما يكفي لهذا المبلغ', coalesce(v_fund, v_old.category);
  end if;
end $function$;

-- ------------------------------------------------------------
-- ١٤) transfer_category — ينقل بس الجزء اللي من الراتب
-- ------------------------------------------------------------
create or replace function public.transfer_category(p_month text, p_from text, p_to text, p_amount numeric)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  from_avail numeric;
  from_salary numeric;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if coalesce(p_amount,0) <= 0 then raise exception 'المبلغ لازم يكون أكبر من صفر'; end if;
  if p_from = p_to then raise exception 'اختر تصنيفين مختلفين'; end if;
  if exists (select 1 from budgets where household_id = hh and month = p_month and locked) then
    raise exception 'هذا الشهر مقفل';
  end if;

  from_avail := cat_avail(hh, p_month, p_from);
  if from_avail is null then raise exception 'التصنيف المصدر غير موجود'; end if;
  if not exists (select 1 from categories where household_id = hh and month = p_month and name = p_to and type <> 'save') then
    raise exception 'التصنيف الهدف غير موجود';
  end if;

  -- النقل ينقص المخصص — والجزء المغطّى بسحب من صندوق مو فلوس راتب،
  -- فتنقيصه ما ينقص المتاح. فالمسموح = أقل من المتاح وحصة الراتب.
  select c.amount - least(c.amount, cat_wd(hh, p_month, p_from)) into from_salary
  from categories c
  where c.household_id = hh and c.month = p_month and c.name = p_from and c.type <> 'save';
  from_avail := least(from_avail, coalesce(from_salary, 0));

  if p_amount > from_avail then
    raise exception 'المتاح للنقل من «%» بس %', p_from, to_char(greatest(from_avail, 0), 'FM999,999,999');
  end if;

  update categories set amount = amount - p_amount
  where household_id = hh and month = p_month and name = p_from and type <> 'save';
  update categories set amount = amount + p_amount
  where household_id = hh and month = p_month and name = p_to and type <> 'save';
end $function$;

-- ------------------------------------------------------------
-- ١٥) save_budget — الصندوق اللي عليه حركات ما ينمسح
-- ------------------------------------------------------------
create or replace function public.save_budget(p_month text, p_salaries jsonb, p_categories jsonb, p_incomes jsonb)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  old_carried jsonb;
  old_closed jsonb;
  old_funds jsonb;
  s1 numeric := 0; s2 numeric := 0;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if p_month is null or p_month = '' then raise exception 'الشهر مطلوب'; end if;
  if exists (select 1 from budgets where household_id = hh and month = p_month and locked) then
    raise exception 'هذا الشهر مقفل، ما تكدر تعدّل ميزانيته';
  end if;

  select coalesce(jsonb_object_agg(name, carried), '{}'::jsonb) into old_carried
  from categories where household_id = hh and month = p_month;

  select coalesce(jsonb_object_agg(name, coalesce(closed, false)), '{}'::jsonb) into old_closed
  from categories where household_id = hh and month = p_month and type = 'save';

  -- 🔒 الصناديق المحمية: بيها رصيد مرحّل، أو عليها حركات بهذي الفترة.
  --    اللي عليه حركات يرجع بمساهمته نفسها، حتى رصيده ما يختل.
  select coalesce(jsonb_agg(jsonb_build_object(
           'name', c.name, 'carried', c.carried, 'goal', c.goal, 'closed', coalesce(c.closed, false),
           'amount', case when exists (select 1 from expenses e where e.household_id = hh
                                         and e.month = p_month and e.category = c.name)
                          then c.amount else 0 end)), '[]'::jsonb)
  into old_funds
  from categories c
  where c.household_id = hh and c.month = p_month and c.type = 'save'
    and (coalesce(c.carried, 0) <> 0
         or exists (select 1 from expenses e where e.household_id = hh
                      and e.month = p_month and e.category = c.name));

  select coalesce((p_salaries->0->>'amount')::numeric,0),
         coalesce((p_salaries->1->>'amount')::numeric,0)
  into s1, s2;

  insert into budgets (household_id, month, salary1, salary2, locked)
  values (hh, p_month, s1, s2, false)
  on conflict (household_id, month)
  do update set salary1 = s1, salary2 = s2;

  delete from salaries where household_id = hh and month = p_month;
  insert into salaries (household_id, month, person, amount, sort)
  select hh, p_month,
         coalesce(nullif(trim(x->>'person'),''), 'راتب'),
         coalesce((x->>'amount')::numeric, 0),
         (row_number() over ())::int
  from jsonb_array_elements(coalesce(p_salaries, '[]'::jsonb)) x
  where coalesce((x->>'amount')::numeric,0) <> 0 or trim(coalesce(x->>'person','')) <> '';

  delete from categories where household_id = hh and month = p_month;
  insert into categories (household_id, month, name, amount, carried, type, goal, closed)
  select hh, p_month, trim(x->>'name'),
         coalesce((x->>'amount')::numeric, 0),
         coalesce((old_carried->>trim(x->>'name'))::numeric, 0),
         case when x->>'type' = 'save' then 'save' else 'spend' end,
         case when x->>'type' = 'save' then coalesce((x->>'goal')::numeric, 0) else 0 end,
         case when x->>'type' = 'save' then coalesce((old_closed->>trim(x->>'name'))::boolean, false) else false end
  from jsonb_array_elements(coalesce(p_categories, '[]'::jsonb)) x
  where trim(coalesce(x->>'name','')) <> ''
  on conflict (household_id, month, name) do nothing;

  insert into categories (household_id, month, name, amount, carried, type, goal, closed)
  select hh, p_month, x->>'name',
         coalesce((x->>'amount')::numeric, 0),
         coalesce((x->>'carried')::numeric, 0), 'save',
         coalesce((x->>'goal')::numeric, 0),
         coalesce((x->>'closed')::boolean, false)
  from jsonb_array_elements(old_funds) x
  on conflict (household_id, month, name) do nothing;

  delete from budget_incomes where household_id = hh and month = p_month;
  insert into budget_incomes (household_id, month, descr, amount)
  select hh, p_month, coalesce(x->>'desc',''), coalesce((x->>'amount')::numeric, 0)
  from jsonb_array_elements(coalesce(p_incomes, '[]'::jsonb)) x
  where coalesce((x->>'amount')::numeric,0) > 0 or coalesce(x->>'desc','') <> '';
end $function$;

commit;
