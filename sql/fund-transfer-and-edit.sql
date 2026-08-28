-- ============================================================
--  نقل بين الصناديق + تعديل صندوق السحب
-- ------------------------------------------------------------
--  شنو ناقص چان:
--   ١) الفلوس تدخل الصندوق وتطلع منه، بس ما تنتقل من صندوق
--      لصندوق. الطريق الوحيد چان: اسحب من الأول (والفلوس تروح
--      لـ«الباقي للصرف») وبعدين ودّعها بالثاني — وهذا يلخبط
--      حساب الشهر، لأن النقل بين صندوقين ما يفروض يمسّ لا الدخل
--      ولا الباقي: مجموع الادخار ما يتغيّر، بس توزيعه يتغيّر.
--   ٢) تعديل السحب يغيّر المبلغ والتاريخ والتفاصيل — بس مو
--      الصندوق. لو سحبت من الصندوق الغلط، ماكو حل غير الحذف
--      وإعادة التسجيل، وهذا يخسّر الدين المرتبط وتاريخ الحركة.
--
--  وبينهن انلكه غلط قديم بـedit_withdrawal: الحركة المرتبطة
--  چانت تنكتب دائماً بالسالب (amount = -p_amount)، وهذا صحيح
--  للتمويل (cat_fund) وغلط للقرض المحمّل (cat_loan) اللي أصلاً
--  موجب — فتعديل مبلغ قرض على تصنيف چان يقلب التحميل لسالب
--  ويزيد متاح التصنيف بدل ما ينقصه. هسه الإشارة تنحفظ مثل ما هي.
-- ============================================================

begin;

-- ------------------------------------------------------------
-- ١) transfer_fund — نقل مبلغ من صندوق لصندوق
--    حركتين مربوطتين بـlink_id:
--      المصدر : موجب  kind='fund_xfer_out'  → ينقص رصيده
--      الهدف  : سالب  kind='fund_xfer_in'   → يزيد رصيده
--    النوعان يبدون بـ'fund_' فـisFundKind بالواجهة يمسكهن، يعني
--    ما يمسّون «الباقي للصرف» ولا متاح أي تصنيف — مثل ما لازم.
--    وربط link_id يخلي edit_withdrawal/delete_withdrawal
--    يضبطون الطرفين سوة بلا أي كود زيادة.
-- ------------------------------------------------------------
create or replace function public.transfer_fund(
  p_month text, p_from text, p_to text, p_amount numeric,
  p_date text default ''::text, p_descr text default ''::text
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
  v_bal numeric;
  v_date text := coalesce(nullif(trim(p_date), ''), to_char(now() at time zone 'Asia/Baghdad', 'YYYY-MM-DD'));
  v_note text := nullif(trim(coalesce(p_descr, '')), '');
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if coalesce(p_amount, 0) <= 0 then raise exception 'المبلغ لازم يكون أكبر من صفر'; end if;
  if trim(coalesce(p_from,'')) = trim(coalesce(p_to,'')) then
    raise exception 'ما تكدر تنقل للصندوق نفسه';
  end if;
  if exists (select 1 from budgets where household_id = hh and month = p_month and locked) then
    raise exception 'هذه الفترة مقفلة';
  end if;
  if not exists (select 1 from categories
                 where household_id = hh and month = p_month and name = p_from and type = 'save') then
    raise exception 'الصندوق «%» غير موجود بهذه الفترة', p_from;
  end if;
  if not exists (select 1 from categories
                 where household_id = hh and month = p_month and name = p_to and type = 'save') then
    raise exception 'الصندوق «%» غير موجود بهذه الفترة', p_to;
  end if;
  if exists (select 1 from categories
             where household_id = hh and month = p_month and name = p_to
               and type = 'save' and coalesce(closed, false)) then
    raise exception 'الصندوق «%» مغلق — افتحه أول', p_to;
  end if;

  -- رصيد المصدر = (المرحّل + مساهمة الشهر) − صافي حركاته
  select (c.carried + c.amount)
         - coalesce((select sum(e.amount) from expenses e
                     where e.household_id = hh and e.month = p_month and e.category = c.name), 0)
    into v_bal
  from categories c
  where c.household_id = hh and c.month = p_month and c.name = p_from and c.type = 'save';

  if p_amount > coalesce(v_bal, 0) then
    raise exception 'رصيد «%» بس % — ما تكدر تنقل أكثر',
      p_from, to_char(coalesce(v_bal,0), 'FM999,999,999');
  end if;

  select display_name into v_name from profiles where id = auth.uid();

  -- الحركة الطالعة من المصدر
  insert into expenses (household_id, month, date, amount, descr, category, by_name, kind)
  values (hh, p_month, v_date, p_amount,
          'نقل لصندوق «' || p_to || '»' || coalesce(' — ' || v_note, ''),
          p_from, coalesce(v_name,''), 'fund_xfer_out')
  returning id into v_id;

  -- الحركة الداخلة للهدف — مربوطة بالأولى
  insert into expenses (household_id, month, date, amount, descr, category, by_name, link_id, kind)
  values (hh, p_month, v_date, -p_amount,
          'نقل من صندوق «' || p_from || '»' || coalesce(' — ' || v_note, ''),
          p_to, coalesce(v_name,''), v_id, 'fund_xfer_in');

  return v_id;
end $function$;


-- ------------------------------------------------------------
-- ٢) edit_withdrawal — زادت p_fund (نقل الحركة لصندوق ثاني)
--    وانتصلّح قلب إشارة الحركة المرتبطة.
--    (زيادة بارامتر = overload جديد، فلازم نحذف التوقيع القديم)
-- ------------------------------------------------------------
drop function if exists public.edit_withdrawal(uuid, numeric, text, text);

