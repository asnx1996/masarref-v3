-- ============================================================
--  ميزة إغلاق الصندوق + حماية الصناديق المرحّلة بكل مكان
-- ============================================================
--  شنو يسوي هذا الملف (كله سوا):
--
--  ١) عمود جديد categories.closed — «الصندوق مغلق»:
--     - يتفعّل من الواجهة بس لما رصيد الصندوق صفر.
--     - الصندوق المغلق يظل ظاهر لنهاية الشهر، ومن ينقفل الشهر
--       ما يترحّل للشهر الجاي (بشرط رصيده صفر — حماية إضافية).
--
--  ٢) clear_month (تفريغ الميزانية): ما عاد يحذف الصناديق المرحّلة —
--     بس يصفّر مساهمتها الشهرية. (أصل الشكوى: التفريغ كان يحذف
--     الصناديق ويضطرك تفتح قفل الشهر الماضي وترحّل من جديد.)
--
--  ٣) close_month (الإقفال والترحيل): يتجاوز الصناديق المغلقة
--     اللي رصيدها صفر. لو صندوق مغلق وبيه فلوس (ما المفروض تصير)،
--     يترحّل عادي — الفلوس ما تختفي أبداً.
--
--  ٤) save_budget (حفظ الميزانية): نسخة نهائية تحافظ على الصناديق
--     المرحّلة + تحافظ على حالة «مغلق» (بدونها كل حفظة تفتح
--     الصناديق المغلقة من جديد).
--     ⚠️ هاي النسخة تشمل وتطوّر اللي بملف protect-carried-funds.sql —
--     إذا رفعته قبل، عادي؛ وإذا ما رفعته، هذا الملف يكفي عنه.
--
--  ٥) load_month: ترجع حالة closed للواجهة (وتشمل linkId من
--     ملف expense-link-id.sql — فما يهم أي واحد رفعت أول).
--
--  ملاحظة: delete_fund القديمة (الحذف من كل الأشهر) ما عادت
--  تستعملها الواجهة — «الإغلاق» صار هو الطريقة. خليناها بمكانها.
--
--  طريقة الرفع: افتح Supabase ← SQL Editor ← الصق كل هذا الملف ← Run.
--  (كله داخل معاملة وحدة — إذا صار خطأ ما ينحفظ شي ناقص.)
-- ============================================================

begin;

-- ------------------------------------------------------------
-- ١) عمود «مغلق» على التصنيفات (يخص الصناديق بس)
-- ------------------------------------------------------------
alter table public.categories add column if not exists closed boolean not null default false;


-- ------------------------------------------------------------
-- ٢) إغلاق / فتح صندوق — الإغلاق مشروط برصيد صفر
-- ------------------------------------------------------------
create or replace function public.set_fund_closed(p_month text, p_name text, p_closed boolean)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  c categories%rowtype;
  bal numeric;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if exists (select 1 from budgets where household_id = hh and month = p_month and locked) then
    raise exception 'هذا الشهر مقفل';
  end if;
  select * into c from categories
  where household_id = hh and month = p_month and name = p_name and type = 'save';
  if c.name is null then raise exception 'الصندوق غير موجود بميزانية هذا الشهر'; end if;

  if p_closed then
    -- رصيد الصندوق بهذا الشهر: المرحّل + المساهمة − صافي الحركات
    bal := coalesce(c.carried, 0) + coalesce(c.amount, 0)
         - coalesce((select sum(e.amount) from expenses e
                     where e.household_id = hh and e.month = p_month and e.category = p_name), 0);
    if bal <> 0 then
      raise exception 'رصيد الصندوق % — لازم يتصفّر قبل الإغلاق (اسحب الباقي أول)', to_char(bal, 'FM999,999,999,999');
    end if;
  end if;

  update categories set closed = p_closed
  where household_id = hh and month = p_month and name = p_name and type = 'save';
end $function$;


