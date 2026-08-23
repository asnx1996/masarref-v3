-- ============================================================
--  القرض من الصندوق: من «تمويل» إلى «تحميل مباشر»
-- ============================================================
--  المشكلة بالنظام القديم (v1):
--   القرض على تصنيف چان يشتغل مثل السحب بالضبط — يزيد «المتاح»
--   للتصنيف، وبعدين إنت تسجّل المصروف بنفسك من ذاك التصنيف.
--   يعني خطوتين لنفس الشي، والتصنيف ما يبيّن إنه صرف فلوس مقترضة.
--
--  النظام الجديد (v2):
--   القرض ينقص الاثنين مرة وحدة — رصيد الصندوق **و** متاح التصنيف.
--   ما تحتاج تسجّل مصروف بعده. التصنيف ينزل بالسالب إذا القرض أكبر
--   من متاحه، والسالب يترحّل للفترة الجاية (close_month أصلاً يرحّله).
--
--  🔑 «الباقي للصرف» ما ينتأثر بالقرض:
--   الفلوس طلعت من الصندوق مو من الدخل، والصندوق أصلاً ينقص برصيده.
--   لو خصمناها من «الباقي» بعد، نكون خصمناها مرتين. فحركة القرض
--   على التصنيف تخص التصنيف بس.
--
--  ⚠️ الحركات القديمة ما تنمس أبداً:
--   لو قلبنا إشارة حركات القروض القديمة، أي قرض إنت أصلاً صرفته
--   من التصنيف راح ينخصم مرتين. وماكو طريقة نعرف بيها منو انصرف
--   ومنو لا. فبدل ما نعيد كتابة التاريخ، **نأشّر النوع**:
--   القروض القديمة تظل v1 بسلوكها القديم، والجديدة v2. والواجهة
--   تفهم الاثنين. ما بيه ازدواج ولا فلوس تضيع.
--
--  وبنفس الوقت هذا يشيل الهشاشة الأكبر بالكود: المنطق چان يعتمد
--  على تحليل نص الوصف بالعربي (regex على «قرض من صندوق»). أي
--  مستخدم يكتب تفاصيل تبدي بنفس الكلمات چان يخرّب حسابه. هسه
--  النوع محفوظ بعمود صريح.
--
--  طريقة الرفع: افتح Supabase ← SQL Editor ← الصق كل هذا الملف ← Run.
--  (كله داخل معاملة وحدة — إذا صار خطأ ما ينحفظ شي ناقص.)
-- ============================================================

begin;

-- ------------------------------------------------------------
-- ١) عمود النوع على الحركات
-- ------------------------------------------------------------
--  القيم وشلون تنقرا بالواجهة:
--
--   على صندوق ادخار (type='save'):
--     fund_wd       سحب                (+) ينقص رصيد الصندوق
--     fund_loan     قرض                (+) ينقص رصيد الصندوق
--     fund_dep      إيداع من الفائض    (−) يزيد الرصيد وينقص «الباقي»
--     fund_dep_cat  إيداع من تصنيف     (−) يزيد الرصيد («الباقي» ينخصم من صف التصنيف)
--     fund_ret      إرجاع دين للصندوق  (−) يزيد الرصيد
--
--   على تصنيف مصاريف:
--     spend         مصروف عادي         (+) ينقص التصنيف وينقص «الباقي»
--     cat_fund      تمويل من سحب       (−) يزيد التصنيف ويزيد «الباقي»
--     cat_dep       إيداع لصندوق       (+) ينقص التصنيف وينقص «الباقي»
--     cat_loan_v1   تمويل من قرض قديم  (−) يزيد التصنيف ويزيد «الباقي»
--     cat_pay_v1    سداد قرض قديم      (+) ينقص التصنيف وينقص «الباقي»
--   ★ cat_loan      قرض محمّل (جديد)   (+) ينقص التصنيف بس — ما يمسّ «الباقي»
--   ★ cat_pay       تسديد قرض (جديد)   (+) ينقص «الباقي» بس — ما يمسّ التصنيف
--   ★ cat_fix       إعدام/تصحيح قرض    (−) يزيد التصنيف بس — ما يمسّ «الباقي»
-- ------------------------------------------------------------
alter table public.expenses add column if not exists kind text;
create index if not exists expenses_kind_idx on public.expenses (kind);


