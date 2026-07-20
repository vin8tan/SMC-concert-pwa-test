const CACHE_NAME = 'concert-v1';

// Only list your primary entry page here
const INITIAL_ASSETS = [
  './',
  './index.html'
];

// 1. Install: Pre-cache the main index page
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(INITIAL_ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Activate: Take immediate control of the page
self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// 3. Fetch: Intercept requests and automatically cache everything dynamically
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // If the file is already cached, serve it instantly
      if (cachedResponse) {
        return cachedResponse;
      }

      // If the file is NOT cached, download it from the network AND save a copy automatically
      return fetch(event.request).then((networkResponse) => {
        // Only cache valid standard requests (status 200 OK)
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse;
        }

        // Clone the stream and store it in cache for offline use later
        const responseToCache = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });

        return networkResponse;
      });
    })
  );
});