'use strict';
const cacheName = 'static-cache-v4';
const precacheResources = [
    './',
    "favicon.ico",
    "logo192.png",
    "logo512.png",
    "appSettins.json",
    "favicon.ico",
    "index.html",
    "manifest.json",
    "robots.txt",
    'stravastat.png',
];
// When the service worker is installing, open the cache and add the precache resources to it
self.addEventListener('install', (event) => {
    console.log('Service worker install event!');
    event.waitUntil(caches.open(cacheName).then((cache) => cache.addAll(precacheResources)));
});
self.addEventListener('activate', (event) => {
    console.log('Service worker activate event!');
});

// When there's an incoming fetch request, try and respond with a precached resource, otherwise fall back to the network
self.addEventListener('fetch', (event) => {
    console.log('Fetch intercepted for:', event.request.url);
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        }).catch(() =>
            caches.match('/')
        ),
    );
});