-- ------------------------------------------------------------
-- ٣) التفريغ يحافظ على الصناديق المرحّلة
-- ------------------------------------------------------------
create or replace function public.clear_month(p_month text)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare hh uuid := my_household();
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if exists (select 1 from budgets where household_id = hh and month = p_month and locked) then
    raise exception 'هذا الشهر مقفل، ما تكدر تفرّغه';
  end if;
  insert into budgets (household_id, month, salary1, salary2, locked)
  values (hh, p_month, 0, 0, false)
  on conflict (household_id, month) do update set salary1 = 0, salary2 = 0;

  -- 🔒 الصناديق المرحّلة (بيها رصيد من شهر سابق) ما تنحذف بالتفريغ —
  -- بس تنصفّر مساهمتها الشهرية. كل الباقي ينحذف مثل قبل.
  update categories set amount = 0
  where household_id = hh and month = p_month and type = 'save' and coalesce(carried, 0) <> 0;

  delete from categories
  where household_id = hh and month = p_month
    and not (type = 'save' and coalesce(carried, 0) <> 0);

  delete from budget_incomes where household_id = hh and month = p_month;
end $function$;


-- ------------------------------------------------------------
-- ٤) الإقفال يتجاوز الصناديق المغلقة (اللي رصيدها صفر)
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


-- ------------------------------------------------------------
-- ٥) الحفظ يحافظ على الصناديق المرحّلة وعلى حالة «مغلق»
--    (النسخة النهائية — تشمل حماية protect-carried-funds.sql)
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

  -- 🔒 حالة الإغلاق الحالية لكل صندوق (حتى ما تنمسح بإعادة الإدخال)
  select coalesce(jsonb_object_agg(name, coalesce(closed, false)), '{}'::jsonb) into old_closed
  from categories where household_id = hh and month = p_month and type = 'save';

  -- 🔒 الصناديق المرحّلة (بيها رصيد) — نلقطها حتى نرجّعها لو الطلب ما جابها
  select coalesce(jsonb_agg(jsonb_build_object(
           'name', name, 'carried', carried, 'goal', goal, 'closed', coalesce(closed, false))), '[]'::jsonb)
  into old_funds
  from categories
  where household_id = hh and month = p_month and type = 'save' and coalesce(carried, 0) <> 0;

  -- نحافظ على توافق الأعمدة القديمة salary1/salary2 (أول راتبين) للأمان
  select coalesce((p_salaries->0->>'amount')::numeric,0),
         coalesce((p_salaries->1->>'amount')::numeric,0)
  into s1, s2;

  insert into budgets (household_id, month, salary1, salary2, locked)
  values (hh, p_month, s1, s2, false)
  on conflict (household_id, month)
  do update set salary1 = s1, salary2 = s2;

  -- الرواتب المرنة
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

  -- 🔒 أي صندوق مرحّل ما رجع بالطلب، نرجّعه بنفسنا (مساهمة 0 + نفس
  -- الرصيد والهدف والحالة). إذا رجع بالطلب، ما ننطيه وجه.
  insert into categories (household_id, month, name, amount, carried, type, goal, closed)
  select hh, p_month, x->>'name', 0,
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


-- ------------------------------------------------------------
-- ٦) load_month ترجع closed للواجهة (+ linkId للمصاريف)
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
      'month',   p_month,
      'salary1', coalesce(b.salary1, 0),
      'salary2', coalesce(b.salary2, 0),
      'locked',  coalesce(b.locked, false),
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
        'desc', e.descr, 'category', e.category, 'by', e.by_name,
        'linkId', e.link_id
      ) order by e.created_at desc)
      from expenses e where e.household_id = hh and e.month = p_month
    ), '[]'::jsonb),
    'debts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'fund', d.fund, 'account', d.account, 'amount', d.amount,
        'date', d.date, 'month', d.month, 'wdId', d.withdrawal_id, 'toCategory', d.to_category
      ) order by d.created_at desc)
      from debts d where d.household_id = hh and d.status = 'مفتوح'
    ), '[]'::jsonb)
  );
end $function$;

commit;
