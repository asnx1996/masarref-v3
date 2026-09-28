-- ============================================================
--  نوع السحب يدوي + نوع ثالث «سحب فقط»
-- ------------------------------------------------------------
--  قبل: نوع السحب ينحدد تلقائياً بتاريخ التثبيت (تغطية أو سلفة).
--  هسه تكدر تختاره بنفسك وقت السحب، وتغيّره بالتعديل بعدين:
--    • cover  تغطية  — fund_wd    + cat_fund   (يغطّي من المخصص)
--    • adv    سلفة   — fund_adv   + cat_adv    (فوك المخصص، وترجع
--                                               للصندوق من الفترة الجاية)
--    • plain  سحب فقط — fund_plain + cat_plain (فوك المخصص، وما ترجع:
--                                               لا دين على الفترة الجاية
--                                               ولا تغطية من مخصص هذي الفترة)
--    • ''     تلقائي — مثل قبل، حسب تاريخ التثبيت
--
--  الحسابات ما تحتاج تغيير: cat_plain سالب بالتصنيف فـcat_spent تزيد
--  متاحه فوك المخصص (مثل cat_adv بالضبط)، وcat_wd تحسب cat_fund بس،
--  وclose_month يسوّي سداد لـfund_adv بس — فسحب فقط ما يرجع.
-- ============================================================

begin;

drop table if exists backup.fn_before_withdraw_kind;
create table backup.fn_before_withdraw_kind as
select p.proname, pg_get_function_identity_arguments(p.oid) as args,
       pg_get_functiondef(p.oid) as def, now() as saved_at
from pg_proc p join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('withdraw_fund','edit_withdrawal','delete_expense');

-- ------------------------------------------------------------
-- ١) withdraw_fund + p_kind
-- ------------------------------------------------------------
drop function if exists public.withdraw_fund(text, text, numeric, text, text, text, text);

create or replace function public.withdraw_fund(
  p_month text, p_date text, p_amount numeric, p_descr text, p_fund text,
  p_debt_account text default ''::text, p_to_category text default ''::text,
  p_kind text default ''::text
)
 returns uuid
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  v_name  text;
  v_id    uuid;
  v_to    text := trim(coalesce(p_to_category, ''));
  v_date  text := coalesce(nullif(left(coalesce(p_date, ''), 10), ''),
                           to_char(now() at time zone 'Asia/Baghdad', 'YYYY-MM-DD'));
  v_kind  text := lower(trim(coalesce(p_kind, '')));
  v_fixed text;
  v_bal   numeric;
  v_fk    text;
  v_ck    text;
  v_pre   text;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if coalesce(p_amount, 0) <= 0 then raise exception 'المبلغ لازم يكون أكبر من صفر'; end if;
  if exists (select 1 from budgets where household_id = hh and month = p_month and locked) then
    raise exception 'هذه الفترة مقفلة';
  end if;
  if not exists (select 1 from categories where household_id = hh and month = p_month and name = p_fund and type = 'save') then
    raise exception 'الصندوق غير موجود بهذه الفترة';
  end if;
  if exists (select 1 from categories where household_id = hh and month = p_month and name = p_fund
               and type = 'save' and coalesce(closed, false)) then
    raise exception 'الصندوق «%» مغلق — افتحه أول', p_fund;
  end if;
  if v_to = '' then raise exception 'اختر تصنيف المصاريف اللي يروح له السحب'; end if;
  if not exists (select 1 from categories where household_id = hh and month = p_month and name = v_to and type <> 'save') then
    raise exception 'تصنيف المصروف «%» غير موجود', v_to;
  end if;

  v_bal := coalesce(fund_balance(hh, p_month, p_fund), 0);
  if p_amount > v_bal then
    raise exception 'رصيد «%» بس % — ما تكدر تسحب أكثر', p_fund, to_char(v_bal, 'FM999,999,999,999');
  end if;

  -- تلقائي: قبل تاريخ التثبيت (أو ماكو تثبيت) = تغطية، وإلا = سلفة
  if v_kind in ('', 'auto') then
    select fixed_date into v_fixed from budgets where household_id = hh and month = p_month;
    v_kind := case when v_fixed is not null and v_date >= v_fixed then 'adv' else 'cover' end;
  end if;
  case v_kind
    when 'cover' then v_fk := 'fund_wd';    v_ck := 'cat_fund';  v_pre := 'تمويل من صندوق «';
    when 'adv'   then v_fk := 'fund_adv';   v_ck := 'cat_adv';   v_pre := 'سلفة من صندوق «';
    when 'plain' then v_fk := 'fund_plain'; v_ck := 'cat_plain'; v_pre := 'سحب من صندوق «';
    else raise exception 'نوع السحب غير معروف';
  end case;

  select display_name into v_name from profiles where id = auth.uid();

  insert into expenses (household_id, month, date, amount, descr, category, by_name, kind)
  values (hh, p_month, v_date, p_amount,
          coalesce(nullif(trim(p_descr), ''),
                   (case v_kind when 'adv' then 'سلفة لـ' when 'plain' then 'سحب فقط لـ' else 'سحب لـ' end) || v_to),
          p_fund, coalesce(v_name, ''), v_fk)
  returning id into v_id;

  insert into expenses (household_id, month, date, amount, descr, category, by_name, link_id, kind)
  values (hh, p_month, v_date, -p_amount, v_pre || p_fund || '»',
          v_to, coalesce(v_name, ''), v_id, v_ck);

  return v_id;
