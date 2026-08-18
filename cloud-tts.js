/* =============================================================================
   FISI-Podcast-App — Google Cloud Text-to-Speech Anbindung
   -----------------------------------------------------------------------------
   KOSTENREGEL (oberste Regel dieses Projekts, siehe Projekt-Notiz):
   Hier wird NIEMALS eigenstaendig Geld ausgegeben. Jeder Aufruf braucht

     (a) einen API-Schluessel, den ruckG4zz selbst erzeugt hat,
     (b) den er selbst in seinem eigenen Browser eingetragen hat,
     (c) und der nur dort im Geraetespeicher liegt — nie im Code, nie im Repo.

   Der Schluessel wird NICHT hier hinterlegt. Es gibt keinen eingebauten
   Standardschluessel und keinen Hintergrundprozess, der ohne aktives
   Zutun laeuft.

   KOSTENSCHUTZ IN DER ARCHITEKTUR:
   Podcast-Text ist statisch. Jedes Segment wird deshalb GENAU EINMAL
   synthetisiert und danach dauerhaft im Geraet zwischengespeichert
   (IndexedDB). Zweites Anhoeren desselben Kapitels kostet null Zeichen.
   Ausserdem wird jedes synthetisierte Zeichen mitgezaehlt und in der
   Oberflaeche sichtbar gemacht.

   PREISE (Stand 18.08.2026, recherchiert):
     WaveNet: 4 USD / 1 Mio. Zeichen, 1 Mio. Zeichen/Monat kostenlos
     Das komplette Layer-1-Skript hat ~21.000 Zeichen — also rund 2 % des
     monatlichen Freikontingents, und das auch nur beim allerersten Hoeren.
   ========================================================================== */

