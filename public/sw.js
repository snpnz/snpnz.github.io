'use strict';
const cacheName = 'static-cache-v4';
const precacheResources = [
    './',
    "android-chrome-192x192.png",
    "android-chrome-512x512.png",
    "apple-touch-icon.png",
    "appSettins.json",
    "browserconfig.xml",
    "favicon.ico",
    "favicon-16x16.png",
    "favicon-32x32.png",
    "index.html",
    "manifest.json",
    "mstile-150x150.png",
    "robots.txt",
    "sw.js",
    './manifest.json',
    './stravastat.png',
    './index.html',
    './sw.js',
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
        }),
    );
});
