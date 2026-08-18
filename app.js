/* =============================================================================
   FISI-Podcast-App — Hauptlogik (Layer-1-Pilot)
   -----------------------------------------------------------------------------
   Player, Recap, Fortschritt, Zwischenfragen, Sprung-Navigation.
   Spricht NIE direkt mit der Web Speech API — immer über Speech.*
   ========================================================================== */

const App = (() => {

  const STORE_KEY = 'fisi-podcast-l1-v1';

  const state = {
    chapter: 0,
    segment: 0,
    playing: false,
    busy: false,      // Frage/Antwort läuft, Player pausiert
    gen: 0,           // Generation-Token: bricht alte Play-Schleifen ab
    voiceInfo: null,
    lastQuestion: null
  };

  const el = {};      // DOM-Referenzen

  /* =====================================================================
     Fortschritt
     ===================================================================== */
  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        chapter: state.chapter,
        segment: state.segment,
        ts: Date.now()
      }));
    } catch (_) { /* privater Modus o.ä. — kein Grund abzustürzen */ }
  }

  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (typeof d.chapter !== 'number') return null;
      // Gegen veraltete Stände absichern
      if (d.chapter >= PODCAST_L1.chapters.length) return null;
      const ch = PODCAST_L1.chapters[d.chapter];
      if (d.segment >= ch.segments.length) d.segment = 0;
      return d;
    } catch (_) { return null; }
  }

  function resetProgress() {
    try { localStorage.removeItem(STORE_KEY); } catch (_) {}
    state.chapter = 0; state.segment = 0;
    renderChapters(); renderNow();
    log('Fortschritt zurückgesetzt.', 'sys');
  }

  /* =====================================================================
     Anzeige
     ===================================================================== */
  function log(text, kind = 'info') {
    const d = document.createElement('div');
    d.className = 'log-entry log-' + kind;
    d.textContent = text;
    el.log.appendChild(d);
    el.log.scrollTop = el.log.scrollHeight;
    while (el.log.children.length > 60) el.log.removeChild(el.log.firstChild);
  }

  function renderChapters() {
    el.chapters.innerHTML = '';
    PODCAST_L1.chapters.forEach((ch, i) => {
      const b = document.createElement('button');
      b.className = 'chapter' + (i === state.chapter ? ' active' : '');
      b.innerHTML = `<span class="ch-num">${String(i + 1).padStart(2, '0')}</span>
                     <span class="ch-body"><span class="ch-title">${ch.titel}</span>
                     <span class="ch-sub">${ch.kurz}</span></span>`;
      b.onclick = () => jumpTo(i, 0, true);
      el.chapters.appendChild(b);
    });
  }

  function renderNow() {
    const ch = PODCAST_L1.chapters[state.chapter];
    const total = ch.segments.length;
    el.nowChapter.textContent = `${state.chapter + 1}. ${ch.titel}`;
    el.nowProgress.textContent = `Abschnitt ${state.segment + 1} von ${total}`;
    const pct = ((state.chapter + (state.segment / total)) / PODCAST_L1.chapters.length) * 100;
    el.bar.style.width = pct.toFixed(1) + '%';
    // aktives Kapitel markieren
    [...el.chapters.children].forEach((c, i) => c.classList.toggle('active', i === state.chapter));
  }

  function setPlayUI(playing) {
    el.play.textContent = playing ? '⏸  Pause' : '▶  Abspielen';
    el.play.classList.toggle('is-playing', playing);
    if ('mediaSession' in navigator) {
      navigator.mediaSession.playbackState = playing ? 'playing' : 'paused';
    }
  }

  /* =====================================================================
     Player
     ===================================================================== */
  async function playLoop() {
    const myGen = ++state.gen;
    state.playing = true;
    setPlayUI(true);
    silentKeepAlive(true);

    while (state.playing && state.gen === myGen) {
      const ch = PODCAST_L1.chapters[state.chapter];
      if (!ch) break;
      const seg = ch.segments[state.segment];

      if (!seg) {
        // Kapitel zu Ende -> nächstes
        if (state.chapter + 1 < PODCAST_L1.chapters.length) {
          state.chapter++; state.segment = 0;
          renderNow(); save(); updateMediaMeta();
          continue;
        } else {
          log('Layer 1 ist durch. Gut gemacht.', 'sys');
          stopPlay();
          break;
        }
      }

      renderNow();
      highlightSegment(seg);
      const res = await Speech.speak(seg.text, { voice: seg.voice });

      // Während des Sprechens abgebrochen (Pause, Frage, Sprung)?
      if (state.gen !== myGen) return;
      if (res && res.stopped) { return; }

      state.segment++;
      save();
    }
    silentKeepAlive(false);
  }

  function highlightSegment(seg) {
    el.transcript.textContent = seg.text;
    el.speaker.textContent = seg.voice === 'b' ? 'Stimme B' : 'Stimme A';
    el.speaker.className = 'speaker speaker-' + seg.voice;
  }

  function startPlay() {
    if (state.busy) return;
    playLoop();
  }

  function stopPlay() {
    state.playing = false;
    state.gen++;
    Speech.stop();
    setPlayUI(false);
    silentKeepAlive(false);
  }

  function togglePlay() {
    if (state.playing) { stopPlay(); log('Pausiert.', 'sys'); }
    else { startPlay(); }
  }

  function jumpTo(chapterIdx, segIdx = 0, announce = false) {
    const wasPlaying = state.playing;
    stopPlay();
    state.chapter = Math.max(0, Math.min(chapterIdx, PODCAST_L1.chapters.length - 1));
    state.segment = segIdx;
    save(); renderNow(); updateMediaMeta();
    const ch = PODCAST_L1.chapters[state.chapter];
    if (announce) log('Sprung zu: ' + ch.titel, 'sys');
    if (wasPlaying || announce) startPlay();
  }

  function nextChapter() {
    if (state.chapter + 1 < PODCAST_L1.chapters.length) jumpTo(state.chapter + 1, 0, true);
    else log('Das war schon das letzte Kapitel.', 'sys');
  }

  function prevChapter() {
    if (state.chapter > 0) jumpTo(state.chapter - 1, 0, true);
    else log('Du bist schon am Anfang.', 'sys');
  }

  function repeatSegment() {
    state.segment = Math.max(0, state.segment - 1);
    jumpTo(state.chapter, state.segment, true);
  }

  /* =====================================================================
     Moderation & Recap
     ---------------------------------------------------------------------
     Die Bausteine kommen aus MODERATION (content-l1.js) und werden zufaellig
     gewaehlt, damit sich Einwuerfe bei haeufiger Nutzung nicht abnutzen.
     Sprecher-Logik: B moderiert, A liefert die Fachantwort.
     ===================================================================== */
  /* Notnagel: sollte content-l1.js mal in einer aelteren Fassung ausgeliefert
     werden (vergessener Upload, zaeher Cache), faellt die App nicht komplett
     aus — sie klingt dann nur weniger lebendig. */
  const MOD = (typeof MODERATION !== 'undefined' && MODERATION) ? MODERATION : {
    wortmeldung:          ['Wir haben eine Zwischenfrage.'],
    antwortStart:         ['Klar.'],
    keinTreffer:          ['Dazu haben wir in Layer eins nichts Passendes.'],
    keinTrefferAbschluss: ['Merken wir uns für später.'],
    zurueck:              ['Zurück zum Thema: {kapitel}.'],
    wiedereinstieg:       ['Willkommen zurück. Wir waren bei {kapitel} — {kurz}.'],
    sprung:               ['Weiter bei {kapitel}.']
  };

  function pick(arr) {
    if (!arr || !arr.length) return '';
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function fuellen(vorlage, werte) {
    return String(vorlage).replace(/\{(\w+)\}/g, (_, k) => werte[k] != null ? werte[k] : '');
  }

  function recapText(kindOfReturn) {
    const ch = PODCAST_L1.chapters[state.chapter];
    if (kindOfReturn === 'frage') {
      return fuellen(pick(MOD.zurueck), { kapitel: ch.titel });
    }
    return fuellen(pick(MOD.wiedereinstieg), { kapitel: ch.titel, kurz: ch.kurz });
  }

  async function speakRecap(kind) {
    const t = recapText(kind);
    log(t, 'recap');
    await Speech.speak(t, { voice: 'b' });   // Rueckfuehrung ins Thema: immer B
  }

  /* =====================================================================
     Zwischenfragen
     ===================================================================== */
  /* Live-Rückmeldung des Mikrofons */
  function micStatus(text, kind) {
    el.micbox.hidden = false;
    el.micStatus.textContent = text;
    el.micStatus.className = 'mic-status' + (kind ? ' ' + kind : '');
  }

  function micHeard(text) {
    const t = (text || '').trim();
    el.micHeardText.textContent = t || '… noch nichts';
    el.micHeardText.className = t ? '' : 'empty';
  }

  async function askByVoice() {
    if (!Speech.sttSupported()) {
      log('Dieser Browser kann keine Spracherkennung. Nutz das Textfeld darunter.', 'err');
      micStatus('Spracherkennung wird von diesem Browser nicht unterstützt.', 'fail');
      el.qtext.focus();
      return;
    }
    const wasPlaying = state.playing;
    state.busy = true;
    stopPlay();

    el.mic.classList.add('listening');
    el.mic.textContent = '🎤  Ich höre …';
    micHeard('');
    micStatus('Starte …');
    log('Mikrofon angefordert.', 'sys');

    try {
      const text = await Speech.listen({
        // Jeder Schritt wird sichtbar — so laesst sich genau sehen,
        // an welcher Stelle es klemmt (Berechtigung? Ton? Erkennung?).
        onStatus:  (s) => { micStatus(s); log('Mikro: ' + s, 'sys'); },
        onInterim: (t) => { micHeard(t); el.qtext.value = t; }
      });

      el.mic.classList.remove('listening');
      el.mic.textContent = '🎤  Frage stellen';

      if (!text) {
        micStatus('Es kam kein verwertbarer Text an.', 'fail');
        micHeard('');
        log('Nichts verstanden — es kam kein Text aus der Erkennung zurück.', 'err');
        state.busy = false;
        if (wasPlaying) resumeAfterQuestion();
        return;
      }

      micStatus('Verstanden.', 'done');
      micHeard(text);
      el.qtext.value = text;
      await handleQuestion(text, wasPlaying);

    } catch (e) {
      el.mic.classList.remove('listening');
      el.mic.textContent = '🎤  Frage stellen';
      micStatus(e.message || 'Spracherkennung fehlgeschlagen.', 'fail');
      log(e.message || 'Spracherkennung fehlgeschlagen.', 'err');
      state.busy = false;
      if (wasPlaying) resumeAfterQuestion();
    }
  }

  async function askByText() {
    const text = el.qtext.value.trim();
    if (!text) return;
    const wasPlaying = state.playing;
    state.busy = true;
    stopPlay();
    await handleQuestion(text, wasPlaying);
  }

  /* Ergebnis-Behandlung einer Frage.
     WICHTIG: Egal was hier schiefgeht — am Ende MUSS state.busy geloest
     und der Podcast fortgesetzt werden, sonst bleibt der Player tot
     zurueck. Deshalb liegt der ganze Ablauf in try/finally. */
  async function handleQuestion(text, wasPlaying) {
    log('Du: ' + text, 'user');
    state.lastQuestion = text;

    let fortsetzen = false;   // im finally ausgewertet

    try {
      const r = Matcher.parse(text, PODCAST_L1, REGISTER_L1);

      if (r.type === 'command') {
        el.qtext.value = '';
        switch (r.cmd) {
          case 'jump':     jumpTo(r.index, 0, true); return;
          case 'next':     nextChapter(); return;
          case 'prev':     prevChapter(); return;
          case 'repeat':   repeatSegment(); return;
          case 'pause':    log('Pausiert.', 'sys'); return;
          case 'resume':   startPlay(); return;
          case 'recap':    await speakRecap('manuell'); if (wasPlaying) startPlay(); return;
          case 'overview': await speakOverview();      if (wasPlaying) startPlay(); return;
        }
        return;
      }

      if (r.type === 'term') {
        /* B kuendigt die Wortmeldung an ... */
        const ansage = pick(MOD.wortmeldung);
        log(ansage, 'recap');
        await Speech.speak(ansage, { voice: 'b' });

        /* ... A antwortet fachlich. */
        let antwort = pick(MOD.antwortStart) + ' ' + r.entry.antwort;
        if (r.unsicher) {
          antwort = `Ich nehme an, du meinst ${r.entry.label}. ` + r.entry.antwort;
        }
        log('Antwort (' + r.entry.label + '): ' + antwort, 'answer');
        showSource(r.entry);
        await Speech.speak(antwort, { voice: 'a' });
        el.qtext.value = '';
        fortsetzen = wasPlaying;
        return;
      }

      /* Kein Treffer — ehrlich sagen, nichts erfinden. */
      if (r.reason === 'sprungziel-unklar') {
        const t = 'Du willst springen, aber ich habe nicht verstanden wohin. Sag zum Beispiel: spring zu Topologien.';
        log(t, 'err');
        await Speech.speak(t, { voice: 'b' });
        fortsetzen = wasPlaying;
        return;
      }

      const ansage = pick(MOD.wortmeldung);
      log(ansage, 'recap');
      await Speech.speak(ansage, { voice: 'b' });

      const absage = pick(MOD.keinTreffer);
      log(absage, 'err');
      showNoMatch();
      await Speech.speak(absage, { voice: 'a' });

      const abschluss = pick(MOD.keinTrefferAbschluss);
      log(abschluss, 'recap');
      await Speech.speak(abschluss, { voice: 'b' });
      fortsetzen = wasPlaying;

    } catch (e) {
      log('Fehler beim Beantworten: ' + (e && e.message), 'err');
      fortsetzen = wasPlaying;
    } finally {
      state.busy = false;
      if (fortsetzen) resumeAfterQuestion();
    }
  }

  /* Der Recap ist Beiwerk — wenn er scheitert, MUSS der Podcast trotzdem
     weiterlaufen. Frueher konnte ein haengender Recap den Player komplett
     stilllegen. */
  async function resumeAfterQuestion() {
    try { await speakRecap('frage'); }
    catch (e) { log('Recap übersprungen: ' + (e && e.message), 'sys'); }
    startPlay();
  }

  async function speakOverview() {
    const list = PODCAST_L1.chapters.map((c, i) => `${i + 1}: ${c.titel}`).join('. ');
    const t = `Layer 1 hat ${PODCAST_L1.chapters.length} Kapitel. ${list}.`;
    log(t, 'answer');
    await Speech.speak(t, { voice: 'b' });
  }

  /* Quellenanzeige zu einer Antwort */
  function showSource(entry) {
    el.source.hidden = false;
    el.source.innerHTML =
      `<strong>Treffer:</strong> ${entry.label}
       <span class="src-chip">Kapitel: ${(PODCAST_L1.chapters.find(c => c.id === entry.chapter) || {}).titel || entry.chapter}</span>
       <button class="src-jump" type="button">Dorthin springen</button>
       <div class="src-note">Quelle: NEINT1-Enzyklopädie, Section sec-l1 (Begriffsregister).</div>`;
    el.source.querySelector('.src-jump').onclick = () => {
      const idx = PODCAST_L1.chapters.findIndex(c => c.id === entry.chapter);
      if (idx >= 0) jumpTo(idx, 0, true);
    };
  }

  function showNoMatch() {
    el.source.hidden = false;
    el.source.innerHTML =
      `<strong>Kein Treffer im Layer-1-Register.</strong>
       <div class="src-note">Es wird bewusst nichts erfunden — beantwortet wird nur, was in NEINT1 tatsächlich steht.</div>
       <button class="src-escalate" type="button" disabled>An eine Live-KI weiterreichen (inaktiv)</button>
       <div class="src-note dim">Platzhalter. Eine Live-Anbindung wäre kostenpflichtig und wird erst nach ausdrücklicher Freigabe aktiviert.</div>`;
  }

  /* =====================================================================
     Stimmen-Einstellungen (Cloud-TTS)
     ---------------------------------------------------------------------
     Der API-Schluessel wird AUSSCHLIESSLICH hier im Geraetespeicher
     gehalten. Er steht in keiner Programmdatei und wird nirgendwohin
     uebertragen ausser an Google selbst, beim tatsaechlichen Sprechen.
     ===================================================================== */
  const CFG_KEY = 'fisi-podcast-stimmen';

  const cfg = {
    provider: 'browser',
    apiKey: '',
    voiceA: 'de-DE-Wavenet-B',
    voiceB: 'de-DE-Wavenet-F'
  };

  function cfgLaden() {
    try {
      const d = JSON.parse(localStorage.getItem(CFG_KEY) || '{}');
      Object.assign(cfg, {
        provider: d.provider === 'cloud' ? 'cloud' : 'browser',
        apiKey:   d.apiKey  || '',
        voiceA:   d.voiceA  || cfg.voiceA,
        voiceB:   d.voiceB  || cfg.voiceB
      });
    } catch (_) {}
    anwendenCfg();
  }

  function cfgSpeichern() {
    try { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch (_) {}
    anwendenCfg();
  }

  function anwendenCfg() {
    Speech.setCloudConfig({ apiKey: cfg.apiKey || null, voiceA: cfg.voiceA, voiceB: cfg.voiceB });
    Speech.setProvider(cfg.provider);
    if (el.provBrowser) el.provBrowser.checked = (cfg.provider !== 'cloud');
    if (el.provCloud)   el.provCloud.checked   = (cfg.provider === 'cloud');
    if (el.cloudBox)    el.cloudBox.hidden     = (cfg.provider !== 'cloud');
    if (el.apiKey && document.activeElement !== el.apiKey) el.apiKey.value = cfg.apiKey || '';
    renderUsage();
  }

  function apiStatus(text, kind) {
    el.apiStatus.textContent = text;
    el.apiStatus.style.color = kind === 'bad' ? 'var(--bad)'
                             : kind === 'ok'  ? 'var(--ok)'
                             : 'var(--fg-dim)';
  }

  async function renderUsage() {
    if (!el.usage) return;
    if (cfg.provider !== 'cloud') { el.usage.innerHTML = ''; return; }

    const klasse = CloudTTS.klasseAusName(cfg.voiceA);
    const v = CloudTTS.verbrauch(klasse);
    const anzahl = await CloudTTS.cacheGroesse();
    const heiss = v.anteilProzent > 80;

    const fmt = n => n.toLocaleString('de-DE');
    el.usage.innerHTML = `
      <div><span>Stimmenklasse</span><b>${v.klasse}</b></div>
      <div><span>Synthetisiert (${v.monat})</span><b>${fmt(v.zeichen)} Zeichen</b></div>
      <div><span>Aus Zwischenspeicher</span><b>${fmt(v.ausCache)} Zeichen — kostenlos</b></div>
      <div><span>Gespeicherte Abschnitte</span><b>${fmt(anzahl)}</b></div>
      <div><span>Kosten diesen Monat</span><b>${v.kostenUSD > 0 ? '$' + v.kostenUSD.toFixed(2) : '$0.00'}</b></div>
      <div class="usage-bar${heiss ? ' hot' : ''}"><i style="width:${Math.min(100, v.anteilProzent).toFixed(1)}%"></i></div>
      <div><span>Freikontingent</span><b>${v.anteilProzent.toFixed(1)} % von ${fmt(v.freiKontingent)}</b></div>`;
  }

  /* Stimmen von Google holen und in die Auswahlfelder einsetzen */
  async function stimmenLaden() {
    if (!cfg.apiKey) { apiStatus('Erst den Schlüssel sichern.', 'bad'); return; }
    apiStatus('Lade Stimmenliste …');
    try {
      const liste = await CloudTTS.stimmenListe(cfg.apiKey);
      if (!liste.length) { apiStatus('Google hat keine deutschen Stimmen gemeldet.', 'bad'); return; }

      const fuellen = (sel, gewaehlt, bevorzugtGeschlecht) => {
        sel.innerHTML = '';
        liste.forEach(v => {
          const o = document.createElement('option');
          o.value = v.name;
          o.textContent = `${v.name}  (${v.geschlecht === 'MALE' ? 'm' : v.geschlecht === 'FEMALE' ? 'w' : '?'}, ${v.klasse})`;
          sel.appendChild(o);
        });
        const treffer = liste.find(v => v.name === gewaehlt)
          || liste.find(v => v.geschlecht === bevorzugtGeschlecht && v.klasse === 'Wavenet')
          || liste[0];
        if (treffer) sel.value = treffer.name;
      };

      fuellen(el.voiceA, cfg.voiceA, 'MALE');
      fuellen(el.voiceB, cfg.voiceB, 'FEMALE');
      cfg.voiceA = el.voiceA.value;
      cfg.voiceB = el.voiceB.value;
      cfgSpeichern();
      apiStatus(liste.length + ' deutsche Stimmen geladen.', 'ok');
    } catch (e) {
      apiStatus(e.message || 'Stimmen konnten nicht geladen werden.', 'bad');
    }
  }

  /* Kurze Hörprobe beider Stimmen — kostet ein paar Dutzend Zeichen */
  async function stimmenProbe() {
    if (!cfg.apiKey) { apiStatus('Erst den Schlüssel sichern.', 'bad'); return; }
    stopPlay();
    apiStatus('Hörprobe läuft …');
    const alt = Speech.getProvider();
    Speech.setProvider('cloud');
    try {
      await Speech.speak('Ich bin Stimme A und übernehme die Erklärungen.', { voice: 'a' });
      await Speech.speak('Und ich bin Stimme B, ich stelle die Zwischenfragen.', { voice: 'b' });
      const f = Speech.letzterFehler();
      apiStatus(f ? ('Cloud fehlgeschlagen: ' + f) : 'Hörprobe fertig.', f ? 'bad' : 'ok');
    } catch (e) {
      apiStatus(e.message || 'Hörprobe fehlgeschlagen.', 'bad');
    } finally {
      Speech.setProvider(alt);
      renderUsage();
    }
  }

  /* Verbindungstest: nutzt die kostenlose Stimmenliste, synthetisiert nichts */
  async function verbindungTesten() {
    if (!cfg.apiKey) { apiStatus('Erst einen Schlüssel eintragen und sichern.', 'bad'); return; }
    apiStatus('Teste Verbindung …');
    try {
      const liste = await CloudTTS.stimmenListe(cfg.apiKey);
      apiStatus(`Verbindung steht. ${liste.length} deutsche Stimmen verfügbar. (Dieser Test kostet nichts.)`, 'ok');
    } catch (e) {
      apiStatus(e.message || 'Verbindung fehlgeschlagen.', 'bad');
    }
  }

  /* =====================================================================
     Media Session (Sperrbildschirm-Steuerung)
     ---------------------------------------------------------------------
     EHRLICHE EINORDNUNG: Die Web Speech API ist kein Media-Element.
     Android hält TTS bei gesperrtem Bildschirm NICHT zuverlässig am Leben.
     Das stille Loop-Audio unten verbessert die Chance spürbar und blendet
     die Mediensteuerung ein, ist aber KEINE Garantie für echte
     Hintergrundwiedergabe. Zuverlässig wird das erst mit vorgerenderten
     Audiodateien (Cloud-TTS) in einem <audio>-Element — kostenpflichtig,
     daher bewusst nicht Teil des Piloten.
     ===================================================================== */
  let silentAudio = null;

  function silentKeepAlive(on) {
    /* Bei Cloud-Stimme unnoetig: dort laeuft die Wiedergabe ohnehin ueber ein
       echtes <audio>-Element, das die Mediensitzung selbst traegt. Der stille
       Ton wuerde sich damit nur ins Gehege kommen. */
    if (Speech.cloudAktiv()) { if (silentAudio) { try { silentAudio.pause(); } catch (_) {} } return; }
    try {
      if (!silentAudio) {
        silentAudio = new Audio(
          'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
        );
        silentAudio.loop = true;
        silentAudio.volume = 0.001;
      }
      if (on) { silentAudio.play().catch(() => {}); }
      else    { silentAudio.pause(); }
    } catch (_) {}
  }

  function updateMediaMeta() {
    if (!('mediaSession' in navigator)) return;
    const ch = PODCAST_L1.chapters[state.chapter];
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: ch.titel,
        artist: 'NEINT1 · Layer 1 — Bitübertragungsschicht',
        album: 'FISI-Podcast',
        artwork: [{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }]
      });
    } catch (_) {}
  }

  function initMediaSession() {
    if (!('mediaSession' in navigator)) return;
    const h = navigator.mediaSession.setActionHandler.bind(navigator.mediaSession);
    try {
      h('play',          () => startPlay());
      h('pause',         () => stopPlay());
      h('nexttrack',     () => nextChapter());
      h('previoustrack', () => prevChapter());
    } catch (_) {}
    updateMediaMeta();
  }

  /* =====================================================================
     Start
     ===================================================================== */
  async function init() {
    // DOM einsammeln
    ['play','mic','ask','qtext','chapters','log','bar','nowChapter','nowProgress',
     'transcript','speaker','source','diag','reset','next','prev',
     'micbox','micStatus','micHeardText',
     'provBrowser','provCloud','cloudBox','apiKey','apiSave','apiShow','apiTest',
     'apiClear','apiStatus','voiceA','voiceB','voiceLoad','voiceProbe',
     'usage','cacheClear','usageReset']
      .forEach(id => el[id] = document.getElementById(id));

    el.title = document.getElementById('title');
    el.title.textContent = PODCAST_L1.titel;
    document.getElementById('subtitle').textContent = PODCAST_L1.untertitel;

    renderChapters();

    // Sprachschicht hochfahren
    try {
      state.voiceInfo = await Speech.init();
      await renderDiag(state.voiceInfo);
    } catch (e) {
      el.diag.innerHTML = `<span class="bad">${e.message}</span>`;
      log(e.message, 'err');
    }

    // Fortschritt
    const saved = load();
    if (saved) {
      state.chapter = saved.chapter;
      state.segment = saved.segment;
      const when = new Date(saved.ts);
      log(`Gespeicherter Stand gefunden (${when.toLocaleDateString('de-DE')}, ${when.toLocaleTimeString('de-DE', {hour:'2-digit',minute:'2-digit'})}).`, 'sys');
      el.resumeBox.hidden = false;
      el.resumeText.textContent = recapText('start');
    }
    renderNow();
    initMediaSession();

    // Events
    el.play.onclick  = togglePlay;
    el.next.onclick  = nextChapter;
    el.prev.onclick  = prevChapter;
    el.mic.onclick   = askByVoice;
    el.ask.onclick   = askByText;
    el.reset.onclick = resetProgress;
    el.qtext.addEventListener('keydown', e => { if (e.key === 'Enter') askByText(); });

    /* --- Stimmen-Einstellungen --- */
    el.provBrowser.onchange = () => { if (el.provBrowser.checked) { cfg.provider = 'browser'; cfgSpeichern(); } };
    el.provCloud.onchange   = () => {
      if (!el.provCloud.checked) return;
      cfg.provider = 'cloud'; cfgSpeichern();
      if (!cfg.apiKey) apiStatus('Trag deinen API-Schlüssel ein und sichere ihn.', 'bad');
    };

    el.apiSave.onclick = () => {
      const k = (el.apiKey.value || '').trim();
      if (!k) { apiStatus('Das Feld ist leer.', 'bad'); return; }
      cfg.apiKey = k; cfgSpeichern();
      el.apiKey.type = 'password';
      el.apiShow.textContent = 'Anzeigen';
      apiStatus('Schlüssel auf diesem Gerät gesichert. Jetzt „Verbindung testen".', 'ok');
    };

    el.apiShow.onclick = () => {
      const zeigen = el.apiKey.type === 'password';
      el.apiKey.type = zeigen ? 'text' : 'password';
      el.apiShow.textContent = zeigen ? 'Verbergen' : 'Anzeigen';
    };

    el.apiClear.onclick = () => {
      cfg.apiKey = ''; el.apiKey.value = ''; cfgSpeichern();
      apiStatus('Schlüssel von diesem Gerät gelöscht.', 'ok');
    };

    el.apiTest.onclick    = verbindungTesten;
    el.voiceLoad.onclick  = stimmenLaden;
    el.voiceProbe.onclick = stimmenProbe;

    el.voiceA.onchange = () => { cfg.voiceA = el.voiceA.value; cfgSpeichern(); };
    el.voiceB.onchange = () => { cfg.voiceB = el.voiceB.value; cfgSpeichern(); };

    el.cacheClear.onclick = async () => {
      await CloudTTS.cacheLeeren();
      apiStatus('Zwischenspeicher geleert. Die nächsten Abschnitte werden neu synthetisiert.', 'ok');
      renderUsage();
    };
    el.usageReset.onclick = () => {
      CloudTTS.zaehlerZuruecksetzen();
      apiStatus('Verbrauchszähler zurückgesetzt (nur die Anzeige, nicht der Google-Stand).', 'ok');
      renderUsage();
    };

    cfgLaden();

    document.getElementById('resumeGo').onclick = async () => {
      el.resumeBox.hidden = true;
      await speakRecap('start');
      startPlay();
    };
    document.getElementById('resumeRestart').onclick = () => {
      el.resumeBox.hidden = true;
      resetProgress();
      startPlay();
    };

    // Tastatur-Komfort am Desktop
    document.addEventListener('keydown', e => {
      if (e.target.tagName === 'INPUT') return;
      if (e.code === 'Space') { e.preventDefault(); togglePlay(); }
    });

    // Sicherheits-Hinweis, wenn ohne HTTPS geöffnet
    if (location.protocol === 'file:' ||
        (location.protocol !== 'https:' && location.hostname !== 'localhost')) {
      log('Achtung: ohne HTTPS verweigert der Browser den Mikrofonzugriff. Die Textfrage funktioniert trotzdem.', 'err');
    }
  }

  async function renderDiag(info) {
    const perm = await Speech.micPermission();
    const permText = {
      'granted':   'erteilt',
      'denied':    'BLOCKIERT — in den Seiten-Berechtigungen freigeben',
      'prompt':    'wird beim ersten Antippen abgefragt',
      'unbekannt': 'nicht abfragbar (Browser meldet es nicht)'
    }[perm] || perm;

    const rows = [
      ['Stimme A', info.a || '— keine gefunden —'],
      ['Stimme B', info.b || '— keine gefunden —'],
      ['Deutsche Stimmen', info.deutsch + ' von ' + info.total],
      ['Spracherkennung', info.sttVerfuegbar ? 'verfügbar' : 'nicht verfügbar'],
      ['Mikrofon-Berechtigung', permText],
      ['Sicherer Kontext (HTTPS)', window.isSecureContext ? 'ja' : 'NEIN — Mikro bleibt gesperrt'],
      ['Gerät', Speech.isMobile() ? 'mobil' : 'Desktop']
    ];
    el.diag.innerHTML = rows.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('');

    if (info.singleVoiceMode) {
      el.diag.innerHTML += `<div class="warn">Nur eine deutsche Stimme installiert. Die beiden Sprecher werden ersatzweise über die Tonhöhe unterschieden — das ersetzt keine echte zweite Stimme.</div>`;
    }
    if (perm === 'denied') {
      el.diag.innerHTML += `<div class="warn">Das Mikrofon ist für diese Seite blockiert. In Chrome: Schloss-Symbol links neben der Adresse → Berechtigungen → Mikrofon → Zulassen. Danach die Seite neu laden.</div>`;
    }
    if (!window.isSecureContext) {
      el.diag.innerHTML += `<div class="warn">Diese Seite läuft nicht in einem sicheren Kontext. Der Browser verweigert dann grundsätzlich den Mikrofonzugriff. Nötig ist HTTPS oder localhost.</div>`;
    }
  }

  // resumeBox nachträglich einsammeln (nach DOM-Aufbau)
  document.addEventListener('DOMContentLoaded', () => {
    el.resumeBox  = document.getElementById('resumeBox');
    el.resumeText = document.getElementById('resumeText');
    init();
  });

  return { state, jumpTo, startPlay, stopPlay };
})();