-- ------------------------------------------------------------
-- ٢) دالة اشتقاق النوع من الحركة
--    نستعملها بالملء الأثر‑رجعي وبالتريغر سوا — مصدر حقيقة واحد.
-- ------------------------------------------------------------
create or replace function public.derive_expense_kind(
  p_is_fund boolean, p_amount numeric, p_descr text
)
 returns text
 language sql
 immutable
as $function$
  select case
    when p_is_fund then case
      when p_amount < 0 and p_descr like 'إيداع: %'      then 'fund_dep'
      when p_amount < 0 and p_descr like 'إيداع من «%'   then 'fund_dep_cat'
      when p_amount < 0                                   then 'fund_ret'
      when p_descr like 'قرض %'                           then 'fund_loan'
      else 'fund_wd'
    end
    else case
      when p_amount < 0 and p_descr like 'تمويل من صندوق «%'  then 'cat_fund'
      when p_amount < 0 and p_descr like 'قرض من صندوق «%'    then 'cat_loan_v1'
      when p_amount > 0 and p_descr like 'سداد قرض لصندوق «%' then 'cat_pay_v1'
      when p_amount > 0 and p_descr like 'إيداع لصندوق «%'    then 'cat_dep'
      else 'spend'
    end
  end
$function$;


-- ------------------------------------------------------------
-- ٣) ملء أثر رجعي لكل الحركات الموجودة
--    «هل هي على صندوق؟» تنعرف من جدول التصنيفات بنفس الشهر.
-- ------------------------------------------------------------
update public.expenses e
set kind = public.derive_expense_kind(
  exists (
    select 1 from public.categories c
    where c.household_id = e.household_id
      and c.month = e.month
      and c.name = e.category
      and c.type = 'save'
  ),
  e.amount,
  coalesce(e.descr, '')
)
where e.kind is null;


-- ------------------------------------------------------------
-- ٤) تريغر يختم النوع بكل إدراج جديد
--    نفس أسلوب stamp_expense_author: يغطي كل الدوال الحالية
--    والجاية بدون ما نلمسهن وحدة وحدة. والدوال اللي تحدد kind
--    بنفسها (add_loan / return_debt) تفوز — ما ننقض عليها.
-- ------------------------------------------------------------
create or replace function public.stamp_expense_kind()
 returns trigger
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
begin
  if new.kind is null then
    new.kind := derive_expense_kind(
      exists (
        select 1 from categories c
        where c.household_id = new.household_id
          and c.month = new.month
          and c.name = new.category
          and c.type = 'save'
      ),
      new.amount,
      coalesce(new.descr, '')
    );
  end if;
  return new;
end $function$;

drop trigger if exists trg_stamp_expense_kind on public.expenses;
create trigger trg_stamp_expense_kind
  before insert on public.expenses
  for each row execute function public.stamp_expense_kind();


-- ------------------------------------------------------------
-- ٥) نسخة القرض على جدول الديون
--    v1 = السلوك القديم (تمويل)، v2 = التحميل المباشر.
--    كل الديون الموجودة هسه v1 — ما نغيّر سلوكها أبداً.
-- ------------------------------------------------------------
alter table public.debts add column if not exists model text;
update public.debts set model = 'v1' where model is null;
alter table public.debts alter column model set default 'v1';


