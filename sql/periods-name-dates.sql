-- ============================================================
--  ميزة: الشهر صار «فترة» — اسم تختاره + تاريخ بداية ونهاية
-- ============================================================
--  المشكلة:
--   - الراتب يوصل يوم ٢٠ من الشهر، فتقفل «شهر ٧» يوم ٢٠ وتبدي
--     بالشهر الجديد. بس مصاريف أيام ٢١–٣١ تموز تاريخها الحقيقي
--     بشهر ٧ (المقفل) → التطبيق يرفضها أو يوديها للشهر الغلط.
--
--  الحل:
--   - عمود month ('YYYY-MM') يظل مفتاح داخلي بس — مو شهر تقويمي.
--   - كل فترة إلها: اسم (title) تكتبه إنت، وتاريخ بداية ونهاية.
--   - المصروف ينسجل بتاريخه الحقيقي (date) لكن ينحسب على الفترة
--     المفتوحة (month) — الاثنين انفصلوا.
--
--  شنو يتغيّر بهذا الملف:
--   ١) أعمدة جديدة على budgets: title / start_date / end_date.
--   ٢) دالة set_period لضبط الاسم والتواريخ (وتعديلهم بعدين).
--   ٣) load_month ترجّع الاسم والتواريخ للواجهة.
--   ٤) add_deposit تاخذ p_month صريح (بدل ما تشتقه من التاريخ).
--   ٥) edit_expense ما عادت تنقل المصروف لشهر ثاني لمن تغيّر تاريخه.
--   ٦) months_summary ترجّع الاسم والتواريخ لقائمة الأشهر.
--
--  طريقة الرفع: افتح Supabase ← SQL Editor ← الصق كل هذا الملف ← Run.
--  (كله داخل معاملة وحدة — إذا صار خطأ ما ينحفظ شي ناقص.)
-- ============================================================

begin;

-- ------------------------------------------------------------
-- ١) أعمدة الفترة
-- ------------------------------------------------------------
alter table public.budgets add column if not exists title      text;
alter table public.budgets add column if not exists start_date text;
alter table public.budgets add column if not exists end_date   text;


-- ------------------------------------------------------------
-- ٢) ضبط/تعديل الفترة — الاسم والتواريخ
--    ملاحظة: مسموح حتى لو الشهر مقفل، لأنها بيانات وصفية بس
--    (ما تمسّ أي مبلغ ولا أي حركة).
-- ------------------------------------------------------------
create or replace function public.set_period(
  p_month text,
  p_title text default ''::text,
  p_start text default ''::text,
  p_end   text default ''::text
)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  v_title text := nullif(trim(coalesce(p_title,'')), '');
  v_start text := nullif(left(coalesce(p_start,''), 10), '');
  v_end   text := nullif(left(coalesce(p_end,''),   10), '');
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if p_month is null or p_month = '' then raise exception 'الشهر مطلوب'; end if;
  if v_start is not null and v_end is not null and v_end < v_start then
    raise exception 'تاريخ النهاية لازم يكون بعد تاريخ البداية';
  end if;

  insert into budgets (household_id, month, salary1, salary2, locked, title, start_date, end_date)
  values (hh, p_month, 0, 0, false, v_title, v_start, v_end)
  on conflict (household_id, month)
  do update set title = v_title, start_date = v_start, end_date = v_end;
end $function$;


-- ------------------------------------------------------------
-- ٣) load_month ترجّع بيانات الفترة
--    (نفس النسخة الحالية + title/startDate/endDate)
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


-- ------------------------------------------------------------
-- ٤) add_deposit تاخذ الفترة صريحة
--    p_month فاضي = السلوك القديم (يشتق الشهر من التاريخ) حتى
--    ما تنكسر أي نسخة واجهة قديمة بعدها بالكاش.
--    ⚠️ لازم نحذف التوقيع القديم (٥ بارامترات) أول — لأن زيادة
--    بارامتر تسوّي دالة جديدة (overload) مو استبدال، وPostgREST
--    يحتار بين الاثنين.
-- ------------------------------------------------------------
drop function if exists public.add_deposit(text, numeric, text, text, text);

