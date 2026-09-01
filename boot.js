/* ---------- تشغيل ---------- */
/* ============================================================
   وضع الأداء — كشف بالقدرة مو بنوع الجهاز
   ------------------------------------------------------------
   قبل چان: /Android/.test(userAgent) — يعني آيفون قديم أو آيباد
   ضعيف ياخذ التأثيرات كاملة، وأندرويد قوي ينحرم منها بلا سبب.
   هسه نسأل الجهاز عن قدرته الفعلية: عدد الأنوية، الذاكرة، تفضيل
   المستخدم بتقليل الحركة، ووضع توفير البيانات.
   ============================================================ */
(function(){
  const nv = navigator;
  const cores = nv.hardwareConcurrency || 0;
  const mem   = nv.deviceMemory || 0;          // كروم بس — 0 يعني مجهول
  const saveData = !!(nv.connection && nv.connection.saveData);
  const slowNet  = !!(nv.connection && /^([23]g|slow-2g)$/i.test(nv.connection.effectiveType || ''));
  const lessMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;

  const weak = (cores > 0 && cores <= 4) ||
               (mem > 0 && mem <= 4) ||
               saveData || slowNet || lessMotion;

  if(weak) document.documentElement.classList.add('perf');
})();

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
/* ============================================================
   شاشة الافتتاح — تنشال أول ما يجهز التطبيق، مو بمؤقّت ثابت
   ------------------------------------------------------------
   قبل چانت setTimeout(kill, 2900) — والقياس يگول إن التطبيق يصير
   جاهز (domInteractive) بـ٣٦٠ms. يعني المستخدم يتفرّج على اللوجو
   ٢٫٥ ثانية بلا سبب، وهذا أكبر مصدر لإحساس «التطبيق بطيء».
   هسه: splashReady() ينناديها فحص الجلسة أول ما يخلص.
     • MIN_MS  — حتى ما تصير ومضة تلمع وتختفي (يبقى إحساس القصد)
     • MAX_MS  — سقف احتياطي لو الشبكة معلّقة، حتى ما تنحبس الشاشة
   ============================================================ */
window.splashReady = () => {};
(function(){
  const sp = document.getElementById('splash');
  if(!sp){ drainAfterSplash(); return; }

  const MIN_MS = 420;    /* أقل مدة يبقى بيها اللوجو */
  const MAX_MS = 2500;   /* سقف: ما ننتظر الشبكة أكثر من هيچي */
  const t0 = performance.now();
  let killed = false;

  const kill = () => {
    if(killed) return;
    killed = true;
    sp.classList.add('leaving');
    /* نخفيه فعلياً بعد ما تخلص حركة الخروج — .done فيها display:none
       حتى ما يبقى سطح بحجم الشاشة يعترض اللمس */
    const gone = () => { sp.classList.add('done'); drainAfterSplash(); };
    sp.addEventListener('animationend', gone, { once:true });
    setTimeout(gone, 500);   /* ضمانة لو الحركة ما اشتغلت (reduced-motion/خطأ) */
  };

  /* الجاهزية توصل من فحص الجلسة تحت — ننتظر الحد الأدنى بس */
  window.splashReady = () => setTimeout(kill, Math.max(0, MIN_MS - (performance.now() - t0)));
  /* سقف احتياطي: لو ما وصلت إشارة جاهزية أبداً */
  setTimeout(kill, MAX_MS);
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
  finally{ splashReady(); }   /* ضمانة أخيرة — عادةً showApp/showLogin سبقونا */
})();
/* ============================================================
   تسجيل الـ Service Worker (فتح فوري + يشتغل كتطبيق)
   ------------------------------------------------------------
   الـSW صار «الكاش أول» (شوف sw.js)، يعني الفتح فوري بس التحديث
   ما يوصل لحاله. هنا نكمّل الصورة: لو نزلت نسخة جديدة، تكعد تنتظر
   ونعرض شريط يخلّي المستخدم يبدّلها بإعادة تحميل واحدة نظيفة.
   ============================================================ */
if('serviceWorker' in navigator){
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      /* نسخة جاهزة وواقفة بالانتظار من فتحة سابقة */
      if(reg.waiting && navigator.serviceWorker.controller) showUpdateBar(reg.waiting);

      reg.addEventListener('updatefound', () => {
        const nw = reg.installing;
        if(!nw) return;
        nw.addEventListener('statechange', () => {
          /* installed + أكو controller = تحديث لتطبيق منصّب أصلاً،
             مو أول تنصيب (بأول تنصيب ماكو شي نگله للمستخدم) */
          if(nw.state === 'installed' && navigator.serviceWorker.controller) showUpdateBar(nw);
        });
      });
    }).catch(()=>{});

    /* لما تستلم النسخة الجديدة نعيد التحميل مرة وحدة بس */
    let reloading = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if(reloading) return;
      reloading = true;
      location.reload();
    });
  });
}

function showUpdateBar(worker){
  if(document.getElementById('updateBar')) return;
  const bar = document.createElement('button');
  bar.id = 'updateBar';
  bar.type = 'button';
  bar.innerHTML = '<span>✨ نزلت نسخة جديدة</span><b>حدّث</b>';
  bar.onclick = () => {
    bar.disabled = true;
    bar.querySelector('b').textContent = 'جاري…';
    worker.postMessage({ type:'SKIP_WAITING' });
  };
  document.body.appendChild(bar);
  /* إجبار تخطيط بدل requestAnimationFrame: الـrAF ما ينفّذ أبداً والصفحة
     بالخلفية — وهذا بالضبط الوقت اللي يوصل بيه التحديث عادةً، فالشريط
     چان يبقى شفاف وبلا لمس للأبد. */
  void bar.offsetWidth;
  bar.classList.add('show');
}