-- ------------------------------------------------------------
-- ٦) add_loan — القرض على تصنيف صار تحميل مباشر (v2)
--    القرض لشخص ما يتغيّر بشي.
-- ------------------------------------------------------------
create or replace function public.add_loan(
  p_month text,
  p_date text,
  p_amount numeric,
  p_fund text,
  p_account text,
  p_due_date text default ''::text,
  p_descr text default ''::text,
  p_to_category text default ''::text
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
  v_acc text := trim(coalesce(p_account,''));
  v_to  text := trim(coalesce(p_to_category,''));
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if coalesce(p_amount,0) <= 0 then raise exception 'المبلغ لازم يكون أكبر من صفر'; end if;
  if exists (select 1 from budgets where household_id = hh and month = p_month and locked) then
    raise exception 'هذا الشهر مقفل';
  end if;
  if not exists (select 1 from categories where household_id = hh and month = p_month and name = p_fund and type = 'save') then
    raise exception 'الصندوق غير موجود بميزانية هذا الشهر';
  end if;

  select display_name into v_name from profiles where id = auth.uid();

  if v_to <> '' then
    ------------------------------------------------------------
    -- (أ) قرض على تصنيف مصاريف — التحميل المباشر
    ------------------------------------------------------------
    if not exists (select 1 from categories where household_id = hh and month = p_month and name = v_to and type <> 'save') then
      raise exception 'تصنيف المصروف «%» غير موجود', v_to;
    end if;

    -- ١) حركة القرض على الصندوق — تنقص رصيده
    insert into expenses (household_id, month, date, amount, descr, category, by_name, kind)
    values (hh, p_month, coalesce(p_date,''), p_amount,
            'قرض لتصنيف «' || v_to || '»' || coalesce(nullif(' — ' || trim(p_descr), ' — '), ''),
            p_fund, coalesce(v_name,''), 'fund_loan')
    returning id into v_id;

    -- ٢) 🔑 التحميل على التصنيف — **موجب** هسه (چان سالب بـv1).
    --    ينقص متاح التصنيف مباشرة، وما يمسّ «الباقي للصرف»
    --    لأن الفلوس طلعت من الصندوق مو من الدخل.
    insert into expenses (household_id, month, date, amount, descr, category, by_name, link_id, kind)
    values (hh, p_month, coalesce(p_date,''), p_amount,
            'قرض من صندوق «' || p_fund || '»', v_to, coalesce(v_name,''), v_id, 'cat_loan');

    -- ٣) سجل الدين — بنسخة v2
    insert into debts (household_id, fund, account, amount, date, month, status, withdrawal_id, kind, due_date, to_category, model)
    values (hh, p_fund, v_to, p_amount, coalesce(p_date,''), p_month, 'مفتوح', v_id,
            'قرض', nullif(trim(coalesce(p_due_date,'')), ''), v_to, 'v2');

  else
    ------------------------------------------------------------
    -- (ب) قرض لشخص — ما يتغيّر
    ------------------------------------------------------------
    if v_acc = '' then raise exception 'اكتب اسم اللي أخذ القرض'; end if;

    insert into expenses (household_id, month, date, amount, descr, category, by_name, kind)
    values (hh, p_month, coalesce(p_date,''), p_amount,
            'قرض لـ«' || v_acc || '»' || coalesce(nullif(' — ' || trim(p_descr), ' — '), ''),
            p_fund, coalesce(v_name,''), 'fund_loan')
    returning id into v_id;

    insert into debts (household_id, fund, account, amount, date, month, status, withdrawal_id, kind, due_date, model)
    values (hh, p_fund, v_acc, p_amount, coalesce(p_date,''), p_month, 'مفتوح', v_id,
            'قرض', nullif(trim(coalesce(p_due_date,'')), ''), 'v2');
  end if;

  return v_id;
end $function$;


