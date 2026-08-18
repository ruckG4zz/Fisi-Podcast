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
     Recap
     ===================================================================== */
  function recapText(kindOfReturn) {
    const ch = PODCAST_L1.chapters[state.chapter];
    const pos = `${state.segment + 1} von ${ch.segments.length}`;
    if (kindOfReturn === 'frage') {
      return `Zurück zum Thema. Wir waren bei Kapitel ${state.chapter + 1}, ${ch.titel}.`;
    }
    return `Willkommen zurück. Du warst bei Kapitel ${state.chapter + 1}, ${ch.titel}. ` +
           `Da ging es um: ${ch.kurz}. Wir steigen wieder bei Abschnitt ${pos} ein.`;
  }

  async function speakRecap(kind) {
    const t = recapText(kind);
    log(t, 'recap');
    await Speech.speak(t, { voice: 'b', pitch: 1.02 });
  }

  /* =====================================================================
     Zwischenfragen
     ===================================================================== */
  async function askByVoice() {
    if (!Speech.sttSupported()) {
      log('Dieser Browser kann keine Spracherkennung. Nutz das Textfeld darunter.', 'err');
      el.qtext.focus();
      return;
    }
    const wasPlaying = state.playing;
    state.busy = true;
    stopPlay();

    el.mic.classList.add('listening');
    el.mic.textContent = '🎤  Ich höre …';
    log('Mikrofon aktiv — stell deine Frage.', 'sys');

    try {
      const text = await Speech.listen({
        onInterim: (t) => { el.qtext.value = t; }
      });
      el.mic.classList.remove('listening');
      el.mic.textContent = '🎤  Frage stellen';
      if (!text) { log('Nichts verstanden.', 'err'); state.busy = false; if (wasPlaying) resumeAfterQuestion(); return; }
      el.qtext.value = text;
      await handleQuestion(text, wasPlaying);
    } catch (e) {
      el.mic.classList.remove('listening');
      el.mic.textContent = '🎤  Frage stellen';
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

  async function handleQuestion(text, wasPlaying) {
    log('Du: ' + text, 'user');
    state.lastQuestion = text;
    const r = Matcher.parse(text, PODCAST_L1, REGISTER_L1);

    if (r.type === 'command') {
      state.busy = false;
      el.qtext.value = '';
      switch (r.cmd) {
        case 'jump':     jumpTo(r.index, 0, true); return;
        case 'next':     nextChapter(); return;
        case 'prev':     prevChapter(); return;
        case 'repeat':   repeatSegment(); return;
        case 'pause':    log('Pausiert.', 'sys'); return;
        case 'resume':   startPlay(); return;
        case 'recap':    await speakRecap('manuell'); if (wasPlaying) startPlay(); return;
        case 'overview': await speakOverview(); if (wasPlaying) startPlay(); return;
      }
      return;
    }

    if (r.type === 'term') {
      let antwort = r.entry.antwort;
      if (r.unsicher) {
        antwort = `Ich nehme an, du meinst ${r.entry.label}. ` + antwort;
      }
      log('Antwort (' + r.entry.label + '): ' + antwort, 'answer');
      showSource(r.entry);
      await Speech.speak(antwort, { voice: 'a' });
      el.qtext.value = '';
      state.busy = false;
      if (wasPlaying) resumeAfterQuestion();
      return;
    }

    /* Kein Treffer — ehrlich sagen, nichts erfinden. */
    const fallback = r.reason === 'sprungziel-unklar'
      ? 'Ich habe verstanden, dass du springen willst, aber nicht wohin. Sag zum Beispiel: spring zu Topologien.'
      : 'Dazu habe ich in Layer 1 nichts Passendes gefunden. Vielleicht kommt das Thema in einer anderen Schicht vor.';
    log(fallback, 'err');
    showNoMatch();
    await Speech.speak(fallback, { voice: 'a' });
    state.busy = false;
    if (wasPlaying) resumeAfterQuestion();
  }

  async function resumeAfterQuestion() {
    await speakRecap('frage');
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
     'transcript','speaker','source','diag','reset','next','prev']
      .forEach(id => el[id] = document.getElementById(id));

    el.title = document.getElementById('title');
    el.title.textContent = PODCAST_L1.titel;
    document.getElementById('subtitle').textContent = PODCAST_L1.untertitel;

    renderChapters();

    // Sprachschicht hochfahren
    try {
      state.voiceInfo = await Speech.init();
      renderDiag(state.voiceInfo);
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

  function renderDiag(info) {
    const rows = [
      ['Stimme A', info.a || '— keine gefunden —'],
      ['Stimme B', info.b || '— keine gefunden —'],
      ['Deutsche Stimmen', info.deutsch + ' von ' + info.total],
      ['Spracherkennung', info.sttVerfuegbar ? 'verfügbar' : 'nicht verfügbar']
    ];
    el.diag.innerHTML = rows.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('');
    if (info.singleVoiceMode) {
      el.diag.innerHTML += `<div class="warn">Nur eine deutsche Stimme installiert. Die beiden Sprecher werden ersatzweise über die Tonhöhe unterschieden — das ersetzt keine echte zweite Stimme.</div>`;
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
