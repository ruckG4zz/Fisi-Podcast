/* =============================================================================
   FISI-Podcast-App — Hauptlogik
   -----------------------------------------------------------------------------
   Player, Recap, Fortschritt, Zwischenfragen, Sprung-Navigation.
   Spricht NIE direkt mit der Web Speech API — immer über Speech.*

   AUSWEITUNG 18.08.2026: aus dem Layer-1-Piloten sind drei Schichten
   geworden (Layer 1, 2 und 3). Die Logik hier ist deshalb konsequent von
   "PODCAST_L1" auf "die gerade gewaehlte Schicht" umgestellt:

     LAYERS   Liste aller tatsaechlich geladenen Schichten
     schicht()  aktueller Eintrag       P()  aktueller Podcast
     R()        aktuelles Begriffsregister

   Warum ueber typeof geprueft wird: faellt eine Inhaltsdatei beim Upload
   aus (vergessen, zaeher Cache), soll die App mit den uebrigen Schichten
   weiterlaufen statt komplett zu sterben.

   FORTSCHRITT: JEDE Schicht hat ihren EIGENEN Speicherplatz. Der Schluessel
   von Layer 1 ist absichtlich unveraendert geblieben — ein bestehender
   Hoerstand geht durch die Ausweitung nicht verloren.
   ========================================================================== */