-- ------------------------------------------------------------
-- ٧) return_debt — صار بيها ثلاث طرق إغلاق
-- ------------------------------------------------------------
--  p_mode:
--   'repay' (الافتراضي) — القرض يرجع للصندوق، والتصنيف يبقى محمّل
--                          (يبقى سالب). كلفة الإرجاع تنزل على «الباقي».
--   'full'              — القرض يرجع للصندوق **و** التصنيف يرجع
--                          لحالته الطبيعية قبل القرض.
--   'void'              — إعدام: الصندوق ما يسترجع شي، والتصنيف
--                          يرجع موجب (كأن القرض انهدى له).
--
--  ⚠️ قروض v1 (القديمة): 'full' تنعامل نفس 'repay' لأن التمويل
--     لازم ينشال من التصنيف وإلا تنخلق فلوس من العدم. و'void'
--     تخلّي التمويل بالتصنيف بلا مقابل — وهذا هو معنى الإعدام
--     بالضبط بالنظام القديم.
-- ------------------------------------------------------------
drop function if exists public.return_debt(uuid, text, text);

create or replace function public.return_debt(
  p_id uuid,
  p_date text default ''::text,
  p_month text default ''::text,
  p_mode text default 'repay'::text
)
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
  v_mode text := lower(trim(coalesce(p_mode, 'repay')));
  v_cat  text;
  v_v2   boolean;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if v_mode not in ('repay','full','void') then raise exception 'طريقة إغلاق غير معروفة'; end if;

  select * into d from debts where id = p_id and household_id = hh;
  if d.id is null then raise exception 'الدين غير موجود'; end if;
  if d.status <> 'مفتوح' then raise exception 'هذا الدين مو مفتوح'; end if;

  v_cat := coalesce(trim(d.to_category), '');
  v_v2  := coalesce(d.model, 'v1') = 'v2';

  -- الإعدام والتصحيح إلهن معنى بس مع القروض على تصنيف
  if v_cat = '' and v_mode <> 'repay' then
    raise exception 'الإعدام والتصحيح للقروض على تصنيف بس — قرض الشخص يا يرجع يا ينشطب';
  end if;

  v_date := nullif(left(coalesce(p_date,''), 10), '');
  if v_date is null then
    v_date := to_char(now() at time zone 'Asia/Baghdad', 'YYYY-MM-DD');
  end if;
  v_month := coalesce(nullif(trim(coalesce(p_month,'')), ''), left(v_date, 7));
  if exists (select 1 from budgets where household_id = hh and month = v_month and locked) then
    raise exception 'فترة الإرجاع مقفلة، اختر فترة مفتوحة';
  end if;

  select display_name into v_name from profiles where id = auth.uid();

  -- ---------- (أ) رجوع المبلغ للصندوق — بكل الطرق إلا الإعدام ----------
  if v_mode <> 'void' then
    insert into expenses (household_id, month, date, amount, descr, category, by_name, kind)
    values (hh, v_month, v_date, -d.amount, 'إرجاع دين: ' || d.account, d.fund, coalesce(v_name,''), 'fund_ret');
  end if;

  -- ---------- (ب) الطرف المقابل على التصنيف ----------
  if v_cat <> '' then
    if not v_v2 then
      ------------------------------------------------------------
      -- قرض قديم (v1): التصنيف عنده «تمويل» زائد لازم ينشال
      -- عند الإرجاع، وبالإعدام يبقى بلا مقابل.
      ------------------------------------------------------------
      if v_mode <> 'void' then
        insert into expenses (household_id, month, date, amount, descr, category, by_name, kind)
        values (hh, v_month, v_date, d.amount,
                'سداد قرض لصندوق «' || d.fund || '»', v_cat, coalesce(v_name,''), 'cat_pay_v1');
      end if;
    else
      ------------------------------------------------------------
      -- قرض جديد (v2): التصنيف أصلاً محمّل بالقرض.
      ------------------------------------------------------------
      if v_mode = 'repay' or v_mode = 'full' then
        -- كلفة الإرجاع تنزل على «الباقي للصرف» بس — مو على التصنيف
        insert into expenses (household_id, month, date, amount, descr, category, by_name, kind)
        values (hh, v_month, v_date, d.amount,
                'تسديد قرض لصندوق «' || d.fund || '»', v_cat, coalesce(v_name,''), 'cat_pay');
      end if;
      if v_mode = 'full' or v_mode = 'void' then
        -- التصنيف يرجع لحالته قبل القرض
        insert into expenses (household_id, month, date, amount, descr, category, by_name, kind)
        values (hh, v_month, v_date, -d.amount,
                case when v_mode = 'void'
                     then 'إعدام قرض من صندوق «' || d.fund || '»'
                     else 'تصحيح قرض من صندوق «' || d.fund || '»' end,
                v_cat, coalesce(v_name,''), 'cat_fix');
      end if;
    end if;
  end if;

  update debts
  set status = case when v_mode = 'void' then 'ملغى' else 'مسترجع' end
  where id = p_id and household_id = hh;

  return v_month;
