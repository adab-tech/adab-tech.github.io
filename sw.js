/**
 * Legacy root service worker — retired.
 * Previously cached the entire site (including the portfolio homepage).
 * This script clears caches and unregisters itself on the next visit.
 */
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
      .then(() => self.registration.unregister())
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(fetch(event.request));
});
