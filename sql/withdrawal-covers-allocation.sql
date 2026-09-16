-- ============================================================
--  السحب من الصندوق يغطّي المخصص — ما يزيد فوكه (الجهة السحابية)
-- ------------------------------------------------------------
--  الواجهة صارت تحسب متاح التصنيف هيچي:
--
--      المتاح = المرحّل + max(المخصص، السحب) + القرض − الصرف
--
--  يعني: تخصص ٦٥٠ لـ«أكل البيت» وتسحب ١٣٥ من صندوق وتوديها له،
--  المتاح يبقى ٦٥٠ — واللي ينستقطع من راتبك يصير ٥١٥. السحب غطّى
--  جزءاً من المخصص، ما زاد فوكه. والسحب اللي أكثر من المخصص ما
--  يضيع: الزيادة تبقى متاحة، لأن الفلوس طالعة فعلاً من الصندوق.
--
--  بس السيرفر بقى على الحساب القديم:
--
--      المتاح = المخصص + المرحّل − المنصرف
--
--  وحركة السحب (kind='cat_fund') تنسجل بالسالب على التصنيف، يعني
--  «المنصرف» ينقص بمقدار السحب — فالمتاح يطلع (المخصص + السحب)،
--  أكبر من الصح بمقدار least(المخصص، السحب) بالضبط.
--
--  وين چان يأذّي:
--    ١) close_month — المرحّل للفترة الجاية يطلع أكبر، والفرق
--       يتراكم بهدوء شهراً ورا شهر. وهذا اللي يلگيه «مدقق الأرصدة
--       ← تدقيق كل الفترات» كـ«انكسار بسلسلة الترحيل».
--    ٢) add_deposit (إيداع من تصنيف) — يسمحلك تودّع أكثر من
--       المتاح الحقيقي.
--    ٣) transfer_category (نقل بين تصنيفين) — نفس الشي.
--
--  هنا نوحّد القاعدة بدالتين صغيرتين ونخلي الثلاثة يستعملوهن.
--  ⚠️ ما يغيّر أي بيانات موجودة: المرحّل القديم اللي انحسب غلط
--  يتصحّح بفك قفل الفترة الأقدم وإقفالها من جديد (نفس الحل اللي
--  يقترحه المدقق).
-- ============================================================

begin;

-- ------------------------------------------------------------
-- ١) cat_wd — شكد سحب من الصناديق وصل لهذا التصنيف
--    حركة السحب تنسجل سالبة على التصنيف، فنقلبها موجبة.
-- ------------------------------------------------------------
create or replace function public.cat_wd(p_hh uuid, p_month text, p_name text)
 returns numeric
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select coalesce(sum(-e.amount), 0)
  from expenses e
  where e.household_id = p_hh and e.month = p_month and e.category = p_name
    and coalesce(e.kind, 'spend') = 'cat_fund'
$function$;

-- ------------------------------------------------------------
-- ٢) cat_avail — المتاح بتصنيف مصروف، بنفس قاعدة الواجهة
--    (catAvailable بـapp.js وbkLedger بـbooks.js — نفس المعادلة)
--
--      (المخصص + المرحّل) − المنصرف − least(المخصص، السحب)
--
--    المنصرف (cat_spent) أصلاً طارح السحب لأنه سالب، فطرح الجزء
--    المشترك يرجّعنا لـmax(المخصص، السحب). والقرض القديم
--    (cat_loan_v1) يبقى يزيد المتاح مثل ما هو — لأنه لازم يرجع،
--    مو تغطية.
-- ------------------------------------------------------------
create or replace function public.cat_avail(p_hh uuid, p_month text, p_name text)
 returns numeric
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select coalesce(c.amount, 0) + coalesce(c.carried, 0)
         - cat_spent(p_hh, p_month, p_name)
         - least(coalesce(c.amount, 0), cat_wd(p_hh, p_month, p_name))
  from categories c
  where c.household_id = p_hh and c.month = p_month
    and c.name = p_name and c.type <> 'save'
$function$;

