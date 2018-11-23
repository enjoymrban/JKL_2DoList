console.log("sw.js");

var cacheName = 'todoList';
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => cache.addAll([
                '../../'
            ]))
    );
});