create or replace function public.add_deposit(
  p_fund text,
  p_amount numeric,
  p_date text default ''::text,
  p_descr text default ''::text,
  p_from_category text default ''::text,
  p_month text default ''::text
)
 returns uuid
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  v_date text; v_month text; v_name text; v_id uuid;
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
    -- إيداع من الفائض — محدود بالفائض المتاح
    v_cap := surplus_of(hh, v_month);
    if v_cap <= 0 then
      raise exception 'ماكو فائض متاح تودّعه — كل فلوسك موزّعة. زيّد الدخل أو قلّل التوزيع أول';
    end if;
    if p_amount > v_cap then
      raise exception 'الفائض المتاح بس % — ما تكدر تودّع أكثر منه', to_char(v_cap, 'FM999,999,999');
    end if;

    insert into expenses (household_id, month, date, amount, descr, category, by_name)
    values (hh, v_month, v_date, -p_amount,
            'إيداع: ' || coalesce(nullif(trim(p_descr), ''), 'إضافة للرصيد'),
            p_fund, coalesce(v_name, ''))
    returning id into v_id;

  else
    -- إيداع من تصنيف مصروف — محدود بالمتاح بذاك التصنيف
    if not exists (select 1 from categories where household_id = hh and month = v_month and name = v_from and type <> 'save') then
      raise exception 'تصنيف المصروف «%» غير موجود', v_from;
    end if;

    select (c.amount + c.carried)
           - coalesce((select sum(e.amount) from expenses e
                       where e.household_id = hh and e.month = v_month and e.category = c.name), 0)
    into v_avail
    from categories c
    where c.household_id = hh and c.month = v_month and c.name = v_from and c.type <> 'save';

    if p_amount > v_avail then
      raise exception 'المتاح بـ«%» بس % — ما تكدر تودّع أكثر', v_from, to_char(v_avail, 'FM999,999,999');
    end if;

    insert into expenses (household_id, month, date, amount, descr, category, by_name)
    values (hh, v_month, v_date, -p_amount,
            'إيداع من «' || v_from || '»' || coalesce(nullif(' — ' || trim(p_descr), ' — '), ''),
            p_fund, coalesce(v_name, ''))
    returning id into v_id;

    insert into expenses (household_id, month, date, amount, descr, category, by_name)
    values (hh, v_month, v_date, p_amount,
            'إيداع لصندوق «' || p_fund || '»', v_from, coalesce(v_name, ''));
  end if;

  return v_id;
end $function$;


-- ------------------------------------------------------------
-- ٥) edit_expense ما تنقل المصروف لفترة ثانية
--    قبل: تغيير التاريخ يغيّر month → المصروف يقفز لفترة ثانية
--    (وممكن مقفلة). هسه الفترة ثابتة، والتاريخ حر.
-- ------------------------------------------------------------
create or replace function public.edit_expense(p_id uuid, p_date text, p_amount numeric, p_descr text, p_category text)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  old_month text;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if coalesce(p_amount,0) <= 0 then raise exception 'المبلغ لازم يكون أكبر من صفر'; end if;

  select month into old_month from expenses where id = p_id and household_id = hh;
  if old_month is null then raise exception 'المصروف غير موجود'; end if;
  if exists (select 1 from budgets where household_id = hh and month = old_month and locked) then
    raise exception 'هذه الفترة مقفلة، ما تكدر تعدّل منها';
  end if;

  -- الفترة (month) ما تتغيّر — بس التاريخ والباقي
  update expenses
  set date = coalesce(p_date,''), amount = p_amount,
      descr = coalesce(p_descr,''), category = coalesce(p_category,'')
  where id = p_id and household_id = hh;
end $function$;


-- ------------------------------------------------------------
-- ٦) months_summary ترجّع اسم الفترة وتواريخها
-- ------------------------------------------------------------
create or replace function public.months_summary()
 returns jsonb
 language plpgsql
 stable security definer
 set search_path to 'public'
as $function$
declare hh uuid := my_household();
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'month', t.month, 'locked', t.locked,
      'title', t.title, 'startDate', t.start_date, 'endDate', t.end_date,
      'income', t.income, 'spent', t.spent, 'saved', t.saved
    ) order by t.month)
    from (
      select b.month, b.locked, b.title, b.start_date, b.end_date,
        b.salary1 + b.salary2
          + coalesce((select sum(i.amount) from budget_incomes i where i.household_id = hh and i.month = b.month), 0) as income,
        coalesce((
          select sum(e.amount)
          from expenses e
          left join categories c on c.household_id = e.household_id and c.month = e.month and c.name = e.category
          where e.household_id = hh and e.month = b.month and coalesce(c.type, 'spend') <> 'save'
        ), 0) as spent,
        coalesce((select sum(c2.amount) from categories c2 where c2.household_id = hh and c2.month = b.month and c2.type = 'save'), 0) as saved
      from budgets b
      where b.household_id = hh
    ) t
  ), '[]'::jsonb);
