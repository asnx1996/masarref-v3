-- ============================================================
--  نسخة احتياطية: تعريفات الدوال قبل ترحيل
--  withdrawal-covers-allocation.sql
-- ------------------------------------------------------------
--  انلقطت من قاعدة البيانات مباشرة بـpg_get_functiondef قبل
--  الترحيل. لو احتجت ترجع للحساب القديم، شغّل هذا الملف —
--  يرجّع close_month وadd_deposit وtransfer_category مثل ما چانوا.
--  (cat_wd وcat_avail جداد، فلازم تحذفهن بإيدك إذا تريد:
--   drop function if exists public.cat_avail(uuid, text, text);
--   drop function if exists public.cat_wd(uuid, text, text);)
--
--  ⚠️ transfer_category هنا هي النسخة اللي چانت فعلاً بالقاعدة —
--  وهي أقدم من اللي بـloan-charge-model.sql: تحسب المتاح بـ
--  sum(e.amount) لكل الحركات بدل cat_spent، يعني ما تطلّع تسديد
--  القرض. الترحيل يصلّح هذا وياه.
-- ============================================================

CREATE OR REPLACE FUNCTION public.close_month(p_month text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  hh uuid := my_household();
  b budgets%rowtype;
  nm text;
  r record;
  v_left numeric;
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
    v_left := (r.amount + r.carried) - r.spent;

    -- 🔒 صندوق مغلق ورصيده صفر → ما يترحّل للشهر الجاي.
    -- لو مغلق وبيه فلوس (حالة شاذة) يترحّل عادي — الفلوس ما تختفي.
    if r.type = 'save' and r.closed and v_left = 0 then
      continue;
    end if;

    insert into categories (household_id, month, name, amount, carried, type, goal)
    values (hh, nm, r.name, 0, v_left, r.type, r.goal)
    on conflict (household_id, month, name)
    do update set carried = excluded.carried, goal = excluded.goal;
  end loop;

  update budgets set locked = true where household_id = hh and month = p_month;
  return nm;
end $function$;

CREATE OR REPLACE FUNCTION public.add_deposit(p_fund text, p_amount numeric, p_date text DEFAULT ''::text, p_descr text DEFAULT ''::text, p_from_category text DEFAULT ''::text, p_month text DEFAULT ''::text)
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
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

  select display_name into v_name from profiles where id = auth.uid();

  if v_from = '' then
    v_cap := surplus_of(hh, v_month);
    if v_cap <= 0 then
      raise exception 'ماكو فائض متاح تودّعه — كل فلوسك موزّعة. زيّد الدخل أو قلّل التوزيع أول';
    end if;
    if p_amount > v_cap then
      raise exception 'الفائض المتاح بس % — ما تكدر تودّع أكثر منه', to_char(v_cap, 'FM999,999,999');
    end if;

    insert into expenses (household_id, month, date, amount, descr, category, by_name, kind)
    values (hh, v_month, v_date, -p_amount,
            'إيداع: ' || coalesce(nullif(trim(p_descr), ''), 'إضافة للرصيد'),
            p_fund, coalesce(v_name, ''), 'fund_dep')
    returning id into v_id;

  else
    if not exists (select 1 from categories where household_id = hh and month = v_month and name = v_from and type <> 'save') then
      raise exception 'تصنيف المصروف «%» غير موجود', v_from;
    end if;

    -- 🔑 المتاح بالدالة الواعية بالنوع (چان sum لكل الحركات)
    select (c.amount + c.carried) - cat_spent(hh, v_month, c.name)
    into v_avail
    from categories c
    where c.household_id = hh and c.month = v_month and c.name = v_from and c.type <> 'save';

    if p_amount > v_avail then
      raise exception 'المتاح بـ«%» بس % — ما تكدر تودّع أكثر', v_from, to_char(v_avail, 'FM999,999,999');
    end if;

    insert into expenses (household_id, month, date, amount, descr, category, by_name, kind)
    values (hh, v_month, v_date, -p_amount,
            'إيداع من «' || v_from || '»' || coalesce(nullif(' — ' || trim(p_descr), ' — '), ''),
            p_fund, coalesce(v_name, ''), 'fund_dep_cat')
    returning id into v_id;

    insert into expenses (household_id, month, date, amount, descr, category, by_name, kind)
    values (hh, v_month, v_date, p_amount,
            'إيداع لصندوق «' || p_fund || '»', v_from, coalesce(v_name, ''), 'cat_dep');
  end if;

  return v_id;
end $function$;

CREATE OR REPLACE FUNCTION public.transfer_category(p_month text, p_from text, p_to text, p_amount numeric)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
declare
  hh uuid := my_household();
  from_avail numeric;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if coalesce(p_amount,0) <= 0 then raise exception 'المبلغ لازم يكون أكبر من صفر'; end if;
  if p_from = p_to then raise exception 'اختر تصنيفين مختلفين'; end if;
  if exists (select 1 from budgets where household_id = hh and month = p_month and locked) then
    raise exception 'هذا الشهر مقفل';
  end if;

  -- المتاح بالمصدر = (المخصص + المرحّل) − المصروف
  select (c.amount + c.carried)
         - coalesce((select sum(e.amount) from expenses e
                     where e.household_id = hh and e.month = p_month and e.category = c.name), 0)
  into from_avail
  from categories c
  where c.household_id = hh and c.month = p_month and c.name = p_from and c.type <> 'save';

  if from_avail is null then raise exception 'التصنيف المصدر غير موجود'; end if;
  if not exists (select 1 from categories where household_id = hh and month = p_month and name = p_to and type <> 'save') then
    raise exception 'التصنيف الهدف غير موجود';
  end if;
  if p_amount > from_avail then
    raise exception 'المتاح بـ«%» بس % — ما تكدر تنقل أكثر', p_from, to_char(from_avail, 'FM999,999,999');
  end if;

  update categories set amount = amount - p_amount
  where household_id = hh and month = p_month and name = p_from and type <> 'save';
  update categories set amount = amount + p_amount
  where household_id = hh and month = p_month and name = p_to and type <> 'save';
end $function$;