end $function$;


-- ------------------------------------------------------------
-- ٨) list_open_debts ترجّع النسخة — الواجهة تحتاجها حتى تعرف
--    شنو الخيارات اللي تعرضها لكل قرض
-- ------------------------------------------------------------
create or replace function public.list_open_debts()
 returns jsonb
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select coalesce(jsonb_agg(jsonb_build_object(
    'id', id, 'account', account, 'fund', fund, 'amount', amount,
    'date', date, 'month', month, 'status', status,
    'kind', coalesce(kind,'سحب'), 'dueDate', due_date, 'toCategory', to_category,
    'model', coalesce(model, 'v1')
  ) order by date), '[]'::jsonb)
  from debts
  where household_id = my_household() and status = 'مفتوح'
$function$;


-- ------------------------------------------------------------
-- ٩) load_month ترجّع kind مع كل حركة + model مع كل دين
--    (نفس نسخة expense-author-identity.sql + الحقلين الجديدين)
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
        'by', coalesce(pr.display_name, e.by_name),
        'byId', e.user_id,
        'linkId', e.link_id,
        'kind', coalesce(e.kind, 'spend')
      ) order by e.created_at desc)
      from expenses e
      left join profiles pr on pr.id = e.user_id
      where e.household_id = hh and e.month = p_month
    ), '[]'::jsonb),
    'debts', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', d.id, 'fund', d.fund, 'account', d.account, 'amount', d.amount,
        'date', d.date, 'month', d.month, 'wdId', d.withdrawal_id,
        'toCategory', d.to_category, 'model', coalesce(d.model, 'v1')
      ) order by d.created_at desc)
      from debts d where d.household_id = hh and d.status = 'مفتوح'
    ), '[]'::jsonb)
  );
end $function$;

-- ------------------------------------------------------------
-- ١٠) دوال جمع واعية بالنوع
--     أي حساب «كم انصرف» لازم يعرف شنو يعدّ. بدونها القرض المحمّل
--     ينخصم مرتين بحسابات السيرفر.
-- ------------------------------------------------------------

/* المنصرف من متاح تصنيف — يطلّع cat_pay (التصنيف انخصم يوم القرض) */
create or replace function public.cat_spent(p_hh uuid, p_month text, p_name text)
 returns numeric
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select coalesce(sum(e.amount), 0)
  from expenses e
  where e.household_id = p_hh and e.month = p_month and e.category = p_name
    and coalesce(e.kind, 'spend') <> 'cat_pay'
$function$;

/* المنصرف من «الباقي للصرف» — يطلّع حركات الصناديق والقرض المحمّل
   والتصحيح، ويحسب إيداع الفائض */
create or replace function public.spend_total(p_hh uuid, p_month text)
 returns numeric
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select coalesce(sum(
    case
      when coalesce(e.kind,'spend') in ('cat_loan','cat_fix') then 0
      when coalesce(e.kind,'spend') = 'fund_dep'              then -e.amount
      when coalesce(e.kind,'spend') like 'fund\_%'            then 0
      else e.amount
    end
  ), 0)
  from expenses e
  where e.household_id = p_hh and e.month = p_month
$function$;


