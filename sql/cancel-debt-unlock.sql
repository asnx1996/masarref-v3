-- ============================================================
--  إصلاح: شطب دين/قرض حتى لو شهره الأصلي صار مقفل
-- ============================================================
--  المشكلة:
--   - القرض ينسحب من صندوق بشهر معيّن، وبعدين الشهر ينقفل
--     (مثلاً تستلم راتب الشهر الجاي يوم ٢٠ وتقفل من وقتها).
--   - القرض يظل مفتوح ويظهر بالشهر الجديد، بس لما تحاول تشطبه
--     يطلع خطأ «الشهر مقفل».
--
--  الحل:
--   - الشطب ما يعدّل أي حركة بالشهر المقفل أصلاً — بس يأشّر على
--     سجل الدين إنه انشطب (المبلغ يبقى مسحوب وما يرجع).
--     فما في داعي لفحص قفل الشهر الأصلي.
--
--  ملاحظة: الإرجاع (return_debt) ما يتغيّر — هو أصلاً يفحص شهر
--  «تاريخ الإرجاع» بس، والواجهة صارت تمرر تاريخ من الشهر المفتوح.
--
--  طريقة الرفع: افتح Supabase ← SQL Editor ← الصق كل هذا الملف ← Run.
-- ============================================================

begin;

drop function if exists public.cancel_debt(uuid);

create or replace function public.cancel_debt(p_id uuid)
 returns text
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  d debts%rowtype;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  select * into d from debts where id = p_id and household_id = hh;
  if d.id is null then raise exception 'الدين غير موجود'; end if;
  if d.status <> 'مفتوح' then raise exception 'هذا الدين مو مفتوح'; end if;

  -- بس نأشّر على الدين — ما نلمس أي حركة قديمة (فالشهر المقفل يظل مثل ما هو)
  update debts set status = 'مشطوب' where id = p_id and household_id = hh;
  return d.month;
end $function$;

commit;
