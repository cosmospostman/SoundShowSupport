self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        './index.html',
        './style.css',
        './sketch.js',
        './p5/p5.js',
        './p5/addons/p5.sound.js',
      ]);
    })
  );
});