-- ------------------------------------------------------------
-- ١١) add_deposit يحسب متاح التصنيف بالدالة الواعية
--     (باقي الجسم نفسه — بس سطر v_avail انتغيّر)
-- ------------------------------------------------------------
create or replace function public.add_deposit(
  p_fund text, p_amount numeric, p_date text default ''::text,
  p_descr text default ''::text, p_from_category text default ''::text,
  p_month text default ''::text
)
 returns uuid
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  v_name text; v_id uuid; v_date text; v_month text;
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
    v_cap := surplus_of(hh, v_month);
    if v_cap <= 0 then
      raise exception 'ماكو فائض متاح تودّعه — كل فلوسك موزّعة. زيّد الدخل أو قلّل التوزيع أول';
    end if;
    if p_amount > v_cap then
      raise exception 'الفائض المتاح بس % — ما تكدر تودّع أكثر منه', to_char(v_cap, 'FM999,999,999');
    end if;

    insert into expenses (household_id, month, date, amount, descr, category, by_name, kind)
    values (hh, v_month, v_date, -p_amount,
            'إيداع: ' || coalesce(nullif(trim(p_descr), ''), 'إضافة للرصيد'),
            p_fund, coalesce(v_name, ''), 'fund_dep')
    returning id into v_id;

  else
    if not exists (select 1 from categories where household_id = hh and month = v_month and name = v_from and type <> 'save') then
      raise exception 'تصنيف المصروف «%» غير موجود', v_from;
    end if;

    -- 🔑 المتاح بالدالة الواعية بالنوع (چان sum لكل الحركات)
    select (c.amount + c.carried) - cat_spent(hh, v_month, c.name)
    into v_avail
    from categories c
    where c.household_id = hh and c.month = v_month and c.name = v_from and c.type <> 'save';

    if p_amount > v_avail then
      raise exception 'المتاح بـ«%» بس % — ما تكدر تودّع أكثر', v_from, to_char(v_avail, 'FM999,999,999');
    end if;

    insert into expenses (household_id, month, date, amount, descr, category, by_name, kind)
    values (hh, v_month, v_date, -p_amount,
            'إيداع من «' || v_from || '»' || coalesce(nullif(' — ' || trim(p_descr), ' — '), ''),
            p_fund, coalesce(v_name, ''), 'fund_dep_cat')
    returning id into v_id;

    insert into expenses (household_id, month, date, amount, descr, category, by_name, kind)
    values (hh, v_month, v_date, p_amount,
            'إيداع لصندوق «' || p_fund || '»', v_from, coalesce(v_name, ''), 'cat_dep');
  end if;

  return v_id;
end $function$;

-- ------------------------------------------------------------
-- ١٢أ) لقطة قبل التبديل — حارس أمان
--      surplus_of هي اللي تحدد سقف الإيداع. راح أعيد كتابتها،
--      ولأنها تمسّ فلوسك ما أريد «أتوقع» إنها مطابقة — أريد أتأكد.
--      نخزّن نتيجتها الحالية لكل فترة عندك، وبعد التبديل نقارن.
--      أي فرق = الترحيل كله ينلغى (كلشي داخل معاملة وحدة).
--      المفروض ما يصير فرق: القروض الجديدة بعدها ما انخلقت،
--      فالمعادلتين لازم تنطيان نفس الرقم على بياناتك الموجودة.
-- ------------------------------------------------------------
create temp table _surplus_before on commit drop as
select household_id, month, surplus_of(household_id, month) as v
from budgets;


-- ------------------------------------------------------------
-- ١٢) surplus_of — الفائض المتاح للإيداع
--     چانت تجمع كل حركات التصنيفات، فالقرض المحمّل چان ينخصم منها
--     غلط. وبنفس الوقت: جسمها القديم چان يعيد بناء نفس معادلة
--     «الباقي للصرف» اللي بالواجهة بيدين — أي تعديل بوحدة ينسى
--     الثانية. هسه الطرفين ينادون نفس المنطق (spend_total).
--
--     المعادلة نفسها ما انتغيّرت:
--       الرواتب + الإيرادات + المرحّل − المحجوز للادخار − المنصرف
--     بس «المنصرف» صار يعرف شنو يعدّ.
-- ------------------------------------------------------------
create or replace function public.surplus_of(p_hh uuid, p_month text)
 returns numeric
 language sql
 stable security definer
 set search_path to 'public'
