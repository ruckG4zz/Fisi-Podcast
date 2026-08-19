/* =============================================================================
   FISI-Podcast-App — Service Worker
   -----------------------------------------------------------------------------
   Zweck: App-Hülle offline verfügbar halten (Installierbarkeit als PWA).

   WICHTIG zur Einordnung: Offline ist damit nur die OBERFLÄCHE plus der
   Skript-Text. Die Spracherkennung (STT) braucht trotzdem eine
   Internetverbindung, weil Chrome das Audio serverseitig verarbeitet.

   Die Sprachausgabe läuft seit 18.08.2026 ausschließlich über Google
   Cloud TTS — die Browser-Stimme wurde entfernt. Bereits gehörte
   Abschnitte bleiben trotzdem offline abspielbar, weil jedes Segment
   nach der ersten Synthese als fertige Audiodatei im Gerätespeicher
   (IndexedDB) liegt. Neue, noch nie gehörte Abschnitte brauchen Netz.
   ========================================================================== */

/* Cache-Name bei JEDER Änderung an den Dateien hochzählen — sonst liefert
   der Service Worker hartnäckig die alte Fassung aus. */
const CACHE = 'fisi-podcast-l1-v13';

const ASSETS = [
  './',
  './index.html',
  './content-l1.js',
  './content-l2.js',
  './content-l3.js',
  './matcher.js',
  './cloud-tts.js',
  './speech.js',
  './app.js',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      // einzeln adden: eine fehlende Datei soll nicht die ganze Installation kippen
      .then(c => Promise.all(ASSETS.map(u => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  if (url.origin !== location.origin) return;   // fremde Hosts nie cachen

  // Netz zuerst, Cache als Rückfall — so bekommt man Updates ohne Hard-Reload,
  // bleibt aber offline lauffähig.
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
  );
});
