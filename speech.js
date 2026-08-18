/* =============================================================================
   FISI-Podcast-App — Sprach-Abstraktionsschicht
   -----------------------------------------------------------------------------
   Der Rest der App kennt nur:

       Speech.speak(text, {voice:'a'|'b'})   -> Promise (resolved wenn fertig)
       Speech.prefetch(text, {voice:...})    -> laedt das NAECHSTE Segment vor
       Speech.stop()
       Speech.pause() / Speech.resume()
       Speech.listen()                       -> Promise<string> (Transkript)
       Speech.cancelListen()
       Speech.init()                         -> Promise (Startdiagnose)
       Speech.voiceInfo()                    -> Diagnose fuer die UI

   -----------------------------------------------------------------------------
   AENDERUNG 18.08.2026 (auf ausdrueckliche Ansage von ruckG4zz):

   Die Browser-Stimme (Web Speech API / speechSynthesis) ist als Sprachausgabe
   KOMPLETT ENTFERNT. Es gibt keinen stillen Rueckfall mehr.

   Warum das gewollt ist: der bisherige Rueckfall hat Cloud-Fehler unsichtbar
   gemacht. Man hoerte etwas, es klang nur schlechter — und niemand konnte
   sagen warum. Jetzt gilt: geht die Cloud nicht, kommt KEIN Ton, dafuer eine
   klare Fehlermeldung. Lieber ehrliche Stille als heimlich schlechtere Qualitaet.

   Folge, die man kennen muss: ohne eingetragenen API-Schluessel spricht die
   App gar nicht. Das ist Absicht, kein Defekt.

   Die SPRACHERKENNUNG (SpeechRecognition) bleibt unveraendert erhalten —
   die ist kostenlos, funktioniert gut und hat mit der Ausgabe nichts zu tun.
   ========================================================================== */

