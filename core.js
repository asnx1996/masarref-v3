/* ============================================================
   core.js — الأدوات الحسابية الصافية (بلا Supabase وبلا رسم)
   منفصلة حتى تنفحص بصفحة الاختبارات tests.html
   ============================================================ */

/* ---------- أدوات ---------- */
const $ = id => document.getElementById(id);

/* ============================================================
   التخزين المحلي — بغلاف آمن
   ------------------------------------------------------------
   localStorage يرمي استثناء بحالات مو نادرة: سفاري الوضع الخاص،
   حجب التخزين من إعدادات المتصفح، أو امتلاء الحصة. ولأن أغلب
   استعمالاتنا بمستوى الملف (خارج أي دالة)، الاستثناء ما يفشّل
   سطر واحد — يوگّع **الملف كله** وقت التحميل، فتطلع شاشة بيضة.
   هنا نغلّفه مرة وحدة ونستعمله بكل مكان.
   ============================================================ */
const LS = {
  get(k, d){
    const dv = (d === undefined) ? null : d;
    try{ const v = localStorage.getItem(k); return v === null ? dv : v; }
    catch(_){ return dv; }
  },
  set(k, v){ try{ localStorage.setItem(k, String(v)); }catch(_){} }
};
/* العملة — نص العرض فقط (ما يمسّ أي حساب) */
const CURRENCIES = {
  iqd: { sym:'د.ع', pos:'after',  name:'دينار عراقي (د.ع)' },
  usd: { sym:'$',   pos:'before', name:'دولار ($)' }
};
let CURRENCY = 'iqd';
try{ CURRENCY = CURRENCIES[LS.get('mas_cur')] ? LS.get('mas_cur') : 'iqd'; }catch(_){}
const fmt = n => {
  const v = (Number(n)||0).toLocaleString('en-US');
  const c = CURRENCIES[CURRENCY] || CURRENCIES.iqd;
  return c.pos === 'before' ? c.sym + v : v + ' ' + c.sym;
};
const num = v => Number(String(v).replace(/[^\d.]/g,'')) || 0;
/* ============================================================
   عدّ بالعربي — «١ قروض» و«١١ قروض» غلط بالاثنين بس بطريقتين
   ------------------------------------------------------------
   العربية إلها أربع صيغ للعدد مو صيغتين مثل الإنكليزي:
     ١   مفرد بلا رقم       → «قرض واحد»
     ٢   مثنّى بلا رقم      → «قرضين»
     ٣-١٠ رقم + جمع        → «٥ قروض»
     ١١+  رقم + مفرد       → «١٥ قرض»
   ============================================================ */
function arCount(n, one, two, few, many){
  n = Number(n) || 0;
  if(n === 1) return one;
  if(n === 2) return two;
  if(n >= 3 && n <= 10) return n + ' ' + few;
  return n + ' ' + many;
}
/* مبلغ بإشارته — بعلامة الطرح الحقيقية (U+2212) مو شرطة الكيبورد.
   fmt() لحاله يطبع '-213,000 د.ع' بشرطة قصيرة تنلخبط ويّا الفواصل. */
const sfmt = n => (Number(n) < 0 ? '\u2212' : '') + fmt(Math.abs(Number(n) || 0));

/* التاريخ حسب توقيت الجهاز (محلي) — مو UTC. لو استخدمنا toISOString()
   يطلع التاريخ ناقص من ١٢ الليل لـ٣ الصبح (بغداد UTC+3)، ومصروف أول
   الشهر الليلي كان يروح للشهر الماضي (وممكن يكون مقفل!) */
const localISO = d => d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0');
const todayISO = () => localISO(new Date());
const thisMonth = () => todayISO().slice(0,7);
const prevMonthStr = m => { let p=m.split('-').map(Number),y=p[0],mm=p[1]-1; if(mm<1){mm=12;y--;} return y+'-'+('0'+mm).slice(-2); };
const nextMonthStr = m => { let p=m.split('-').map(Number),y=p[0],mm=p[1]+1; if(mm>12){mm=1;y++;} return y+'-'+('0'+mm).slice(-2); };
const daysInMonth = m => { const p=m.split('-').map(Number); return new Date(p[0], p[1], 0).getDate(); };
/* تاريخ يقع جوّا الشهر المطلوب: لو اليوم من نفس الشهر ناخذه، وإلا
   أول يوم (لو الشهر جاي) أو آخر يوم (لو فات) — للحركات اللي لازم
   تنسجل بالشهر المعروض مثل إرجاع القرض */
const dateInMonth = m => {
  const t = todayISO();
  if(t.slice(0,7) === m) return t;
  return m + (m < t.slice(0,7) ? '-' + ('0'+daysInMonth(m)).slice(-2) : '-01');
};