as $function$
  select
      coalesce((select sum(amount) from salaries
                where household_id = p_hh and month = p_month), 0)
    + coalesce((select sum(amount) from budget_incomes
                where household_id = p_hh and month = p_month), 0)
    + coalesce((select sum(carried) from categories
                where household_id = p_hh and month = p_month and type <> 'save'), 0)
    - coalesce((select sum(amount) from categories
                where household_id = p_hh and month = p_month and type = 'save'), 0)
    - spend_total(p_hh, p_month);
$function$;


-- ------------------------------------------------------------
-- ١٢ب) المقارنة — لو أي فترة انتغيّر فائضها، نلغي الترحيل كله
-- ------------------------------------------------------------
do $$
declare
  n integer;
  sample text;
begin
  select count(*),
         string_agg(b.month || ': ' || b.v || ' ← ' || surplus_of(b.household_id, b.month), ' · ')
  into n, sample
  from _surplus_before b
  where b.v is distinct from surplus_of(b.household_id, b.month);

  if n > 0 then
    raise exception
      'تحقّق فشل — surplus_of انتغيّرت نتيجتها بـ% فترة. الترحيل كله انلغى وما انحفظ شي. التفاصيل: %',
      n, left(coalesce(sample,''), 500);
  end if;

  raise notice '✓ التحقّق نجح — surplus_of تنطي نفس النتيجة بالضبط على كل فتراتك';
end $$;


-- ------------------------------------------------------------
-- ١٣) transfer_category — المتاح بالمصدر بالدالة الواعية
--     (باقي الجسم نفسه بالضبط — بس حساب from_avail انتغيّر)
-- ------------------------------------------------------------
create or replace function public.transfer_category(p_month text, p_from text, p_to text, p_amount numeric)
 returns void
 language plpgsql
 security definer
 set search_path to 'public'
as $function$
declare
  hh uuid := my_household();
  from_avail numeric;
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if coalesce(p_amount,0) <= 0 then raise exception 'المبلغ لازم يكون أكبر من صفر'; end if;
  if p_from = p_to then raise exception 'اختر تصنيفين مختلفين'; end if;
  if exists (select 1 from budgets where household_id = hh and month = p_month and locked) then
    raise exception 'هذا الشهر مقفل';
  end if;

  -- المتاح بالمصدر = (المخصص + المرحّل) − المنصرف الواعي بالنوع
  select (c.amount + c.carried) - cat_spent(hh, p_month, c.name)
  into from_avail
  from categories c
  where c.household_id = hh and c.month = p_month and c.name = p_from and c.type <> 'save';

  if from_avail is null then raise exception 'التصنيف المصدر غير موجود'; end if;
  if not exists (select 1 from categories where household_id = hh and month = p_month and name = p_to and type <> 'save') then
    raise exception 'التصنيف الهدف غير موجود';
  end if;
  if p_amount > from_avail then
    raise exception 'المتاح بـ«%» بس % — ما تكدر تنقل أكثر', p_from, to_char(from_avail, 'FM999,999,999');
  end if;

  update categories set amount = amount - p_amount
  where household_id = hh and month = p_month and name = p_from and type <> 'save';
  update categories set amount = amount + p_amount
  where household_id = hh and month = p_month and name = p_to and type <> 'save';
end $function$;


