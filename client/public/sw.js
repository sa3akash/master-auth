

self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: data.icon || "/icon.png",
      badge: "/badge.png",
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: "2",
        url: data.url || "http://localhost:4000?key=dinamic",
      },
    };
    event.waitUntil(self.registration.showNotification(data.title, options));
  }
});

// self.addEventListener('notificationclick', function (event) {
//   console.log('Notification click received.')
//   console.log(event)
//   event.notification.close()
//   event.waitUntil(clients.openWindow('http://localhost:3000'))
// })

self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  console.log(event);

  const urlToOpen = event.notification.data.url; // Get the dynamic URL
  event.notification.close(); // Close the notification

  event.waitUntil(
    clients.matchAll({ type: "window" }).then((clientList) => {
      // Check if there is an open window for the app
      for (const client of clientList) {
        // If a window is already open, focus it and navigate to the URL
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus().then(() => client.navigate(urlToOpen));
        }
      }
      // If no windows are open, open a new one
      return clients.openWindow(urlToOpen);
    })
  );
});
