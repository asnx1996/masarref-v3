-- ============================================================
--  ميزة: تعديل فاتورة (اسم / مبلغ / يوم الاستحقاق) بدون حذف
-- ============================================================
--  الواجهة صارت تفتح نافذة تعديل بالضغط على الفاتورة —
--  هاي الدالة اللي تحفظ التعديل.
--
--  طريقة الرفع: افتح Supabase ← SQL Editor ← الصق كل هذا الملف ← Run.
-- ============================================================

begin;

create or replace function public.edit_bill(p_id uuid, p_name text, p_amount numeric, p_due_day integer default null)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if trim(coalesce(p_name, '')) = '' then raise exception 'اسم الفاتورة مطلوب'; end if;
  if p_due_day is not null and (p_due_day < 1 or p_due_day > 31) then
    raise exception 'يوم الاستحقاق لازم يكون بين 1 و31';
  end if;

  update bills
  set name = trim(p_name),
      amount = coalesce(p_amount, 0),
      due_day = p_due_day
  where id = p_id and household_id = hh;

  if not found then raise exception 'الفاتورة غير موجودة'; end if;
end $function$;

commit;
