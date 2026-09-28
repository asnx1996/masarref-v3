-- ============================================================
--  سداد السلفة من مخصص نفس التصنيف بالفترة الجاية
-- ------------------------------------------------------------
--  قبل: سداد السلف (fund_rep) ينخصم من الرواتب كرقم واحد قبل
--  التوزيع — فـ«الباقي بلا توزيع» ينقص بكل السلف، ومخصص التصنيف
--  يبقى كامل.
--
--  هسه: كل سلفة ترجع من مخصص التصنيف اللي أخذها. مثلاً «حنود»
--  أخذ سلفة ٢٠٠ والشهر الجاي مخصصه ٧٠٠ → ٢٠٠ منها ترجع للصندوق
--  والمتاح للصرف ٥٠٠، والرواتب ينقطع منها ٧٠٠ بس (المخصص نفسه).
--  لو السلفة أكبر من المخصص، الزيادة بس تنخصم من الرواتب.
--
--  التنفيذ: وياه fund_rep (على الصندوق) ينخلق طرف ثاني cat_rep
--  (موجب، على التصنيف، link_id = fund_rep) — وهو اللي يحدد منو
--  يسدّ. تكدر تغيّر تصنيفه (set_repay_category) لو بدّلت الاسم.
--    • cat_avail  = … − least(المخصص، cat_rep)
--    • cat_spent  ما يحسب cat_rep (ينحسب بالـleast فوك)
--    • spend_total ما يحسب cat_rep — fund_rep أصلاً ينقص «الباقي»
-- ============================================================

begin;

drop table if exists backup.fn_before_repay_from_cat;
create table backup.fn_before_repay_from_cat as
select p.proname, pg_get_function_identity_arguments(p.oid) as args,
       pg_get_functiondef(p.oid) as def, now() as saved_at
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('cat_spent','cat_avail','spend_total','close_month','unlock_month','delete_expense');

-- ------------------------------------------------------------
-- ١) الحسابات
-- ------------------------------------------------------------
create or replace function public.cat_rep(p_hh uuid, p_month text, p_name text)
 returns numeric
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select coalesce(sum(e.amount), 0)
  from expenses e
  where e.household_id = p_hh and e.month = p_month and e.category = p_name
    and e.kind = 'cat_rep'
$function$;
revoke execute on function public.cat_rep(uuid, text, text) from public, anon;

create or replace function public.cat_spent(p_hh uuid, p_month text, p_name text)
 returns numeric
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select coalesce(sum(e.amount), 0)
  from expenses e
  where e.household_id = p_hh and e.month = p_month and e.category = p_name
    and coalesce(e.kind, 'spend') not in ('cat_pay', 'cat_rep')
$function$;

create or replace function public.cat_avail(p_hh uuid, p_month text, p_name text)
 returns numeric
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select coalesce(c.amount, 0) + coalesce(c.carried, 0)
         - cat_spent(p_hh, p_month, p_name)
         - least(coalesce(c.amount, 0), cat_wd(p_hh, p_month, p_name))
         - least(greatest(coalesce(c.amount, 0), 0), cat_rep(p_hh, p_month, p_name))
  from categories c
  where c.household_id = p_hh and c.month = p_month
    and c.name = p_name and c.type <> 'save'
$function$;

create or replace function public.spend_total(p_hh uuid, p_month text)
 returns numeric
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select coalesce(sum(
    case
      when coalesce(e.kind,'spend') in ('cat_loan','cat_fix','cat_rep') then 0
      when coalesce(e.kind,'spend') in ('fund_dep','fund_rep')          then -e.amount
      when coalesce(e.kind,'spend') like 'fund\_%'                      then 0
      else e.amount
    end
  ), 0)
  from expenses e
  where e.household_id = p_hh and e.month = p_month
$function$;

-- ------------------------------------------------------------
-- ٢) close_month — السداد ينربط بتصنيف السلفة
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

  select display_name into v_name from profiles where id = auth.uid();
  v_title := coalesce(nullif(trim(b.title), ''), p_month);
  select coalesce(nullif(start_date, ''), nm || '-01') into v_ndate
  from budgets where household_id = hh and month = nm;

  -- 🔑 كل سلفة → سداد بالفترة الجاية: الصندوق يرجعله (fund_rep)،
  --    والتصنيف اللي أخذها يسدّ من مخصصه (cat_rep)
  with adv as (
    select f.id, f.amount, f.category as fund,
           coalesce((select x.category from expenses x where x.link_id = f.id limit 1), '') as cat
    from expenses f
    where f.household_id = hh and f.month = p_month and f.kind = 'fund_adv'
      and not exists (select 1 from expenses x where x.household_id = hh and x.link_id = f.id and x.kind = 'fund_rep')
  ), ins as (
    insert into expenses (household_id, month, date, amount, descr, category, by_name, link_id, kind)
    select hh, nm, v_ndate, -adv.amount,
           'سداد سلفة «' || coalesce(nullif(adv.cat, ''), '—') || '» من «' || v_title || '»',
           adv.fund, coalesce(v_name, ''), adv.id, 'fund_rep'
    from adv
    returning id, amount, link_id
  )
  insert into expenses (household_id, month, date, amount, descr, category, by_name, link_id, kind)
  select hh, nm, v_ndate, -ins.amount,
         'سداد سلفة لصندوق «' || adv.fund || '» من «' || v_title || '»',
         adv.cat, coalesce(v_name, ''), ins.id, 'cat_rep'
  from ins join adv on adv.id = ins.link_id
  where adv.cat <> '';

  update budgets set locked = true where household_id = hh and month = p_month;
  return nm;