const Speech = (() => {

  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  let recognition = null;

  /* Zaehler zum Entwerten laufender UND erst geplanter Sprechvorgaenge.
     Zwischen speak() und dem tatsaechlichen Abspielen liegt ein await
     (Cache-Zugriff oder Google-Anfrage) — ein stop() in genau diesem
     Fenster wuerde sonst wirkungslos verpuffen und die Ausgabe liefe
     trotzdem los. */
  let speakGen = 0;

  /* ---------------------------------------------------------------------
     Aussprache-Korrekturen
     Der Skript-Text bleibt lesbar; hier wird zentral repariert, was eine
     deutsche TTS-Stimme sonst verstuemmelt.

     WICHTIG — das ist neu: diese Tabelle wurde frueher NUR auf die
     Browser-Stimme angewendet, die Cloud-Stimme bekam den Rohtext.
     "LWL" ging also ungefiltert an Google. Jetzt laeuft jeder Text hier
     durch, egal welche Stimme.
     --------------------------------------------------------------------- */
  const TTS_FIX = [
    [/\bLWL\b/g,        'L-W-L'],
    [/\bIEEE\b/g,       'I-Triple-E'],
    [/\bRJ45\b/g,       'R-J-45'],
    [/\bUTP\b/g,        'U-T-P'],
    [/\bSTP\b/g,        'S-T-P'],
    [/\bSFP\b/g,        'S-F-P'],
    [/\bPDU\b/g,        'P-D-U'],
    [/\bSV\b/g,         'S-V'],
    [/\bGV\b/g,         'G-V'],
    [/\bEV\b/g,         'E-V'],
    [/\bMM\b/g,         'M-M'],
    [/\bSM\b/g,         'S-M'],
    [/\bOM3\b/g,        'O-M-3'],
    [/\bOM4\b/g,        'O-M-4'],
    [/\bFDDI\b/g,       'F-D-D-I'],
    [/\bVCSEL\b/g,      'Wixel'],
    [/\bNFC\b/g,        'N-F-C'],
    [/\bCSMA\/CD\b/g,   'C-S-M-A C-D'],
    [/\bCSMA\/CA\b/g,   'C-S-M-A C-A'],
    [/\bMAC\b/g,        'Mac'],
    [/\bTCP\/IP\b/g,    'T-C-P I-P'],
    [/\bOSI\b/g,        'O-S-I'],

    /* ---------------------------------------------------------------
       LAYER 2 (Sicherungsschicht) — Abkuerzungen, die eine deutsche
       Stimme sonst als Kunstwort verschluckt.

       BEWUSST NICHT AUFGENOMMEN, weil sie im Deutschen als Wort
       gesprochen werden und moderne Stimmen das von selbst treffen:
       LAN, WLAN, VLAN-Bestandteil "LAN", CAM, WEP, TKIP, ARP, NAT, PAT,
       RIP, APIPA, SLAAC. Eine "Korrektur" auf Verdacht wuerde diese
       Faelle eher verschlechtern — dieselbe Linie wie bei ENGLISCH_FIX.
       --------------------------------------------------------------- */
    [/\bVLAN\b/g,       'V-LAN'],
    /* "STP" steht schon weiter oben (dort fuer Shielded Twisted Pair aus
       Layer 1). Die Regel dort greift NICHT in "RSTP", weil davor ein
       Wortzeichen steht — die Wortgrenze rettet uns hier. */
    [/\bRSTP\b/g,       'R-S-T-P'],
    [/\bBPDU\b/g,       'B-P-D-U'],
    [/\bFCS\b/g,        'F-C-S'],
    [/\bCRC\b/g,        'C-R-C'],
    [/\bOUI\b/g,        'O-U-I'],
    [/\bSFD\b/g,        'S-F-D'],
    [/\bMTU\b/g,        'M-T-U'],
    [/\bSSID\b/g,       'S-S-I-D'],
    [/\bWPA3\b/g,       'W-P-A drei'],    // vor WPA
    [/\bWPA2\b/g,       'W-P-A zwei'],
    [/\bWPA\b/g,        'W-P-A'],
    [/\bAES\b/g,        'A-E-S'],
    [/\bCCMP\b/g,       'C-C-M-P'],
    [/\bGCMP\b/g,       'G-C-M-P'],
    [/\bSAE\b/g,        'S-A-E'],
    [/\bRTS\/CTS\b/g,   'R-T-S C-T-S'],
    [/\bASCII\b/g,      'Aski'],

    /* ---------------------------------------------------------------
       LAYER 3 (Vermittlungsschicht)
       Reihenfolge ist hier bedeutungstragend: die langen IP-Varianten
       muessen VOR dem blossen "IP" stehen, und "IP" selbst muss NACH
       der TCP/IP-Regel oben kommen — sonst zerlegt es "TCP/IP", bevor
       die dortige Regel greifen kann.
       --------------------------------------------------------------- */
    [/\bICMPv6\b/g,     'I-C-M-P für I-P sechs'],
    [/\bIPv4\b/g,       'I-P vier'],
    [/\bIPv6\b/g,       'I-P sechs'],
    [/\bIPsec\b/gi,     'I-P-Sec'],
    [/\bIP\b/g,         'I-P'],
    [/\bICMP\b/g,       'I-C-M-P'],
    [/\bIGMP\b/g,       'I-G-M-P'],
    [/\bNDP\b/g,        'N-D-P'],
    [/\bNAPT\b/g,       'N-A-P-T'],
    [/\bTTL\b/g,        'T-T-L'],
    [/\bVLSM\b/g,       'V-L-S-M'],
    [/\bOSPF\b/g,       'O-S-P-F'],
    [/\bBGP\b/g,        'B-G-P'],
    [/\bEIGRP\b/g,      'E-I-G-R-P'],
    [/\bRFC\b/g,        'R-F-C'],
    [/\bDHCP\b/g,       'D-H-C-P'],
    [/\bDNS\b/g,        'D-N-S'],
    [/\bRDP\b/g,        'R-D-P'],
    [/\bESP\b/g,        'E-S-P'],
    [/\bTLS\b/g,        'T-L-S'],
    [/\bIKE\b/g,        'I-K-E'],
    [/\bRSA\b/g,        'R-S-A'],
    [/\bSSH\b/g,        'S-S-H'],
    [/\bHTTPS\b/g,      'H-T-T-P-S'],
    [/\bHTTP\b/g,       'H-T-T-P'],       // nach HTTPS
    [/\bUDP\b/g,        'U-D-P'],
    [/\bTCP\b/g,        'T-C-P'],         // nach der TCP/IP-Regel oben
    [/\bCDN\b/g,        'C-D-N'],
    [/(\d)BASE-/g,      '$1 Base '],   // 10BASE-T -> 10 Base T
    [/\bBASE-/g,        'Base '],
    [/µm/g,             'Mikrometer'],
    [/\bGbit\/s\b/g,    'Gigabit pro Sekunde'],
    [/\bMbit\/s\b/g,    'Megabit pro Sekunde'],
    [/\bGHz\b/g,        'Gigahertz'],
    [/ — /g,            ', '],          // Gedankenstrich -> Sprechpause
    [/ – /g,            ', '],
    /* Kapiteltitel wie "ARP & NDP" oder "Kurzübersicht & Übergang" werden
       ueber den Uebersichts-Befehl vorgelesen. Ob eine Stimme das Zeichen
       selbst aufloest, ist nicht garantiert — hier wird es deshalb sicher
       ausgeschrieben, statt darauf zu vertrauen. */
    [/ & /g,            ' und '],
    [/\s+/g,            ' ']
  ];

  /* ---------------------------------------------------------------------
     ENGLISCHE FACHBEGRIFFE — Aussprache-Feinschliff
     -----------------------------------------------------------------------
     Ziel (Vorgabe ruckG4zz): deutsche Begriffe bleiben deutsch, aber ein
     REINER englischer Fachbegriff soll auch englisch klingen, statt steif
     eingedeutscht vorgelesen zu werden.

     Der saubere Weg waere SSML mit <lang xml:lang="en-US">. Genau das
     unterstuetzt aber KEINE der beiden gewaehlten Stimmen: Chirp3-HD kann
     gar kein SSML, und Studio unterstuetzt SSML ausdruecklich OHNE <lang>.
     (Google-Doku, geprueft 18.08.2026.)

     Bleibt die lautschriftliche Umschreibung — deutsch gelesen ergibt den
     englischen Klang.

     WARUM HIER SO WENIG DRINSTEHT — das ist Absicht, kein Vergessen:
     Nach der ersten echten Hoerprobe hat ruckG4zz bestaetigt, dass die
     englischen Begriffe insgesamt sauber kommen. Chirp3-HD und Studio sind
     moderne Modelle und sprechen sie im deutschen Satz meist von selbst
     richtig aus. Eine "Korrektur" auf Verdacht wuerde es VERSCHLECHTERN.

     Deshalb steht hier ausschliesslich, was tatsaechlich als falsch
     gehoert wurde, plus Faelle mit nachweislich derselben Ursache.
     Die Tabelle waechst nur mit echten Hoerbefunden, nicht mit Vermutungen.
     --------------------------------------------------------------------- */
  const ENGLISCH_FIX = [
    /* "Fiber" -> deutsch gelesen "Fieber". Von ruckG4zz gemeldet. */
    [/\bFiber\b/gi,   'Faiber'],
    /* Britische Schreibweise, gleiche Ursache. */
    [/\bFibre\b/gi,   'Faiber'],
    /* Taucht bei LWL-Themen auf und kippt deutsch gelesen ebenso. */
    [/\bSplice\b/gi,  'Splais']
  ];

  function fixForTTS(text) {
    let t = ' ' + text + ' ';
    for (const [re, rep] of ENGLISCH_FIX) t = t.replace(re, rep);
    for (const [re, rep] of TTS_FIX)      t = t.replace(re, rep);
    return t.trim();
  }

  const IS_MOBILE = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');

  /* =====================================================================
     CLOUD-KONFIGURATION
     ---------------------------------------------------------------------
     Der Schluessel wird ausschliesslich von aussen gesetzt (aus dem
     Geraetespeicher, den ruckG4zz selbst befuellt). Hier steht keiner drin
     und es gibt keinen eingebauten Standardschluessel.

     Stimmen-Voreinstellung: von ruckG4zz am 18.08.2026 nach eigenem
     Hoervergleich festgelegt. BEIDE Chirp3-HD — die beiden Sprecher
     bleiben ueber alle Schichten hinweg dieselben (Wiedererkennungswert,
     ausfuehrliche Begruendung bei STIMME_B_STANDARD in app.js).
     ===================================================================== */
  const cloudConfig = {
    apiKey: null,
    voiceA: 'de-DE-Chirp3-HD-Enceladus',   // maennlich
    voiceB: 'de-DE-Chirp3-HD-Achernar',    // weiblich
    rate: 1.0
  };

  let letzterCloudFehler = null;

  function setCloudConfig(cfg) { Object.assign(cloudConfig, cfg || {}); }
  function getCloudConfig() {
    return Object.assign({}, cloudConfig, { apiKey: cloudConfig.apiKey ? '(gesetzt)' : null });
  }
  function cloudAktiv()   { return !!cloudConfig.apiKey; }
  function letzterFehler(){ return letzterCloudFehler; }
  function stimmeFuer(v)  { return (v === 'b') ? cloudConfig.voiceB : cloudConfig.voiceA; }

  /* =====================================================================
     WIEDERGABE
     ---------------------------------------------------------------------
     EIN einziges, dauerhaftes <audio>-Element. Bewusst nicht pro Segment
     ein neues: nur so bleibt die Mediensitzung des Systems daran haengen
     und die Wiedergabe bei gesperrtem Bildschirm ueberhaupt moeglich.
     ===================================================================== */
  let player = null;

  function holePlayer() {
    if (!player) {
      player = new Audio();
      player.preload = 'auto';
      // Verhindert, dass iOS/Android die Wiedergabe in einen Vollbild-
      // Videoplayer zwingt — waere hier sinnlos und stoert die Steuerung.
      player.playsInline = true;
      player.setAttribute('playsinline', '');
    }
    return player;
  }

  /* Zeiger auf die gerade laufende Wiedergabe, damit stop() sie aufloesen
     kann. NOETIG SEIT DER ECHTEN PAUSE: ein pausiertes <audio> feuert kein
     'ended'. Wuerde jetzt gesprungen oder eine Frage gestellt, bliebe die
     Zusage fuer immer offen und die Abspielschleife haengen — der Podcast
     waere tot, ohne dass man den Grund sieht. */
  let laufendeWiedergabe = null;

  function spieleUrl(url, myGen) {
    return new Promise(resolve => {
      const a = holePlayer();
      let done = false;

      const aufraeumen = () => {
        a.removeEventListener('ended', beiEnde);
        a.removeEventListener('error', beiFehler);
        if (laufendeWiedergabe && laufendeWiedergabe.id === myGen) laufendeWiedergabe = null;
      };
      const fertig = (p) => { if (done) return; done = true; aufraeumen(); resolve(p); };
      laufendeWiedergabe = { id: myGen, abbrechen: () => fertig({ stopped: true }) };
      const beiEnde   = () => fertig({ stopped: myGen !== speakGen });
      const beiFehler = () => fertig({ stopped: true, error: 'audio-wiedergabe-fehler' });

      a.addEventListener('ended', beiEnde);
      a.addEventListener('error', beiFehler);

      a.src = url;
      a.play().catch(e => {
        // Haeufigster Fall: Wiedergabe ohne vorherige Nutzergeste blockiert
        fertig({ stopped: true, error: 'wiedergabe-blockiert: ' + (e && e.message) });
      });
    });
  }

  /* ---------------------------------------------------------------------
     VORABLADEN — der eigentliche Hebel gegen den Abbruch bei gesperrtem
     Bildschirm.

     PROBLEM VORHER: Zwischen zwei Segmenten lag eine echte Luecke. Erst
     wenn Segment N fertig war, wurde Segment N+1 bei Google angefragt
     (Netzzugriff, mehrere hundert Millisekunden). In dieser Luecke spielt
     das <audio>-Element nichts ab. Android wertet das als "Wiedergabe
     beendet", gibt den Audio-Fokus frei und friert die Seite im
     Hintergrund ein — der angefangene Satz lief noch zu Ende, danach war
     Schluss. Exakt das von ruckG4zz beobachtete Verhalten.

     LOESUNG: Das naechste Segment wird schon WAEHREND des laufenden
     synthetisiert und im Geraetespeicher abgelegt. Beim Segmentwechsel
     kommt es dann aus dem lokalen Zwischenspeicher statt aus dem Netz —
     die Luecke schrumpft von "Netzanfrage" auf "Datenbankzugriff".

     Kontingent-Hinweis: Vorabladen loest KEINE zusaetzliche Synthese aus.
     Es zieht denselben Abruf nur zeitlich vor. Es wird also kein einziges
     Zeichen zusaetzlich verbraucht.
     --------------------------------------------------------------------- */
  async function prefetch(text, opts = {}) {
    if (!cloudAktiv()) return null;
    const roh = (text || '').trim();
    if (!roh) return null;
    try {
      const erg = await CloudTTS.synthese(fixForTTS(roh), {
        apiKey: cloudConfig.apiKey,
        voice:  stimmeFuer(opts.voice),
        rate:   opts.rate != null ? opts.rate : cloudConfig.rate
      });
      return erg.url;
    } catch (_) {
      // Vorabladen ist Komfort, kein Muss. Faellt es aus, versucht es
      // speak() gleich noch einmal — dann eben mit sichtbarem Fehler.
      return null;
    }
  }

  /**
   * Spricht einen Text. Resolved, wenn fertig gesprochen.
   * NUR Cloud — kein Rueckfall auf die Browser-Stimme (siehe Kopf).
   */
  async function speak(text, opts = {}) {
    const myGen = speakGen;

    if (!cloudAktiv()) {
      letzterCloudFehler = 'Kein API-Schlüssel hinterlegt. Ohne Schlüssel gibt es keine Sprachausgabe.';
      return { stopped: true, error: 'kein-schluessel', cloudFehler: letzterCloudFehler };
    }

    const roh = (text || '').trim();
    if (!roh) return { stopped: false };

    try {
      const erg = await CloudTTS.synthese(fixForTTS(roh), {
        apiKey: cloudConfig.apiKey,
        voice:  stimmeFuer(opts.voice),
        rate:   opts.rate != null ? opts.rate : cloudConfig.rate
      });
      if (myGen !== speakGen) return { stopped: true };   // zwischenzeitlich gestoppt
      letzterCloudFehler = null;
      return await spieleUrl(erg.url, myGen);
    } catch (e) {
      /* KEIN stiller Rueckfall mehr. Der Fehler wird gemerkt, nach oben
         gereicht und in der Oberflaeche sichtbar gemacht. */
      letzterCloudFehler = (e && e.message) || 'Unbekannter Cloud-Fehler';
      return { stopped: true, error: 'cloud-fehler', cloudFehler: letzterCloudFehler };
    }
  }

  function stop() {
    // Generation hochzaehlen: entwertet auch Sprechvorgaenge, die noch in
    // der Synthese haengen und sonst danach trotzdem losspielen wuerden.
    speakGen++;
    if (player) {
      try {
        player.pause();
        // Position zuruecksetzen, damit ein spaeteres resume() nicht
        // mitten im abgebrochenen Satz wieder anfaengt.
        player.currentTime = 0;
      } catch (_) {}
    }
    /* Eine haengende (z.B. pausierte) Wiedergabe aktiv aufloesen — siehe
       Kommentar bei laufendeWiedergabe. Ohne das bliebe die Abspielschleife
       nach einem Sprung aus der Pause heraus fuer immer stehen. */
    if (laufendeWiedergabe) {
      const w = laufendeWiedergabe;
      laufendeWiedergabe = null;
      w.abbrechen();
    }
  }

  /* SOFORT-STOPP fuer die Zwischenfrage.
     Unterschied zu stop(): hier wird zusaetzlich die Lautstaerke hart auf
     null gezogen, bevor pausiert wird. Auf Android klingt ein reines
     pause() gelegentlich noch ein paar Millisekunden nach — das wirkt bei
     einer Unterbrechung unsauber. */
  function stopSofort() {
    if (player) { try { player.volume = 0; } catch (_) {} }
    stop();
    if (player) { try { player.volume = 1; } catch (_) {} }
  }

  function pause() {
    if (player && !player.paused) { try { player.pause(); } catch (_) {} }
  }

  /* ---------------------------------------------------------------------
     FORTSETZEN — gibt jetzt zurueck, OB es tatsaechlich geklappt hat.
     ---------------------------------------------------------------------
     BEFUND VOM HANDY-TEST (18.08.2026, ruckG4zz): ueber die Steuerung auf
     dem Sperrbildschirm laesst sich pausieren, aber nicht wieder starten —
     dafuer muss der Bildschirm erst entsperrt werden.

     Die Ursache steckt in der Asymmetrie der beiden Aufrufe:
       pause()  ist synchron und gelingt praktisch immer.
       play()   gibt ein Promise zurueck, das Android ablehnen kann, wenn
                die Seite im Hintergrund liegt.

     Bisher stand hier `player.play().catch(() => {})` — der Fehler wurde
     also komplett verschluckt. Es gab nicht einmal eine Spur davon, weder
     im Verlauf noch in der Diagnose. Der Knopf war einfach tot.

     Jetzt wird das Ergebnis nach oben gereicht, damit app.js einen
     Notfallplan fahren kann (Abschnitt neu anwerfen statt gar nichts).
     --------------------------------------------------------------------- */
  let letzterWiedergabeFehler = null;

  async function resume() {
    if (!player || !player.src) return false;
    if (!player.paused) return true;          // laeuft ohnehin schon
    try {
      await player.play();
      letzterWiedergabeFehler = null;
      return true;
    } catch (e) {
      letzterWiedergabeFehler = (e && e.message) || 'play() wurde abgelehnt';
      return false;
    }
  }

  function letzterPlayFehler() { return letzterWiedergabeFehler; }

  /* Aktuelle Position innerhalb des laufenden Segments.
     Basis fuer die Zeit-/Laufbalkenanzeige in app.js: ohne den Anteil im
     laufenden Segment wuerde der Balken nur alle paar Sekunden ruckartig
     weiterspringen statt gleichmaessig zu laufen. */
  function position() {
    if (!player || !player.src) return { zeit: 0, dauer: 0, anteil: 0 };
    const d = isFinite(player.duration) && player.duration > 0 ? player.duration : 0;
    const t = player.currentTime || 0;
    return { zeit: t, dauer: d, anteil: d > 0 ? Math.min(1, t / d) : 0 };
  }
  function isPaused()   { return !!(player && player.paused && player.src && !player.ended); }
  function isSpeaking() { return !!(player && player.src && !player.paused && !player.ended); }

  /* =====================================================================
     START / DIAGNOSE
     ===================================================================== */
  async function init() {
    return voiceInfo();
  }

  function voiceInfo() {
    const kannA = (typeof CloudTTS !== 'undefined')
      ? CloudTTS.faehigkeiten(cloudConfig.voiceA) : null;
    const kannB = (typeof CloudTTS !== 'undefined')
      ? CloudTTS.faehigkeiten(cloudConfig.voiceB) : null;
    return {
      a: cloudConfig.voiceA,
      b: cloudConfig.voiceB,
      klasseA: (typeof CloudTTS !== 'undefined') ? CloudTTS.klasseAusName(cloudConfig.voiceA) : '?',
      klasseB: (typeof CloudTTS !== 'undefined') ? CloudTTS.klasseAusName(cloudConfig.voiceB) : '?',
      ssmlA: kannA ? kannA.ssml : false,
      ssmlB: kannB ? kannB.ssml : false,
      schluessel: !!cloudConfig.apiKey,
      sttVerfuegbar: !!SR
    };
  }

  /* =====================================================================
     SPRACHERKENNUNG  (unveraendert — kostenlos, funktioniert)
     ---------------------------------------------------------------------
     WICHTIG (Sicherheitsvorgabe): wird ausschliesslich durch einen
     bewussten Aufruf von listen() gestartet, der in der UI hinter einem
     Tastendruck haengt. Kein Dauerlauschen, kein continuous-Modus.
     Hinweis: Chrome verarbeitet das Audio serverseitig (i.d.R. Google).
     ===================================================================== */

  /**
   * Fragt den gespeicherten Mikrofon-Berechtigungsstand ab, OHNE eine
   * Abfrage auszuloesen. Nicht jeder Browser kennt das — dann 'unbekannt'.
   */
  async function micPermission() {
    try {
      if (!navigator.permissions || !navigator.permissions.query) return 'unbekannt';
      const st = await navigator.permissions.query({ name: 'microphone' });
      return st.state || 'unbekannt';
    } catch (_) { return 'unbekannt'; }
  }

  /**
   * Fordert den Mikrofonzugriff ueber den regulaeren Weg an (getUserMedia)
   * und gibt den Stream sofort wieder frei.
   *
   * WARUM DAS NOETIG IST: Android-Chrome loest die Berechtigungsabfrage bei
   * SpeechRecognition haeufig NICHT selbst aus. Ohne vorher erteilten
   * Zugriff scheitert die Erkennung dann still.
   */
  async function requestMic() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Dieser Browser bietet keinen Mikrofonzugriff an (getUserMedia fehlt).');
    }
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      return true;
    } catch (e) {
      const n = (e && e.name) || '';
      if (n === 'NotAllowedError' || n === 'SecurityError') {
        throw new Error('Mikrofonzugriff abgelehnt oder blockiert. In Chrome: Schloss-Symbol links neben der Adresse → Berechtigungen → Mikrofon → Zulassen. Danach Seite neu laden.');
      }
      if (n === 'NotFoundError' || n === 'DevicesNotFoundError') {
        throw new Error('Kein Mikrofon gefunden.');
      }
      if (n === 'NotReadableError') {
        throw new Error('Das Mikrofon wird gerade von einer anderen App benutzt.');
      }
      throw new Error('Mikrofon nicht verfügbar: ' + (n || e.message || 'unbekannter Fehler'));
    } finally {
      // Stream sofort freigeben — sonst kann er die Erkennung blockieren.
      if (stream) { try { stream.getTracks().forEach(t => t.stop()); } catch (_) {} }
    }
  }

  function listen(opts = {}) {
    return new Promise((resolve, reject) => {
      if (!SR) return reject(new Error('Spracherkennung wird von diesem Browser nicht unterstützt.'));

      const status = (s) => { if (opts.onStatus) { try { opts.onStatus(s); } catch (_) {} } };

      cancelListen();
      const r = new SR();
      r.lang            = opts.lang || 'de-DE';
      r.continuous      = false;   // bewusst: eine Frage, dann Schluss
      r.interimResults  = true;    // nur fuer Live-Anzeige
      r.maxAlternatives = 3;

      let finalText = '';
      let settled   = false;
      let sicherung = null;

      const done = (fn, arg) => {
        if (settled) return; settled = true;
        if (sicherung) { clearTimeout(sicherung); sicherung = null; }
        try { r.stop(); } catch (_) {}
        recognition = null;
        fn(arg);
      };

      r.onstart      = () => status('Aufnahme läuft — sprich jetzt.');
      r.onaudiostart = () => status('Ton wird empfangen.');
      r.onspeechstart= () => status('Sprache erkannt …');
      r.onspeechend  = () => status('Sprechpause erkannt, werte aus …');

      r.onresult = (ev) => {
        let interim = '';
        for (let i = ev.resultIndex; i < ev.results.length; i++) {
          const res = ev.results[i];
          if (res.isFinal) finalText += res[0].transcript;
          else interim += res[0].transcript;
        }
        if (opts.onInterim) opts.onInterim((finalText + ' ' + interim).trim());
      };

      r.onerror = (ev) => {
        const map = {
          'no-speech':     'Es kam kein hörbarer Ton an. Sprich etwas lauter und näher ans Mikrofon.',
          'audio-capture': 'Kein Mikrofon gefunden.',
          'not-allowed':   'Mikrofonzugriff wurde nicht erlaubt. In Chrome: Schloss-Symbol neben der Adresse → Berechtigungen → Mikrofon → Zulassen, dann Seite neu laden.',
          'network':       'Die Spracherkennung braucht eine Internetverbindung.',
          'service-not-allowed': 'Der Spracherkennungsdienst ist auf diesem Gerät nicht verfügbar.',
          'aborted':       'Abgebrochen.'
        };
        // Fehlercode immer mitgeben — beim Eingrenzen ist er Gold wert.
        const msg = (map[ev.error] || 'Spracherkennungs-Fehler') + '  [Code: ' + ev.error + ']';
        done(reject, new Error(msg));
      };

      r.onend = () => { status('Erkennung beendet.'); done(resolve, finalText.trim()); };

      recognition = r;

      /* Erst Berechtigung sicherstellen, DANN starten (siehe requestMic). */
      status('Frage Mikrofon-Berechtigung an …');
      requestMic()
        .then(() => {
          status('Berechtigung da, starte Erkennung …');
          try { r.start(); }
          catch (e) {
            // "already started" ist harmlos, alles andere zaehlt.
            if (!/already started/i.test(e.message || '')) done(reject, e);
          }
        })
        .catch(e => done(reject, e));

      /* HARTES Sicherheitsnetz.
         Vorher wurde hier nur r.stop() aufgerufen und darauf vertraut,
         dass onend feuert. Tut es das nicht (auf Android beobachtbar,
         wenn die Erkennung gar nicht erst richtig startet), blieb die
         Promise fuer immer offen — der Podcast stand dann still.
         Jetzt wird nach Ablauf zusaetzlich hart aufgeloest. */
      const grenze = opts.timeout || 12000;
      sicherung = setTimeout(() => {
        if (settled) return;
        try { r.stop(); } catch (_) {}
        // Kurze Gnadenfrist fuer ein noch eintreffendes onend …
        setTimeout(() => {
          if (settled) return;
          status('Zeitlimit erreicht.');
          done(resolve, finalText.trim());   // ggf. leer -> Aufrufer behandelt das
        }, 900);
      }, grenze);
    });
  }

  function cancelListen() {
    if (recognition) {
      try { recognition.abort(); } catch (_) {}
      recognition = null;
    }
  }

  function sttSupported() { return !!SR; }
  function ttsSupported() { return true; }   // Cloud-TTS, an den Schluessel gebunden

  return {
    init, speak, prefetch, stop, stopSofort, pause, resume, isPaused, isSpeaking,
    position, letzterPlayFehler,
    listen, cancelListen, sttSupported, ttsSupported, voiceInfo,
    micPermission, requestMic, isMobile: () => IS_MOBILE,
    setCloudConfig, getCloudConfig, cloudAktiv, letzterFehler,
    holePlayer,               // fuer die Mediensteuerung in app.js
    _fixForTTS: fixForTTS     // fuer Diagnose/Tests
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = { Speech };
