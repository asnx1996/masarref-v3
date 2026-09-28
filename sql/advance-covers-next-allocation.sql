-- ============================================================
--  السلفة ما ترجع للصندوق — تغطّي من مخصص تصنيفها بالفترة الجاية
-- ------------------------------------------------------------
--  (يصحّح sql/advance-repay-from-category.sql)
--  حنود أخذ سلفة ٢٠٠، الشهر الجاي مخصصه ٧٠٠ → المتاح ٥٠٠، والرواتب
--  ينقطع منها ٥٠٠ بس. الـ٢٠٠ انصرفت من الصندوق أصلاً — ما ترجع له.
--
--  يعني السلفة = «تغطية مؤجّلة»: التغطية تقلّل استقطاع الراتب هذا
--  الشهر، والسلفة تقلّله الشهر الجاي.
--
--  • ماكو fund_rep بعد — الصندوق ما يتحرّك بالإقفال.
--  • cat_rep (موجب، على التصنيف، link_id = السلفة fund_adv):
--      cat_avail = … − cat_rep        (المتاح ينقص بكامل السلفة)
--      spend_total ما يحسبه            («الباقي للصرف» ما ينقص)
--    والواجهة تحسب شكد وفّر من الراتب (min(المخصص − التغطية، السلفة)).
-- ============================================================

begin;

drop table if exists backup.fn_before_adv_covers_next;
create table backup.fn_before_adv_covers_next as
select p.proname, pg_get_function_identity_arguments(p.oid) as args,
       pg_get_functiondef(p.oid) as def, now() as saved_at
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('cat_avail','close_month','unlock_month','set_repay_category');

-- ١) المتاح ينقص بكامل السلفة
create or replace function public.cat_avail(p_hh uuid, p_month text, p_name text)
 returns numeric
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select coalesce(c.amount, 0) + coalesce(c.carried, 0)
         - cat_spent(p_hh, p_month, p_name)
         - least(coalesce(c.amount, 0), cat_wd(p_hh, p_month, p_name))
         - cat_rep(p_hh, p_month, p_name)
  from categories c
  where c.household_id = p_hh and c.month = p_month
    and c.name = p_name and c.type <> 'save'
$function$;

-- ٢) close_month — cat_rep بس، بلا رجوع للصندوق
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

    if r.type = 'save' and r.closed and v_left = 0 then
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

  -- 🔑 كل سلفة → تنخصم من مخصص تصنيفها بالفترة الجاية
  insert into expenses (household_id, month, date, amount, descr, category, by_name, link_id, kind)
  select hh, nm, v_ndate, f.amount,
         'سلفة «' || x.category || '» من «' || v_title || '» (من صندوق «' || f.category || '»)',
         x.category, coalesce(v_name, ''), f.id, 'cat_rep'
  from expenses f
  join lateral (select c.category from expenses c
                where c.household_id = hh and c.link_id = f.id and c.kind = 'cat_adv' limit 1) x on true
  where f.household_id = hh and f.month = p_month and f.kind = 'fund_adv'
    and not exists (select 1 from expenses y where y.household_id = hh and y.link_id = f.id and y.kind = 'cat_rep');

  update budgets set locked = true where household_id = hh and month = p_month;
  return nm;
end $function$;

-- ٣) unlock_month — يشيل خصم السلف (والسداد القديم لو موجود)
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
  where household_id = hh and month = nm and kind in ('cat_rep', 'fund_rep')
    and link_id in (select id from expenses where household_id = hh and month = p_month);
  update budgets set locked = false where household_id = hh and month = p_month;
end $function$;

-- ٤) set_repay_category — منو ينخصم منه (لو تغيّر اسم التصنيف)
create or replace function public.set_repay_category(p_id uuid, p_category text)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  v expenses%rowtype;
  v_cat text := trim(coalesce(p_category, ''));
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  select * into v from expenses where id = p_id and household_id = hh and kind = 'cat_rep';
  if v.id is null then raise exception 'هاي مو سلفة من الفترة الماضية'; end if;
  if exists (select 1 from budgets where household_id = hh and month = v.month and locked) then
    raise exception 'هذه الفترة مقفلة';
  end if;
  if not exists (select 1 from categories where household_id = hh and month = v.month
                   and name = v_cat and type <> 'save') then
    raise exception 'اختر تصنيف مصاريف موجود بهذه الفترة';
  end if;
  update expenses set category = v_cat where id = v.id;
end $function$;

-- ٥) البيانات: السداد اللي رجّع فلوس للصندوق ينشال، وخصم التصنيف
--    ينربط بالسلفة نفسها بدل السداد
update expenses c
set link_id = r.link_id,
    descr   = 'سلفة «' || coalesce((select a.category from expenses a
                                    where a.link_id = r.link_id and a.kind = 'cat_adv' limit 1), c.category)
              || '» من الفترة الماضية (من صندوق «' || r.category || '»)'
from expenses r
where c.kind = 'cat_rep' and r.id = c.link_id and r.kind = 'fund_rep';

delete from expenses r
where r.kind = 'fund_rep'
  and not exists (select 1 from budgets b where b.household_id = r.household_id and b.month = r.month and b.locked);

commit;
