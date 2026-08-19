/* =============================================================================
   Testlauf der Sprach-Abstraktionsschicht —  node test-speech.js
   -----------------------------------------------------------------------------
   KOMPLETT NEU GESCHRIEBEN am 18.08.2026.

   Die alte Fassung pruefte das Verhalten der Browser-Stimme (Web Speech API)
   und deren Chrome-Eigenheiten. Diese Stimme wurde auf ausdrueckliche Ansage
   von ruckG4zz entfernt — die Tests dazu waren damit gegenstandslos und
   wurden nicht "repariert", sondern ersetzt. Was jetzt geprueft wird:

     1. Aussprache-Korrekturen greifen — und zwar JETZT AUCH fuer die
        Cloud-Stimme. Frueher bekam nur die Browser-Stimme sie ab, an
        Google ging der Rohtext.

     2. Ohne API-Schluessel kommt KEIN Ton und eine klare Meldung.
        Es darf keinen stillen Ersatz mehr geben.

     3. Ein Cloud-Fehler wird nach oben gereicht statt verschluckt.

     4. WICHTIGSTER TEST: Vorabladen und Abspielen muessen exakt denselben
        Eintrag im Zwischenspeicher treffen. Waeren die Texte auch nur
        minimal verschieden, wuerde jedes Segment ZWEIMAL synthetisiert —
        das Vorabladen waere nicht nur wirkungslos, es wuerde das
        Monatskontingent verdoppeln. Genau das faengt dieser Test ab.

     5. stop() waehrend der Synthese verhindert, dass der Ton danach
        trotzdem noch losspielt.

   Die echte cloud-tts.js wird mitgeladen (nicht nachgebaut), damit der
   Zwischenspeicher wirklich getestet wird und nicht eine Attrappe davon.
   ========================================================================== */

const fs   = require('fs');
const path = require('path');
const vm   = require('vm');

let pass = 0, fail = 0;
const fails = [];

function ok(name, cond, detail) {
  if (cond) { pass++; console.log('  OK    ' + name); }
  else { fail++; console.log('  FEHLT ' + name); fails.push(`  ${name}${detail ? '\n      ' + detail : ''}`); }
}

/* ---------------------------------------------------------------------------
   Browser-Umgebung nachbilden
   --------------------------------------------------------------------------- */
function makeEnv() {
  const store = {};
  const localStorage = {
    getItem: k => (k in store ? store[k] : null),
    setItem: (k, v) => { store[k] = String(v); },
    removeItem: k => { delete store[k]; }
  };

  const daten = new Map();
  function fakeRequest(ergebnis) {
    const r = { result: ergebnis, onsuccess: null, onerror: null };
    setTimeout(() => { if (r.onsuccess) r.onsuccess(); }, 0);
    return r;
  }
  const indexedDB = {
    open() {
      const req = { result: null, onupgradeneeded: null, onsuccess: null, onerror: null };
      req.result = {
        objectStoreNames: { contains: () => true },
        createObjectStore: () => {},
        transaction() {
          const tx = { oncomplete: null, onerror: null };
          return {
            objectStore: () => ({
              get:   k => fakeRequest(daten.get(k)),
              put:   (v, k) => { daten.set(k, v); return fakeRequest(true); },
              count: () => fakeRequest(daten.size),
              clear: () => { daten.clear(); return fakeRequest(true); }
            }),
            get oncomplete() { return tx.oncomplete; },
            set oncomplete(f) { tx.oncomplete = f; setTimeout(() => f && f(), 0); },
            set onerror(f) { tx.onerror = f; }
          };
        }
      };
      setTimeout(() => { if (req.onsuccess) req.onsuccess(); }, 0);
      return req;
    }
  };

  const aufrufe = [];
  let antwortModus = 'ok';

  async function fetchMock(url, init) {
    aufrufe.push({ url, init });
    if (antwortModus === 'ok') {
      return { ok: true, status: 200, json: async () => ({ audioContent: 'QUJDREVG' }) };
    }
    return { ok: false, status: 403, json: async () => ({ error: { message: 'Requests from referer are blocked.' } }) };
  }

  /* Audio-Attrappe: spielt "ab" und meldet nach kurzer Zeit 'ended'. */
  const gespielt = [];
  class FakeAudio {
    constructor() {
      this.paused = true; this.src = ''; this.volume = 1;
      this.currentTime = 0; this.ended = false;
      this._h = {};
    }
    addEventListener(t, f) { (this._h[t] = this._h[t] || []).push(f); }
    removeEventListener(t, f) {
      if (!this._h[t]) return;
      this._h[t] = this._h[t].filter(x => x !== f);
    }
    setAttribute() {}
    _feuer(t) { (this._h[t] || []).slice().forEach(f => f()); }
    play() {
      this.paused = false;
      gespielt.push(this.src);
      setTimeout(() => { if (!this.paused) { this.ended = true; this._feuer('ended'); } }, 5);
      return Promise.resolve();
    }
    pause() { this.paused = true; }
  }

  const navigatorMock = {
    userAgent: 'Mozilla/5.0 (Linux; Android 14) Chrome/120 Mobile',
    permissions: { query: async () => ({ state: 'granted' }) },
    mediaDevices: { getUserMedia: async () => ({ getTracks: () => [{ stop() {} }] }) }
  };

  const windowMock = { indexedDB };

  const ctx = {
    console, setTimeout, clearTimeout, Date, Math, JSON,
    module: { exports: {} },
    localStorage, indexedDB, fetch: fetchMock,
    encodeURIComponent,
    Audio: FakeAudio,
    navigator: navigatorMock,
    window: windowMock,
    location: { origin: 'https://ruckg4zz.github.io' }
  };
  ctx.globalThis = ctx;
  vm.createContext(ctx);

  vm.runInContext(fs.readFileSync(path.join(__dirname, 'cloud-tts.js'), 'utf8'), ctx, { filename: 'cloud-tts.js' });
  vm.runInContext(fs.readFileSync(path.join(__dirname, 'speech.js'), 'utf8'), ctx, { filename: 'speech.js' });

  return {
    Speech:   vm.runInContext('Speech', ctx),
    CloudTTS: vm.runInContext('CloudTTS', ctx),
    aufrufe, gespielt, daten,
    setModus: m => { antwortModus = m; }
  };
}

