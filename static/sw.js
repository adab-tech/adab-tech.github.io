// Service Worker for Hausa Explorer PWA (scoped to /static/ only)
const CACHE_NAME = 'hausa-explorer-v4';
const urlsToCache = [
  '/static/hausa_explorer.html',
  '/static/css/hausa-explorer.css',
  '/static/js/hausa-explorer-data.js',
  '/static/js/hausa-lessons.js',
  '/static/js/robinson-lookup.js',
  '/static/js/hausa-explorer-app.js',
  '/static/data/robinson-en-ha-index.json',
  '/static/data/ATTRIBUTION.md',
  '/manifest.json',
];

function isStaticAsset(url) {
  return url.pathname.startsWith('/static/');
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)).catch((err) => {
      console.log('Cache installation failed:', err);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !isStaticAsset(url)) {
    return;
  }

  if (event.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => caches.match(event.request).then((r) => r || caches.match('/static/hausa_explorer.html')))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      const networkFetch = fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && response.type === 'basic') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          }
          return response;
        })
        .catch(() => cached);

      return cached || networkFetch;
    })
  );
});