end $function$;

commit;


-- ============================================================
--  تكملة: دالتين باقيات چان بيهن نفس القيد «التاريخ بنفس الشهر»
-- ============================================================

begin;

-- ------------------------------------------------------------
-- ٧) edit_withdrawal: نشيل فحص «التاريخ لازم يبقى بنفس الشهر».
--    الدالة أصلاً ما تغيّر عمود month — الفحص چان احتياطي وصار
--    غلط بعد ما انفصل التاريخ عن الفترة.
-- ------------------------------------------------------------
create or replace function public.edit_withdrawal(p_id uuid, p_amount numeric, p_date text, p_descr text default null::text)
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
  -- (انشال فحص الشهر — الفترة ثابتة والتاريخ حر)

  -- أ) حركة السحب نفسها
  update expenses
  set amount = p_amount,
      date   = coalesce(nullif(p_date,''), date),
      descr  = coalesce(nullif(trim(p_descr), ''), descr)
  where id = p_id and household_id = hh;

  -- ب) الدين/القرض المفتوح المرتبط
  update debts
  set amount = p_amount,
      date   = coalesce(nullif(p_date,''), date)
  where household_id = hh and withdrawal_id = p_id and status = 'مفتوح';

  -- ج) حركة تمويل التصنيف المرتبطة (عبر link_id)
  update expenses
  set amount = -p_amount,
      date   = coalesce(nullif(p_date,''), date)
  where household_id = hh and link_id = p_id;

  -- سحوبات قديمة (قبل v9): ماكو link_id — نلكي حركة التمويل المطابقة
  if not found then
    select ctid into v_ctid from expenses
    where household_id = hh and month = v_old.month
      and link_id is null
      and descr = 'تمويل من صندوق «' || v_old.category || '»'
      and amount = -v_old.amount and date = v_old.date
    limit 1;
    if v_ctid is not null then
      update expenses
      set amount = -p_amount,
          date   = coalesce(nullif(p_date,''), date),
          link_id = p_id
      where ctid = v_ctid;
    end if;
  end if;
end $function$;


-- ------------------------------------------------------------
-- ٨) return_debt تاخذ الفترة صريحة (p_month) بدل ما تشتقها من
--    التاريخ — حتى إرجاع القرض ينحسب على الفترة المفتوحة حتى لو
--    تاريخه يقع بشهر تقويمي مقفل.
--    (لازم نحذف التوقيع القديم أول — زيادة بارامتر = overload.)
-- ------------------------------------------------------------
drop function if exists public.return_debt(uuid, text);

create or replace function public.return_debt(p_id uuid, p_date text default ''::text, p_month text default ''::text)
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
  v_month := coalesce(nullif(trim(coalesce(p_month,'')), ''), left(v_date, 7));
  if exists (select 1 from budgets where household_id = hh and month = v_month and locked) then
    raise exception 'فترة الإرجاع مقفلة، اختر فترة مفتوحة';
  end if;

  select display_name into v_name from profiles where id = auth.uid();

  -- ١) رجوع المبلغ للصندوق (حركة سالبة على الصندوق تزيد رصيده)
  insert into expenses (household_id, month, date, amount, descr, category, by_name)
  values (hh, v_month, v_date, -d.amount, 'إرجاع دين: ' || d.account, d.fund, coalesce(v_name,''));

  -- ٢) لو قرض على تصنيف: خصم المبلغ من «المتاح» بالتصنيف
  if coalesce(trim(d.to_category), '') <> '' then
    insert into expenses (household_id, month, date, amount, descr, category, by_name)
    values (hh, v_month, v_date, d.amount, 'سداد قرض لصندوق «' || d.fund || '»', d.to_category, coalesce(v_name,''));
  end if;

  update debts set status = 'مسترجع' where id = p_id and household_id = hh;
  return v_month;
end $function$;

commit;
