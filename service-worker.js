const CACHE_NAME = 'newtea-cache-v2';

// Ajout du dossier racine './' et de 'index.html' en minuscules
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192x192.png',
  './icon-512x512.png'
  './tuto.html'
  './translations.js'
];

// Installation du service worker et mise en cache des fichiers
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Fichiers mis en cache avec succès');
        return cache.addAll(urlsToCache);
      })
  );
  // Force le nouveau service worker à s'activer immédiatement
  self.skipWaiting();
});

// Interception des requêtes réseau
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Retourne la version en cache si elle existe (mode hors-ligne)
        if (response) {
          return response;
        }
        
        // Comportement de repli : si on navigue vers une URL introuvable mais qu'on est hors-ligne
        // on renvoie l'index.html
        if (event.request.mode === 'navigate') {
          return caches.match('./index.html');
        }

        // Sinon, fait la requête réseau normale
        return fetch(event.request);
      })
  );
});

// Nettoyage des anciens caches lors des mises à jour
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
  self.clients.claim();
});
