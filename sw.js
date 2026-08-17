/* مصاريفنا — Service Worker
   يخزّن واجهة التطبيق حتى تفتح فوراً وتشتغل بلا نت.

   ⚠️ مهم: كل ما تعدّل أي ملف من ملفات الواجهة (index.html / styles.css /
   core.js / app.js / i18n.js / decor.js / fluid.js / boot.js)، غيّر رقم
   النسخة بالسطر التحت (مثلاً masareef-v42 ← masareef-v43).

   📌 سياسة التحديث (انتغيّرت بـv41):
   قبل چانت stale-while-revalidate لكل شي — تعرض المخزّن فوراً وتحدّث
   بالخلفية. النتيجة: أي تعديل ما يوصل إلا بالفتحة الجاية، فتفتح التطبيق
   وتلگي الميزة الجديدة «مو موجودة».
   هسه:
     • الكود والصفحة (html/js/css) → الشبكة أول، والكاش احتياط لو ماكو نت.
       يعني التحديث يوصل بنفس الفتحة. لو ماكو نت يشتغل من الكاش عادي.
     • الخطوط والصور والصوت → الكاش أول (ما تتغيّر، وثقيلة).
   ============================================================ */
const CACHE = 'masareef-v44';
const SHELL = [
  './', './index.html', './manifest.json', './icon-192.png', './icon-512.png',
  './fonts.css', './styles.css',
  './core.js', './app.js', './i18n.js', './decor.js', './holmes.js', './fluid.js', './boot.js',
  './fonts/rubik-arabic.woff2', './fonts/rubik-latin.woff2',
  './fonts/alexandria-arabic.woff2', './fonts/alexandria-latin.woff2'
];

/* الملفات اللي لازم تجي من الشبكة أول — الكود والتنسيق والصفحة نفسها */
const isCode = (url, req) =>
  req.mode === 'navigate' || /\.(?:html|js|css)$/i.test(new URL(url).pathname);

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(SHELL))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  // فقط ملفات الواجهة (GET من نفس النطاق). نداءات Supabase وأي شي خارجي يمر مباشرة للنت.
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  if (isCode(req.url, req)) {
    /* ---------- الشبكة أول ---------- */
    e.respondWith(
      caches.open(CACHE).then(cache =>
        fetch(req)
          .then(res => {
            if (res && res.status === 200) cache.put(req, res.clone());
            return res;
          })
          .catch(async () => {
            // ماكو نت → من الكاش. ولو طلب تنقّل، نرجّع الصفحة الرئيسية.
            const cached = await cache.match(req);
            if (cached) return cached;
            if (req.mode === 'navigate') return cache.match('./index.html');
            throw new Error('offline');
          })
      )
    );
    return;
  }

  /* ---------- الكاش أول (خطوط/صور/صوت) ---------- */
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(req).then(cached => {
        if (cached) return cached;
        return fetch(req).then(res => {
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        });
      })
    )
  );
});
