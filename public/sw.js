// Load the sw-toolbox library.
importScripts('./js/idb-keyval.js');

const cacheName = 'todoList';

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
  
  // check for /fonts.googleapis.com/ domain if it takes to long to load abort
  if (/fonts.googleapis.com/.test(event.request.url)) {
    return event.respondWith(
      Promise.race([
        timeout(300),
        fetch(event.request.url)
      ])

    );
  }

  // Offline page functionality
  event.respondWith(caches.match(event.request).then(function (response) {

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

      // if a post put or delete is requested the cache ignores the request
      if (event.request.method === 'POST' || event.request.method === 'PUT' || event.request.method === 'DELETE') {
        var init = { "status": 200, "statusText": "Cache ignored the request and returned nothing!" };
        var cacheResponse = new Response(init);
        return cacheResponse;
      }

      console.log(error);
    });
  }));

});


//keeping data synchronized
self.addEventListener('sync', (event) => {

  // IndexedDB is ordered alphabetically
  // Keys are sorted after priority
  // Heighest Priority  A(GET)-B(DELETE)  Lowest Priority
  if (event.tag === 'needsSync') {
    let promise = idbKeyval.keys();
    promise.then((keys) => {
      let posts = [];
      let puts = [];
      let deletes = [];

      for (let k of keys) {
        if (/sendTask/.test(k)) {
          posts.push(k);
        } else if (/updateTask/.test(k)) {
          puts.push(k);
        } else if ((/deleteTask/.test(k))) {
          deletes.push(k);
        }
      }
      let sortedKeys = posts.concat(puts, deletes);

      for (let sortedKey of sortedKeys) {
        if (/sendTask/.test(sortedKey)) {
          idbKeyval.get(sortedKey).then((value) => {
            fetch('api/tasks', {
              method: 'POST',
              headers: new Headers({
                'content-type': 'application/json'
              }),
              body: JSON.stringify(value)
            }).then((response) => {
              console.log("POST sync successful");
            }).catch(err => {
              console.log("POST sync failed");

            });
          });

          idbKeyval.delete(sortedKey);
        } else if (/updateTask/.test(sortedKey)) {
          idbKeyval.get(sortedKey).then((value) => {
            let updatedTask = {
              "description": value.description,
              "category": value.category
            };
            fetch('api/tasks/' + value.id, {
              method: 'PUT',
              headers: {
                'content-type': 'application/json'
              },
              body: JSON.stringify(updatedTask)
            }).then((response) => {
              console.log("PUT sync successful");
            }).catch(err => {
              console.log("PUT sync failed");

            });
          });
          idbKeyval.delete(sortedKey);
        } else if (/deleteTask/.test(sortedKey)) {
          idbKeyval.get(sortedKey).then((value) => {
            fetch('api/tasks/' + value, {
              method: 'DELETE'

            }).then((response) => {
              console.log("DELETE sync successful");

            }).catch(err => {
              console.log("DELETE sync failed");

            });
          });
          idbKeyval.delete(sortedKey);
        }
      }
    });

  }
});