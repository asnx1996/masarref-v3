/* مصاريفنا — Service Worker
   يخزّن واجهة التطبيق حتى تفتح فوراً، ويحدّثها بالخلفية بهدوء.

   ⚠️ مهم: كل ما تعدّل index.html، غيّر رقم النسخة بالسطر التحت
   (مثلاً masareef-v1 ← masareef-v2) حتى يوصل التحديث للتلفون. */
const CACHE = 'masareef-v23';
const SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

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
  // فقط ملفات الواجهة (GET من نفس النطاق). نداءات Apps Script وأي شي خارجي يمر مباشرة للنت.
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  // stale-while-revalidate: اعرض من الكاش فوراً، وحدّث الكاش بالخلفية
  e.respondWith(
    caches.open(CACHE).then(cache =>
      cache.match(req).then(cached => {
        const network = fetch(req).then(res => {
          if (res && res.status === 200) cache.put(req, res.clone());
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    )
  );
});
