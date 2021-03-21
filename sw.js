self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('v1').then((cache) => {
      return cache.addAll([
        './index.html',
        './frequency.html',
        './soundtrack.html',
        './common.js',
        './style.css',
        './sketch.js',
        './p5/p5.js',
        './p5/addons/p5.sound.js',
        './fonts/ShareTechMono-Regular.ttf',
        './fonts/Teko-Regular.ttf',
        './sounds/weatherwarlock.mp3',
        './sounds/raymondscott-musicbox.mp3',
        './kube/dist/css/kube.css',
      ]);
    })
  );
});