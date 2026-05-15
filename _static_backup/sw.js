/**
 * BandUp AI — Service Worker
 * sw.js — PWA offline support & caching
 */

const CACHE_NAME   = 'bandup-ai-v1';
const STATIC_CACHE = 'bandup-static-v1';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/manifest.json',
];

/* ── INSTALL ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

/* ── ACTIVATE ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== STATIC_CACHE)
          .map(k => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

/* ── FETCH (Cache-first for static, Network-first for API) ── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET and cross-origin (fonts, CDN)
  if (request.method !== 'GET') return;
  if (url.origin !== location.origin) return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request).then(response => {
        // Cache successful responses
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => {
        // Offline fallback
        if (request.headers.get('accept')?.includes('text/html')) {
          return caches.match('/index.html');
        }
      });
    })
  );
});

/* ── PUSH NOTIFICATIONS (study reminders) ── */
self.addEventListener('push', event => {
  const data = event.data?.json() ?? {};
  const options = {
    body: data.body || 'Time for your daily IELTS practice! 🎯',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    tag: 'study-reminder',
    renotify: true,
    actions: [
      { action: 'practice', title: 'Start Practice' },
      { action: 'dismiss',  title: 'Later' },
    ],
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'BandUp AI Reminder', options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'practice') {
    event.waitUntil(clients.openWindow('/'));
  }
});
