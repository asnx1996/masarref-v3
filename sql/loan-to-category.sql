-- ============================================================
--  ميزة: قرض من صندوق ادخار «على تصنيف مصاريف»
-- ============================================================
--  الفكرة:
--   - بدل ما القرض يكون لشخص بس، صار يقدر يكون على أحد تصنيفات المصاريف.
--   - وقت القرض: ينقص رصيد الصندوق ويزيد «المتاح» للتصنيف (قرض مؤقت).
--   - يظل دين مفتوح، ويترحّل ويبقى ظاهر عبر الأشهر (مثل باقي الديون المفتوحة).
--   - وقت الإرجاع: يرجّع المبلغ للصندوق وينقص «المتاح» من التصنيف، ويقفل الدين.
--
--  التوافق: الديون القديمة (قرض لشخص / سحب على حساب) ما تتأثر —
--           to_category تظل NULL عندها فتشتغل بالسلوك القديم بالضبط.
--
--  طريقة الرفع: افتح Supabase ← SQL Editor ← الصق كل هذا الملف ← Run.
--  (كله داخل معاملة وحدة — إذا صار خطأ ما ينحفظ شي ناقص.)
-- ============================================================

begin;

-- ------------------------------------------------------------
-- 1) عمود جديد على جدول الديون: التصنيف اللي انعطى له القرض
--    NULL = قرض لشخص أو سحب عادي (السلوك القديم)
-- ------------------------------------------------------------
alter table public.debts add column if not exists to_category text;


-- ------------------------------------------------------------
-- 2) توسعة add_loan ببارامتر اختياري p_to_category
--    نحذف التوقيع القديم (٧ بارامترات) أول حتى ما يصير تعارض overload
-- ------------------------------------------------------------
drop function if exists public.add_loan(text, text, numeric, text, text, text, text);

create or replace function public.add_loan(
  p_month text,
  p_date text,
  p_amount numeric,
  p_fund text,
  p_account text,
  p_due_date text default ''::text,
  p_descr text default ''::text,
  p_to_category text default ''::text
)
 returns uuid
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  v_name text;
  v_id uuid;
  v_acc text := trim(coalesce(p_account,''));
  v_to  text := trim(coalesce(p_to_category,''));
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if coalesce(p_amount,0) <= 0 then raise exception 'المبلغ لازم يكون أكبر من صفر'; end if;
  if exists (select 1 from budgets where household_id = hh and month = p_month and locked) then
    raise exception 'هذا الشهر مقفل';
  end if;
  if not exists (select 1 from categories where household_id = hh and month = p_month and name = p_fund and type = 'save') then
    raise exception 'الصندوق غير موجود بميزانية هذا الشهر';
  end if;

  select display_name into v_name from profiles where id = auth.uid();

  if v_to <> '' then
    ------------------------------------------------------------
    -- (أ) قرض على تصنيف مصاريف
    ------------------------------------------------------------
    if not exists (select 1 from categories where household_id = hh and month = p_month and name = v_to and type <> 'save') then
      raise exception 'تصنيف المصروف «%» غير موجود', v_to;
    end if;

    -- ١) حركة القرض على الصندوق (تنقص رصيده — مثل السحب)
    insert into expenses (household_id, month, date, amount, descr, category, by_name)
    values (hh, p_month, coalesce(p_date,''), p_amount,
            'قرض لتصنيف «' || v_to || '»' || coalesce(nullif(' — ' || trim(p_descr), ' — '), ''),
            p_fund, coalesce(v_name,''))
    returning id into v_id;

    -- ٢) تمويل التصنيف بنفس المبلغ (حركة سالبة عليه، مربوطة بالسحب) — يزيد «المتاح»
    insert into expenses (household_id, month, date, amount, descr, category, by_name, link_id)
    values (hh, p_month, coalesce(p_date,''), -p_amount,
            'قرض من صندوق «' || p_fund || '»', v_to, coalesce(v_name,''), v_id);

    -- ٣) سجل الدين — التصنيف يدين للصندوق (account = اسم التصنيف)، to_category محدد
    insert into debts (household_id, fund, account, amount, date, month, status, withdrawal_id, kind, due_date, to_category)
    values (hh, p_fund, v_to, p_amount, coalesce(p_date,''), p_month, 'مفتوح', v_id,
            'قرض', nullif(trim(coalesce(p_due_date,'')), ''), v_to);

  else
    ------------------------------------------------------------
    -- (ب) قرض لشخص — السلوك القديم بالضبط
    ------------------------------------------------------------
    if v_acc = '' then raise exception 'اكتب اسم اللي أخذ القرض'; end if;

    -- ١) حركة القرض على الصندوق (تنقص رصيده — مثل السحب)
    insert into expenses (household_id, month, date, amount, descr, category, by_name)
    values (hh, p_month, coalesce(p_date,''), p_amount,
            'قرض لـ«' || v_acc || '»' || coalesce(nullif(' — ' || trim(p_descr), ' — '), ''),
            p_fund, coalesce(v_name,''))
    returning id into v_id;

    -- ٢) سجل القرض — يظل مفتوح لين يرجع للصندوق أو ينشطب
    insert into debts (household_id, fund, account, amount, date, month, status, withdrawal_id, kind, due_date)
    values (hh, p_fund, v_acc, p_amount, coalesce(p_date,''), p_month, 'مفتوح', v_id,
            'قرض', nullif(trim(coalesce(p_due_date,'')), ''));
  end if;

  return v_id;
