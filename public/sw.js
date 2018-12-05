// Load the sw-toolbox library.
importScripts('./js/idb-keyval.js');

const cacheName = 'todoList';
const offlineUrl = '/offline';

// Cache our known resources during install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
    .then(cache => cache.addAll([
      './',
      './css/style.css',
      './js/idb-keyval.js',
      './js/main.js'
    ]))
  );
});

// Handle network delays
function timeout(delay) {
  return new Promise(function (resolve, reject) {
    setTimeout(function () {
      resolve(new Response('', {
        status: 408,
        statusText: 'Request timed out.'
      }));
    }, delay);
  });
}

self.addEventListener('fetch', function(event) {

  // Check for the googleapis domain
  if (/googleapis/.test(event.request.url)) {
    return event.respondWith(
        Promise.race([
        timeout(500),
        fetch(event.request.url)
      ])
    );
  } else{
    //else return
  }
});
