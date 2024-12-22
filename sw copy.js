self.addEventListener('push', function (event) {
    if (event.data) {
      const data = event.data.json()
      const options = {
        body: data.body,
        icon: data.icon || '/icon.png',
        badge: '/badge.png',
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          primaryKey: '2',
          url: data.url || 'http://localhost:4000?key=dinamic',
        },
      }
      event.waitUntil(self.registration.showNotification(data.title, options))
    }
  })
   
  // self.addEventListener('notificationclick', function (event) {
  //   console.log('Notification click received.')
  //   console.log(event)
  //   event.notification.close()
  //   event.waitUntil(clients.openWindow('http://localhost:3000'))
  // })


  // self.addEventListener('notificationclick', function (event) {  
  //   console.log('Notification click received.');  
  //   console.log(event);  
  
  //   const urlToOpen = event.notification.data.url; // Get the dynamic URL 
  //   console.log(urlToOpen); 
  
  //   event.notification.close(); // Close the notification  
  
  //   event.waitUntil(  
  //     clients.matchAll({ type: 'window' }).then((clientList) => {  
  //       // Check if there is an open window for the app  
  //       for (const client of clientList) {  
  //         // If a window is already open, focus it and navigate to the URL  
  //         if (client.url === urlToOpen && 'focus' in client) {  
  //           return client.focus().then(() => client.navigate(urlToOpen));  
  //         }  
  //       }  
  //       // If no windows are open, open a new one  
  //       return clients.openWindow(urlToOpen);  
  //     })  
  //   );  
  // }); 



  const CACHE_NAME = 'my-app-cache-v1';
  const urlsToCache = [
    '/',
    '/~offline',
    '/favicon.ico',
    '/next.svg',
    '/_next/static',
    // Add other URLs you want to cache initially
  ];
  
  // Install event - cache initial URLs
  self.addEventListener('install', event => {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => {
          return cache.addAll(urlsToCache)
            .catch(error => {
              console.error('Failed to cache:', error);
              urlsToCache.forEach(url => {
                fetch(url).catch(fetchError => {
                  console.error(`Failed to fetch ${url}:`, fetchError);
                });
              });
            });
        })
    );
  });
  
  // Fetch event - serve cached content and update cache
  self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET') {
      // Only cache GET requests
      return;
    }
  
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) {
            // Fetch the latest data from the server and update the cache
            fetch(event.request).then(networkResponse => {
              caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, networkResponse.clone());
              });
            });
            // Return the cached response
            return response;
          }
          // If not in cache, fetch from network
          return fetch(event.request).then(networkResponse => {
            // Cache the new request
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          });
        })
        .catch(() => caches.match('/~offline')) // Serve offline page if both cache and network fail
    );
  });
  
  // Activate event - clean up old caches
  self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
  
  self.addEventListener('notificationclick', function (event) {  
    console.log('Notification click received.');  
    console.log(event);  
  
    const urlToOpen = event.notification.data.url; // Get the dynamic URL 
    console.log(urlToOpen); 
  
    event.notification.close(); // Close the notification  
  
    event.waitUntil(  
      clients.matchAll({ type: 'window' }).then((clientList) => {  
        // Check if there is an open window for the app  
        for (const client of clientList) {  
          // If a window is already open, focus it and navigate to the URL  
          if (client.url === urlToOpen && 'focus' in client) {  
            return client.focus().then(() => client.navigate(urlToOpen));  
          }  
        }  
        // If no windows are open, open a new one  
        return clients.openWindow(urlToOpen);  
      })  
    );  
  });


  // const CACHE_NAME = 'my-app-cache-v1';
  // const urlsToCache = [
  //   '/',
  //   '/~offline',
  //   '/favicon.ico',
  //   '/next.svg',
  //   '/_next/static/chunks',
  //   // Add other URLs you want to cache initially
  // ];
  
  // // Install event - cache initial URLs
  // self.addEventListener('install', event => {
  //   event.waitUntil(
  //     caches.open(CACHE_NAME)
  //       .then(cache => {
  //         return cache.addAll(urlsToCache)
  //           .catch(error => {
  //             console.error('Failed to cache:', error);
  //           });
  //       })
  //   );
  // });
  
  // // Fetch event - serve cached content and update cache
  // self.addEventListener('fetch', event => {
  //   event.respondWith(
  //     caches.match(event.request)
  //       .then(response => {
  //         if (response) {
  //           // Fetch the latest data from the server and update the cache
  //           fetch(event.request).then(networkResponse => {
  //             caches.open(CACHE_NAME).then(cache => {
  //               cache.put(event.request, networkResponse.clone());
  //             });
  //           });
  //           // Return the cached response
  //           return response;
  //         }
  //         // If not in cache, fetch from network
  //         return fetch(event.request).then(networkResponse => {
  //           // Cache the new request
  //           return caches.open(CACHE_NAME).then(cache => {
  //             cache.put(event.request, networkResponse.clone());
  //             return networkResponse;
  //           });
  //         });
  //       })
  //       .catch(() => caches.match('/~offline')) // Serve offline page if both cache and network fail
  //   );
  // });
  
  // // Activate event - clean up old caches
  // self.addEventListener('activate', event => {
  //   const cacheWhitelist = [CACHE_NAME];
  //   event.waitUntil(
  //     caches.keys().then(cacheNames => {
  //       return Promise.all(
  //         cacheNames.map(cacheName => {
  //           if (cacheWhitelist.indexOf(cacheName) === -1) {
  //             return caches.delete(cacheName);
  //           }
  //         })
  //       );
  //     })
  //   );
  // });


  // ===================

  // const CACHE_NAME = 'my-app-cache-v1';
  // const urlsToCache = [
  //   '/',
  //   '/~offline',
  //   // Add other URLs you want to cache
  // ];
  
  // self.addEventListener('install', event => {
  //   event.waitUntil(
  //     caches.open(CACHE_NAME)
  //       .then(cache => {
  //         return cache.addAll(urlsToCache)
  //           .catch(error => {
  //             console.error('Failed to cache:', error);
  //           });
  //       })
  //   );
  // });
  
  // self.addEventListener('fetch', event => {
  //   event.respondWith(
  //     caches.match(event.request)
  //       .then(response => {
  //         if (response) {
  //           return response;
  //         }
  //         return fetch(event.request);
  //       })
  //       .catch(() => caches.match('/~offline'))
  //   );
  // });
  
  // self.addEventListener('activate', event => {
  //   const cacheWhitelist = [CACHE_NAME];
  //   event.waitUntil(
  //     caches.keys().then(cacheNames => {
  //       return Promise.all(
  //         cacheNames.map(cacheName => {
  //           if (cacheWhitelist.indexOf(cacheName) === -1) {
  //             return caches.delete(cacheName);
  //           }
  //         })
  //       );
  //     })
  //   );
  // });