end $function$;


-- ------------------------------------------------------------
-- 3) توسعة return_debt: لو الدين قرض على تصنيف، الإرجاع
--    ينقص «المتاح» من التصنيف (زيادة على رجوع المبلغ للصندوق)
-- ------------------------------------------------------------
create or replace function public.return_debt(p_id uuid, p_date text default ''::text)
 returns text
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  d debts%rowtype;
  v_date text;
  v_month text;
  v_name text;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  select * into d from debts where id = p_id and household_id = hh;
  if d.id is null then raise exception 'الدين غير موجود'; end if;
  if d.status <> 'مفتوح' then raise exception 'هذا الدين مو مفتوح'; end if;

  v_date := nullif(left(coalesce(p_date,''), 10), '');
  if v_date is null then
    v_date := to_char(now() at time zone 'Asia/Baghdad', 'YYYY-MM-DD');
  end if;
  v_month := left(v_date, 7);
  if exists (select 1 from budgets where household_id = hh and month = v_month and locked) then
    raise exception 'شهر الإرجاع مقفل، اختر تاريخ بشهر مفتوح';
  end if;

  select display_name into v_name from profiles where id = auth.uid();

  -- ١) رجوع المبلغ للصندوق (حركة سالبة على الصندوق تزيد رصيده)
  insert into expenses (household_id, month, date, amount, descr, category, by_name)
  values (hh, v_month, v_date, -d.amount, 'إرجاع دين: ' || d.account, d.fund, coalesce(v_name,''));

  -- ٢) لو قرض على تصنيف: خصم المبلغ من «المتاح» بالتصنيف (حركة موجبة عليه)
  if coalesce(trim(d.to_category), '') <> '' then
    insert into expenses (household_id, month, date, amount, descr, category, by_name)
    values (hh, v_month, v_date, d.amount, 'سداد قرض لصندوق «' || d.fund || '»', d.to_category, coalesce(v_name,''));
  end if;

  update debts set status = 'مسترجع' where id = p_id and household_id = hh;
  return v_month;
end $function$;


-- ------------------------------------------------------------
-- 4) إظهار toCategory بقوائم الديون حتى الواجهة تميّز قرض التصنيف
-- ------------------------------------------------------------
create or replace function public.list_open_debts()
 returns jsonb
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', id, 'account', account, 'fund', fund, 'amount', amount,
    'date', date, 'month', month, 'status', status,
    'kind', coalesce(kind,'سحب'), 'dueDate', due_date, 'toCategory', to_category
  ) order by date), '[]'::jsonb)
  from debts
  where household_id = my_household() and status = 'مفتوح'
$function$;

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
        select jsonb_agg(jsonb_build_object('name', c.name, 'amount', c.amount, 'carried', c.carried, 'type', c.type, 'goal', c.goal) order by c.name)
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
        'desc', e.descr, 'category', e.category, 'by', e.by_name
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
