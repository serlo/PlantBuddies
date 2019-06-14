const currentCacheName = 'plantbuddies-0.01';

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
    caches.open(currentCacheName).then(cache => {
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

function isNavigateRequest (request) {
  return (request.mode === 'navigate' ||
     (request.method === 'GET' &&
       request.headers.get('accept').includes('text/html')));
}

function offlineRedirect () {
  return caches.open(currentCacheName).then(cache => {
    return cache.match('index.html');
  });
}

self.addEventListener('fetch', event => {
  if (event.request.url.startsWith(self.location.origin) || event.request.url.startsWith('https://plantbud') ) {

    // console.log(event.request)
    // console.log(event.request.url)
    // if (event.request.url.indexOf('/plant' !== -1)) {
      // console.log("route")
    // }
    event.respondWith(
      caches.match(event.request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(event.request).then(response => {
            return response;
        }).catch(() => offlineRedirect()) //maybe catch only navigation events with that

      })
    );
  }
});



self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== currentCacheName) {
            console.log('[ServiceWorker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});
