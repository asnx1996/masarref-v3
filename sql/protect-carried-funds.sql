-- ============================================================
--  حماية ١: الصناديق المرحّلة ما تنحذف عند حفظ الميزانية
-- ============================================================
--  المشكلة:
--   - save_budget تحذف كل تصنيفات الشهر وتعيد إدخالها من طلب الواجهة.
--   - فأي صندوق ادخار مرحّل (بيه رصيد من شهر سابق) ما يجي بالطلب —
--     لأي سبب (خلل بالواجهة، طلب ناقص...) — كان ينحذف برصيده كله.
--
--  الحل:
--   - قبل الحذف نلقط الصناديق اللي بيها رصيد مرحّل (carried <> 0).
--   - بعد إعادة الإدخال، أي صندوق منهم ما رجع بالطلب نرجّعه بنفسنا
--     (بمساهمة شهرية 0 ونفس الرصيد والهدف). إذا جا بالطلب، ما نلمسه.
--   - النتيجة: مستحيل صندوق مرحّل يختفي بسبب حفظ ميزانية.
--
--  (الواجهة هم صارت تحمي صف الصندوق المرحّل من الحذف — هاي طبقة
--   حماية ثانية من جهة السيرفر.)
--
--  طريقة الرفع: افتح Supabase ← SQL Editor ← الصق كل هذا الملف ← Run.
-- ============================================================

begin;

create or replace function public.save_budget(p_month text, p_salaries jsonb, p_categories jsonb, p_incomes jsonb)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  old_carried jsonb;
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

  -- 🔒 نلقط الصناديق المرحّلة (بيها رصيد من شهر سابق) قبل الحذف
  select coalesce(jsonb_agg(jsonb_build_object('name', name, 'carried', carried, 'goal', goal)), '[]'::jsonb)
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
  insert into categories (household_id, month, name, amount, carried, type, goal)
  select hh, p_month, trim(x->>'name'),
         coalesce((x->>'amount')::numeric, 0),
         coalesce((old_carried->>trim(x->>'name'))::numeric, 0),
         case when x->>'type' = 'save' then 'save' else 'spend' end,
         case when x->>'type' = 'save' then coalesce((x->>'goal')::numeric, 0) else 0 end
  from jsonb_array_elements(coalesce(p_categories, '[]'::jsonb)) x
  where trim(coalesce(x->>'name','')) <> ''
  on conflict (household_id, month, name) do nothing;

  -- 🔒 حماية الصناديق المرحّلة: أي صندوق برصيد مرحّل ما رجع بالطلب،
  -- نرجّعه بنفسنا (مساهمة 0 + نفس الرصيد والهدف). إذا رجع، ما ننطيه وجه.
  insert into categories (household_id, month, name, amount, carried, type, goal)
  select hh, p_month, x->>'name', 0,
         coalesce((x->>'carried')::numeric, 0), 'save',
         coalesce((x->>'goal')::numeric, 0)
  from jsonb_array_elements(old_funds) x
  on conflict (household_id, month, name) do nothing;

  delete from budget_incomes where household_id = hh and month = p_month;
  insert into budget_incomes (household_id, month, descr, amount)
  select hh, p_month, coalesce(x->>'desc',''), coalesce((x->>'amount')::numeric, 0)
  from jsonb_array_elements(coalesce(p_incomes, '[]'::jsonb)) x
  where coalesce((x->>'amount')::numeric,0) > 0 or coalesce(x->>'desc','') <> '';
end $function$;

commit;
