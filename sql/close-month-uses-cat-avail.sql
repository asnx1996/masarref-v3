-- ============================================================
--  الترحيل عند الإقفال = المتاح (تكملة withdrawal-covers-allocation)
-- ------------------------------------------------------------
--  بذيل withdrawal-covers-allocation.sql سجّلنا غلطاً ما لمسناه
--  وقتها: close_month يحسب «المنصرف» بـsum(e.amount) لكل الحركات،
--  يعني يحسب تسديد القرض (kind='cat_pay') على التصنيف.
--
--  وهذا غلط: تسديد القرض ما يمسّ التصنيف أصلاً — التصنيف انخصم
--  يوم القرض بـcat_loan. لو حسبناه مرة ثانية عند الإقفال، التصنيف
--  ينخصم مرتين والمرحّل ينقص بمقدار التسديد بلا وجه حق.
--
--  وكل باقي النظام متفق على استثناءه:
--    • cat_spent بالسيرفر          — `<> 'cat_pay'`
--    • hitsCat بـcore.js           — `k !== 'cat_pay'`
--    • bkLedger بـbooks.js         — يمرّ على hitsCat
--    • فحص سلسلة الترحيل بالمدقق   — يمرّ على hitsCat
--  close_month چان الوحيد الشاذ — يعني المدقق راح يعلّم «انكسار
--  بسلسلة الترحيل» على أي فترة بيها تسديد قرض، وهو محق.
--
--  الحل هنا مو ترقيع: التصنيف يترحّل بـcat_avail مباشرة. المعنى
--  يصير صريح — «اللي يترحّل للفترة الجاية هو المتاح» — ويورّث
--  تلقائياً قاعدتين بمصدر واحد: السحب يغطّي المخصص، والتسديد ما
--  يمسّ التصنيف. والصندوق يبقى مثل ما چان (المرحّل + المساهمة −
--  صافي حركاته) لأن كل حركاته فلوس حقيقية طالعة وداخلة.
--
--  ✅ أثره على البيانات الحالية: صفر.
--     ماكو ولا حركة cat_pay بالقاعدة لحد هسه، وانتأكدنا قبل الرفع
--     بمقارنة الصيغتين على كل تصنيف مصروف موجود — ماكو ولا فرق.
-- ============================================================

begin;

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
    -- 🔑 التصنيف يترحّل بمتاحه — مصدر واحد للقاعدة (السحب يغطّي
    --    المخصص، والتسديد ما يمسّ التصنيف).
    --    الصندوق: المرحّل + المساهمة − صافي حركاته، كل حركاته فلوس.
    if r.type = 'save' then
      v_left := (r.amount + r.carried) - r.spent;
    else
      v_left := cat_avail(hh, p_month, r.name);
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
--  cat_spent وspend_total داخليتان مثل cat_wd/cat_avail — الواجهة
--  ما تندههن مباشرة أبداً (انتأكدنا: ماكو sb.rpc('cat_spent') ولا
--  sb.rpc('spend_total') بأي ملف)، وتنندّان من جوّا دوال security
--  definer ثانية. نسحب EXECUTE من public/anon مثل ما هي surplus_of،
--  حتى ما يبقى /rest/v1/rpc/cat_spent مفتوحاً لغير المسجّلين
--  يجرّبون household_id عشوائي.
-- ------------------------------------------------------------
revoke execute on function public.cat_spent(uuid, text, text) from public, anon;
revoke execute on function public.spend_total(uuid, text)     from public, anon;

commit;

-- ============================================================
--  ✅ انرفع على المشروع rcpwavfgxrqzgxclqwss بتاريخ 2026-09-16
--     (migration: close_month_uses_cat_avail)
--     الرجوع للخلف: sql/rollback/before-withdrawal-covers-allocation.sql
--     (يرجّع الثلاث هجرات سوة — close_month وadd_deposit
--      وtransfer_category لتعريفاتهن الأصلية)
--
--  بعد هذا الملف صار ماكو إلا مصدر واحد لـ«متاح التصنيف»:
--    السيرفر : cat_avail()
--    الواجهة : catAvailable() بـapp.js
--    الدفاتر : bkLedger() بـbooks.js
--  والثلاثة يحسبون: المرحّل + max(المخصص، السحب) + القرض − الصرف.
-- ============================================================
