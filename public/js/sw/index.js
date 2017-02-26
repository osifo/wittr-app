//caching pages
const urlsToCache = [
  '/skeleton',
  'js/main.js',
  'css/main.css',
  'imgs/icon.png'
];

const staticCacheName = 'wittr-static-v8'

self.addEventListener('install', (event) => {
  //event.waitUntil created room for syncronous code to be run.
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});
//testing stuff
self.addEventListener('activate', (event) => {
  let currCacheName;

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => {
          return name.startsWith('wittr') && name != staticCacheName;
        }).map((cacheName) => {
          return caches.delete(cacheName);
        })
      );
    })
  );
})

self.addEventListener('fetch', function(event) {
  let requestUrl = new URL(event.request.url);
  console.log('requestUrl: ', requestUrl);

  // checks that the request is intra-site
  if(requestUrl.origin === location.origin) {
    if(requestUrl.pathname === '/') {
      event.respondWith(caches.match('/skeleton'));
      return;
    }
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('message', (event) => {
  console.log('some new stuff');
  if(event.data.action == 'refresh') {
    self.skipWaiting();
  }
});