const CloudTTS = (() => {

  const ENDPOINT = 'https://texttospeech.googleapis.com/v1/text:synthesize';
  const DB_NAME  = 'fisi-podcast-audio';
  const STORE    = 'segments';
  const DB_VER   = 1;

  /* Freikontingent pro Monat je Stimmenklasse (Zeichen) */
  const FREI_KONTINGENT = { Wavenet: 1000000, Neural2: 1000000, Standard: 4000000, Studio: 100000, Chirp3: 1000000 };
  /* USD je 1 Mio. Zeichen oberhalb des Freikontingents */
  const PREIS_PRO_MIO   = { Wavenet: 4, Neural2: 16, Standard: 4, Studio: 160, Chirp3: 30 };

  let db = null;

  /* ---------------------------------------------------------------------
     Verbrauchszaehler — liegt im Geraetespeicher, monatlich zurueckgesetzt
     --------------------------------------------------------------------- */
  const ZAEHLER_KEY = 'fisi-podcast-tts-verbrauch';

  function monatsSchluessel() {
    const d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0');
  }

  function ladeZaehler() {
    try {
      const roh = JSON.parse(localStorage.getItem(ZAEHLER_KEY) || '{}');
      if (roh.monat !== monatsSchluessel()) {
        // Neuer Monat -> Freikontingent beginnt von vorn
        return { monat: monatsSchluessel(), zeichen: 0, aufrufe: 0, ausCache: 0 };
      }
      return { monat: roh.monat, zeichen: roh.zeichen || 0, aufrufe: roh.aufrufe || 0, ausCache: roh.ausCache || 0 };
    } catch (_) {
      return { monat: monatsSchluessel(), zeichen: 0, aufrufe: 0, ausCache: 0 };
    }
  }

  function speichereZaehler(z) {
    try { localStorage.setItem(ZAEHLER_KEY, JSON.stringify(z)); } catch (_) {}
  }

  function verbrauch(stimmenKlasse) {
    const z = ladeZaehler();
    const klasse = stimmenKlasse || 'Wavenet';
    const frei = FREI_KONTINGENT[klasse] || 1000000;
    const preis = PREIS_PRO_MIO[klasse] || 4;
    const ueber = Math.max(0, z.zeichen - frei);
    return {
      monat: z.monat,
      zeichen: z.zeichen,
      aufrufe: z.aufrufe,
      ausCache: z.ausCache,
      freiKontingent: frei,
      anteilProzent: Math.min(100, (z.zeichen / frei) * 100),
      kostenUSD: (ueber / 1000000) * preis,
      klasse
    };
  }

  function zaehlerZuruecksetzen() {
    speichereZaehler({ monat: monatsSchluessel(), zeichen: 0, aufrufe: 0, ausCache: 0 });
  }

  /* ---------------------------------------------------------------------
     Audio-Zwischenspeicher (IndexedDB) — spart Geld und ermoeglicht
     Wiedergabe ohne Netz beim zweiten Durchgang.
     --------------------------------------------------------------------- */
  function oeffneDB() {
    if (db) return Promise.resolve(db);
    return new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error('IndexedDB nicht verfügbar'));
      const req = indexedDB.open(DB_NAME, DB_VER);
      req.onupgradeneeded = () => {
        const d = req.result;
        if (!d.objectStoreNames.contains(STORE)) d.createObjectStore(STORE);
      };
      req.onsuccess = () => { db = req.result; resolve(db); };
      req.onerror   = () => reject(req.error || new Error('IndexedDB-Fehler'));
    });
  }

  async function ausCacheHolen(schluessel) {
    try {
      const d = await oeffneDB();
      return await new Promise((resolve) => {
        const tx = d.transaction(STORE, 'readonly');
        const rq = tx.objectStore(STORE).get(schluessel);
        rq.onsuccess = () => resolve(rq.result || null);
        rq.onerror   = () => resolve(null);
      });
    } catch (_) { return null; }
  }

  async function inCacheLegen(schluessel, dataUrl) {
    try {
      const d = await oeffneDB();
      await new Promise((resolve) => {
        const tx = d.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).put(dataUrl, schluessel);
        tx.oncomplete = resolve;
        tx.onerror    = resolve;   // Cache-Fehler darf nie die Wiedergabe stoppen
      });
    } catch (_) {}
  }

  async function cacheLeeren() {
    try {
      const d = await oeffneDB();
      await new Promise((resolve) => {
        const tx = d.transaction(STORE, 'readwrite');
        tx.objectStore(STORE).clear();
        tx.oncomplete = resolve;
        tx.onerror    = resolve;
      });
      return true;
    } catch (_) { return false; }
  }

  async function cacheGroesse() {
    try {
      const d = await oeffneDB();
      return await new Promise((resolve) => {
        const tx = d.transaction(STORE, 'readonly');
        const rq = tx.objectStore(STORE).count();
        rq.onsuccess = () => resolve(rq.result || 0);
        rq.onerror   = () => resolve(0);
      });
    } catch (_) { return 0; }
  }

  /* Kurzer, stabiler Hash als Cache-Schluessel (djb2) */
  function hash(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return (h >>> 0).toString(36);
  }

  /* ---------------------------------------------------------------------
     Synthese
     --------------------------------------------------------------------- */

  /**
   * Liefert eine abspielbare Data-URL (MP3) fuer den Text.
   * Nutzt den Cache, wenn moeglich — dann entstehen KEINE Kosten.
   *
   * @param {string} text
   * @param {object} opts  { apiKey, voice, rate, pitch }
   * @returns {Promise<{url:string, ausCache:boolean, zeichen:number}>}
   */
  async function synthese(text, opts = {}) {
    const roh = (text || '').trim();
    if (!roh) throw new Error('Kein Text zum Sprechen.');
    if (!opts.apiKey) throw new Error('Kein API-Schlüssel hinterlegt.');

    const stimme = opts.voice || 'de-DE-Wavenet-B';
    const rate   = opts.rate  != null ? opts.rate  : 1.0;
    const pitch  = opts.pitch != null ? opts.pitch : 0;

    const cacheKey = 'v1:' + stimme + ':' + rate + ':' + pitch + ':' + hash(roh);

    /* 1. Zuerst im Cache nachsehen — kostenlos. */
    const treffer = await ausCacheHolen(cacheKey);
    if (treffer) {
      const z = ladeZaehler();
      z.ausCache += roh.length;
      speichereZaehler(z);
      return { url: treffer, ausCache: true, zeichen: 0 };
    }

    /* 2. Nur wenn nichts im Cache liegt, wird tatsaechlich synthetisiert. */
    const antwort = await fetch(ENDPOINT + '?key=' + encodeURIComponent(opts.apiKey), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text: roh },
        voice: { languageCode: 'de-DE', name: stimme },
        audioConfig: { audioEncoding: 'MP3', speakingRate: rate, pitch: pitch }
      })
    });

    if (!antwort.ok) {
      let detail = '';
      try {
        const fehler = await antwort.json();
        detail = (fehler && fehler.error && fehler.error.message) || '';
      } catch (_) {}
      throw new Error(deutlicherFehler(antwort.status, detail));
    }

    const daten = await antwort.json();
    if (!daten.audioContent) throw new Error('Google hat kein Audio zurückgegeben.');

    const url = 'data:audio/mp3;base64,' + daten.audioContent;

    /* 3. Merken, damit dieser Text nie ein zweites Mal Geld kostet. */
    await inCacheLegen(cacheKey, url);

    const z = ladeZaehler();
    z.zeichen += roh.length;
    z.aufrufe += 1;
    speichereZaehler(z);

    return { url, ausCache: false, zeichen: roh.length };
  }

  function deutlicherFehler(status, detail) {
    if (status === 400 && /API key not valid/i.test(detail)) {
      return 'Der API-Schlüssel ist ungültig. Bitte prüfen und neu eintragen.';
    }
    if (status === 403) {
      if (/referer|referrer/i.test(detail)) {
        return 'Der Schlüssel ist auf andere Websites beschränkt. In der Google Cloud Console unter „Anmeldedaten" muss ' +
               location.origin + '/* als erlaubte Website eingetragen sein.';
      }
      if (/API has not been used|disabled/i.test(detail)) {
        return 'Die Text-to-Speech API ist für dieses Projekt nicht aktiviert.';
      }
      return 'Zugriff verweigert. ' + (detail || '');
    }
    if (status === 429) return 'Kontingent erschöpft oder zu viele Anfragen auf einmal.';
    return 'Google-Fehler ' + status + (detail ? ': ' + detail : '');
  }

  /* ---------------------------------------------------------------------
     Stimmenliste abrufen (kostenlos, zaehlt nicht als Synthese)
     --------------------------------------------------------------------- */
  async function stimmenListe(apiKey) {
    if (!apiKey) throw new Error('Kein API-Schlüssel hinterlegt.');
    const r = await fetch(
      'https://texttospeech.googleapis.com/v1/voices?languageCode=de-DE&key=' + encodeURIComponent(apiKey)
    );
    if (!r.ok) {
      let detail = '';
      try { const f = await r.json(); detail = (f && f.error && f.error.message) || ''; } catch (_) {}
      throw new Error(deutlicherFehler(r.status, detail));
    }
    const d = await r.json();
    return (d.voices || [])
      .filter(v => (v.languageCodes || []).some(l => l.startsWith('de')))
      .map(v => ({
        name: v.name,
        geschlecht: v.ssmlGender,
        klasse: klasseAusName(v.name)
      }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function klasseAusName(name) {
    if (/Chirp3?-?HD/i.test(name)) return 'Chirp3';
    if (/Studio/i.test(name))      return 'Studio';
    if (/Neural2/i.test(name))     return 'Neural2';
    if (/Wavenet/i.test(name))     return 'Wavenet';
    if (/Polyglot/i.test(name))    return 'Wavenet';
    return 'Standard';
  }

  /**
   * Schaetzt die Kosten fuer eine geplante Menge Text, OHNE etwas zu senden.
   * Reine Rechenhilfe zur Transparenz vor dem ersten Durchlauf.
   */
  function kostenSchaetzung(zeichen, stimmenKlasse) {
    const klasse = stimmenKlasse || 'Wavenet';
    const z = ladeZaehler();
    const frei = FREI_KONTINGENT[klasse] || 1000000;
    const preis = PREIS_PRO_MIO[klasse] || 4;
    const nachher = z.zeichen + zeichen;
    const ueber = Math.max(0, nachher - frei) - Math.max(0, z.zeichen - frei);
    return {
      zeichen,
      restFreiVorher: Math.max(0, frei - z.zeichen),
      kostenUSD: (ueber / 1000000) * preis,
      klasse
    };
  }

  return {
    synthese, stimmenListe, verbrauch, zaehlerZuruecksetzen,
    cacheLeeren, cacheGroesse, kostenSchaetzung, klasseAusName,
    FREI_KONTINGENT, PREIS_PRO_MIO
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = { CloudTTS };
