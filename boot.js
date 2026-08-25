/* ---------- تشغيل ---------- */
if(/Android/i.test(navigator.userAgent)) document.documentElement.classList.add('perf');

/* ============================================================
   جدولة ما بعد الافتتاح
   ------------------------------------------------------------
   السبب الحقيقي للتقطيع بحركة اللوجو: كل الزينة (٤٠ نجمة + ٢٦
   شجرة + ٢٦ ذرة، وكلهن بأنميشن لانهائي) چانت تنبني بنفس اللحظة
   اللي اللوجو يتحرك بيها — ورا الشاشة، يعني محد يشوفها! فالخيط
   الرئيسي مشغول ببناء DOM بدل ما يرسم إطارات الحركة.
   هسه: الحركة تاخذ الخيط لحالها، والزينة تنبني بعد ما تخلص، وكل
   مهمة بإطار لحالها حتى ولا وحدة تسوّي وقفة طويلة.
   ============================================================ */
const AFTER_SPLASH = [];
let splashGone = false;
function afterSplash(fn){
  if(splashGone) idle(fn); else AFTER_SPLASH.push(fn);
}
/* ينفّذ المهمة بوقت فراغ الخيط.
   مع ضمانة setTimeout: requestIdleCallback ما يشتغل أبداً لو الصفحة
   بالخلفية (يعني المستخدم فتح التطبيق وطلع منه) — وبلا الضمانة
   السماء ما تنبني نهائياً وتبقى الخلفية سادة. */
function idle(fn){
  let done = false;
  const run = () => { if(done) return; done = true; try{ fn(); }catch(e){} };
  if(window.requestIdleCallback) requestIdleCallback(run, { timeout: 300 });
  setTimeout(run, 400);
}
function drainAfterSplash(){
  if(splashGone) return;
  splashGone = true;
  /* واحدة واحدة، مو كلهن بنفس الإطار */
  (function next(){
    const fn = AFTER_SPLASH.shift();
    if(!fn) return;
    idle(() => { try{ fn(); }catch(e){} next(); });
  })();
}
// شيل شاشة الافتتاح بعد ما تخلص حركتها (حتى ما تعيق الضغط)
(function(){
  const sp = document.getElementById('splash');
  if(!sp){ drainAfterSplash(); return; }
  const kill = () => { sp.classList.add('done'); drainAfterSplash(); };
  const t = document.documentElement.classList.contains('perf') ? 2300 : 2900;
  setTimeout(kill, t);
  setTimeout(kill, 4000);
  window.addEventListener('load', () => setTimeout(kill, t));
})();
loadPalette();
try{ loadFontPref(); }catch(e){}
try{ applyFontScale(fontScale); }catch(e){}
try{ applySkyBlur(skyBlur); }catch(e){}
try{ updateCurrencyLabels(); }catch(e){}
apiReady();
try{ applyLangBoot(); }catch(e){}
/* إظهار/إخفاء التبويبات الاختيارية.
   catch فارغ چان يخفي عطل حقيقي: applyLedgerVisible وapplyAuditVisible
   ساكنات بـbooks.js، فلو الملف ما وصل تطيح النداءات وماكو أي أثر —
   لا بالشاشة ولا بالكونسول. هسه الخطأ ينطبع على الأقل. */
['applyBillsVisible', 'applyReconVisible', 'applyLedgerVisible', 'applyAuditVisible']
  .forEach(name => {
    /* تعريفات الدوال بأعلى مستوى السكربت تنحط على window، فما نحتاج eval */
    const fn = window[name];
    if(typeof fn !== 'function'){
      console.warn('[tabs] الدالة ' + name + ' مو موجودة — تأكد إن books.js انحمّل');
      return;
    }
    try{ fn(); }catch(e){ console.warn('[tabs] ' + name + ' طاحت:', e); }
  });
try{ applyDark(); }catch(e){}
window.addEventListener('beforeprint', () => {
  try{
    const pa = $('printArea');
    if(pa && session){ pa.innerHTML = buildReportHTML(); translateNode(pa); }
  }catch(_){}
});
try{ initSwipe(); }catch(e){}   /* رخيصة — أربع مستمعات بس */
/* الزينة كلها تتأجّل لما تخلص حركة الافتتاح — هي مخفية وراها أصلاً */
afterSplash(() => startDeco());
afterSplash(() => { updateSky(); setInterval(updateSky, 5 * 60 * 1000); });
afterSplash(() => initDepth());
afterSplash(() => initAmbient());
(async () => {
  try{
    const { data:{ session: s } } = await sb.auth.getSession();
    if(s && s.user){ await afterLogin(s.user); } else { showLogin(); }
  }catch(_){ showLogin(); }
})();
/* ---------- تسجيل الـ Service Worker (فتح فوري + يشتغل كتطبيق) ---------- */
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(()=>{});
  });
}
