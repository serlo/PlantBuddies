
const cachePrefix = 'plantbuddies.0.2';

//trick to use parcel-plugin-sw-cache without workbox
//TODO: Replace with other plugin or custom code
const cacheFunction = {
    precacheAndRoute: function(arr){
      return arr
    }
}
const cacheFilesObj = cacheFunction.precacheAndRoute([])
const cacheFiles = cacheFilesObj.map(function(item) {
  return item['url'];
});

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(`${cachePrefix}-shell`).then(cache => {
      return cache.addAll(cacheFiles);
    }).then(() => self.skipWaiting())
  );
});


function fetchFromCache (request) {
  return caches.match(request).then(response => {
    if (!response) {
      throw Error(`${request.url} not found in cache`);
    }
    return response;
  });
}

self.addEventListener('fetch', event => {
  var request = event.request;
  var url     = new URL(request.url);
  if (cacheFiles.indexOf(url.pathname) !== -1) {
    event.respondWith(
      fetchFromCache(request)
        .catch(() => fetch(request))
    );
  }
});


self.addEventListener('activate', event => {
  event.waitUntil(clients.claim());
});


// function fetchFromCache(request) {
//   return caches.match(request).then(response => {
//     if (!response) {
//       throw Error(`${request.url} not found in cache`);
//     }
//     return response;
//   });
// }

// function addToCache(request, response) {
//   if (response.ok) {
//     const copy = response.clone();
//     caches.open(`${cachePrefix}-assets`).then(cache => {
//       cache.put(request, copy);
//     });
//   }
//   return response;
// }

// function offlinePage() {
//   return caches.open(`${cachePrefix}-offline`).then(cache => {
//     return cache.match('offline.html');
//   });
// }

// function isNavigateRequest(request) {
//   return (request.mode === 'navigate' ||
//     (request.method === 'GET' &&
//       request.headers.get('accept').includes('text/html')));
// }

// function isImageRequest(request) {
//   return (request.headers.get('Accept').indexOf('image') !== -1);
// }

// self.addEventListener('install', event => {
//   self.skipWaiting();
//   // const offlineURL = 'offline.html';
//   // event.waitUntil(
//   //   fetch(new Request(offlineURL)).then(response => {
//   //     return caches.open(`${cachePrefix}-offline`).then(cache => {
//   //       return cache.put(offlineURL, response);
//   //     });
//   //   })
//   // );
// });

// self.skipWaiting();
// self.addEventListener('activate', event => {
//   event.waitUntil(clients.claim());
// });

// self.addEventListener('fetch', event => {
//   var request = event.request;
//   if (isNavigateRequest(request)) {
//     event.respondWith(
//       fetch(request)
//         .then(response => addToCache(request, response))
//         .catch(() => fetchFromCache(request))
//       // .catch(() => offlinePage())
//     );
//   } else if (isImageRequest(request)) {
//     event.respondWith(
//       fetchFromCache(request)
//         .catch(() => fetch(request)
//           .then(response => addToCache(request, response)))
//         .catch(() => console.log('unable to respond to request'))
//     );
//   }
// });

