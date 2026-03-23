const CACHE_NAME = 'kanwas-pwa-v2';
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/sw.js',
];

// Install: pre-cache core assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch: cache-first with stale-while-revalidate
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests from same origin
  if (request.method !== 'GET') return;

  // Skip Google Maps / external APIs
  if (
    url.hostname.includes('maps.google') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('gstatic') ||
    url.origin !== self.location.origin
  ) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);

      // For navigation requests, try network then cache then fallback to /index.html
      if (request.mode === 'navigate') {
        try {
          const networkResponse = await fetch(request);
          cache.put(request, networkResponse.clone());
          return networkResponse;
        } catch {
          return cached || cache.match('/index.html');
        }
      }

      // Cache-first for static assets
      if (cached) {
        // Stale-while-revalidate: update cache in background
        fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(request, networkResponse.clone());
          }
        }).catch(() => {});
        return cached;
      }

      // Not in cache — fetch from network and cache it
      try {
        const networkResponse = await fetch(request);
        if (networkResponse && networkResponse.status === 200 && networkResponse.type !== 'opaque') {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        // Network failed — if we have a cached version, return it
        const fallback = await cache.match(request);
        return fallback || new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      }
    })
  );
});