/* ============================================================
   الفترة (اللي چان اسمها «شهر») — اسم تختاره + بداية ونهاية
   مفتاحها بعده 'YYYY-MM' بس هذا مفتاح داخلي، مو شهر تقويمي.
   ============================================================ */
const PERIOD_DAYS = 30;   /* المدة الافتراضية لفترة جديدة */

/* جمع/طرح أيام على تاريخ ISO — بتوقيت محلي (مو UTC) */
const addDays = (iso, n) => {
  const p = String(iso).slice(0,10).split('-').map(Number);
  const d = new Date(p[0], p[1]-1, p[2]);
  d.setDate(d.getDate() + n);
  return localISO(d);
};
/* عدد الأيام بين تاريخين — شامل الطرفين (يوم واحد = 1) */
const daysBetween = (a, b) => {
  const pa = String(a).slice(0,10).split('-').map(Number);
  const pb = String(b).slice(0,10).split('-').map(Number);
  const da = new Date(pa[0], pa[1]-1, pa[2]), db = new Date(pb[0], pb[1]-1, pb[2]);
  return Math.round((db - da) / 86400000) + 1;
};
/* هل الفترة إلها تواريخ مضبوطة؟ */
const hasPeriodDates = p => !!(p && p.startDate && p.endDate);
/* الاسم المعروض للفترة */
const periodLabel = (p, m) => (p && p.title) ? p.title : ('شهر ' + (m || ''));
/* اسم مقترح للفترة الجاية: نزيد آخر رقم بالاسم السابق (عربي أو إنكليزي).
   ما بيه رقم أو ماكو اسم سابق → «مصاريف شهر N» حسب مفتاح الفترة. */
const AR_DIGITS = '٠١٢٣٤٥٦٧٨٩';
const toArDigits = n => String(n).replace(/\d/g, d => AR_DIGITS[+d]);
function suggestPeriodTitle(prevTitle, month){
  const t = String(prevTitle || '').trim();
  const m = t && t.match(/([0-9٠-٩]+)(?!.*[0-9٠-٩])/);
  if(m){
    const isAr = /[٠-٩]/.test(m[1]);
    const val = Number(m[1].replace(/[٠-٩]/g, d => AR_DIGITS.indexOf(d))) + 1;
    return t.slice(0, m.index) + (isAr ? toArDigits(val) : String(val)) + t.slice(m.index + m[1].length);
  }
  if(t) return t + ' — التالي';
  return 'مصاريف شهر ' + toArDigits(Number(String(month || '').slice(5,7)) || '');
}

/* تقدّم الفترة: تعتمد تواريخ البداية/النهاية إذا موجودة، وإلا
   ترجع للسلوك القديم (الشهر التقويمي) حتى الفترات القديمة تشتغل */
function monthProgress(m, period){
  if(hasPeriodDates(period)){
    const total = Math.max(1, daysBetween(period.startDate, period.endDate));
    const t = todayISO();
    if(t < period.startDate) return { elapsed: 0, left: total, total };
    if(t > period.endDate)   return { elapsed: total, left: 0, total };
    const elapsed = Math.min(total, Math.max(1, daysBetween(period.startDate, t)));
    return { elapsed, left: Math.max(0, total - elapsed), total };
  }
  const total = daysInMonth(m);
  const cur = thisMonth();
  if(m < cur) return { elapsed: total, left: 0, total };
  if(m > cur) return { elapsed: 0, left: total, total };
  const day = new Date().getDate();
  return { elapsed: day, left: Math.max(0, total - day), total };
}

/* التاريخ الافتراضي لفورم الإضافة داخل فترة معيّنة:
   اليوم إذا داخل الفترة، وإلا أقرب طرف من أطرافها */
function periodDefaultDate(period, m){
  const t = todayISO();
  if(hasPeriodDates(period)){
    if(t < period.startDate) return period.startDate;
    if(t > period.endDate)   return period.endDate;
    return t;
  }
  return dateInMonth(m);
}

/* تاريخ استحقاق فاتورة متكررة داخل شهر معيّن.
   يوم ٣١ بشهر ٣٠ يوم (أو شباط) ينقصّ على آخر يوم بالشهر — بدونه
   يطلع '2026-02-31' وهذا تاريخ غير صالح فتنكسر كل حسابات التأخير. */
function billDueISO(month, dueDay){
  const d = Math.min(Math.max(1, Number(dueDay) || 1), daysInMonth(month));
  return month + '-' + ('0' + d).slice(-2);
}

