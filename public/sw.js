// Load the sw-toolbox library.
importScripts('./js/idb-keyval.js');

const cacheName = 'todoList';
const offlineUrl = '/index-offline.html';

// Cache our known resources during install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName)
    .then(cache => cache.addAll([
      //'./',
      offlineUrl,
      '/api/tasks',
      './css/style.css',
      './js/idb-keyval.js',
      './js/main.js',

      'https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js',
      'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/js/bootstrap.min.js',
      'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css'
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

self.addEventListener('fetch', function (event) {


  // Intercepting networkrequests
  // dont' load google fonts and icons if save-data header is on. In GET Request of the Localhost!
  if (event.request.headers.get('save-data')) {
    if (event.request.url.includes('fonts.googleapis.com')) {
      event.respondWith(new Response('', {
        status: 417,
        statusText: 'Ignore fonts to save data'
      }));
    }
  }
  // Exampel for Service Worker to the rescue. To avoid Single Point of Failure
  // Check for the googleapis domain
  if (/abcd/.test(event.request.url)) {
    return event.respondWith(
      Promise.race([
        timeout(300),
        fetch(event.request.url)
      ])

    );
  } else {
    //else return
  }



  // Offline page functionality
  event.respondWith(caches.match(event.request).then(function (response) {
    // if (response) {
    //    if (/api\/tasks/.test(response.url)) {
    //     caches.open('todoList').then((cache) => {
    //      fetch(response.url)
    //        .then((resp) => {
    //          if(resp.ok){
    //             let newResp = resp.clone();
    //             cache.put('/api/tasks',newResp);
    //             //return newResp;
    //          }
    //       });

    //     });

    //    }
    //  return response;
    // }

    //If the the client is online don't take tasks from cache, if it is offline take from storage!
    if (response && (!/api\/tasks/.test(response.url) || !navigator.onLine)) {
      return response;
    }
    var fetchRequest = event.request.clone();
    return fetch(fetchRequest).then(function (response) {
      if (!response || response.status !== 200) {
        return response;
      }
      var responseToCache = response.clone();
      caches.open(cacheName).then(function (cache) {
        if (event.request.method === 'GET') {
          cache.put(event.request, responseToCache);
        }
      });
      return response;


    }).catch(error => {

      if (event.request.method === 'GET' &&
        event.request.headers.get('accept').includes('text/html')) {
        return caches.match(offlineUrl);
      }
    });
  }));

});


//keeping data synchronized
self.addEventListener('sync', (event) => {

  if (event.tag === 'newTask') {

    let promise = idbKeyval.keys();
    promise.then((keys) => {
      for (let k of keys) {
        if (/sendTask/.test(k)) {
          idbKeyval.get(k).then((value) => {
            fetch('api/tasks', {
              method: 'POST',
              headers: new Headers({
                'content-type': 'application/json'
              }),
              body: JSON.stringify(value)
            }).then((response) => {
              console.log(response);

            });
          });

          idbKeyval.delete(k);
        }

      }
    });
  } else if (event.tag === 'taskToDelete') {

    let promise = idbKeyval.keys();
    promise.then((keys) => {
      for (let k of keys) {
        if (/deleteTask/.test(k)) {
          idbKeyval.get(k).then((value) => {
            fetch('api/tasks/' + value, {
              method: 'DELETE'

            }).then((response) => {
              console.log(response);

            });
          });
          idbKeyval.delete(k);
        }
      }
    });
  }else if (event.tag === 'updatedTask') {




    let promise = idbKeyval.keys();
    promise.then((keys) => {
      for (let k of keys) {
        if (/updateTask/.test(k)) {
          idbKeyval.get(k).then((value) => {
            let updatedTask = {
              "description": value.description,
              "category": value.category
          };
            fetch('api/tasks/' + value.id, {
              method: 'PUT',
              body: JSON.stringify(updatedTask)
            }).then((response) => {
              console.log(response);

            });
          });
          idbKeyval.delete(k);
        }
      }
    });
  }



});