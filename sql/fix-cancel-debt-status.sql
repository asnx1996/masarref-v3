-- ============================================================
--  إصلاح: «شطب القرض» كان يرفض دائماً (مو بسبب قفل الشهر!)
-- ============================================================
--  السبب الحقيقي:
--   - ملف cancel-debt-unlock.sql شال فحص قفل الشهر (زين)، بس
--     خلّى الدالة تحط status = 'مشطوب'.
--   - جدول debts بيه قيد:
--        CHECK (status in ('مفتوح','مسترجع','ملغى'))
--     فحالة 'مشطوب' ممنوعة → كل شطبة ترجع خطأ قيد، وتظهر
--     للمستخدم كأنها رفض.
--
--  الحل:
--   - نرجّع الدالة تستعمل 'ملغى' — هي أصلاً الحالة اللي تستعملها
--     الشطبات القديمة بالبيانات، فما يصير عدنا حالتين لنفس المعنى.
--   - القيد ما ينلمس، وما نحتاج ترحيل بيانات.
--   - فحص قفل الشهر يبقى مشال (الشطب ما يعدّل أي حركة قديمة —
--     بس يأشّر على سجل الدين، والمبلغ يبقى مسحوب).
--
--  طريقة الرفع: افتح Supabase ← SQL Editor ← الصق كل هذا الملف ← Run.
-- ============================================================

begin;

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

  -- 'ملغى' — الحالة المسموحة بالقيد debts_status_check (مو 'مشطوب').
  -- ما نلمس أي حركة قديمة، فالشهر المقفل يظل مثل ما هو.
  update debts set status = 'ملغى' where id = p_id and household_id = hh;
  return d.month;
end $function$;

commit;