/* ============================================================
   نوع الحركة — بدل تحليل نص الوصف بالعربي
   ------------------------------------------------------------
   السيرفر صار يرجّع e.kind بعمود صريح (sql/loan-charge-model.sql).
   لو الترحيل بعده مو مرفوع (أو حركة قديمة بالكاش)، نشتقه من الوصف
   والإشارة — نفس منطق derive_expense_kind بالسيرفر بالضبط، فالنتيجة
   وحدة قبل الترحيل وبعده.

   الأنواع اللي تكسر قاعدة «الإشارة تسوّي كلشي» — وهي بيت القصيد:
     cat_loan  قرض محمّل على تصنيف (+) → ينقص التصنيف بس.
               ما يمسّ «الباقي للصرف» لأن الفلوس طلعت من الصندوق
               مو من الدخل، والصندوق أصلاً نقص برصيده. لو خصمناها
               من «الباقي» بعد، نكون خصمناها مرتين.
     cat_pay   تسديد قرض (+) → ينقص «الباقي» بس.
               التصنيف محمّل أصلاً من يوم القرض، فما ينخصم مرتين.
     cat_fix   إعدام/تصحيح قرض (−) → يزيد التصنيف بس.
   ============================================================ */
function kindOf(e, saveNames){
  if(e && e.kind) return e.kind;
  const d = String((e && e.desc) || '');
  const a = Number((e && e.amount) || 0);
  if(saveNames && saveNames.has(e && e.category)){
    if(a < 0){
      if(d.indexOf('إيداع: ') === 0)   return 'fund_dep';
      if(d.indexOf('إيداع من «') === 0) return 'fund_dep_cat';
      return 'fund_ret';
    }
    return d.indexOf('قرض') === 0 ? 'fund_loan' : 'fund_wd';
  }
  if(a < 0 && d.indexOf('تمويل من صندوق «') === 0)  return 'cat_fund';
  if(a < 0 && d.indexOf('قرض من صندوق «') === 0)    return 'cat_loan_v1';
  if(a > 0 && d.indexOf('سداد قرض لصندوق «') === 0) return 'cat_pay_v1';
  if(a > 0 && d.indexOf('إيداع لصندوق «') === 0)    return 'cat_dep';
  return 'spend';
}
/* حركة على صندوق ادخار (تحرّك رصيده) */
const isFundKind = k => String(k).indexOf('fund_') === 0;
/* تنخصم من متاح التصنيف؟ */
const hitsCat    = k => !isFundKind(k) && k !== 'cat_pay';
/* تنخصم من «الباقي للصرف»؟ (حركات الصناديق إلها حسابها لحالها) */
const hitsRemain = k => !isFundKind(k) && k !== 'cat_loan' && k !== 'cat_fix';
/* حركة صندوق بالمعنى الواسع — تروح لقسم «حركات الصناديق» مو لسجل المصاريف */
const isFundMoveKind = k => k !== 'spend';

function toast(msg, isErr){
  const t = $('toast');
  t.textContent = msg;
  t.className = 'toast show' + (isErr ? ' err' : '');
  clearTimeout(t._h);
  t._h = setTimeout(()=> t.className='toast', 2600);
}
function loading(on){ $('loader').className = on ? 'show' : ''; }

/* ---------- إظهار/إخفاء الشيتات (المودالات) ----------
   هنا النسخة الأساسية: تبديل كلاس بسيط، والأنميشن من CSS.
   fluid.js يلبس الدالتين ويحوّلهن لنوابض قابلة للسحب والمقاطعة.
   إذا ما تحمّل fluid.js، التطبيق يبقى يشتغل بهالنسخة. */
function sheetShow(el){ if(el) el.classList.add('show'); }
function sheetHide(el, then){ if(el) el.classList.remove('show'); if(then) then(); }

function liveFormat(input){
  input.addEventListener('input', () => {
    const n = num(input.value);
    input.value = n ? n.toLocaleString('en-US') : '';
  });
}

function esc(s){
  return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

/* ============================================================
   طابور الأوفلاين — مصاريف انسجلت بلا نت
   تنحفظ بالجهاز (localStorage) وتنرفع تلقائياً من يرجع الاتصال.
   ============================================================ */
const OFFLINE_KEY = 'mas_offline_exp';
function offlineList(){
  try{ const l = JSON.parse(LS.get(OFFLINE_KEY)); return Array.isArray(l) ? l : []; }
  catch(_){ return []; }
}
function offlineSave(list){ try{ LS.set(OFFLINE_KEY, JSON.stringify(list)); }catch(_){} }
function offlineAdd(item){
  const l = offlineList();
  item.qid = 'q' + Date.now().toString(36) + Math.random().toString(36).slice(2,7);
  l.push(item);
  offlineSave(l);
  return item.qid;
}
function offlineRemove(qid){ offlineSave(offlineList().filter(x => x.qid !== qid)); }
/* هل الخطأ سببه انقطاع نت (مو رفض من السيرفر)؟ */
function isNetErr(msg){
  if(typeof navigator !== 'undefined' && navigator.onLine === false) return true;
  return /failed to fetch|networkerror|network request failed|load failed|fetch failed/i.test(String(msg||''));
}
