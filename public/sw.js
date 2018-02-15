self.addEventListener('install', async function(event) {
  
  const cache = await caches.open('v1.2');
  return cache.addAll([
    'assets/252025.svg',
    'assets/all-buses.json',
    'assets/favicon.ico',
    'assets/favicon.png',
    'assets/transit-app.css',
    'assets/transit-app.js',
    'assets/vendor.css',
    'assets/vendor.js',
  ]);

});


self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    // caches.match() always resolves
    // but in case of success response will have value
    if (response !== undefined) {
      return response;
    } else {
      return fetch(event.request).then(function (response) {
        // response may be used only once
        // we need to save clone to put one copy in cache
        // and serve second one
        let responseClone = response.clone();
        
        if(event.request.url.match(/assets/))
          caches.open('v1.2').then(function (cache) {

            cache.put(event.request, responseClone);
          });
        return response;
      }).catch(function () {
        return console.error('failed to fetch ', event.request, event);
      });
    }
  }));
});