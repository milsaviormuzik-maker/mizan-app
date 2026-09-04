/* ============================================================
   MİZAN — Servis çalışanı (çevrimdışı destek)
   ------------------------------------------------------------
   Uygulama kabuğu kurulumda önbelleğe alınır; sonrasında
   internet olmasa da namaz vakitleri, Kur'an metni, dualar ve
   takvim çalışmaya devam eder — hepsi cihazda hesaplanıyor.

   Tilavet sesi bilinçli olarak önbelleğe ALINMAZ: yüzlerce MB
   eder. Ses için bağlantı gerekir; oynatıcı bunu zaten söylüyor.
   ============================================================ */

const VERSION = 'mizan-v3';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './css/tokens.css',
  './css/base.css',
  './css/components.css',
  './css/screens.css',
  './assets/mark-koyu.png',
  './assets/mark-acik.png',
  './assets/logo-koyu.png',
  './assets/logo-acik.png',
  './assets/desen.png',
  './assets/icon.svg',
  './js/app.js'
];

self.addEventListener('install', (e) => {
  e.waitUntil((async () => {
    const cache = await caches.open(VERSION);
    // Tek bir dosya düşerse kurulum komple başarısız olmasın
    await Promise.allSettled(SHELL.map((u) => cache.add(u)));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  // Ses ve diğer dış kaynaklar: doğrudan ağa, önbelleğe alınmaz
  if (url.origin !== self.location.origin) return;

  // Uygulama kodu: önce ağ (güncel kalsın), düşerse önbellek
  e.respondWith((async () => {
    try {
      const fresh = await fetch(req);
      if (fresh && fresh.ok) {
        const cache = await caches.open(VERSION);
        cache.put(req, fresh.clone());
      }
      return fresh;
    } catch {
      const cached = await caches.match(req);
      if (cached) return cached;
      // Gezinme isteği ise kabuğu döndür (hash yönlendirme kendi işini görür)
      if (req.mode === 'navigate') {
        const shell = await caches.match('./index.html');
        if (shell) return shell;
      }
      throw new Error('offline');
    }
  })());
});