create or replace function public.edit_withdrawal(
  p_id uuid, p_amount numeric, p_date text,
  p_descr text default null::text, p_fund text default ''::text
)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  v_old record;
  v_ctid tid;
  v_fund text := nullif(trim(coalesce(p_fund, '')), '');
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

  -- الصندوق الجديد لازم يكون صندوق حقيقي بنفس الفترة ومفتوح
  if v_fund is not null and v_fund <> v_old.category then
    if not exists (select 1 from categories
                   where household_id = hh and month = v_old.month
                     and name = v_fund and type = 'save') then
      raise exception 'الصندوق «%» غير موجود بهذه الفترة', v_fund;
    end if;
    if exists (select 1 from categories
               where household_id = hh and month = v_old.month and name = v_fund
                 and type = 'save' and coalesce(closed, false)) then
      raise exception 'الصندوق «%» مغلق — افتحه أول', v_fund;
    end if;
    -- نقل لنفس صندوق الطرف الثاني يخلي الحركة تنقل لنفسها
    if exists (select 1 from expenses
               where household_id = hh and link_id = p_id and category = v_fund) then
      raise exception 'هذا هو صندوق الطرف الثاني للنقل — اختر صندوق غيره';
    end if;
  else
    v_fund := null;
  end if;

  -- أ) حركة السحب نفسها
  update expenses
  set amount   = p_amount,
      date     = coalesce(nullif(p_date,''), date),
      descr    = coalesce(nullif(trim(p_descr), ''), descr),
      category = coalesce(v_fund, category)
  where id = p_id and household_id = hh;

  -- ب) الدين/القرض المفتوح المرتبط
  update debts
  set amount = p_amount,
      date   = coalesce(nullif(p_date,''), date),
      fund   = coalesce(v_fund, fund)
  where household_id = hh and withdrawal_id = p_id and status = 'مفتوح';

  -- ج) الحركة المرتبطة (تمويل تصنيف / قرض محمّل / طرف النقل الثاني)
  --    الإشارة تنحفظ مثل ما هي — القرض المحمّل موجب والتمويل سالب.
  --    واسم الصندوق داخل الوصف ينتبدّل لو انتقلت الحركة.
  update expenses
  set amount = case when amount < 0 then -p_amount else p_amount end,
      date   = coalesce(nullif(p_date,''), date),
      descr  = case when v_fund is null then descr
                    else replace(descr, '«' || v_old.category || '»', '«' || v_fund || '»') end
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
      set amount  = -p_amount,
          date    = coalesce(nullif(p_date,''), date),
          descr   = case when v_fund is null then descr
                         else 'تمويل من صندوق «' || v_fund || '»' end,
          link_id = p_id
      where ctid = v_ctid;
    end if;
  end if;
end $function$;

commit;

-- ============================================================
--  ملاحظة على الأنواع الجديدة (fund_xfer_out / fund_xfer_in):
--  ما تحتاج تنضاف لـderive_expense_kind — الدالتين فوك تختمن
--  النوع صراحة عند الإدخال، والتريغر ما يشتق إلا لو kind فاضي.
--  والواجهة تقراهن من العمود مباشرة (kindOf بـcore.js).
-- ============================================================
