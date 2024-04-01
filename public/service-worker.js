self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(
      "ticTacToesCache".then((cache) => {
        return cache.addAll([
          "/",
          "/index.html",
          "/manifest.json",
          "logo-512.png",
          "logo-196.png",
        ]);
      }),
    ),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    }),
  );
});