-- ------------------------------------------------------------
-- ٣) close_month — الترحيل بنفس القاعدة
--    الصناديق تبقى (المرحّل + المساهمة) − صافي حركاتها، لأن
--    السحب عليها فلوس طالعة فعلاً. التغطية تخصّ التصنيفات بس.
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
                     where e.household_id = hh and e.month = p_month and e.category = c.name), 0) as spent,
           coalesce((select sum(-e.amount) from expenses e
                     where e.household_id = hh and e.month = p_month and e.category = c.name
                       and coalesce(e.kind, 'spend') = 'cat_fund'), 0) as wd
    from categories c where c.household_id = hh and c.month = p_month
  loop
    -- 🔑 التصنيف: السحب يغطّي المخصص فينطرح الجزء المشترك.
    --    الصندوق: مثل ما چان — كل حركاته فلوس حقيقية.
    if r.type = 'save' then
      v_left := (r.amount + r.carried) - r.spent;
    else
      v_left := (r.amount + r.carried) - r.spent - least(r.amount, r.wd);
    end if;

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

-- ------------------------------------------------------------
-- ٤) add_deposit — سقف «الإيداع من تصنيف» صار cat_avail
--    (الباقي من الدالة مثل ما هو — نسخة loan-charge-model.sql)
-- ------------------------------------------------------------
create or replace function public.add_deposit(
  p_fund text, p_amount numeric, p_date text default ''::text,
  p_descr text default ''::text, p_from_category text default ''::text,
  p_month text default ''::text
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

    -- 🔑 المتاح بقاعدة «السحب يغطّي المخصص» (چان amount+carried−spent)
    v_avail := cat_avail(hh, v_month, v_from);

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

-- ------------------------------------------------------------
-- ٥) transfer_category — نقل مخصص بين تصنيفين، نفس السقف
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
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if coalesce(p_amount,0) <= 0 then raise exception 'المبلغ لازم يكون أكبر من صفر'; end if;
  if p_from = p_to then raise exception 'اختر تصنيفين مختلفين'; end if;
  if exists (select 1 from budgets where household_id = hh and month = p_month and locked) then
    raise exception 'هذا الشهر مقفل';
  end if;

  -- 🔑 المتاح بقاعدة «السحب يغطّي المخصص»
  from_avail := cat_avail(hh, p_month, p_from);

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

-- ------------------------------------------------------------
-- ٦) الدالتين الجديدتين داخليتان — نسحب EXECUTE من public/anon
--    مثل ما هي surplus_of أصلاً. الواجهة ما تندههن مباشرة أبداً
--    (تنندّان من جوّا close_month/add_deposit/transfer_category)،
--    فبلا هذا السطر يكدر أي واحد غير مسجّل ينده
--    /rest/v1/rpc/cat_avail ويجرّب household_id عشوائي.
-- ------------------------------------------------------------
revoke execute on function public.cat_wd(uuid, text, text)    from public, anon;
revoke execute on function public.cat_avail(uuid, text, text) from public, anon;

commit;

-- ============================================================
--  ✅ انرفع على المشروع rcpwavfgxrqzgxclqwss بتاريخ 2026-09-16
--     (migrations: withdrawal_covers_allocation +
--      restrict_cat_helpers_execute)
--     الرجوع للخلف: sql/rollback/before-withdrawal-covers-allocation.sql
--
--  بعد ما تنرفع:
--   • الفترات الجديدة تترحّل صح من أول يوم.
--   • الفترات القديمة اللي انقفلت بالحساب الغلط يصلّحها
--     «مدقق الأرصدة ← تدقيق كل الفترات»: يكولك وين الانكسار،
--     وتفك قفل الفترة الأقدم وتقفلها من جديد فينحسب الترحيل
--     من الأول ويصلّح كل اللي بعدها.
--
--  ✅ انصلّح بعدين: غلط تسديد القرض (kind='cat_pay') اللي چان
--     close_month يحسبه على التصنيف — شوف
--     sql/close-month-uses-cat-avail.sql. صار التصنيف يترحّل
--     بـcat_avail مباشرة، فينورّث القاعدتين من مصدر واحد.
-- ============================================================