// ==============================



// const CACHE_NAME = 'my-pwa-cache-v1';  
// const OFFLINE_URL = '/offline.html';  

// // Files to cache  
// const URLS_TO_CACHE = [  
//   '/',  
//   // Include other paths that need to be cached  
//   '/about',        // Example route  
//   '/styles/global.css',  // Your global CSS file  
//   '/icon.png',     // Your app icon  
//   '/badge.png',    // Notification badge  
// ];  

// // Install event - Cache resources  
// self.addEventListener('install', (event) => {  
//   event.waitUntil(  
//     caches.open(CACHE_NAME).then((cache) => {  
//       console.log('Caching app shell...');  
//       return cache.addAll(URLS_TO_CACHE);  
//     })  
//   );  
// });  

// // Fetch event - Serve cached resources or fallback to offline page  
// self.addEventListener('fetch', (event) => {  
//   event.respondWith(  
//     fetch(event.request)  
//       .then((response) => {  
//         // Check if we received a valid response  
//         if (!response || response.status !== 200 || response.type !== 'basic') {  
//           return response;  
//         }  

//         // Clone the response so we can use it in a cache and return it  
//         const responseToCache = response.clone();  

//         caches.open(CACHE_NAME).then((cache) => {  
//           cache.put(event.request, responseToCache);  
//         });  

//         return response;  
//       })  
//       .catch(() => {  
//         // If offline, return cached version or offline fallback  
//         return caches.match(event.request).then((cachedResponse) => {  
//           return cachedResponse || caches.match(OFFLINE_URL);  
//         });  
//       })  
//   );  
// });  

// // Push event - Handle incoming push notifications  
// self.addEventListener('push', function (event) {  
//   if (event.data) {  
//     const data = event.data.json();  
//     const options = {  
//       body: data.body,  
//       icon: data.icon || '/icon.png',  
//       badge: '/badge.png',  
//       vibrate: [100, 50, 100],  
//       data: {  
//         dateOfArrival: Date.now(),  
//         primaryKey: '2',  
//       },  
//     };  
//     event.waitUntil(self.registration.showNotification(data.title, options));  
//   }  
// });  

// // Notification click event - Handle interactions with notifications  
// self.addEventListener('notificationclick', function (event) {  
//   console.log('Notification click received.');  
//   event.notification.close();  
//   event.waitUntil(  
//     clients.openWindow('http://localhost:3000') // Change this to your app's main URL  
//   );  
// });  

// // Activation event - Cleanup old caches  
// self.addEventListener('activate', (event) => {  
//   const cacheWhitelist = [CACHE_NAME];  
//   event.waitUntil(  
//     caches.keys().then((cacheNames) => {  
//       return Promise.all(  
//         cacheNames.map((cacheName) => {  
//           if (!cacheWhitelist.includes(cacheName)) {  
//             return caches.delete(cacheName);  
//           }  
//         })  
//       );  
//     })  
//   );  
// });