const App = (() => {

  const LAYERS = [
    { id: 'l1', key: 'fisi-podcast-l1-v1',
      podcast:  (typeof PODCAST_L1  !== 'undefined') ? PODCAST_L1  : null,
      register: (typeof REGISTER_L1 !== 'undefined') ? REGISTER_L1 : [],
      knopf: 'Layer 1', kurz: 'Bitübertragung', gesprochen: 'Layer eins',
      thema: 'der Bitübertragungsschicht' },
    { id: 'l2', key: 'fisi-podcast-l2-v1',
      podcast:  (typeof PODCAST_L2  !== 'undefined') ? PODCAST_L2  : null,
      register: (typeof REGISTER_L2 !== 'undefined') ? REGISTER_L2 : [],
      knopf: 'Layer 2', kurz: 'Sicherung', gesprochen: 'Layer zwei',
      thema: 'der Sicherungsschicht' },
    { id: 'l3', key: 'fisi-podcast-l3-v1',
      podcast:  (typeof PODCAST_L3  !== 'undefined') ? PODCAST_L3  : null,
      register: (typeof REGISTER_L3 !== 'undefined') ? REGISTER_L3 : [],
      knopf: 'Layer 3', kurz: 'Vermittlung', gesprochen: 'Layer drei',
      thema: 'der Vermittlungsschicht' }
  ].filter(l => l.podcast && l.podcast.chapters && l.podcast.chapters.length);

  const LAYER_KEY = 'fisi-podcast-schicht';

  /* ---------------------------------------------------------------------
     ZEITSCHÄTZUNG
     ---------------------------------------------------------------------
     Die echte Audiodauer ist im Voraus NICHT bekannt: jedes Segment wird
     erst beim ersten Hoeren synthetisiert. Ein ehrlicher Laufbalken ueber
     die Gesamtlaenge braucht also eine Schaetzung.

     Grundlage ist die Zeichenzahl. 900 Zeichen pro Minute ist der
     Richtwert, mit dem auch die Testsuite seit dem Layer-1-Pilot rechnet —
     er passt zu einer ruhig gesprochenen deutschen Stimme.

     Wichtig zur Einordnung: die Anzeige ist damit eine SCHAETZUNG, keine
     Messung. Innerhalb des laufenden Segments wird sie mit der echten
     Position des Audio-Elements verfeinert, damit der Balken gleichmaessig
     laeuft statt zu springen. In der Oberflaeche steht das auch so dran.
     --------------------------------------------------------------------- */
  const ZEICHEN_PRO_MINUTE = 900;

  const state = {
    layer: 0,         // Index in LAYERS
    chapter: 0,
    segment: 0,
    playing: false,
    paused: false,    // echte Pause: Schleife lebt, Audio steht nur still
    busy: false,      // Frage/Antwort läuft, Player pausiert
    gen: 0,           // Generation-Token: bricht alte Play-Schleifen ab
    voiceInfo: null,
    lastQuestion: null,
    sitzung: null     // laufende Hör-Sitzung (für die Abschluss-Zusammenfassung)
  };

  /* Kurzzugriffe auf die laufende Schicht. Bewusst Funktionen und keine
     Variablen: beim Schichtwechsel muss sonst an zwanzig Stellen etwas
     nachgezogen werden — genau so entstehen halbe Zustaende. */
  function schicht() { return LAYERS[state.layer]; }
  function P()       { return schicht().podcast; }
  function R()       { return schicht().register; }

  /* =====================================================================
     ZEIT-INDEX
     ---------------------------------------------------------------------
     Fuer jede Schicht wird EINMAL beim Start ausgerechnet, wie viele
     Zeichen vor jedem einzelnen Segment liegen. Damit laesst sich jede
     Position in Sekunden umrechnen, ohne bei jedem Bildaufbau ueber alle
     hundert Kapitel zu laufen.
     ===================================================================== */
  LAYERS.forEach(l => {
    const kapitel = [];
    let summe = 0;
    l.podcast.chapters.forEach(ch => {
      const vor = [];
      ch.segments.forEach(s => { vor.push(summe); summe += s.text.length; });
      kapitel.push(vor);
    });
    l.zeit = { kapitel, gesamt: summe };
  });

  const GESAMT_ZEICHEN = LAYERS.reduce((n, l) => n + l.zeit.gesamt, 0);

  function sekundenAusZeichen(z) { return (z / ZEICHEN_PRO_MINUTE) * 60; }

  /* mm:ss unter einer Stunde, h:mm:ss darüber */
  function zeitText(sekunden) {
    const s = Math.max(0, Math.round(sekunden));
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const rest = s % 60;
    const zwei = n => String(n).padStart(2, '0');
    return h > 0 ? `${h}:${zwei(m)}:${zwei(rest)}` : `${m}:${zwei(rest)}`;
  }

  /* Zeichen, die in der laufenden Schicht bereits hinter uns liegen —
     inklusive des angebrochenen Segments, damit der Balken gleichmaessig
     laeuft und nicht im Sekundentakt springt. */
  function zeichenBisHier() {
    const z = schicht().zeit;
    const vorher = (z.kapitel[state.chapter] || [])[state.segment];
    if (vorher == null) return 0;
    const seg = P().chapters[state.chapter].segments[state.segment];
    let anteil = 0;
    try { anteil = Speech.position().anteil || 0; } catch (_) {}
    return vorher + (seg ? seg.text.length * anteil : 0);
  }

  /* Dasselbe ueber alle Schichten hinweg — fuer die Gesamtanzeige. */
  function zeichenGesamtBisHier() {
    let summe = 0;
    for (let i = 0; i < state.layer; i++) summe += LAYERS[i].zeit.gesamt;
    return summe + zeichenBisHier();
  }

  const el = {};      // DOM-Referenzen

  /* =====================================================================
     Fortschritt  (pro Schicht getrennt)
     ===================================================================== */
  function save() {
    try {
      localStorage.setItem(schicht().key, JSON.stringify({
        chapter: state.chapter,
        segment: state.segment,
        ts: Date.now()
      }));
      localStorage.setItem(LAYER_KEY, schicht().id);
    } catch (_) { /* privater Modus o.ä. — kein Grund abzustürzen */ }
  }

  function load(layerIdx = state.layer) {
    try {
      const l = LAYERS[layerIdx];
      if (!l) return null;
      const raw = localStorage.getItem(l.key);
      if (!raw) return null;
      const d = JSON.parse(raw);
      if (typeof d.chapter !== 'number') return null;
      // Gegen veraltete Stände absichern (Kapitelzahl kann sich ändern)
      if (d.chapter >= l.podcast.chapters.length) return null;
      const ch = l.podcast.chapters[d.chapter];
      if (d.segment >= ch.segments.length) d.segment = 0;
      return d;
    } catch (_) { return null; }
  }

  /* ---------------------------------------------------------------------
     EINMALIGE VERSCHIEBUNG DES LAYER-1-HOERSTANDS (19.08.2026)
     ---------------------------------------------------------------------
     Layer 1 hat mit dem neuen Kapitel "einleitung" ganz vorne EIN Kapitel
     mehr bekommen. Der Fortschritt wird als reiner Zahlen-Index abgelegt —
     ein gespeichertes "Kapitel 5" zeigt seit der Ergaenzung also auf das
     falsche Thema. Wer bei den Topologien aufgehoert hat, laege danach bei
     den Uebertragungsmodi.

     Deshalb wird der gespeicherte Index EINMAL um eins angehoben. Mit
     Marke im Geraetespeicher, exakt nach dem Muster der Stimm-Migration
     weiter unten: ohne Marke wuerde bei JEDEM App-Start weitergeschoben
     und der Hoerstand wanderte langsam ans Ende der Schicht.

     Betrifft nur Layer 1. Layer 2 und 3 sind unveraendert.
     --------------------------------------------------------------------- */
  const L1_SHIFT_MARKE = 'fisi-podcast-l1-einleitung-verschoben';

  function migriereL1Fortschritt() {
    try {
      if (localStorage.getItem(L1_SHIFT_MARKE)) return;
      const l1 = LAYERS.find(l => l.id === 'l1');
      /* Marke auch dann setzen, wenn es nichts zu verschieben gibt —
         sonst laeuft die Pruefung bei jedem Start erneut ins Leere. */
      if (l1) {
        const raw = localStorage.getItem(l1.key);
        if (raw) {
          const d = JSON.parse(raw);
          if (typeof d.chapter === 'number' && d.chapter < l1.podcast.chapters.length - 1) {
            d.chapter += 1;
            localStorage.setItem(l1.key, JSON.stringify(d));
          }
        }
      }
      localStorage.setItem(L1_SHIFT_MARKE, '1');
    } catch (_) { /* privater Modus o.ä. — kein Grund abzustürzen */ }
  }

  function resetProgress() {
    try { localStorage.removeItem(schicht().key); } catch (_) {}
    state.chapter = 0; state.segment = 0;
    renderChapters(); renderNow();
    log('Fortschritt in ' + schicht().knopf + ' zurückgesetzt.', 'sys');
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

  /* ---------------------------------------------------------------------
     SCHICHT-UMSCHALTER
     ---------------------------------------------------------------------
     Bewusst als sichtbare Knopfleiste und NICHT als Sprachbefehl gebaut.
     Begruendung: "spring zu Layer zwei" und "spring zu Layer 2 Sicherung"
     liessen sich vom Sprungbefehl innerhalb einer Schicht kaum sauber
     trennen — ein falsch verstandener Schichtwechsel mitten im Hoeren
     waere deutlich aergerlicher als ein Knopfdruck.
     --------------------------------------------------------------------- */
  function renderLayers() {
    if (!el.layers) return;
    el.layers.innerHTML = '';
    LAYERS.forEach((l, i) => {
      const b = document.createElement('button');
      b.className = 'layer' + (i === state.layer ? ' active' : '');
      b.type = 'button';
      b.innerHTML = `<b>${l.knopf}</b><em>${l.kurz}</em>`;
      b.onclick = () => layerWechseln(i);
      el.layers.appendChild(b);
    });
  }

  function layerWechseln(idx) {
    if (idx === state.layer || !LAYERS[idx]) return;
    stopPlay();                       // laufende Wiedergabe sauber beenden
    save();                           // Stand der bisherigen Schicht sichern
    state.layer = idx;

    const gespeichert = load(idx);
    state.chapter = gespeichert ? gespeichert.chapter : 0;
    state.segment = gespeichert ? gespeichert.segment : 0;

    try { localStorage.setItem(LAYER_KEY, schicht().id); } catch (_) {}

    if (el.resumeBox) el.resumeBox.hidden = true;
    if (el.source)    el.source.hidden = true;

    renderKopf();
    renderLayers();
    renderChapters();
    renderNow();
    updateMediaMeta();

    log(gespeichert
      ? `Gewechselt zu ${schicht().knopf}. Gespeicherter Stand: Kapitel ${state.chapter + 1}.`
      : `Gewechselt zu ${schicht().knopf}. Start von vorn.`, 'sys');
  }

  function renderKopf() {
    const p = P();
    el.title.textContent = p.titel;
    document.getElementById('subtitle').textContent = p.untertitel;
    const q = document.getElementById('quelle');
    if (q) q.textContent = p.quelle;
  }

  function renderChapters() {
    el.chapters.innerHTML = '';
    P().chapters.forEach((ch, i) => {
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
    const ch = P().chapters[state.chapter];
    const total = ch.segments.length;
    el.nowChapter.textContent = `${state.chapter + 1}. ${ch.titel}`;
    el.nowProgress.textContent =
      `Kapitel ${state.chapter + 1} von ${P().chapters.length} · Abschnitt ${state.segment + 1} von ${total}`;
    renderZeit();
    // aktives Kapitel markieren
    [...el.chapters.children].forEach((c, i) => c.classList.toggle('active', i === state.chapter));
  }

  /* ---------------------------------------------------------------------
     LAUFBALKEN UND ZEITANZEIGE (Wunsch ruckG4zz, 18.08.2026)
     ---------------------------------------------------------------------
     Vorher zeigte der Balken nur den Kapitelanteil — man sah also nicht,
     wo man in der Gesamtaufnahme steht. Jetzt laeuft er ueber die
     geschaetzte Spielzeit und darunter steht beides im Klartext:
     Position in der laufenden Schicht UND ueber alle drei zusammen.

     Zusaetzlich wird die Position an die Mediensitzung gemeldet. Damit
     bekommt auch der Sperrbildschirm einen echten Fortschrittsbalken,
     statt nur Titel und Knoepfe zu zeigen.
     --------------------------------------------------------------------- */
  function renderZeit() {
    if (!el.bar) return;

    const inSchicht   = zeichenBisHier();
    const schichtGes  = schicht().zeit.gesamt;
    const gesamt      = zeichenGesamtBisHier();

    const anteil = schichtGes > 0 ? (inSchicht / schichtGes) * 100 : 0;
    el.bar.style.width = Math.min(100, Math.max(0, anteil)).toFixed(2) + '%';

    if (el.zeit) {
      el.zeit.innerHTML =
        `<span><b>${zeitText(sekundenAusZeichen(inSchicht))}</b> von ` +
        `${zeitText(sekundenAusZeichen(schichtGes))} · ${schicht().knopf}</span>` +
        `<span class="zeit-ges">gesamt ${zeitText(sekundenAusZeichen(gesamt))} von ` +
        `${zeitText(sekundenAusZeichen(GESAMT_ZEICHEN))}</span>`;
    }

    /* Fortschrittsbalken auf dem Sperrbildschirm. In einen try/catch, weil
       Android bei ungueltigen Werten (Position groesser als Dauer) hart
       wirft — das darf die Wiedergabe nicht mitreissen. */
    if ('mediaSession' in navigator && navigator.mediaSession.setPositionState) {
      try {
        const dauer = sekundenAusZeichen(schichtGes);
        navigator.mediaSession.setPositionState({
          duration: dauer,
          position: Math.min(sekundenAusZeichen(inSchicht), dauer),
          playbackRate: 1
        });
      } catch (_) {}
    }
  }

  /* Waehrend der Wiedergabe laeuft die Anzeige mit. Ein Segment dauert
     mehrere Sekunden — ohne Ticker stuende der Balken die ganze Zeit still
     und sprae dann. */
  let tickerId = null;
  function tickerStart() { if (!tickerId) tickerId = setInterval(renderZeit, 1000); }
  function tickerStop()  { if (tickerId) { clearInterval(tickerId); tickerId = null; } }

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
  /* ---------------------------------------------------------------------
     HEBEL 3 — kurze Reaktions-Einwuerfe beim Sprecherwechsel
     ---------------------------------------------------------------------
     Im echten Gespraech sagt der Zuhoerende nicht nichts. Beim Wechsel
     wird deshalb gelegentlich ein kurzes "Mhm." o.ae. vorangestellt.

     ZWEI BEWUSSTE ENTSCHEIDUNGEN:

     1. Der Einwurf wird dem Segmenttext VORANGESTELLT, nicht als eigener
        Sprechvorgang abgespielt. Damit bleibt es EINE Audiodatei — kein
        zusaetzlicher Schnitt, keine zusaetzliche Luecke.

     2. Die Auswahl ist DETERMINISTISCH (aus Kapitel- und Segmentnummer
        gerechnet), nicht zufaellig. Bei Zufall bekaeme dasselbe Segment
        bei jedem Hoeren einen anderen Text — und damit jedes Mal einen
        neuen Eintrag im Zwischenspeicher, der neu synthetisiert werden
        muesste. Deterministisch heisst: einmal erzeugt, fuer immer aus
        dem Geraetespeicher. Belastet das Monatskontingent also nur beim
        allerersten Durchlauf, danach null.
     --------------------------------------------------------------------- */
  /* Wörter, mit denen eine Replik von sich aus schon zustimmend beginnt.
     BEHOBENER FEHLER (18.08.2026): Vorher wurde nicht geprueft, womit das
     Segment selbst anfaengt. Bei "Genau, der kommt naemlich..." setzte sich
     dann ein "Stimmt." davor — zwei Bestaetigungen hintereinander, die sich
     gegenseitig entwerten und zusammenhangslos klingen. Genau der von
     ruckG4zz gemeldete Fall. */
  const EIGENE_ZUSTIMMUNG = /^\s*(genau|stimmt|richtig|klar|gut|ja|okay|ok|mhm|aha|verstehe|korrekt|exakt|sehr gut|so ist es|absolut|eben)\b/i;

  function reaktionFuer(chIdx, segIdx, seg, vorheriges) {
    if (!vorheriges || vorheriges.voice === seg.voice) return '';
    const liste = (MOD.reaktionen && MOD.reaktionen.length) ? MOD.reaktionen : null;
    if (!liste) return '';

    /* Faengt die Replik selbst schon bestaetigend an, bleibt sie unangetastet. */
    if (EIGENE_ZUSTIMMUNG.test(seg.text)) return '';

    /* Eine Rueckfrage bekommt keine Zustimmung vorangestellt — "Mhm. Und
       wie erkenne ich das?" klingt falsch, weil zugestimmt wird, bevor
       ueberhaupt etwas gesagt wurde. */
    if (/\?\s*$/.test(String(vorheriges.text || ''))) return '';

    const h = (chIdx * 977 + segIdx * 31 + 7) >>> 0;
    if (h % 4 !== 0) return '';                 // sparsamer als vorher (jeder 4.)
    return liste[h % liste.length] + ' ';
  }

  /* Der endgueltige Sprechtext einer Position.
     MUSS fuer Wiedergabe UND Vorabladen identisch sein, sonst zeigen die
     beiden auf unterschiedliche Eintraege im Zwischenspeicher und das
     Vorabladen waere wirkungslos (und wuerde doppelt verbrauchen). */
  /* Layer-bezogene Fassung — noetig fuer das Vorabladen ueber die
     Schichtgrenze hinweg (siehe naechstePosition). */
  function segmentTextVon(layerIdx, chIdx, segIdx) {
    const l = LAYERS[layerIdx];
    if (!l) return null;
    const ch = l.podcast.chapters[chIdx];
    if (!ch) return null;
    const seg = ch.segments[segIdx];
    if (!seg) return null;
    const vorheriges = segIdx > 0 ? ch.segments[segIdx - 1] : null;
    return { text: reaktionFuer(chIdx, segIdx, seg, vorheriges) + seg.text, voice: seg.voice, seg };
  }

  function segmentText(chIdx, segIdx) {
    return segmentTextVon(state.layer, chIdx, segIdx);
  }

  /* Die naechste Position — ueber Kapitel- UND Schichtgrenzen hinweg.
     ---------------------------------------------------------------------
     Der Sprung ueber die Schichtgrenze ist neu (18.08.2026). Ohne ihn
     endete das Vorabladen am letzten Segment einer Schicht: das erste
     Segment der naechsten haette erst nach dem Wechsel synthetisiert
     werden muessen. Genau in dieser Luecke raeumt Android die Wiedergabe
     im Hintergrund ab — der automatische Uebergang waere also ausgerechnet
     im Auto, bei dunklem Bildschirm, am unzuverlaessigsten gewesen.
     Rueckgabe jetzt [layerIdx, chapterIdx, segmentIdx]. */
  function naechstePosition(layerIdx, chIdx, segIdx) {
    const l = LAYERS[layerIdx];
    if (!l) return null;
    const ch = l.podcast.chapters[chIdx];
    if (ch && segIdx + 1 < ch.segments.length) return [layerIdx, chIdx, segIdx + 1];
    if (chIdx + 1 < l.podcast.chapters.length) return [layerIdx, chIdx + 1, 0];
    if (layerIdx + 1 < LAYERS.length)          return [layerIdx + 1, 0, 0];
    return null;
  }

  /* Der gesprochene Uebergang von einer Schicht in die naechste.
     DETERMINISTISCH ueber den Schicht-Index gewaehlt, nicht zufaellig:
     nur so trifft das Vorabladen spaeter denselben Eintrag im
     Zwischenspeicher wie die Wiedergabe. Bei Zufall waere es jedes Mal ein
     neuer Text und damit eine neue Synthese. */
  function uebergangsText(vonIdx) {
    const alt = LAYERS[vonIdx];
    const neu = LAYERS[vonIdx + 1];
    if (!alt || !neu) return '';
    const liste = MOD.schichtwechsel;
    return fuellen(liste[vonIdx % liste.length], {
      fertig:   alt.gesprochen,
      naechste: neu.gesprochen,
      thema:    neu.thema || neu.kurz
    });
  }

  async function playLoop() {
    const myGen = ++state.gen;
    state.playing = true;
    setPlayUI(true);
    silentKeepAlive(true);
    tickerStart();
    sitzungStarten();

    while (state.playing && state.gen === myGen) {
      const ch = P().chapters[state.chapter];
      if (!ch) break;
      const seg = ch.segments[state.segment];

      if (!seg) {
        // Kapitel zu Ende -> nächstes
        if (state.chapter + 1 < P().chapters.length) {
          state.chapter++; state.segment = 0;
          renderNow(); save(); updateMediaMeta();
          continue;
        }

        /* ===== SCHICHT ZU ENDE — AUTOMATISCH WEITER (18.08.2026) =====

           Vorher endete hier alles: Meldung, Stopp, Stille. Wer weiterhoeren
           wollte, musste die naechste Schicht antippen und erneut auf
           Abspielen druecken.

           Vorgabe von ruckG4zz: gehoert wird unter anderem beim Autofahren.
           Eine Bedienaufforderung ist dort nicht nur unbequem, sondern
           schlicht nicht ausfuehrbar — der Podcast waere einfach verstummt.
           Deshalb laeuft es jetzt von allein weiter, mit einer kurzen
           gesprochenen Ueberleitung.

           BEWUSST NICHT ueber layerWechseln(): das ruft stopPlay(), was die
           eigene Abspielschleife hier mitten im Lauf abraeumen wuerde. Der
           Wechsel passiert deshalb direkt im Zustand, die Schleife laeuft
           mit `continue` einfach in der neuen Schicht weiter. */
        const naechsterIdx = state.layer + 1;
        if (naechsterIdx < LAYERS.length) {
          /* Erst den Stand der abgeschlossenen Schicht sichern — sonst
             stuende sie beim naechsten Oeffnen wieder auf "fast fertig". */
          save();

          const ansage = uebergangsText(state.layer);
          log(ansage, 'recap');
          const uebergang = await Speech.speak(ansage, { voice: 'b' });

          // Waehrend der Ueberleitung gestoppt (Frage, Sprung, Pause)?
          if (state.gen !== myGen) return;
          if (uebergang && uebergang.stopped) return;

          state.layer   = naechsterIdx;
          state.chapter = 0;
          state.segment = 0;

          /* Die laufende Hoer-Sitzung wird ABSICHTLICH nicht angefasst:
             sie laeuft ueber den Schichtwechsel hinweg weiter, damit die
             Abschluss-Zusammenfassung am Ende beide Schichten kennt. */
          renderKopf(); renderLayers(); renderChapters();
          renderNow(); save(); updateMediaMeta();
          continue;
        }

        /* Letzte vorhandene Schicht — hier gibt es nichts mehr, wohin
           uebergeleitet werden koennte. Das Skript selbst endet bereits
           mit einem gesprochenen Schlusswort. */
        log(schicht().knopf + ' ist durch. Das war alles. Gut gemacht.', 'sys');
        stopPlay();
        break;
      }

      renderNow();
      highlightSegment(seg);

      const jetzt = segmentText(state.chapter, state.segment);

      /* VORABLADEN des naechsten Segments — nicht abwarten, laeuft parallel
         zum aktuellen Sprechen. Das ist der eigentliche Fix gegen den
         Abbruch bei gesperrtem Bildschirm: beim Segmentwechsel entsteht
         dadurch keine Netz-Wartezeit mehr, in der Android die Wiedergabe
         fuer beendet haelt. Kostet kein zusaetzliches Zeichen, es zieht
         denselben Abruf nur zeitlich vor. */
      const np = naechstePosition(state.layer, state.chapter, state.segment);
      if (np) {
        const kommt = segmentTextVon(np[0], np[1], np[2]);
        if (kommt) Speech.prefetch(kommt.text, { voice: kommt.voice });

        /* Fuehrt der naechste Schritt in eine ANDERE Schicht, liegt
           dazwischen noch die gesprochene Ueberleitung. Die muss ebenfalls
           vorab bereitliegen — sonst entsteht ausgerechnet an der
           Nahtstelle die Luecke, an der Android die Hintergrundwiedergabe
           abraeumt. Kostet kein zusaetzliches Zeichen: der Text ist
           deterministisch und wird ohnehin genau einmal synthetisiert. */
        if (np[0] !== state.layer) {
          const brueckentext = uebergangsText(state.layer);
          if (brueckentext) Speech.prefetch(brueckentext, { voice: 'b' });
        }
      }

      const res = await Speech.speak(jetzt.text, { voice: jetzt.voice });

      // Während des Sprechens abgebrochen (Pause, Frage, Sprung)?
      if (state.gen !== myGen) return;

      /* Cloud-Fehler sind jetzt LAUT, nicht mehr still (kein Rueckfall auf
         die Browser-Stimme). Ohne diese Anzeige waere die App einfach
         stumm und niemand wuesste warum. */
      if (res && (res.error === 'kein-schluessel' || res.error === 'cloud-fehler')) {
        log('Sprachausgabe gestoppt: ' + (res.cloudFehler || res.error), 'err');
        zeigeSprachFehler(res.cloudFehler || res.error);
        stopPlay();
        return;
      }

      if (res && res.stopped) { return; }

      /* Erst JETZT gilt der Abschnitt als tatsaechlich gehoert. Grundlage
         fuer die Sitzungs-Zusammenfassung am Ende: gezaehlt wird nur, was
         auch wirklich durchgelaufen ist — nicht, worueber man hinweg
         gesprungen ist. */
      sitzungZaehlen(jetzt.text.length);

      state.segment++;
      save();
    }
    silentKeepAlive(false);
    tickerStop();
  }

  /* Sichtbare, unuebersehbare Meldung wenn die Sprachausgabe nicht kann. */
  function zeigeSprachFehler(text) {
    el.transcript.innerHTML =
      '<strong style="color:var(--bad)">Keine Sprachausgabe.</strong><br>' +
      String(text) +
      '<br><span style="color:var(--fg-dim);font-size:.85em">' +
      'Die Browser-Stimme wurde bewusst entfernt — es gibt keinen stillen Ersatz mehr. ' +
      'Trag unter „Stimmen" einen gültigen API-Schlüssel ein.</span>';
  }

  function highlightSegment(seg) {
    el.transcript.textContent = seg.text;
    el.speaker.textContent = seg.voice === 'b' ? 'Stimme B' : 'Stimme A';
    el.speaker.className = 'speaker speaker-' + seg.voice;
  }

  /* ===== ZWEI BEHOBENE URSACHEN FÜR "DERSELBE TEXT ZWEIMAL" (18.08.2026) =====

     URSACHE 1 — Pause war gar keine Pause, sondern ein Stopp.
     togglePlay() rief frueher stopPlay(), was die Wiedergabe hart abbrach und
     die Abspielposition auf null zurueckdrehte. Der laufende Abschnitt wurde
     dabei NICHT als erledigt gezaehlt. Beim naechsten Play begann derselbe
     Abschnitt also wieder von vorn — hatte man ihn vorher fast zu Ende
     gehoert, klang das wie "derselbe Text zweimal".
     Jetzt ist Pause eine echte Pause: das Audio-Element haelt an der Stelle
     an, an der es steht, und laeuft dort weiter.

     URSACHE 2 — startPlay() konnte eine ZWEITE Abspielschleife starten.
     Es gab keine Sperre gegen einen Aufruf bei bereits laufender Wiedergabe.
     Die Sperrbildschirm-Steuerung (Media Session) ruft startPlay() aber
     direkt auf, und Android feuert dort beim Hantieren mit Play/Pause gern
     mehrfach. Ergebnis: zwei Schleifen liefen gleichzeitig und sprachen
     durcheinander — besonders auffaellig an Kapitelgrenzen, wo beide
     gleichzeitig ins neue Kapitel wechselten. Jetzt prallt ein zweiter
     Aufruf sauber ab. */

  function startPlay() {
    if (state.busy) return;
    if (state.playing) return;                 // Ursache 2: keine zweite Schleife
    if (state.paused) { resumePlay(); return; } // fortsetzen statt neu beginnen
    playLoop();
  }

  /* Echte Pause: die Abspielschleife bleibt am Leben und haengt weiter im
     await. Deshalb hier KEIN state.gen++ — das wuerde sie entwerten. */
  function pausePlay() {
    state.playing = false;
    state.paused  = true;
    Speech.pause();
    setPlayUI(false);
    tickerStop();
    renderZeit();          // Standlinie einmal sauber nachziehen
    log('Pausiert.', 'sys');
  }

  /* ===== BEHOBEN: PLAY AUF DEM SPERRBILDSCHIRM TAT NICHTS (18.08.2026) =====

     Von ruckG4zz gemeldet: ueber die Steuerung im gesperrten Zustand liess
     sich anhalten, aber nicht wieder starten — dafuer musste der Bildschirm
     erst entsperrt werden.

     Ursache: `player.play()` gibt ein Promise zurueck, das Android ablehnt,
     wenn die Seite im Hintergrund liegt. In speech.js wurde dieser Fehler
     bis eben komplett verschluckt. Nach aussen sah es aus, als sei der
     Knopf tot — es gab weder Ton noch Meldung.

     Jetzt meldet Speech.resume() ehrlich zurueck, ob es geklappt hat. Und
     wenn nicht, wird der laufende Abschnitt von vorn angeworfen, statt
     tatenlos zu bleiben: ein Satz doppelt zu hoeren ist deutlich besser
     als ein Knopf, der nicht reagiert. */
  async function resumePlay() {
    state.paused  = false;
    state.playing = true;
    setPlayUI(true);
    silentKeepAlive(true);
    tickerStart();

    const ok = await Speech.resume();
    if (ok) return true;

    log('Fortsetzen wurde vom Browser abgelehnt (' +
        (Speech.letzterPlayFehler() || 'ohne Angabe') +
        '). Der Abschnitt wird neu gestartet.', 'sys');

    /* Die alte Schleife haengt noch im await einer Wiedergabe, die nie
       endet (pausiertes Audio feuert kein 'ended'). Speech.stop() loest
       sie auf, danach faengt playLoop() denselben Abschnitt neu an. */
    Speech.stop();
    state.playing = false;
    playLoop();
    return false;
  }

  /* Harter Stopp: beendet die Schleife wirklich. Fuer Sprung, Zwischenfrage
     und Ende des Podcasts — nicht fuer die Pausentaste. */
  function stopPlay() {
    state.playing = false;
    state.paused  = false;
    state.gen++;
    Speech.stop();
    setPlayUI(false);
    silentKeepAlive(false);
    tickerStop();
  }

  function togglePlay() {
    if (state.playing)     { pausePlay(); }
    else if (state.paused) { resumePlay(); }
    else                   { startPlay(); }
  }

  /* ---------------------------------------------------------------------
     PLAY VON DER MEDIENSTEUERUNG (Sperrbildschirm / Kopfhoerertaste)
     ---------------------------------------------------------------------
     Braucht mehr Vorsicht als der Knopf in der App, weil der Zustand hier
     auseinanderlaufen kann: raeumt Android die Wiedergabe im Hintergrund
     ab, steht state.playing weiterhin auf true — der Ton ist aber weg.
     startPlay() wuerde in diesem Fall sofort wieder aussteigen ("laeuft ja
     schon") und der Knopf bliebe wirkungslos. Genau dieses Bild hat
     ruckG4zz beschrieben.

     Deshalb wird hier zusaetzlich geprueft, ob tatsaechlich Ton laeuft,
     und im Zweifel neu angeworfen.
     --------------------------------------------------------------------- */
  function medienPlay() {
    if (state.busy) return;
    if (state.paused) { resumePlay(); return; }

    if (state.playing && !Speech.isSpeaking()) {
      log('Die Wiedergabe stand still, obwohl sie laufen sollte — wird neu gestartet.', 'sys');
      Speech.stop();
      state.playing = false;
      playLoop();
      return;
    }
    startPlay();
  }

  function jumpTo(chapterIdx, segIdx = 0, announce = false) {
    const wasPlaying = state.playing;
    stopPlay();
    state.chapter = Math.max(0, Math.min(chapterIdx, P().chapters.length - 1));
    state.segment = segIdx;
    save(); renderNow(); updateMediaMeta();
    const ch = P().chapters[state.chapter];
    if (announce) log('Sprung zu: ' + ch.titel, 'sys');
    if (wasPlaying || announce) startPlay();
  }

  /* =====================================================================
     HÖR-SITZUNG UND ABSCHLUSS-ZUSAMMENFASSUNG
     ---------------------------------------------------------------------
     Aus dem Ursprungskonzept vom 31.07.2026 ("Am Ende einer Session:
     Zusammenfassungsblock"), damals bewusst nicht Teil des Piloten,
     nachgetragen am 18.08.2026.

     ABGRENZUNG zum Kapitel "Zusammenfassung Layer X": Das ist ein fester
     Merkblock zum kompletten Themengebiet einer Schicht. Was hier
     entsteht, ist etwas anderes — ein Bericht ueber genau DIESE Sitzung:
     wie lange, welche Kapitel, wo es weitergeht. Deshalb dynamisch
     zusammengesetzt statt im Skript hinterlegt.

     WICHTIG zur Inhaltsregel: es wird kein Fachinhalt erfunden. Genannt
     werden ausschliesslich Kapiteltitel und deren Kurzbeschreibungen, wie
     sie in den content-Dateien stehen, plus reine Navigationsangaben.
     ===================================================================== */
  function sitzungStarten() {
    if (state.sitzung) return;
    state.sitzung = {
      beginn:  Date.now(),
      gehoert: 0,          // tatsaechlich durchgelaufene Zeichen
      kapitel: []          // "layerIdx:chapterIdx", in Hoerreihenfolge
    };
  }

  function sitzungZaehlen(zeichen) {
    if (!state.sitzung) return;
    state.sitzung.gehoert += zeichen;
    const marke = state.layer + ':' + state.chapter;
    if (state.sitzung.kapitel[state.sitzung.kapitel.length - 1] !== marke) {
      /* Nur aufnehmen, wenn es nicht schon direkt davor stand — bei einem
         Ruecksprung soll ein Kapitel aber durchaus zweimal auftauchen
         duerfen, deshalb kein globales Set. Beim Vorlesen wird spaeter
         entdoppelt. */
      state.sitzung.kapitel.push(marke);
    }
  }

  /* Baut den gesprochenen Bericht. Gibt null zurueck, wenn in dieser
     Sitzung nichts gehoert wurde — dann gibt es auch nichts zu berichten. */
  function sitzungBericht() {
    const s = state.sitzung;
    if (!s || !s.gehoert) return null;

    const minuten = Math.max(1, Math.round(sekundenAusZeichen(s.gehoert) / 60));

    /* Reihenfolge erhalten, Doppelnennungen raus */
    const gesehen = new Set();
    const kapitel = [];
    s.kapitel.forEach(m => {
      if (gesehen.has(m)) return;
      gesehen.add(m);
      const [li, ci] = m.split(':').map(Number);
      const l = LAYERS[li];
      if (l && l.podcast.chapters[ci]) kapitel.push({ layer: l, ch: l.podcast.chapters[ci] });
    });
    if (!kapitel.length) return null;

    /* Schichten, die berührt wurden — für den Einleitungssatz */
    const schichten = [...new Set(kapitel.map(k => k.layer.gesprochen))];

    const teile = [];
    teile.push({ voice: 'b', text:
      `Kurzer Rückblick auf diese Sitzung. Du hast rund ${minuten} ${minuten === 1 ? 'Minute' : 'Minuten'} gehört, ` +
      `und zwar in ${schichten.length === 1 ? schichten[0] : schichten.join(' und ')}.` });

    teile.push({ voice: 'a', text:
      `Durch waren dabei ${kapitel.length} ${kapitel.length === 1 ? 'Kapitel' : 'Kapitel'}.` });

    /* Die Kapitel einzeln, mit ihrer Kurzbeschreibung aus dem Skript.
       Bei sehr vielen Kapiteln bewusst gekuerzt — eine Aufzaehlung von
       zwanzig Titeln hoert sich niemand bis zum Ende an. */
    const nennen = kapitel.slice(0, 8);
    nennen.forEach((k, i) => {
      teile.push({
        voice: i % 2 === 0 ? 'b' : 'a',
        text: `${k.ch.titel}. Da ging es um ${k.ch.kurz}.`
      });
    });
    if (kapitel.length > nennen.length) {
      teile.push({ voice: 'a', text:
        `Und ${kapitel.length - nennen.length} weitere, die ich nicht alle aufzähle.` });
    }

    const ch = P().chapters[state.chapter];
    teile.push({ voice: 'b', text:
      `Beim nächsten Mal geht es weiter bei ${ch.titel}, in ${schicht().gesprochen}. Bis dahin.` });

    return { minuten, kapitel, teile };
  }

  /* Zeigt die Beenden-Abfrage. Bewusst eine Karte in der App und kein
     Browser-Dialog: nur so lassen sich drei echte Wahlmöglichkeiten
     anbieten statt nur OK und Abbrechen. */
  function beendenAnbieten() {
    if (state.playing) pausePlay();
    const b = sitzungBericht();
    if (!el.endBox) return;
    el.endBox.hidden = false;
    el.endText.textContent = b
      ? `Du hast in dieser Sitzung rund ${b.minuten} ${b.minuten === 1 ? 'Minute' : 'Minuten'} gehört, ` +
        `verteilt auf ${b.kapitel.length} ${b.kapitel.length === 1 ? 'Kapitel' : 'Kapitel'}. ` +
        `Soll ich kurz zusammenfassen, was das war?`
      : 'In dieser Sitzung wurde noch nichts gehört — es gibt also nichts zusammenzufassen.';
    if (el.endSummary) el.endSummary.disabled = !b;
    try { el.endBox.scrollIntoView({ behavior: 'smooth', block: 'center' }); } catch (_) {}
  }

  /* Spricht den Bericht und beendet danach die Sitzung. */
  async function sitzungAbschliessen() {
    const bericht = sitzungBericht();
    stopPlay();
    if (!bericht) {
      log('In dieser Sitzung wurde noch nichts gehört — es gibt nichts zusammenzufassen.', 'sys');
      state.sitzung = null;
      return;
    }
    for (const t of bericht.teile) {
      log(t.text, 'recap');
      const res = await Speech.speak(t.text, { voice: t.voice });
      if (res && res.stopped) break;   // abgebrochen, z.B. weil doch weitergehört wird
    }
    state.sitzung = null;
  }

  /* "Fass mal zusammen" — springt ins Zusammenfassungs-Kapitel der
     laufenden Schicht.
     ---------------------------------------------------------------------
     Jede Schicht hat seit 18.08.2026 ein eigenes Kapitel mit der ID
     'zusammenfassung'. Es ist bewusst vom Übergang zur nächsten Schicht
     getrennt, damit es allein anspringbar und allein hörbar ist — etwa
     als letzte Wiederholung vor einer Prüfung, ohne den ganzen Layer
     nochmal durchlaufen zu müssen. */
  function zurZusammenfassung() {
    const idx = P().chapters.findIndex(c => c.id === 'zusammenfassung');
    if (idx >= 0) { jumpTo(idx, 0, true); return; }
    /* Ehrlich statt stumm: kaeme nur vor, wenn eine Inhaltsdatei in einer
       aelteren Fassung ausgeliefert wurde. */
    log('Diese Schicht hat kein Zusammenfassungs-Kapitel.', 'err');
  }

  function nextChapter() {
    if (state.chapter + 1 < P().chapters.length) jumpTo(state.chapter + 1, 0, true);
    else log('Das war schon das letzte Kapitel.', 'sys');
  }

  function prevChapter() {
    if (state.chapter > 0) jumpTo(state.chapter - 1, 0, true);
    else log('Du bist schon am Anfang.', 'sys');
  }

  /* "Kannst du das nochmal wiederholen?"
     ---------------------------------------------------------------------
     Bewusst NICHT ueber repeatSegment(): das springt eins zurueck, was nur
     stimmt, wenn das Segment vorher sauber zu Ende lief. Beim Wiederholen
     kommt der Wunsch aber fast immer waehrend eines Segments — die Frage
     unterbricht es. state.segment zeigt dann noch auf genau dieses
     angefangene Segment, und genau das soll noch einmal kommen.

     Ausserdem wird der Wunsch hoerbar bestaetigt, statt wortlos neu
     anzusetzen. */
  async function wiederholen() {
    const ansage = pick(MOD.wiederholung);
    log(ansage, 'recap');
    await Speech.speak(ansage, { voice: 'b' });
    renderNow(); save();
    startPlay();
  }

  /* "Kannst du hier nochmal von vorne beginnen?" / "Ich hab den Faden verloren."
     ---------------------------------------------------------------------
     Gegenstueck zur echten Pause: die Pausentaste setzt bewusst dort fort,
     wo aufgehoert wurde. Wer wirklich raus ist, kommt hierueber zurueck an
     den Anfang des LAUFENDEN KAPITELS — nicht nur des einen Abschnitts
     (dafuer gibt es 'repeat') und nicht des ganzen Podcasts.

     Ohne Vorwurf formuliert: den Faden zu verlieren ist beim Zuhoeren
     voellig normal, das soll sich nicht wie ein Fehler anfuehlen. */
  async function kapitelNeu() {
    const ch = P().chapters[state.chapter];
    const ansage = fuellen(pick(MOD.neustart), { kapitel: ch.titel, kurz: ch.kurz });
    log(ansage, 'recap');
    state.segment = 0;
    renderNow(); save(); updateMediaMeta();
    await Speech.speak(ansage, { voice: 'b' });
    startPlay();
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
  const MOD_STANDARD = {
    wortmeldung:            ['Wir haben eine Zwischenfrage.'],
    antwortStart:           ['Klar.'],
    keinTreffer:            ['Dazu haben wir in {schicht} nichts Passendes.'],
    keinTrefferAbschluss:   ['Merken wir uns für später.'],
    andereSchicht:          ['Das gehört nicht hierher, sondern in {schicht} — Stichwort {begriff}.'],
    andereSchichtAbschluss: ['Wenn du magst, wechsel oben die Schicht.'],
    schichtwechsel:         ['Das war {fertig}. Weiter mit {naechste}, {thema}.'],
    zurueck:                ['Zurück zum Thema: {kapitel}.'],
    wiedereinstieg:         ['Willkommen zurück. Wir waren bei {kapitel} — {kurz}.'],
    sprung:                 ['Weiter bei {kapitel}.'],
    mikroAnsage:            ['Ja bitte?'],
    wiederholung:           ['Klar, nochmal.'],
    neustart:               ['Kein Problem, wir fangen bei {kapitel} nochmal von vorne an.'],
    reaktionen:             ['Mhm.']
  };

  /* Fehlende Bausteine werden aufgefuellt, statt dass die App an einer
     aelteren content-l1.js scheitert (vergessener Upload, zaeher Cache). */
  const MOD = Object.assign({}, MOD_STANDARD,
    (typeof MODERATION !== 'undefined' && MODERATION) ? MODERATION : {});
  for (const k of Object.keys(MOD_STANDARD)) {
    if (!Array.isArray(MOD[k]) || !MOD[k].length) MOD[k] = MOD_STANDARD[k];
  }

  function pick(arr) {
    if (!arr || !arr.length) return '';
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function fuellen(vorlage, werte) {
    return String(vorlage).replace(/\{(\w+)\}/g, (_, k) => werte[k] != null ? werte[k] : '');
  }

  /* Sucht einen Begriff in den Registern der ANDEREN Schichten.
     Ergebnis wird nur fuer den ehrlichen Verweis benutzt — es wird
     ausdruecklich NICHT quer geantwortet (siehe Kommentar bei
     MODERATION.andereSchicht in content-l1.js). */
  function inAndererSchicht(text) {
    for (let i = 0; i < LAYERS.length; i++) {
      if (i === state.layer) continue;
      const l = LAYERS[i];
      if (!l.register || !l.register.length) continue;
      const treffer = Matcher.findTerm(text, l.register);
      /* Risiko-Aliase (z.B. "man") zaehlen hier NICHT: ein unsicherer
         Treffer in einer fremden Schicht waere reines Raten. */
      if (treffer && !treffer.risky) {
        return { layerIdx: i, layer: l, entry: treffer.entry };
      }
    }
    return null;
  }

  function recapText(kindOfReturn) {
    const ch = P().chapters[state.chapter];
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

    /* ===== SOFORT-UNTERBRECHUNG (Wunsch ruckG4zz, 18.08.2026) =====
       Vorher wurde die Wiedergabe wortlos gekappt — das wirkte abrupt und
       unnatuerlich. In einem echten Gespraech redet der andere nicht
       stumpf zu Ende, er reagiert. Genau das passiert jetzt:

         1. Der laufende Satz wird SOFORT abgeschnitten, mitten im Wort.
            Er wird ausdruecklich NICHT zu Ende gesprochen.
         2. Direkt danach kommt eine kurze hoerbare Reaktion
            ("Oh, Moment — da kommt eine Frage. Ja bitte?").
         3. Erst dann geht das Mikrofon auf.

       Preis dafuer, ehrlich benannt: die Aufnahme startet rund ein bis
       zwei Sekunden spaeter als vorher. Beim allerersten Mal etwas mehr,
       weil die Ansage einmal synthetisiert werden muss — danach liegt sie
       im Geraetespeicher und kommt ohne Verzoegerung. */
    Speech.stopSofort();
    stopPlay();

    el.mic.classList.add('listening');
    el.mic.textContent = '🎤  Moment …';
    micHeard('');
    micStatus('Unterbreche …');

    try {
      const ansage = pick(MOD.mikroAnsage);
      log(ansage, 'recap');
      await Speech.speak(ansage, { voice: 'b' });
    } catch (_) {
      /* Die Ansage ist Hoeflichkeit, kein Muss. Scheitert sie, wird
         trotzdem zugehoert — sonst waere die Frage verloren. */
    }

    el.mic.textContent = '🎤  Ich höre …';
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
      const r = Matcher.parse(text, P(), R());

      if (r.type === 'command') {
        el.qtext.value = '';

        /* ===== BEHOBENER SACKGASSEN-FEHLER (18.08.2026) =====
           startPlay() beginnt mit `if (state.busy) return;`. state.busy wird
           beim Stellen einer Frage gesetzt und erst im finally weiter unten
           wieder geloest — also NACH diesen return-Anweisungen hier.

           Folge vorher: jeder Befehl, der die Wiedergabe wieder anwerfen
           wollte (jump, next, prev, repeat, resume), prallte an genau dieser
           Sperre ab. Es passierte schlicht nichts, der Podcast stand.
           Das war exakt der von ruckG4zz gemeldete Fall "kannst du das
           nochmal wiederholen" -> keine Reaktion, kein Weiterlaufen.

           Ein Befehl ist eine abgeschlossene Handlung, kein laufender
           Frage-Antwort-Vorgang. Deshalb wird die Sperre hier VOR der
           Ausfuehrung geloest. Das finally unten setzt sie ohnehin
           nochmal — doppelt schadet nicht. */
        state.busy = false;

        switch (r.cmd) {
          case 'jump':     jumpTo(r.index, 0, true); return;
          case 'next':     nextChapter(); return;
          case 'prev':     prevChapter(); return;
          case 'repeat':   await wiederholen(); return;
          case 'restart':  await kapitelNeu();  return;
          case 'pause':    log('Pausiert.', 'sys'); return;
          case 'resume':   startPlay(); return;
          case 'summary':  zurZusammenfassung(); return;
          case 'ende':     await sitzungAbschliessen(); return;
          case 'recap':    await speakRecap('manuell'); if (wasPlaying) startPlay(); return;
          case 'overview': await speakOverview();      if (wasPlaying) startPlay(); return;
        }
        return;
      }

      if (r.type === 'term') {
        /* ===== BEHOBEN: DOPPELTE FRAGE-ANKUENDIGUNG (18.08.2026) =====
           Hier stand frueher zusaetzlich MOD.wortmeldung ("Oh, wir haben eine
           Zwischenfrage. Hoeren wir mal rein."). Das war noch aus der Zeit
           VOR der Sofort-Unterbrechung sinnvoll, als die Frage erst nach der
           Ankuendigung kam.

           Seit die Aufnahme mit MOD.mikroAnsage eingeleitet wird, ist die
           Frage an dieser Stelle laengst gestellt und verstanden. Die zweite
           Ankuendigung kam also NACH der Frage — "hoeren wir mal rein",
           obwohl schon zugehoert wurde. Genau die von ruckG4zz gemeldete
           Dopplung: Ansage, Frage, nochmal Ansage, dann erst die Antwort.

           Jetzt geht es direkt in die Antwort. */
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
        /* Das Beispiel wird aus der LAUFENDEN Schicht genommen. Frueher stand
           hier fest "spring zu Topologien" — in Layer 2 oder 3 waere das ein
           Ratschlag, der garantiert ins Leere laeuft. */
        const beispiel = P().chapters[Math.min(2, P().chapters.length - 1)].titel;
        const t = `Du willst springen, aber ich habe nicht verstanden wohin. Sag zum Beispiel: spring zu ${beispiel}.`;
        log(t, 'err');
        await Speech.speak(t, { voice: 'b' });
        fortsetzen = wasPlaying;
        return;
      }

      /* ===== NEU MIT LAYER 2 UND 3: Verweis statt blosser Absage =====
         Bevor ehrlich gepasst wird, wird geprueft, ob der Begriff in einer
         ANDEREN geladenen Schicht steht. Dann kommt kein "kenne ich nicht",
         sondern ein Wegweiser. Beantwortet wird trotzdem nichts aus der
         fremden Schicht — der Podcast bleibt bei seinem Thema. */
      const woanders = inAndererSchicht(text);
      if (woanders) {
        const verweis = fuellen(pick(MOD.andereSchicht), {
          schicht: woanders.layer.gesprochen,
          begriff: woanders.entry.label
        });
        log(verweis, 'answer');
        showOtherLayer(woanders);
        await Speech.speak(verweis, { voice: 'a' });

        const nach = pick(MOD.andereSchichtAbschluss);
        log(nach, 'recap');
        await Speech.speak(nach, { voice: 'b' });
        el.qtext.value = '';
        fortsetzen = wasPlaying;
        return;
      }

      /* Auch hier keine zweite Ankuendigung mehr (siehe oben) — direkt zur
         ehrlichen Absage. */
      const absage = fuellen(pick(MOD.keinTreffer), { schicht: schicht().gesprochen });
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
    const list = P().chapters.map((c, i) => `${i + 1}: ${c.titel}`).join('. ');
    const t = `${schicht().gesprochen} hat ${P().chapters.length} Kapitel. ${list}.`;
    log(t, 'answer');
    await Speech.speak(t, { voice: 'b' });
  }

  /* Quellenanzeige zu einer Antwort */
  function showSource(entry) {
    el.source.hidden = false;
    el.source.innerHTML =
      `<strong>Treffer:</strong> ${entry.label}
       <span class="src-chip">Kapitel: ${(P().chapters.find(c => c.id === entry.chapter) || {}).titel || entry.chapter}</span>
       <button class="src-jump" type="button">Dorthin springen</button>
       <div class="src-note">Quelle: ${P().quelle} (Begriffsregister).</div>`;
    el.source.querySelector('.src-jump').onclick = () => {
      const idx = P().chapters.findIndex(c => c.id === entry.chapter);
      if (idx >= 0) jumpTo(idx, 0, true);
    };
  }

  /* Der Begriff steht in einer anderen Schicht — Wegweiser statt Antwort. */
  function showOtherLayer(fund) {
    el.source.hidden = false;
    el.source.innerHTML =
      `<strong>Gehört zu ${fund.layer.knopf}:</strong> ${fund.entry.label}
       <span class="src-chip">${fund.layer.podcast.titel}</span>
       <button class="src-jump" type="button">Zu ${fund.layer.knopf} wechseln</button>
       <div class="src-note">Beantwortet wird hier bewusst nichts aus einer anderen Schicht — sonst käme Stoff, der an dieser Stelle noch nicht einzuordnen ist. Der Stand in ${schicht().knopf} bleibt gespeichert.</div>`;
    el.source.querySelector('.src-jump').onclick = () => {
      const zielKapitel = fund.layer.podcast.chapters.findIndex(c => c.id === fund.entry.chapter);
      layerWechseln(fund.layerIdx);
      if (zielKapitel >= 0) jumpTo(zielKapitel, 0, true);
    };
  }

  function showNoMatch() {
    el.source.hidden = false;
    el.source.innerHTML =
      `<strong>Kein Treffer — weder in ${schicht().knopf} noch in den anderen geladenen Schichten.</strong>
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

  /* ---------------------------------------------------------------------
     STIMMEN-VOREINSTELLUNG — beide Chirp3-HD
     ---------------------------------------------------------------------
     Von ruckG4zz nach eigenem Hoervergleich festgelegt. Die frueheren
     WaveNet-Vorgaben sind bewusst entfernt, ebenso die Browser-Stimme als
     Ganzes (siehe Kopf von speech.js).

     KORRIGIERT 18.08.2026 (Layer-2/3-Session): Hier stand fuer Stimme B
     noch 'de-DE-Studio-C'. Gehoert wurde aber laengst Achernar — die Wahl
     lag nur im Geraetespeicher, nicht im Code. Auf einem frisch
     eingerichteten Geraet (oder nach dem Loeschen der Browserdaten, was
     vor einem Test schon vorkam) haette der Podcast damit ploetzlich mit
     einer ANDEREN Frauenstimme gesprochen.

     Warum das mehr als Kosmetik ist: Wiedererkennungswert ist bei einem
     Podcast ein Grundsatz, kein Detail. Zwei Sprecher, die ueber alle
     Schichten hinweg dieselben bleiben, sind Teil des roten Fadens —
     genauso wie das durchgehende Farbschema bei den HTML-Enzyklopaedien.
     Ein Stimmwechsel mitten in der Reihe wuerde denselben Bruch erzeugen.

     Nebeneffekt, positiv: beide Stimmen sind jetzt Chirp3-HD und teilen
     sich damit dasselbe, deutlich groessere Freikontingent (1 Mio. statt
     100.000 Zeichen/Monat bei Studio). Bei ~84.000 Zeichen fuer alle drei
     Schichten faellt das erst richtig ins Gewicht.
     --------------------------------------------------------------------- */
  const STIMME_A_STANDARD = 'de-DE-Chirp3-HD-Enceladus';   // männlich
  const STIMME_B_STANDARD = 'de-DE-Chirp3-HD-Achernar';    // weiblich

  const cfg = {
    apiKey: '',
    voiceA: STIMME_A_STANDARD,
    voiceB: STIMME_B_STANDARD,
    stimmwechsel: false      // Marke: Studio-C -> Achernar bereits erledigt
  };

  function cfgLaden() {
    let nachtragen = false;
    try {
      const d = JSON.parse(localStorage.getItem(CFG_KEY) || '{}');
      Object.assign(cfg, {
        apiKey: d.apiKey || '',
        voiceA: d.voiceA || cfg.voiceA,
        voiceB: d.voiceB || cfg.voiceB,
        stimmwechsel: !!d.stimmwechsel
      });
      /* Altlast aufraeumen: wer die App vor dem 18.08.2026 benutzt hat, hat
         noch WaveNet-Stimmen im Geraetespeicher stehen. Die werden einmalig
         auf die neue Voreinstellung gehoben, damit niemand ungewollt mit
         den alten Stimmen weiterhoert. */
      if (/Wavenet|Standard/i.test(cfg.voiceA)) cfg.voiceA = STIMME_A_STANDARD;
      if (/Wavenet|Standard/i.test(cfg.voiceB)) cfg.voiceB = STIMME_B_STANDARD;

      /* ---------------------------------------------------------------
         EINMALIGE Umstellung Studio-C -> Achernar.

         Bewusst EINMALIG und mit Marke im Geraetespeicher, nicht als
         Dauerregel: sonst wuerde eine spaeter bewusst ueber die Auswahl
         getroffene Studio-Wahl bei jedem App-Start wieder ueberschrieben.
         Man koennte die Stimme dann gar nicht mehr umstellen — ein
         "Fix", der eine Funktion kaputtmacht, ist keiner.
         --------------------------------------------------------------- */
      if (!cfg.stimmwechsel) {
        if (cfg.voiceB === 'de-DE-Studio-C') cfg.voiceB = STIMME_B_STANDARD;
        cfg.stimmwechsel = true;
        nachtragen = true;
      }
    } catch (_) {}
    if (nachtragen) cfgSpeichern();   // schreibt die Marke mit weg
    else            anwendenCfg();
  }

  function cfgSpeichern() {
    try { localStorage.setItem(CFG_KEY, JSON.stringify(cfg)); } catch (_) {}
    anwendenCfg();
  }

  function anwendenCfg() {
    Speech.setCloudConfig({ apiKey: cfg.apiKey || null, voiceA: cfg.voiceA, voiceB: cfg.voiceB });
    if (el.apiKey && document.activeElement !== el.apiKey) el.apiKey.value = cfg.apiKey || '';
    if (el.keyWarn) el.keyWarn.hidden = !!cfg.apiKey;
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

    /* Die beiden Stimmen koennen unterschiedlichen Klassen angehoeren und
       haben dann UNTERSCHIEDLICHE Freikontingente — Studio 100.000
       Zeichen/Monat, Chirp3 dagegen 1 Mio. Angezeigt wird deshalb bewusst
       die knappere der beiden, sonst wiegt die Anzeige in falscher
       Sicherheit. */
    const klasseA = CloudTTS.klasseAusName(cfg.voiceA);
    const klasseB = CloudTTS.klasseAusName(cfg.voiceB);
    const freiA = CloudTTS.FREI_KONTINGENT[klasseA] || 1000000;
    const freiB = CloudTTS.FREI_KONTINGENT[klasseB] || 1000000;
    const klasse = freiA <= freiB ? klasseA : klasseB;

    const v = CloudTTS.verbrauch(klasse);
    const anzahl = await CloudTTS.cacheGroesse();
    const heiss = v.anteilProzent > 80;

    const fmt = n => n.toLocaleString('de-DE');
    el.usage.innerHTML = `
      <div><span>Stimme A</span><b>${cfg.voiceA} (${klasseA})</b></div>
      <div><span>Stimme B</span><b>${cfg.voiceB} (${klasseB})</b></div>
      <div><span>Maßstab (knapperes Kontingent)</span><b>${v.klasse}</b></div>
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

      const fuellen = (sel, gewaehlt, standard) => {
        sel.innerHTML = '';
        liste.forEach(v => {
          const o = document.createElement('option');
          o.value = v.name;
          o.textContent = `${v.name}  (${v.geschlecht === 'MALE' ? 'm' : v.geschlecht === 'FEMALE' ? 'w' : '?'}, ${v.klasse})`;
          sel.appendChild(o);
        });
        /* Reihenfolge der Rueckfallebenen bewusst so: erst die tatsaechlich
           gewaehlte Stimme, dann die festgelegte Voreinstellung. Frueher
           landete man hier ersatzweise bei einer WaveNet-Stimme — genau die
           sollen nicht mehr angesteuert werden. */
        const treffer = liste.find(v => v.name === gewaehlt)
          || liste.find(v => v.name === standard)
          || liste[0];
        if (treffer) sel.value = treffer.name;
      };

      fuellen(el.voiceA, cfg.voiceA, STIMME_A_STANDARD);
      fuellen(el.voiceB, cfg.voiceB, STIMME_B_STANDARD);
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
    try {
      /* Bewusst mit englischen Fachbegriffen gespickt: genau daran soll
         ruckG4zz hoeren, ob der Sprachwechsel von selbst sitzt oder ob die
         Aussprachetabelle in speech.js nachgeschaerft werden muss.
         Beide Stimmen tragen hier erklaerende UND fragende Anteile —
         die Rollen sind nicht mehr fest verteilt. */
      await Speech.speak(
        'Ich bin Stimme A. Kurzer Test mit englischen Begriffen: Full Duplex, Crosstalk, Twisted Pair und Access Point.',
        { voice: 'a' });
      await Speech.speak(
        'Und ich bin Stimme B. Ich erkläre genauso mit, zum Beispiel Straight Through, Crossover und Repeater.',
        { voice: 'b' });
      const f = Speech.letzterFehler();
      apiStatus(f ? ('Cloud fehlgeschlagen: ' + f) : 'Hörprobe fertig. Klingen die englischen Begriffe sauber?', f ? 'bad' : 'ok');
    } catch (e) {
      apiStatus(e.message || 'Hörprobe fehlgeschlagen.', 'bad');
    } finally {
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

  /* ---------------------------------------------------------------------
     STILLER DAUERTON — zweite Haelfte des Hintergrundwiedergabe-Fixes.

     KORREKTUR GEGENUEBER VORHER: Frueher wurde dieser Ton bei aktiver
     Cloud-Stimme ABGESCHALTET, mit der Begruendung, das <audio>-Element
     trage die Mediensitzung ohnehin selbst. Das war ein Denkfehler.

     Es traegt sie nur, SOLANGE es spielt. Zwischen zwei Segmenten steht es
     kurz still — und genau in diesem Moment gibt Android den Audio-Fokus
     frei und friert die Seite im Hintergrund ein. Der laufende Satz lief
     noch zu Ende, danach war Schluss: exakt das gemeldete Verhalten.

     Der stille Ton laeuft in Dauerschleife und haelt den Audio-Fokus
     ueber diese Luecken hinweg. Zusammen mit dem Vorabladen in speech.js
     (das die Luecke ueberhaupt erst klein macht) ist das der Doppelgriff
     gegen den Abbruch. Er laeuft jetzt IMMER, unabhaengig von der Stimme.
     --------------------------------------------------------------------- */
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
    const ch = P().chapters[state.chapter];
    try {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: ch.titel,
        artist: 'NEINT1 · ' + P().titel,
        album: 'FISI-Podcast',
        artwork: [{ src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' }]
      });
    } catch (_) {}
  }

  function initMediaSession() {
    if (!('mediaSession' in navigator)) return;
    const h = navigator.mediaSession.setActionHandler.bind(navigator.mediaSession);
    try {
      /* Sperrbildschirm: Pause muss hier ebenfalls eine ECHTE Pause sein,
         sonst springt der Abschnitt beim Fortsetzen an den Anfang zurueck. */
      h('play',          () => medienPlay());
      h('pause',         () => pausePlay());
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
    ['play','mic','ask','qtext','chapters','layers','log','bar','zeit','nowChapter','nowProgress',
     'transcript','speaker','source','diag','reset','next','prev',
     'endSession','endBox','endText','endSummary','endClose','endBack',
     'micbox','micStatus','micHeardText',
     'keyWarn','apiKey','apiSave','apiShow','apiTest',
     'apiClear','apiStatus','voiceA','voiceB','voiceLoad','voiceProbe',
     'usage','cacheClear','usageReset']
      .forEach(id => el[id] = document.getElementById(id));

    el.title = document.getElementById('title');

    /* Notausgang: ohne geladene Inhaltsdatei gibt es nichts abzuspielen.
       Lieber eine klare Meldung als eine App, die stumm im Nichts steht. */
    if (!LAYERS.length) {
      el.title.textContent = 'Keine Inhalte geladen';
      document.getElementById('subtitle').textContent =
        'Es wurde keine der Dateien content-l1.js, content-l2.js oder content-l3.js gefunden.';
      return;
    }

    /* Hoerstand an das neue Einleitungs-Kapitel anpassen — muss VOR dem
       ersten load() laufen, sonst wird der alte Index noch einmal
       angezeigt und beim naechsten save() falsch zurueckgeschrieben. */
    migriereL1Fortschritt();

    /* Zuletzt gehoerte Schicht wiederherstellen */
    try {
      const zuletzt = localStorage.getItem(LAYER_KEY);
      const idx = LAYERS.findIndex(l => l.id === zuletzt);
      if (idx >= 0) state.layer = idx;
    } catch (_) {}

    renderKopf();
    renderLayers();
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
      log(`Gespeicherter Stand in ${schicht().knopf} gefunden (${when.toLocaleDateString('de-DE')}, ${when.toLocaleTimeString('de-DE', {hour:'2-digit',minute:'2-digit'})}).`, 'sys');
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

    /* --- Sitzung beenden --- */
    if (el.endSession) el.endSession.onclick = beendenAnbieten;
    if (el.endSummary) el.endSummary.onclick = async () => {
      el.endBox.hidden = true;
      await sitzungAbschliessen();
    };
    if (el.endClose) el.endClose.onclick = () => {
      el.endBox.hidden = true;
      stopPlay();
      state.sitzung = null;
      log('Sitzung beendet. Der Hörstand ist gespeichert.', 'sys');
    };
    if (el.endBack) el.endBack.onclick = () => {
      el.endBox.hidden = true;
      startPlay();
    };

    /* ---------------------------------------------------------------------
       WARNUNG BEIM SCHLIESSEN — mit ehrlicher Einschraenkung.
       ---------------------------------------------------------------------
       Wunsch von ruckG4zz: beim Beenden der App soll gefragt werden, ob er
       schliessen will und die Zusammenfassung noch hoeren moechte.

       Was technisch geht: der Browser zeigt seinen EIGENEN, generischen
       Dialog ("Seite verlassen?"). Ein eigener Text ist darin seit Jahren
       nicht mehr erlaubt, und drei Wahlmoeglichkeiten schon gar nicht.

       Was NICHT geht: das Wegwischen der installierten App aus der
       Aufgabenuebersicht abfangen. Android beendet sie dann ohne jede
       Vorwarnung an die Seite. Genau dafuer gibt es den Beenden-Knopf und
       den Sprachbefehl — das ist der zuverlaessige Weg, dieser hier ist
       nur das Netz darunter.
       --------------------------------------------------------------------- */
    window.addEventListener('beforeunload', (e) => {
      if (!state.sitzung || !state.sitzung.gehoert) return;
      e.preventDefault();
      e.returnValue = '';
    });

    /* --- Stimmen-Einstellungen ---
       Es gibt keine Provider-Umschaltung mehr. Google Cloud ist die einzige
       Sprachausgabe; die Browser-Stimme wurde auf Ansage entfernt. */
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
      ['Sprachausgabe', 'Google Cloud (Browser-Stimme entfernt)'],
      ['Stimme A', `${info.a} · ${info.klasseA}`],
      ['Stimme B', `${info.b} · ${info.klasseB}`],
      ['Feinsteuerung (SSML)', `A: ${info.ssmlA ? 'ja' : 'nein'} · B: ${info.ssmlB ? 'ja' : 'nein'}`],
      ['API-Schlüssel', info.schluessel ? 'hinterlegt' : 'FEHLT — keine Sprachausgabe möglich'],
      ['Spracherkennung', info.sttVerfuegbar ? 'verfügbar' : 'nicht verfügbar'],
      ['Mikrofon-Berechtigung', permText],
      ['Sicherer Kontext (HTTPS)', window.isSecureContext ? 'ja' : 'NEIN — Mikro bleibt gesperrt'],
      ['Gerät', Speech.isMobile() ? 'mobil' : 'Desktop']
    ];
    el.diag.innerHTML = rows.map(([k, v]) => `<div><span>${k}</span><b>${v}</b></div>`).join('');

    if (!info.schluessel) {
      el.diag.innerHTML += `<div class="warn">Ohne API-Schlüssel spricht die App nicht. Das ist Absicht: die Browser-Stimme wurde bewusst entfernt, damit ein Cloud-Fehler nicht mehr still durch schlechtere Qualität ersetzt wird. Schlüssel unter „Stimmen" eintragen.</div>`;
    }
    if (!info.ssmlA || !info.ssmlB) {
      el.diag.innerHTML += `<div class="warn">Mindestens eine gewählte Stimme unterstützt kein SSML (Chirp3-HD kann es grundsätzlich nicht). Für diese Stimme entfallen die feinen Pausen zwischen den Sätzen — sie wird mit reinem Text angesteuert. Das ist kein Fehler, sondern eine Eigenschaft der Stimmenklasse.</div>`;
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

  return { state, jumpTo, startPlay, stopPlay, layerWechseln, LAYERS };
})();

