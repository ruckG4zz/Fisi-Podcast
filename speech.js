/* =============================================================================
   FISI-Podcast-App — Sprach-Abstraktionsschicht
   -----------------------------------------------------------------------------
   Kapselt KOMPLETT die Web Speech API. Der Rest der App kennt nur:

       Speech.speak(text, {voice:'a'|'b'})   -> Promise (resolved wenn fertig)
       Speech.stop()
       Speech.pause() / Speech.resume()
       Speech.listen()                       -> Promise<string> (Transkript)
       Speech.cancelListen()
       Speech.init()                         -> Promise (Stimmen geladen)
       Speech.voiceInfo()                    -> Diagnose für die UI

   Zweck der Kapselung (Architektur-Vorgabe aus der Projekt-Notiz):
   Ein späterer Wechsel auf eine Cloud-TTS ist ein Austausch DIESER Datei,
   kein Umbau der App. Nirgends sonst wird speechSynthesis angefasst.

   Kostenpolitik: Diese Implementierung ist zu 100% kostenneutral
   (Browser-Bordmittel). Keine kostenpflichtige API wird angesprochen.
   ========================================================================== */

const Speech = (() => {

  const synth = window.speechSynthesis;
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;

  let voices        = [];
  let voiceA        = null;   // "männlich"
  let voiceB        = null;   // "weiblich"
  let singleVoiceMode = false; // nur eine dt. Stimme gefunden -> Pitch-Trick
  let recognition   = null;
  let keepAliveTimer = null;
  let currentUtter  = null;

  /* ---------------------------------------------------------------------
     Aussprache-Korrekturen
     Der Skript-Text bleibt lesbar; hier wird zentral repariert, was
     deutsche TTS-Engines sonst verstümmeln. Wächst mit der Nutzung.
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
    [/(\d)BASE-/g,      '$1 Base '],   // 10BASE-T -> 10 Base T
    [/\bBASE-/g,        'Base '],
    [/µm/g,             'Mikrometer'],
    [/\bGbit\/s\b/g,    'Gigabit pro Sekunde'],
    [/\bMbit\/s\b/g,    'Megabit pro Sekunde'],
    [/\bGHz\b/g,        'Gigahertz'],
    [/ — /g,            ', '],          // Gedankenstrich -> Sprechpause
    [/ – /g,            ', '],
    [/\s+/g,            ' ']
  ];

  function fixForTTS(text) {
    let t = ' ' + text + ' ';
    for (const [re, rep] of TTS_FIX) t = t.replace(re, rep);
    return t.trim();
  }

  /* ---------------------------------------------------------------------
     Stimmen laden. getVoices() ist in Chrome asynchron befüllt.
     --------------------------------------------------------------------- */
  function loadVoices() {
    return new Promise(resolve => {
      const grab = () => {
        const v = synth.getVoices();
        if (v && v.length) { resolve(v); return true; }
        return false;
      };
      if (grab()) return;
      let tries = 0;
      const iv = setInterval(() => {
        if (grab() || ++tries > 20) { clearInterval(iv); resolve(synth.getVoices() || []); }
      }, 150);
      synth.onvoiceschanged = () => { if (grab()) clearInterval(iv); };
    });
  }

  /* Heuristik: Geschlecht anhand bekannter Stimm-Namen. */
  const FEMALE_HINTS = ['katja','hedda','anna','marlene','petra','vicki','female','frau','google deutsch'];
  const MALE_HINTS   = ['conrad','stefan','markus','klaus','male','mann','bernd','yannick'];

  function pickVoices() {
    const de = voices.filter(v => (v.lang || '').toLowerCase().startsWith('de'));
    const pool = de.length ? de : voices;

    const scoreFemale = v => FEMALE_HINTS.some(h => v.name.toLowerCase().includes(h));
    const scoreMale   = v => MALE_HINTS.some(h => v.name.toLowerCase().includes(h));

    voiceB = pool.find(scoreFemale) || null;   // weiblich
    voiceA = pool.find(scoreMale)   || null;   // männlich

    // Auffüllen mit dem, was übrig ist
    if (!voiceA) voiceA = pool.find(v => v !== voiceB) || pool[0] || null;
    if (!voiceB) voiceB = pool.find(v => v !== voiceA) || pool[0] || null;

    singleVoiceMode = !voiceA || !voiceB || voiceA === voiceB;
  }

  /* ---------------------------------------------------------------------
     Chrome-Bug-Workaround: speechSynthesis stoppt lange Utterances nach
     ca. 15 s. Gegenmittel auf DESKTOP: regelmäßig pause()+resume() antickern.

     WICHTIG: Dieser Trick ist Desktop-Chrome-spezifisch. Auf Android-Chrome
     bricht ein erzwungenes pause()+resume() die Sprachausgabe nachweislich
     eher komplett ab, statt sie zu retten (beobachtet: Abbruch nach dem
     ersten kurzen Segment, exakt im 10s-Timer-Takt). Deshalb läuft der
     Trick NUR auf Desktop-Browsern; Mobile bleibt bewusst ohne Eingriff,
     weil dort die 15s-Bugvariante ohnehin nicht in gleicher Form auftritt.
     --------------------------------------------------------------------- */
  const IS_MOBILE = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '');

  function startKeepAlive() {
    stopKeepAlive();
    if (IS_MOBILE) return;   // auf Mobile bewusst kein Eingriff, siehe oben
    keepAliveTimer = setInterval(() => {
      // Selbstheilend statt erzwingend: nur eingreifen, wenn der Browser
      // selbst schon pausiert hat (das ist der eigentliche Bugfall).
      if (synth.paused) { synth.resume(); }
      else if (synth.speaking) { synth.pause(); synth.resume(); }
    }, 10000);
  }
  function stopKeepAlive() {
    if (keepAliveTimer) { clearInterval(keepAliveTimer); keepAliveTimer = null; }
  }

  /* =====================================================================
     ÖFFENTLICHE API
     ===================================================================== */

  async function init() {
    if (!synth) throw new Error('SpeechSynthesis wird von diesem Browser nicht unterstützt.');
    voices = await loadVoices();
    pickVoices();
    return voiceInfo();
  }

  function voiceInfo() {
    return {
      total: voices.length,
      deutsch: voices.filter(v => (v.lang || '').toLowerCase().startsWith('de')).length,
      a: voiceA ? voiceA.name : null,
      b: voiceB ? voiceB.name : null,
      singleVoiceMode,
      sttVerfuegbar: !!SR
    };
  }

  /**
   * Spricht einen Text. Resolved, wenn fertig gesprochen.
   * Bei stop() resolved die Promise ebenfalls (mit {stopped:true}),
   * damit der Aufrufer nicht hängen bleibt.
   */
  function speak(text, opts = {}) {
    return new Promise(resolve => {
      if (!synth) return resolve({ stopped: true, error: 'kein TTS' });

      const u = new SpeechSynthesisUtterance(fixForTTS(text));
      const useB = opts.voice === 'b';
      const v = useB ? voiceB : voiceA;
      if (v) u.voice = v;
      u.lang = (v && v.lang) || 'de-DE';

      // Grundtempo etwas ruhiger als Default — Podcast, kein Nachrichtenticker.
      u.rate   = opts.rate   != null ? opts.rate   : 0.98;
      u.volume = opts.volume != null ? opts.volume : 1;

      // Nur eine deutsche Stimme vorhanden? Dann werden die beiden
      // Sprecher über die Tonhöhe unterscheidbar gemacht (Notbehelf,
      // ersetzt keine echte zweite Stimme — wird in der UI benannt).
      if (opts.pitch != null)        u.pitch = opts.pitch;
      else if (singleVoiceMode)      u.pitch = useB ? 1.18 : 0.88;
      else                           u.pitch = 1;

      let done = false;
      const finish = (payload) => {
        if (done) return; done = true;
        stopKeepAlive();
        if (currentUtter === u) currentUtter = null;
        resolve(payload);
      };

      /* Ob diese Äußerung regulär zu Ende kam, wird an IHR SELBST
         festgemacht — nicht an einem geteilten Flag. Sonst meldet eine
         durch cancel() abgeräumte Utterance faelschlich "sauber fertig",
         und der Player springt ein Segment zu weit. */
      u.onend   = () => finish({ stopped: currentUtter !== u });
      u.onerror = (e) => {
        // 'interrupted'/'canceled' sind normale Folgen von stop() — kein echter Fehler.
        const benign = e && (e.error === 'interrupted' || e.error === 'canceled');
        finish({ stopped: true, error: benign ? null : (e && e.error) || 'tts-fehler' });
      };

      // Erst die alte Äußerung abräumen, DANN currentUtter umhängen:
      // so sieht deren onend-Handler noch den alten Wert und meldet korrekt "stopped".
      if (synth.speaking || synth.pending) synth.cancel();
      currentUtter = u;
      synth.speak(u);
      startKeepAlive();
    });
  }

  function stop() {
    // Referenz ZUERST loesen: der gleich feuernde onend-Handler prueft
    // currentUtter und meldet dadurch korrekt "abgebrochen" statt "fertig".
    currentUtter = null;
    stopKeepAlive();
    if (synth) synth.cancel();
  }

  function pause()  { if (synth && synth.speaking && !synth.paused) synth.pause(); }
  function resume() { if (synth && synth.paused) synth.resume(); }
  function isPaused()   { return !!(synth && synth.paused); }
  function isSpeaking() { return !!(synth && synth.speaking); }

  /* ---------------------------------------------------------------------
     Spracherkennung.
     WICHTIG (Sicherheitsvorgabe): wird ausschließlich durch einen
     bewussten Aufruf von listen() gestartet, der in der UI hinter einem
     Tastendruck hängt. Kein Dauerlauschen, kein continuous-Modus.
     Hinweis: Chrome verarbeitet das Audio serverseitig (i.d.R. Google).
     --------------------------------------------------------------------- */
  /**
   * Fragt den gespeicherten Mikrofon-Berechtigungsstand ab, OHNE eine
   * Abfrage auszulösen. Nicht jeder Browser kennt das — dann 'unbekannt'.
   * Rückgabe: 'granted' | 'denied' | 'prompt' | 'unbekannt'
   */
  async function micPermission() {
    try {
      if (!navigator.permissions || !navigator.permissions.query) return 'unbekannt';
      const st = await navigator.permissions.query({ name: 'microphone' });
      return st.state || 'unbekannt';
    } catch (_) { return 'unbekannt'; }
  }

  /**
   * Fordert den Mikrofonzugriff über den regulären Weg an (getUserMedia)
   * und gibt den Stream sofort wieder frei.
   *
   * WARUM DAS NÖTIG IST: Android-Chrome loest die Berechtigungsabfrage bei
   * SpeechRecognition haeufig NICHT selbst aus. Ohne vorher erteilten
   * Zugriff scheitert die Erkennung dann still — es passiert schlicht
   * nichts, und der Nutzer sieht nie eine Abfrage. getUserMedia ist der
   * zuverlaessige Weg, die Abfrage ueberhaupt erst anzustossen.
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
      r.interimResults  = true;    // nur für Live-Anzeige
      r.maxAlternatives = 3;

      let finalText = '';
      let settled   = false;

      const done = (fn, arg) => {
        if (settled) return; settled = true;
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

      // Sicherheitsnetz: nie länger als 12 s offen halten.
      setTimeout(() => { if (!settled) { try { r.stop(); } catch (_) {} } }, opts.timeout || 12000);
    });
  }

  function cancelListen() {
    if (recognition) {
      try { recognition.abort(); } catch (_) {}
      recognition = null;
    }
  }

  function sttSupported() { return !!SR; }
  function ttsSupported() { return !!synth; }

  return {
    init, speak, stop, pause, resume, isPaused, isSpeaking,
    listen, cancelListen, sttSupported, ttsSupported, voiceInfo,
    micPermission, requestMic, isMobile: () => IS_MOBILE,
    _fixForTTS: fixForTTS   // für Diagnose/Tests
  };
})();
