const CACHE_NAME = 'smartspend-offline-v17';
const APP_SHELL = [
  './',
  './index.html',
  './style.css?v=17',
  './script.js?v=17',
  './assets/chart.umd.min.js',
  './assets/smartspend-mark.png',
  './assets/smartspend-logo-themed.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => Promise.all(
        cacheNames
          .filter((cacheName) => cacheName.startsWith('smartspend-offline-') && cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName)),
      ))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url);
  if (event.request.method !== 'GET' || requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request, { ignoreSearch: true })
      .then((cachedResponse) => cachedResponse || fetch(event.request)
        .then((response) => {
          if (!response.ok) {
            return response;
          }

          const responseCopy = response.clone();
          caches.open(CACHE_NAME)
            .then((cache) => cache.put(event.request, responseCopy));
          return response;
        }))
      .catch((error) => {
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }

        throw error;
      }),
  );
});
