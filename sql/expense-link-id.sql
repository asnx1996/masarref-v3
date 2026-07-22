-- ============================================================
--  إصلاح: إرجاع link_id مع المصاريف بـ load_month
-- ============================================================
--  الفكرة:
--   - حركات «تمويل من صندوق» و«قرض من صندوق» مخزونة بعمود link_id
--     يربطها بحركة السحب الأصلية على الصندوق.
--   - الواجهة كانت تلگه السحب الأصلي بالتخمين (نفس التصنيف والمبلغ
--     والتاريخ) — وإذا صار سحبين متشابهين بنفس اليوم ممكن تحذف الغلط.
--   - بعد هذا الملف، load_month ترجع linkId والواجهة تحذف الربط الدقيق.
--
--  التوافق: الواجهة تشتغل قبل وبعد الرفع (إذا linkId ما موجود ترجع
--           للتخمين القديم) — بس الرفع هو اللي يفعّل الربط الدقيق.
--
--  طريقة الرفع: افتح Supabase ← SQL Editor ← الصق كل هذا الملف ← Run.
-- ============================================================

begin;

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