-- ------------------------------------------------------------
-- ١٤) withdraw_fund — تختم النوع صراحة
--     المنطق ما انتغيّر أبداً. بس چانت تعتمد على التريغر يشتق
--     النوع من الوصف، والوصف يجي من المستخدم. صريح أأمن.
-- ------------------------------------------------------------
create or replace function public.withdraw_fund(
  p_month text, p_date text, p_amount numeric, p_descr text, p_fund text,
  p_debt_account text default ''::text, p_to_category text default ''::text
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
  v_to text := trim(coalesce(p_to_category,''));
begin
  if hh is null then raise exception 'الدخول مطلوب'; end if;
  if coalesce(p_amount,0) <= 0 then raise exception 'المبلغ لازم يكون أكبر من صفر'; end if;
  if exists (select 1 from budgets where household_id = hh and month = p_month and locked) then
    raise exception 'هذا الشهر مقفل';
  end if;
  if not exists (select 1 from categories where household_id = hh and month = p_month and name = p_fund and type = 'save') then
    raise exception 'الصندوق غير موجود بميزانية هذا الشهر';
  end if;
  if v_to <> '' and not exists (
      select 1 from categories where household_id = hh and month = p_month and name = v_to and type <> 'save') then
    raise exception 'تصنيف المصروف «%» غير موجود', v_to;
  end if;

  select display_name into v_name from profiles where id = auth.uid();

  -- ١) حركة السحب على الصندوق (تنقص رصيده)
  insert into expenses (household_id, month, date, amount, descr, category, by_name, kind)
  values (hh, p_month, coalesce(p_date,''), p_amount, coalesce(p_descr,''), p_fund, coalesce(v_name,''), 'fund_wd')
  returning id into v_id;

  -- ٢) دين اختياري (سحب على حساب شخص)
  if trim(coalesce(p_debt_account,'')) <> '' then
    insert into debts (household_id, fund, account, amount, date, month, status, withdrawal_id)
    values (hh, p_fund, trim(p_debt_account), p_amount, coalesce(p_date,''), p_month, 'مفتوح', v_id);
  end if;

  -- ٣) تمويل تصنيف مصروف بنفس المبلغ (حركة سالبة عليه) — مربوطة بالسحب
  if v_to <> '' then
    insert into expenses (household_id, month, date, amount, descr, category, by_name, link_id, kind)
    values (hh, p_month, coalesce(p_date,''), -p_amount,
            'تمويل من صندوق «' || p_fund || '»', v_to, coalesce(v_name,''), v_id, 'cat_fund');
  end if;

  return v_id;
end $function$;

commit;


-- ============================================================
--  (انحلّت) surplus_of و transfer_category و withdraw_fund
--  انتحوّلن بالبنود ١٢–١٤ فوك. ماكو شي ناقص بعد.
-- ============================================================

-- ============================================================
--  فحص بعد الرفع — شغّلهن لحالهن (كلهن قراءة بس)
-- ============================================================
--
--  ١) توزيع أنواع الحركات عندك:
--     select kind, count(*), sum(amount) from expenses
--     group by kind order by 2 desc;
--
--     المفروض ما تشوف cat_loan ولا cat_pay ولا cat_fix أبداً —
--     هذي تنخلق بس من القروض الجديدة بعد الرفع.
--
--  ٢) القروض المفتوحة ونسخها:
--     select model, kind, count(*), sum(amount) from debts
--     where status = 'مفتوح' group by model, kind;
--
--     المفروض كلهن v1. أي قرض تسجّله بعد الرفع يطلع v2.
--
--  ٣) ⭐ الأهم: «الباقي للصرف» بالسيرفر لازم يطابق اللي بالشاشة.
--     بدّل الشهر لشهرك الحالي:
--
--       select surplus_of(my_household(), '2026-08');
--
--     قارنه بالرقم بالهيدر. لازم يكونان نفس الشي بالضبط.
--     (قبل الرفع چانت المعادلة مكتوبة مرتين — مرة بالسيرفر ومرة
--      بالواجهة — وهسه الطرفين ينادون spend_total.)
--
--  ٤) متاح كل تصنيف بالسيرفر:
--     select c.name, (c.amount + c.carried) - cat_spent(c.household_id, c.month, c.name) as متاح
--     from categories c
--     where c.household_id = my_household() and c.month = '2026-08' and c.type <> 'save'
--     order by c.name;
--
--     لازم يطابق «باقي/تجاوز» بظروف اللوحة.
-- ============================================================