const warte = ms => new Promise(r => setTimeout(r, ms));

(async () => {

  console.log('=== 1. Aussprache-Korrekturen (jetzt auch fuer die Cloud) ===');
  {
    const { Speech } = makeEnv();
    const f = Speech._fixForTTS;
    ok('LWL wird buchstabiert',      f('Ein LWL Kabel').includes('L-W-L'));
    ok('IEEE wird aufgeloest',       f('Norm IEEE 802.3').includes('I-Triple-E'));
    ok('10BASE-T wird lesbar',       /10 Base T/.test(f('10BASE-T')));
    ok('Mikrometer statt Zeichen',   f('50 µm Faser').includes('Mikrometer'));
    ok('CSMA/CD wird getrennt',      f('nutzt CSMA/CD hier').includes('C-S-M-A C-D'));
    ok('normaler Text bleibt heil',  f('Das ist ein Satz.') === 'Das ist ein Satz.');
  }

  /* -------------------------------------------------------------------------
     1c. OSI — Aussprache (19.08.2026)
     -------------------------------------------------------------------------
     Von ruckG4zz als "klingt wild" gemeldet. Statt 'O-S-I' stehen jetzt die
     deutschen Buchstabennamen ausgeschrieben da. Zusaetzlich abgesichert:
     die Bindestrich-Form muss VOR der Wortform greifen, sonst bliebe in
     "OSI-Modell" ein doppelter Bindestrich stehen und die Stimme liest ihn
     als Pause mitten im Wort.

     ZWEITER ANLAUF 19.08.2026: die erste Fassung stand auf 'Oh-Ess-Ih' und
     wurde von ruckG4zz als schlechter als vorher gemeldet — das "h" wurde
     mitgesprochen. Der Test haelt jetzt ausdruecklich fest, dass am Ende
     KEIN "h" mehr stehen darf. Sonst schleicht es sich beim naechsten
     Feinschliff wieder ein.
     ------------------------------------------------------------------------- */
  console.log('=== 1c. OSI-Aussprache ===');
  {
    const { Speech } = makeEnv();
    const f = Speech._fixForTTS;

    ok('OSI wird ausgeschrieben',    f('nach dem OSI Standard').includes('Oh-Ess-I'));
    ok('kein O-S-I mehr',            !/O-S-I/.test(f('nach dem OSI Standard')));
    ok('OSI-Modell sauber getrennt', f('das OSI-Modell').includes('Oh-Ess-I Modell'));
    ok('kein doppelter Bindestrich', !/I-Modell/.test(f('das OSI-Modell')));
    ok('OSI-Referenzmodell greift',  f('dem OSI-Referenzmodell folgen').includes('Oh-Ess-I Referenzmodell'));
    /* Das "h" war der konkrete Hoerbefund — es wurde mitgesprochen. */
    ok('kein mitgesprochenes h',     !/Ess-Ih/.test(f('das OSI-Modell und OSI allgemein')));
    /* Gegenprobe: die Regel darf nicht in beliebige Woerter hineingreifen. */
    ok('greift nicht in Woerter',    f('eine Position im Osiris Modul').includes('Osiris'));
  }

  /* -------------------------------------------------------------------------
     1b. NEU MIT LAYER 2 UND 3 — die Reihenfolge in TTS_FIX ist eine Falle
     -------------------------------------------------------------------------
     Layer 2 und 3 bringen ein Vielfaches an Abkuerzungen mit, und mehrere
     davon stecken ineinander: IP in IPv4, IP in TCP/IP, STP in RSTP, HTTP
     in HTTPS, WPA in WPA2. Greift die kurze Regel zuerst, bleibt ein halb
     ersetzter Rest stehen — und der wird dann woertlich vorgelesen.

     Diese Tests halten genau diese Reihenfolge fest. Sie sind der Grund,
     warum die IP-Regeln in speech.js NACH der TCP/IP-Regel stehen.
     ------------------------------------------------------------------------- */
  console.log('=== 1b. Abkuerzungen aus Layer 2 und 3 (Reihenfolge-Fallen) ===');
  {
    const { Speech } = makeEnv();
    const f = Speech._fixForTTS;

    /* Die Falle: ein zu frueh angewandtes \bIP\b wuerde "TCP/IP" zerlegen,
       bevor die TCP/IP-Regel greifen kann. */
    ok('TCP/IP bleibt als Ganzes',   f('im TCP/IP Modell').includes('T-C-P I-P'));
    ok('TCP/IP nicht halb zerlegt',  !/TCP\/I-P/.test(f('im TCP/IP Modell')));
    ok('TCP allein wird buchstabiert', f('mit TCP oder UDP').includes('T-C-P'));

    ok('IPv4 wird gesprochen',       f('eine IPv4 Adresse').includes('I-P vier'));
    ok('IPv6 wird gesprochen',       f('eine IPv6 Adresse').includes('I-P sechs'));
    ok('IPv4 nicht halb ersetzt',    !/I-Pv4|IPv4/.test(f('eine IPv4 Adresse')));
    ok('IP allein wird buchstabiert', f('die IP Adresse').includes('I-P Adresse'));
    ok('IPsec bleibt zusammen',      f('mit IPsec gesichert').includes('I-P-Sec'));
    ok('ICMPv6 bleibt zusammen',     f('laeuft ueber ICMPv6 hier').includes('I-C-M-P für I-P sechs'));

    ok('RSTP wird buchstabiert',     f('nutzt RSTP heute').includes('R-S-T-P'));
    ok('RSTP nicht von STP zerlegt', !/R-S-T-P-/.test(f('nutzt RSTP heute')));
    ok('STP bleibt eigenstaendig',   f('das STP Kabel').includes('S-T-P'));

    ok('HTTPS vor HTTP',             f('ueber HTTPS gekapselt').includes('H-T-T-P-S'));
    ok('WPA3 wird gesprochen',       f('mit WPA3 gesichert').includes('W-P-A drei'));
    ok('WPA2 wird gesprochen',       f('mit WPA2 gesichert').includes('W-P-A zwei'));
    ok('WPA allein wird gesprochen', f('das alte WPA war unsicher').includes('W-P-A '));
    ok('VLAN wird getrennt',         f('ein VLAN Tag').includes('V-LAN'));
    ok('WLAN bleibt unangetastet',   f('das WLAN hier').includes('WLAN'));
    ok('FCS wird buchstabiert',      f('die FCS pruefsumme').includes('F-C-S'));
    ok('BPDU wird buchstabiert',     f('die BPDU Nachricht').includes('B-P-D-U'));
    ok('OSPF wird buchstabiert',     f('mit OSPF geroutet').includes('O-S-P-F'));
    ok('NAT bleibt Wort',            f('macht NAT dafuer').includes('NAT'));
    ok('deutscher Satz unveraendert',
      f('Der Switch lernt die Adresse.') === 'Der Switch lernt die Adresse.');
  }

  console.log('=== 2. Ohne Schluessel: kein Ton, klare Meldung ===');
  {
    const { Speech, aufrufe, gespielt } = makeEnv();
    Speech.setCloudConfig({ apiKey: null });

    const r = await Speech.speak('Testsatz.', { voice: 'a' });
    ok('meldet abgebrochen',            r.stopped === true);
    ok('nennt den fehlenden Schluessel', r.error === 'kein-schluessel', 'error=' + r.error);
    ok('Meldung ist verstaendlich',     /Schlüssel/i.test(r.cloudFehler || ''));
    ok('es wurde NICHTS an Google gesendet', aufrufe.length === 0, 'aufrufe=' + aufrufe.length);
    ok('es wurde kein Ton abgespielt',  gespielt.length === 0, 'gespielt=' + gespielt.length);
    ok('Fehler ist auch spaeter abrufbar', /Schlüssel/i.test(Speech.letzterFehler() || ''));
  }

  console.log('=== 3. Cloud-Fehler wird gemeldet, nicht verschluckt ===');
  {
    const { Speech, setModus, gespielt } = makeEnv();
    Speech.setCloudConfig({ apiKey: 'TESTKEY' });
    setModus('referer');

    const r = await Speech.speak('Testsatz.', { voice: 'a' });
    ok('meldet abgebrochen',        r.stopped === true);
    ok('kennzeichnet Cloud-Fehler', r.error === 'cloud-fehler', 'error=' + r.error);
    ok('Klartext statt Fehlercode', /Website|beschränkt/i.test(r.cloudFehler || ''), r.cloudFehler);
    ok('KEIN Ersatzton abgespielt', gespielt.length === 0, 'gespielt=' + gespielt.length);
  }

  console.log('=== 4. Erfolgreiches Sprechen ===');
  {
    const { Speech, aufrufe, gespielt } = makeEnv();
    Speech.setCloudConfig({ apiKey: 'TESTKEY' });

    const r = await Speech.speak('Ein kurzer Satz.', { voice: 'a' });
    ok('laeuft sauber durch',    r.stopped === false, JSON.stringify(r));
    ok('genau ein Google-Aufruf', aufrufe.length === 1, 'aufrufe=' + aufrufe.length);
    ok('Ton wurde abgespielt',   gespielt.length === 1);
    ok('kein Fehler gemerkt',    Speech.letzterFehler() === null);
  }

  console.log('=== 5. KERNTEST: Vorabladen trifft denselben Cache-Eintrag ===');
  {
    const { Speech, aufrufe } = makeEnv();
    Speech.setCloudConfig({ apiKey: 'TESTKEY' });

    const text = 'Mhm. Das LWL Kabel schafft zehn Gigabit.';

    /* So laeuft es in app.js: erst wird vorgeladen, danach gesprochen. */
    const vorab = await Speech.prefetch(text, { voice: 'b' });
    ok('Vorabladen liefert eine Tonquelle', !!vorab);
    ok('Vorabladen loest genau eine Synthese aus', aufrufe.length === 1, 'aufrufe=' + aufrufe.length);

    const r = await Speech.speak(text, { voice: 'b' });
    ok('Abspielen laeuft durch', r.stopped === false);
    ok('Abspielen loest KEINE zweite Synthese aus — sonst doppelter Verbrauch',
       aufrufe.length === 1, 'aufrufe=' + aufrufe.length + ' (haette 1 bleiben muessen)');

    /* Gegenprobe: andere Stimme MUSS ein eigener Eintrag sein. */
    await Speech.speak(text, { voice: 'a' });
    ok('andere Stimme ist ein eigener Eintrag', aufrufe.length === 2, 'aufrufe=' + aufrufe.length);
  }

  console.log('=== 6. Vorabladen ohne Schluessel sendet nichts ===');
  {
    const { Speech, aufrufe } = makeEnv();
    Speech.setCloudConfig({ apiKey: null });
    const r = await Speech.prefetch('Irgendein Satz.', { voice: 'a' });
    ok('liefert nichts zurueck', r === null);
    ok('sendet garantiert nichts', aufrufe.length === 0, 'aufrufe=' + aufrufe.length);
  }

  console.log('=== 7. stop() waehrend der Synthese ===');
  {
    const { Speech, gespielt } = makeEnv();
    Speech.setCloudConfig({ apiKey: 'TESTKEY' });

    /* stop() faellt in das Zeitfenster zwischen Anfrage und Wiedergabe.
       Ohne den Generationszaehler wuerde der Ton danach TROTZDEM losspielen
       — der Podcast haette beim Mikrofondruck einfach weitergeredet. */
    const p = Speech.speak('Wird abgebrochen.', { voice: 'a' });
    Speech.stop();
    const r = await p;

    ok('loest trotzdem auf (kein Haenger)', r && typeof r === 'object');
    ok('meldet korrekt abgebrochen', r.stopped === true, JSON.stringify(r));
    ok('es wurde kein Ton abgespielt', gespielt.length === 0, 'gespielt=' + gespielt.length);
  }

  /* -------------------------------------------------------------------------
     8. WIEDERERKENNUNGSWERT — beide Sprecher muessen ueber alle Schichten
        hinweg dieselben bleiben.
     -------------------------------------------------------------------------
     Diese Tests sichern die Voreinstellung im CODE ab, nicht die Auswahl im
     Geraetespeicher. Genau da lag der Fehler, der in der Layer-2/3-Session
     auffiel: gehoert wurde Achernar, im Code stand aber noch Studio-C. Auf
     einem frischen Geraet oder nach dem Loeschen der Browserdaten haette der
     Podcast damit ploetzlich mit einer anderen Frauenstimme gesprochen.
     ------------------------------------------------------------------------- */
  console.log('=== 8. Stimmen-Voreinstellung (Wiedererkennungswert) ===');
  {
    const { Speech } = makeEnv();
    const i = Speech.voiceInfo();
    ok('Stimme A ist Chirp3-HD-Enceladus', i.a === 'de-DE-Chirp3-HD-Enceladus', i.a);
    ok('Stimme B ist Chirp3-HD-Achernar',  i.b === 'de-DE-Chirp3-HD-Achernar', i.b);
    ok('Klasse A korrekt erkannt',         i.klasseA === 'Chirp3', i.klasseA);
    ok('Klasse B korrekt erkannt',         i.klasseB === 'Chirp3', i.klasseB);
    ok('beide Stimmen derselben Klasse',   i.klasseA === i.klasseB);
    ok('Chirp3 wird als SSML-unfaehig gefuehrt (A)', i.ssmlA === false);
    ok('Chirp3 wird als SSML-unfaehig gefuehrt (B)', i.ssmlB === false);
    ok('fehlender Schluessel wird gemeldet',     i.schluessel === false);

    /* Beide Voreinstellungen muessen auch in app.js identisch stehen —
       sonst laufen Sprachschicht und Oberflaeche auseinander. */
    const appQuelle = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
    ok('app.js kennt dieselbe Stimme A',
      /STIMME_A_STANDARD\s*=\s*'de-DE-Chirp3-HD-Enceladus'/.test(appQuelle));
    ok('app.js kennt dieselbe Stimme B',
      /STIMME_B_STANDARD\s*=\s*'de-DE-Chirp3-HD-Achernar'/.test(appQuelle));
    ok('kein Studio-C mehr als Voreinstellung',
      !/STIMME_[AB]_STANDARD\s*=\s*'de-DE-Studio/.test(appQuelle));
  }

  console.log('=== 9. Keine Spur der Browser-Stimme mehr ===');
  {
    const quelle = fs.readFileSync(path.join(__dirname, 'speech.js'), 'utf8');
    /* Nur ausserhalb von Kommentaren suchen — im Kopf steht bewusst
       beschrieben, WARUM die Browser-Stimme entfernt wurde. */
    const ohneKommentare = quelle
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/(^|[^:])\/\/.*$/gm, '$1');

    ok('kein speechSynthesis mehr',        !/speechSynthesis/.test(ohneKommentare));
    ok('keine SpeechSynthesisUtterance',   !/SpeechSynthesisUtterance/.test(ohneKommentare));
    ok('Spracherkennung ist noch da',      /SpeechRecognition/.test(ohneKommentare));
    ok('kein stiller Rueckfall im Code',   !/speakBrowser/.test(ohneKommentare));
  }

  await warte(20);

  console.log('\n' + '-'.repeat(50));
  console.log('Tests bestanden:      ' + pass);
  console.log('Tests fehlgeschlagen: ' + fail);
  if (fails.length) {
    console.log('\nFEHLER:');
    fails.forEach(f => console.log(f));
  }
  process.exit(fail ? 1 : 0);
})();