end $function$;

-- ------------------------------------------------------------
-- ٢) edit_withdrawal + p_kind — تغيير نوع سحب مسجّل
-- ------------------------------------------------------------
drop function if exists public.edit_withdrawal(uuid, numeric, text, text, text);

create or replace function public.edit_withdrawal(
  p_id uuid, p_amount numeric, p_date text, p_descr text default null::text,
  p_fund text default ''::text, p_kind text default ''::text
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
  v_kind text := lower(trim(coalesce(p_kind, '')));
  v_oldk text;
  v_fk   text;
  v_ck   text;
  v_pre  text;
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
  if exists (select 1 from debts where household_id = hh and withdrawal_id = p_id and status <> 'مفتوح') then
    raise exception 'هذا قرض قديم انرجّع أو انعدم — ما ينعدّل';
  end if;

  v_oldk := coalesce(v_old.kind, derive_expense_kind(true, v_old.amount, v_old.descr));
  if v_kind <> '' then
    if v_oldk not in ('fund_wd', 'fund_adv', 'fund_plain') then
      raise exception 'نوع هاي الحركة ما يتغيّر — بس السحب (تغطية/سلفة/سحب فقط)';
    end if;
    case v_kind
      when 'cover' then v_fk := 'fund_wd';    v_ck := 'cat_fund';  v_pre := 'تمويل من صندوق «';
      when 'adv'   then v_fk := 'fund_adv';   v_ck := 'cat_adv';   v_pre := 'سلفة من صندوق «';
      when 'plain' then v_fk := 'fund_plain'; v_ck := 'cat_plain'; v_pre := 'سحب من صندوق «';
      else raise exception 'نوع السحب غير معروف';
    end case;
    if v_fk = v_oldk then v_fk := null; end if;   -- نفس النوع — ماكو تغيير
  end if;

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
    if exists (select 1 from expenses
               where household_id = hh and link_id = p_id and category = v_fund) then
      raise exception 'هذا هو صندوق الطرف الثاني للنقل — اختر صندوق غيره';
    end if;
  else
    v_fund := null;
  end if;

  update expenses
  set amount   = p_amount,
      date     = coalesce(nullif(p_date,''), date),
      descr    = coalesce(nullif(trim(p_descr), ''), descr),
      category = coalesce(v_fund, category)
  where id = p_id and household_id = hh;

  update debts
  set amount = p_amount,
      date   = coalesce(nullif(p_date,''), date),
      fund   = coalesce(v_fund, fund)
  where household_id = hh and withdrawal_id = p_id and status = 'مفتوح';

  update expenses
  set amount = case when amount < 0 then -p_amount else p_amount end,
      date   = coalesce(nullif(p_date,''), date),
      descr  = case when v_fund is null then descr
                    else replace(descr, '«' || v_old.category || '»', '«' || v_fund || '»') end
  where household_id = hh and link_id = p_id;

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

  -- 🔁 تغيير النوع: الطرفين سوة (الصندوق والتصنيف)
  if v_fk is not null then
    if not exists (select 1 from expenses where household_id = hh and link_id = p_id) then
      raise exception 'ما لكيت طرف التصنيف لهذا السحب — ما نكدر نغيّر نوعه';
    end if;
    update expenses set kind = v_fk where id = p_id and household_id = hh;
    update expenses
    set kind  = v_ck,
        descr = v_pre || coalesce(v_fund, v_old.category) || '»'
    where household_id = hh and link_id = p_id;
  end if;

  -- 🔒 الزيادة أو النقل لصندوق ثاني ما يخلي الصندوق بالسالب
  if (p_amount > v_old.amount or v_fund is not null)
     and coalesce(fund_balance(hh, v_old.month, coalesce(v_fund, v_old.category)), 0) < 0 then
    raise exception 'رصيد «%» ما يكفي لهذا المبلغ', coalesce(v_fund, v_old.category);
  end if;
end $function$;

-- ------------------------------------------------------------
-- ٣) delete_expense — يعرف fund_plain / cat_plain
-- ------------------------------------------------------------
create or replace function public.delete_expense(p_id uuid)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  v expenses%rowtype;
  k text;
  v_parent uuid;
  v_ctid tid;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  select * into v from expenses where id = p_id and household_id = hh;
  if v.id is null then raise exception 'المصروف غير موجود'; end if;
  if exists (select 1 from budgets where household_id = hh and month = v.month and locked) then
    raise exception 'هذا الشهر مقفل، ما تكدر تحذف منه';
  end if;
  k := coalesce(v.kind, 'spend');

  if k in ('spend', 'fund_dep') then
    delete from expenses where id = p_id and household_id = hh;
    return;
  end if;

  if k in ('fund_wd', 'fund_adv', 'fund_plain', 'fund_xfer_out', 'fund_loan') then
    perform delete_withdrawal(p_id);
    return;
  end if;

  if k in ('cat_fund', 'cat_adv', 'cat_plain', 'fund_xfer_in', 'cat_loan') then
    v_parent := v.link_id;
    if v_parent is null and k = 'cat_fund' then
      select id into v_parent from expenses
      where household_id = hh and month = v.month and kind = 'fund_wd'
        and category = substring(v.descr from 'تمويل من صندوق «(.*)»')
        and amount = -v.amount and date = v.date
      limit 1;
    end if;
    if v_parent is null then
      raise exception 'هاي حركة مربوطة بسحب — احذفها من سجل الصندوق';
    end if;
    perform delete_withdrawal(v_parent);
    return;
  end if;

  if k = 'fund_dep_cat' then
    delete from expenses where household_id = hh and link_id = p_id and kind = 'cat_dep';
    if not found then
      select ctid into v_ctid from expenses
      where household_id = hh and month = v.month and kind = 'cat_dep' and link_id is null
        and descr = 'إيداع لصندوق «' || v.category || '»'
        and amount = -v.amount and date = v.date
      limit 1;
      if v_ctid is not null then delete from expenses where ctid = v_ctid; end if;
    end if;
    delete from expenses where id = p_id and household_id = hh;
    return;
  end if;
  if k = 'cat_dep' then
    v_parent := v.link_id;
    if v_parent is null then
      select id into v_parent from expenses
      where household_id = hh and month = v.month and kind = 'fund_dep_cat'
        and descr like 'إيداع من «' || v.category || '»%'
        and category = substring(v.descr from 'إيداع لصندوق «(.*)»')
        and amount = -v.amount and date = v.date
      limit 1;
    end if;
    if v_parent is not null then delete from expenses where id = v_parent and household_id = hh; end if;
    delete from expenses where id = p_id and household_id = hh;
    return;
  end if;

  if k = 'fund_rep' then
    raise exception 'هذا سداد سلفة تلقائي من الفترة الماضية — ينشال بس لو فكّيت قفلها';
  end if;
  raise exception 'هاي حركة قرض قديمة مرتبطة — ما تنحذف لحالها';
end $function$;

-- الدوال الجديدة (بعد drop) تاخذ صلاحيات افتراضية — نرجّعها مثل قبل
revoke execute on function public.withdraw_fund(text, text, numeric, text, text, text, text, text) from public, anon;
revoke execute on function public.edit_withdrawal(uuid, numeric, text, text, text, text) from public, anon;
grant  execute on function public.withdraw_fund(text, text, numeric, text, text, text, text, text) to authenticated, service_role;
grant  execute on function public.edit_withdrawal(uuid, numeric, text, text, text, text) to authenticated, service_role;

commit;