end $function$;

-- ------------------------------------------------------------
-- ٣) unlock_month — يشيل السداد بطرفيه
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
  where household_id = hh and month = nm and kind = 'cat_rep'
    and link_id in (select id from expenses where household_id = hh and month = nm and kind = 'fund_rep'
                      and link_id in (select id from expenses where household_id = hh and month = p_month));
  delete from expenses
  where household_id = hh and month = nm and kind = 'fund_rep'
    and link_id in (select id from expenses where household_id = hh and month = p_month);
  update budgets set locked = false where household_id = hh and month = p_month;
end $function$;

-- ------------------------------------------------------------
-- ٤) set_repay_category — منو يسدّ السلفة (لو تغيّر اسم التصنيف)
--    p_category = '' → بلا تصنيف: تنخصم كلها من الرواتب
-- ------------------------------------------------------------
create or replace function public.set_repay_category(p_id uuid, p_category text)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  v expenses%rowtype;
  v_rep expenses%rowtype;
  v_cat text := trim(coalesce(p_category, ''));
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  select * into v from expenses where id = p_id and household_id = hh;
  if v.id is null then raise exception 'الحركة غير موجودة'; end if;
  -- نقبل الطرفين: السداد على الصندوق أو على التصنيف
  if v.kind = 'fund_rep' then
    v_rep := v;
    select * into v from expenses where household_id = hh and link_id = v_rep.id and kind = 'cat_rep';
  elsif v.kind = 'cat_rep' then
    select * into v_rep from expenses where id = v.link_id and household_id = hh and kind = 'fund_rep';
  else
    raise exception 'هاي مو حركة سداد سلفة';
  end if;
  if v_rep.id is null then raise exception 'ما لكيت سداد السلفة'; end if;
  if exists (select 1 from budgets where household_id = hh and month = v_rep.month and locked) then
    raise exception 'هذه الفترة مقفلة';
  end if;

  if v_cat = '' then
    delete from expenses where household_id = hh and link_id = v_rep.id and kind = 'cat_rep';
    return;
  end if;
  if not exists (select 1 from categories where household_id = hh and month = v_rep.month
                   and name = v_cat and type <> 'save') then
    raise exception 'تصنيف المصروف «%» غير موجود', v_cat;
  end if;

  if v.id is null then
    insert into expenses (household_id, month, date, amount, descr, category, by_name, link_id, kind)
    values (hh, v_rep.month, v_rep.date, -v_rep.amount,
            'سداد سلفة لصندوق «' || v_rep.category || '»', v_cat, v_rep.by_name, v_rep.id, 'cat_rep');
  else
    update expenses set category = v_cat where id = v.id;
  end if;
end $function$;
revoke execute on function public.set_repay_category(uuid, text) from public, anon;
grant  execute on function public.set_repay_category(uuid, text) to authenticated, service_role;

-- ------------------------------------------------------------
-- ٥) delete_expense — cat_rep مثل fund_rep: ينشال بفك القفل بس
-- ------------------------------------------------------------
do $do$
declare d text;
begin
  select pg_get_functiondef('public.delete_expense'::regproc) into d;
  if position($q$  if k = 'fund_rep' then$q$ in d) = 0 then raise exception 'delete_expense pattern not found'; end if;
  d := replace(d, $q$  if k = 'fund_rep' then$q$, $q$  if k in ('fund_rep', 'cat_rep') then$q$);
  execute d;
end $do$;

-- ------------------------------------------------------------
-- ٦) السداد الموجود (قبل هذا الترحيل) — نربطه بتصنيفه.
--    لو التصنيف انبدّل اسمه (مثلاً «حنود» ← «حنود السبع») ناخذ
--    التصنيف الوحيد اللي يبدي بنفس الاسم؛ وإلا يبقى بلا تصنيف.
-- ------------------------------------------------------------
insert into expenses (household_id, month, date, amount, descr, category, by_name, link_id, kind)
select r.household_id, r.month, r.date, -r.amount,
       'سداد سلفة لصندوق «' || r.category || '»',
       m.name, r.by_name, r.id, 'cat_rep'
from expenses r
join lateral (
  select coalesce(
    (select c.name from categories c where c.household_id = r.household_id and c.month = r.month
       and c.type <> 'save' and c.name = src.cat),
    (select min(c.name) from categories c where c.household_id = r.household_id and c.month = r.month
       and c.type <> 'save' and c.name like src.cat || '%'
     having count(*) = 1)
  ) as name
  from (select x.category as cat from expenses x
        where x.link_id = r.link_id and x.kind = 'cat_adv' limit 1) src
) m on m.name is not null
where r.kind = 'fund_rep'
  and not exists (select 1 from expenses y where y.link_id = r.id and y.kind = 'cat_rep')
  and not exists (select 1 from budgets b where b.household_id = r.household_id and b.month = r.month and b.locked);

commit;
