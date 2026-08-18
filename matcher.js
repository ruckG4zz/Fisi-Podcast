/* =============================================================================
   FISI-Podcast-App — Offline-Matching-Engine
   -----------------------------------------------------------------------------
   Ordnet eine transkribierte Äußerung einem von drei Ergebnissen zu:

     {type:'command', cmd:'...', arg:...}   Steuerbefehl (Pause, Sprung, ...)
     {type:'term',    entry:{...}, ...}     Begriff aus dem NEINT1-Register
     {type:'none',    text:'...'}           kein Treffer -> ehrlicher Fallback

   Läuft vollständig offline gegen REGISTER_L1. Keine Netzanfrage, keine KI.
   ========================================================================== */

const Matcher = (() => {

  /* ---------------------------------------------------------------------
     Normalisierung: Umlaute auflösen, Satzzeichen weg, klein schreiben.
     --------------------------------------------------------------------- */
  function norm(s) {
    return (s || '')
      .toLowerCase()
      .replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss')
      .replace(/[.,;:!?"'`()\[\]{}]/g, ' ')
      .replace(/[-_/]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /* ---------------------------------------------------------------------
     RISIKO-ALIASE
     Kurze Aliase, die zugleich häufige deutsche Alltagswörter sind.
     Sie dürfen nicht bei jeder beliebigen Frage feuern. Sie zählen nur,
     wenn KEIN anderer Treffer existiert — und die Antwort wird dann mit
     einer Rückversicherung eingeleitet ("Ich nehme an, du meinst ...").

     Bewusst KURZ gehalten: die Netz-Kürzel (LAN, WAN, CAN ...) sind mit
     erzwungener Wortgrenze unkritisch. Echt gefährlich sind nur Aliase,
     die zugleich normale deutsche Wörter oder Verlegenheitslaute sind.
     --------------------------------------------------------------------- */
  const RISKY = new Set(['man', 'ev', 'mm', 'sm']);

  /* ---------------------------------------------------------------------
     Steuerbefehle. Reihenfolge = Priorität (spezifisch vor allgemein).
     --------------------------------------------------------------------- */
  const COMMANDS = [
    /* Wortgrenze am ENDE ist entscheidend: sonst matcht "geh" in "gehoert". */
    { cmd: 'jump',     res: [/\b(spring|springe|springen|geh|gehe|wechsel|wechsle|zeig|zeige)\b\s+/] },
    { cmd: 'next',     res: [/\b(naechstes?|naechsten)\s+(kapitel|abschnitt|thema)\b/, /^\s*(naechstes?|vorwaerts|ueberspringen)\s*$/] },
    { cmd: 'prev',     res: [/\b(vorheriges?|letztes?|vorherigen)\s+(kapitel|abschnitt|thema)\b/, /^\s*(zurueck|rueckwaerts)\s*$/] },
    /* NEUANFANG DES KAPITELS — muss VOR 'repeat' stehen.
       -------------------------------------------------------------------
       Hintergrund: Die Pausentaste setzt seit 18.08.2026 dort fort, wo
       tatsaechlich aufgehoert wurde, statt den Abschnitt neu zu beginnen.
       Wer den Faden verloren hat, braucht dafuer einen eigenen Weg zurueck
       an den Kapitelanfang — genau das ist dieser Befehl.

       Warum die Reihenfolge zaehlt: "kannst du nochmal von vorne beginnen"
       enthaelt "nochmal" und wuerde sonst vom Wiederhol-Befehl darunter
       geschluckt, der nur den einen unterbrochenen Abschnitt wiederholt.
       Wer "von vorne" sagt, meint aber das ganze Kapitel.

       Bewusst NICHT weich (kein soft): "den Faden verloren" ist eindeutig,
       da steckt keine versteckte Fachfrage drin. */
    { cmd: 'restart',  res: [
        /\b(von vorn|von vorne|nochmal von vorn|neu beginnen|neu anfangen|von anfang|am anfang anfangen)\b/,
        /\b(faden verloren|verloren den faden|nicht mehr mitgekommen|nicht mehr hinterher|abgehaengt|komplett raus)\b/,
        /\b(kapitel|abschnitt|thema)\s+(nochmal|neu|von vorn|von vorne)\b/
      ] },
    /* WEICH: "nochmal" ist meistens nur ein Fuellwort in einer echten Frage
       ("erklaer mir das nochmal mit CAN"). Deshalb greift dieser Befehl erst,
       wenn im Satz KEIN Fachbegriff steckt — sonst gewinnt die Antwort. */
    { cmd: 'repeat',   soft: true, res: [/\b(nochmal|noch mal|wiederhol|wiederhole|wiederholen|nochmals)\b/] },
    { cmd: 'pause',    res: [/^\s*(pause|pausiere|stopp?|halt|anhalten|warte|stop mal)\s*$/] },
    /* "weiter" allein heisst nach einer Zwischenfrage fast immer
       "spiel weiter", nicht "ueberspring das Kapitel". */
    { cmd: 'resume',   res: [/^\s*(weiter|weiterhoeren|fortsetzen|weiterlesen|mach weiter|weiter gehts|fortfahren)\s*$/] },
    /* SPRUNG INS ZUSAMMENFASSUNGS-KAPITEL — muss VOR 'recap' stehen.
       -------------------------------------------------------------------
       Bis 18.08.2026 lagen "zusammenfassung" und "zusammenfassen" im
       recap-Befehl. Der macht aber etwas ganz anderes: er sagt nur in
       einem Satz, wo man gerade steht ("Wir waren bei Topologien").

       Seit jede Schicht ein eigenes Kapitel "Zusammenfassung" hat, ist
       das die falsche Zuordnung: wer "fass mal zusammen" sagt, will den
       Merkblock hören, nicht wissen, in welchem Kapitel er sitzt.
       Deshalb ein eigener Befehl, und recap behaelt nur noch die
       Wo-bin-ich-Formulierungen. */
    { cmd: 'summary',  res: [
        /\b(zusammenfassung|zusammenfassen|zusammengefasst)\b/,
        /* Getrenntes "fass ... zusammen": im Deutschen steht zwischen Verb
           und Praefix fast immer noch etwas ("fass mal zusammen", "fass das
           kurz zusammen"). Deshalb ein Fenster dazwischen statt einer
           festen Wortfolge — sonst greift genau die Formulierung nicht,
           die man tatsaechlich sagt. */
        /\bfass(e|t)?\b.{0,25}\bzusammen\b/,
        /\b(kurzuebersicht|das wichtigste|wichtigste nochmal|merkblock)\b/
      ] },
    { cmd: 'recap',    res: [/\b(wo (bin|sind|waren) (ich|wir)|recap|worueber reden wir|wo waren wir)\b/] },
    { cmd: 'overview', res: [/\b(inhaltsverzeichnis|uebersicht|welche kapitel|was kommt noch|kapitelliste)\b/] }
  ];

  /* ---------------------------------------------------------------------
     Kapitel-Erkennung für Sprungbefehle.
     --------------------------------------------------------------------- */
  function findChapter(text, podcast) {
    const t = norm(text);
    let best = null;

    podcast.chapters.forEach((ch, idx) => {
      const cands = [ch.titel, ch.id, ch.kurz].filter(Boolean);
      for (const c of cands) {
        const n = norm(c);
        if (!n || n.length < 3) continue;
        if (t.includes(n)) {
          const score = n.length;
          if (!best || score > best.score) best = { chapter: ch, index: idx, score, via: c };
        }
      }
    });

    // Zusätzlich: einzelne markante Wörter aus dem Kapiteltitel
    if (!best) {
      podcast.chapters.forEach((ch, idx) => {
        const words = norm(ch.titel).split(' ').filter(w => w.length >= 5);
        for (const w of words) {
          if (t.includes(w)) {
            const score = w.length - 1; // schwächer als Volltreffer
            if (!best || score > best.score) best = { chapter: ch, index: idx, score, via: w };
          }
        }
      });
    }
    return best;
  }

  /* ---------------------------------------------------------------------
     Begriffs-Matching gegen das Register.

     Tie-Breaking (Regel aus der Projekt-Notiz, hier konkretisiert):
       1. Nur Treffer auf Wortgrenze zählen (verhindert "lan" in "geplant").
       2. Score = Länge des getroffenen Alias in Zeichen.
          -> der spezifischere/längere Begriff gewinnt.
          "campus area network" (19) schlaegt "can" (3).
       3. Mehrwort-Aliase bekommen einen Bonus (echte Fachbegriffe).
       4. Risiko-Aliase (s. RISKY) werden nur als letzter Ausweg genommen.
     --------------------------------------------------------------------- */
  function findTerm(text, register) {
    const t = ' ' + norm(text) + ' ';
    let best = null;
    let bestRisky = null;

    for (const entry of register) {
      const cands = [entry.label, ...(entry.aliases || [])];
      for (const raw of cands) {
        const a = norm(raw);
        if (!a) continue;

        // Wortgrenzen-Treffer erzwingen
        if (!t.includes(' ' + a + ' ')) continue;

        const isRisky = RISKY.has(a);
        let score = a.length;
        if (a.includes(' ')) score += 5;          // Mehrwort-Fachbegriff
        if (a === norm(entry.label)) score += 2;  // exakter Label-Treffer

        const hit = { entry, alias: a, score, risky: isRisky };

        if (isRisky) {
          if (!bestRisky || score > bestRisky.score) bestRisky = hit;
        } else {
          if (!best || score > best.score) best = hit;
        }
      }
    }
    return best || bestRisky;
  }

  /* ---------------------------------------------------------------------
     Hauptfunktion.
     --------------------------------------------------------------------- */
  function parse(input, podcast, register) {
    const raw = (input || '').trim();
    if (!raw) return { type: 'none', text: raw, reason: 'leer' };
    const t = norm(raw);

    /* 1. Harte Steuerbefehle prüfen (weiche kommen erst nach dem Begriff) */
    for (const c of COMMANDS) {
      if (c.soft) continue;
      for (const re of c.res) {
        if (re.test(t)) {
          if (c.cmd === 'jump') {
            // "spring zu <ziel>" -> Ziel bestimmen
            const ch = findChapter(t, podcast);
            if (ch) return { type: 'command', cmd: 'jump', chapter: ch.chapter, index: ch.index };
            const term = findTerm(t, register);
            if (term) {
              const idx = podcast.chapters.findIndex(x => x.id === term.entry.chapter);
              if (idx >= 0) return { type: 'command', cmd: 'jump', chapter: podcast.chapters[idx], index: idx, viaTerm: term.entry };
            }
            return { type: 'none', text: raw, reason: 'sprungziel-unklar' };
          }
          return { type: 'command', cmd: c.cmd };
        }
      }
    }

    /* 2. Begriff im Register suchen */
    const term = findTerm(t, register);
    if (term) {
      return {
        type: 'term',
        entry: term.entry,
        alias: term.alias,
        unsicher: !!term.risky,
        score: term.score
      };
    }

    /* 3. Jetzt erst die weichen Befehle — kein Fachbegriff im Satz gefunden */
    for (const c of COMMANDS) {
      if (!c.soft) continue;
      for (const re of c.res) {
        if (re.test(t)) return { type: 'command', cmd: c.cmd };
      }
    }

    /* 4. Vielleicht ist ein Kapitel gemeint, auch ohne Sprung-Verb */
    const ch = findChapter(t, podcast);
    if (ch && ch.score >= 6) {
      return { type: 'command', cmd: 'jump', chapter: ch.chapter, index: ch.index, weich: true };
    }

    /* 5. Ehrlich: kein Treffer */
    return { type: 'none', text: raw, reason: 'kein-treffer' };
  }

  /* Für die UI: alle Begriffe eines Kapitels auflisten */
  function termsOfChapter(chapterId, register) {
    return register.filter(e => e.chapter === chapterId);
  }

  return { parse, norm, findTerm, findChapter, termsOfChapter, RISKY };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = { Matcher };
