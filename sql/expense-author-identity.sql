-- ============================================================
--  إصلاح: «منو صرف» يتعلّق بالهوية مو بالاسم النصي
-- ============================================================
--  المشكلة:
--   - عمود expenses.by_name يخزّن اسم المُدخِل كـ«صورة» وقت التسجيل.
--   - فكل مرة تغيّر اسمك، المصاريف القديمة تبقى بالاسم القديم
--     ويظهر «شخص» جديد بفلتر «منو صرف».
--   - مثال حقيقي من البيانات: نفس الشخص انقسم لثلاثة —
--       «أحمد» (٣٨ مصروف) · «أحمد ابن الرافدين» (٤٤) · «احمد ابن الرافدين» (٤)
--
--  الحل:
--   ١) عمود جديد expenses.user_id — هوية صاحب المصروف الحقيقية.
--   ٢) تريغر يحطها تلقائياً بكل إدراج (يغطي كل الدوال الحالية
--      والجاية: add_expense / withdraw_fund / add_loan / add_deposit /
--      return_debt / أي شي ينضاف بعدين) — بدون ما نلمس أي دالة.
--   ٣) load_month تعرض الاسم الحالي من profiles، وترجع لـby_name
--      بس للسجلات القديمة اللي ما انربطت.
--   ٤) ملء أثر رجعي: كل صف اسمه يطابق اسم عضو بنفس العائلة ينربط.
--   ٥) list_authors / merge_author — لدمج الأسماء القديمة الباقية
--      (مثل «أحمد» و«احمد ابن الرافدين») بشخص واحد من الواجهة.
--
--  بعد هذا: تغيير الاسم يمشي على كل التاريخ تلقائياً، وتسجيل الدخول
--  بحساب ثاني ينطي هوية مستقلة صح.
--
--  طريقة الرفع: افتح Supabase ← SQL Editor ← الصق كل هذا الملف ← Run.
-- ============================================================

begin;

-- ------------------------------------------------------------
-- ١) عمود الهوية
-- ------------------------------------------------------------
alter table public.expenses add column if not exists user_id uuid;
create index if not exists expenses_user_id_idx on public.expenses (user_id);


-- ------------------------------------------------------------
-- ٢) تريغر يختم الهوية بكل إدراج
--    ليش تريغر ومو تعديل كل دالة؟ لأن الإدراج بـexpenses يصير من
--    ٥ دوال مختلفة على الأقل — التريغر يغطيهن كلهن ويغطي أي دالة
--    جديدة تنكتب بالمستقبل، بدون خطر نسيان وحدة.
-- ------------------------------------------------------------
create or replace function public.stamp_expense_author()
 returns trigger
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
begin
  if new.user_id is null then
    new.user_id := auth.uid();
  end if;
  return new;
end $function$;

drop trigger if exists trg_stamp_expense_author on public.expenses;
create trigger trg_stamp_expense_author
  before insert on public.expenses
  for each row execute function public.stamp_expense_author();


-- ------------------------------------------------------------
-- ٣) ملء أثر رجعي — الأسماء اللي تطابق عضو بنفس العائلة بالضبط
-- ------------------------------------------------------------
update public.expenses e
set user_id = p.id
from public.profiles p
where e.user_id is null
  and p.household_id = e.household_id
  and trim(p.display_name) = trim(e.by_name);


-- ------------------------------------------------------------
-- ٤) load_month تعرض الاسم الحالي من الملف الشخصي
--    (نفس نسخة الفترات + resolve للاسم)
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
        'desc', e.descr, 'category', e.category,
        -- 🔑 الاسم الحالي من الملف الشخصي — وby_name بس للسجلات القديمة
        'by', coalesce(pr.display_name, e.by_name),
        'byId', e.user_id,
        'linkId', e.link_id
      ) order by e.created_at desc)
      from expenses e
      left join profiles pr on pr.id = e.user_id
      where e.household_id = hh and e.month = p_month
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
-- ٥) الأسماء القديمة غير المرتبطة — للعرض بالواجهة
--    ترجّع كل by_name ما إله user_id، مع عدد مصاريفه.
-- ------------------------------------------------------------
create or replace function public.list_authors()
 returns jsonb
 language plpgsql
 stable security definer
 set search_path to 'public'
as $function$
declare hh uuid := my_household();
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  return jsonb_build_object(
    'members', coalesce((
      select jsonb_agg(jsonb_build_object('id', p.id, 'name', p.display_name)
             order by p.display_name)
      from profiles p where p.household_id = hh
    ), '[]'::jsonb),
    'orphans', coalesce((
      select jsonb_agg(jsonb_build_object('name', t.by_name, 'count', t.n) order by t.n desc)
      from (
        select coalesce(e.by_name,'') as by_name, count(*) as n
        from expenses e
        where e.household_id = hh and e.user_id is null
        group by coalesce(e.by_name,'')
      ) t
    ), '[]'::jsonb)
  );
end $function$;


-- ------------------------------------------------------------
-- ٦) دمج اسم قديم بعضو — يربط كل مصاريف ذاك الاسم بهويته
-- ------------------------------------------------------------
create or replace function public.merge_author(p_old_name text, p_user_id uuid)
 returns integer
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  n integer;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  -- الهدف لازم يكون عضو بنفس العائلة
  if not exists (select 1 from profiles where id = p_user_id and household_id = hh) then
    raise exception 'هذا العضو مو بعائلتك';
  end if;

  update expenses
  set user_id = p_user_id
  where household_id = hh
    and user_id is null
    and coalesce(by_name,'') = coalesce(p_old_name,'');

  get diagnostics n = row_count;
  return n;
end $function$;

commit;
