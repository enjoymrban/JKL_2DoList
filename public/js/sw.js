console.log("sw.js");

var cacheName = 'todoList';
var css = '../../css/style.css';
var indexPage = '../../index.html';
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => cache.addAll([
                css, 
                indexPage
            ]))
    );
});

this.addEventListener('fetch', event => {
    if (event.request.method === 'GET' &&
        event.request.headers.get('accept').includes('text/html')) {
        event.respondWith(
            fetch(event.request.url).catch(error => {
                return caches.match(indexPage);
            })
        );
    }
    else {
        event.respondWith(fetch(event.request));
    }
});