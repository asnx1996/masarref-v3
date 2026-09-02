/* مصاريفنا — Service Worker
   يخزّن واجهة التطبيق حتى تفتح فوراً وتشتغل بلا نت.

   ⚠️ مهم: كل ما تعدّل أي ملف من ملفات الواجهة (index.html / styles.css /
   core.js / app.js / i18n.js / decor.js / holmes.js / books.js / fluid.js / a11y.js / boot.js)، غيّر رقم
   النسخة بالسطر التحت (مثلاً masareef-v51 ← masareef-v52).

   📌 سياسة التحديث (انتغيّرت بـv50):
   بـv41 صارت «الشبكة أول» لكل الكود، حتى يوصل التحديث بنفس الفتحة.
   بس الكلفة چانت أكبر من الفايدة: ~٥٣٠KB لازم تنزل من الشبكة بكل
   فتحة قبل ما يظهر أي شي — يعني على داتا موبايل ضعيفة التطبيق يكعد
   يحمّل رغم إن كل شي مخزّن عندنا. هذا يلغي فايدة الـPWA أصلاً.

   هسه (الأفضل من الاثنين):
     • كل شي → الكاش أول، فالفتح فوري دائماً (حتى بلا نت).
     • بنفس الوقت نتحقق من الشبكة بالخلفية ونحدّث الكاش.
     • لو نزلت نسخة جديدة، النسخة الجديدة من الـSW تكعد تنتظر،
       وboot.js يعرض شريط «أكو تحديث — اضغط للتحديث».
       المستخدم يضغط ← skipWaiting ← الصفحة تنعاد ← النسخة الجديدة.

   ⚠️ ما نسوّي skipWaiting تلقائياً: لو النسخة الجديدة استلمت والصفحة
   بعدها شغّالة بالكود القديم، ينخلط app.js قديم ويّا styles.css جديد.
   التبديل ينصير بإعادة تحميل واحدة نظيفة بس.
   ============================================================ */
const CACHE = 'masareef-v51';
const SHELL = [
  './', './index.html', './manifest.json', './icon-192.png', './icon-512.png',
  './fonts.css', './styles.css',
  './core.js', './app.js', './i18n.js', './decor.js', './holmes.js', './books.js', './fluid.js', './a11y.js', './boot.js',
  './fonts/rubik-arabic.woff2', './fonts/rubik-latin.woff2',
  './fonts/alexandria-arabic.woff2', './fonts/alexandria-latin.woff2'
];

self.addEventListener('install', (e) => {
  /* بلا skipWaiting — ننتظر إذن المستخدم (شوف الملاحظة فوق) */
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* الصفحة تگلنا «بدّل هسه» لما المستخدم يضغط زر التحديث */
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // فقط ملفات الواجهة (GET من نفس النطاق). نداءات Supabase وأي شي خارجي يمر مباشرة للنت.
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  /* ---------- الكاش أول + تحديث بالخلفية (stale-while-revalidate) ---------- */
  e.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(req);

      const fromNet = fetch(req)
        .then(res => {
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        })
        .catch(async () => {
          // ماكو نت ولا كاش، ولو طلب تنقّل نرجّع الصفحة الرئيسية
          if (req.mode === 'navigate') {
            const home = await cache.match('./index.html');
            if (home) return home;
          }
          throw new Error('offline');
        });

      if (cached) {
        /* نرجّع المخزّن فوراً، والتحديث يكمّل بالخلفية.
           waitUntil حتى المتصفح ما يوقف الـSW قبل ما يخلص التنزيل. */
        e.waitUntil(fromNet.catch(() => {}));
        return cached;
      }
      return fromNet;
    })
  );
});
