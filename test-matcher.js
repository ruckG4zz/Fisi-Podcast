/* =============================================================================
   Testlauf der Matching-Engine — mit Node ausführen:  node test-matcher.js
   -----------------------------------------------------------------------------
   Prüft die Offline-Erkennung gegen realistische Äußerungen, so wie sie aus
   der Spracherkennung kommen (klein, ohne Satzzeichen, mit Füllwörtern).
   Kein Test-Framework nötig, bewusst abhängigkeitsfrei.

   ERWEITERT 18.08.2026: läuft jetzt gegen ALLE DREI Schichten. Neu dazu
   gekommen sind vor allem die Kreuz-Tests — ein Begriff aus Layer 3 darf in
   Layer 1 gerade NICHT antworten, sonst kippt die Schichtentrennung.
   ========================================================================== */

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const here = __dirname;
const ctx = { module: { exports: {} }, console, window: {}, location: { protocol: 'https:' } };
vm.createContext(ctx);

for (const f of ['content-l1.js', 'content-l2.js', 'content-l3.js', 'matcher.js']) {
  vm.runInContext(fs.readFileSync(path.join(here, f), 'utf8'), ctx, { filename: f });
}

/* Top-Level-`const` liegt im lexikalischen Scope des Contexts, nicht auf dem
   Context-Objekt — deshalb explizit auslesen statt destrukturieren. */
const PODCAST_L1  = vm.runInContext('PODCAST_L1', ctx);
const REGISTER_L1 = vm.runInContext('REGISTER_L1', ctx);
const PODCAST_L2  = vm.runInContext('PODCAST_L2', ctx);
const REGISTER_L2 = vm.runInContext('REGISTER_L2', ctx);
const PODCAST_L3  = vm.runInContext('PODCAST_L3', ctx);
const REGISTER_L3 = vm.runInContext('REGISTER_L3', ctx);
const MODERATION  = vm.runInContext('MODERATION', ctx);
const Matcher     = vm.runInContext('Matcher', ctx);

const SCHICHTEN = [
  { name: 'Layer 1', podcast: PODCAST_L1, register: REGISTER_L1 },
  { name: 'Layer 2', podcast: PODCAST_L2, register: REGISTER_L2 },
  { name: 'Layer 3', podcast: PODCAST_L3, register: REGISTER_L3 }
];

let pass = 0, fail = 0;
const fails = [];

/* aktuelle Schicht, gegen die check() prüft */
let AKTIV = SCHICHTEN[0];

function check(input, expect) {
  const r = Matcher.parse(input, AKTIV.podcast, AKTIV.register);
  let ok = false;
  let got = r.type;

  if (expect.type === 'term')      { ok = r.type === 'term' && r.entry.id === expect.id; got = r.type === 'term' ? `term:${r.entry.id}` : r.type; }
  else if (expect.type === 'command') { ok = r.type === 'command' && r.cmd === expect.cmd; got = r.type === 'command' ? `command:${r.cmd}` : r.type; }
  else if (expect.type === 'none') { ok = r.type === 'none'; if (r.type === 'term') got = `term:${r.entry.id}`; }

  if (expect.unsicher !== undefined && r.type === 'term') ok = ok && (!!r.unsicher === expect.unsicher);

  if (ok) { pass++; }
  else {
    fail++;
    const want = expect.type === 'term' ? `term:${expect.id}` :
                 expect.type === 'command' ? `command:${expect.cmd}` : 'none';
    fails.push(`  [${AKTIV.name}] "${input}"\n      erwartet: ${want}\n      bekommen: ${got}`);
  }
}

function melde(bedingung, text) {
  if (bedingung) pass++;
  else { fail++; fails.push('  ' + text); }
}

/* ===========================================================================
   TEIL A — LAYER 1 (unveraendert uebernommen, sichert die Bestandslogik)
   =========================================================================== */
AKTIV = SCHICHTEN[0];

console.log('\n=== 1. Begriffe (Zwischenfragen) ===');
check('was ist cat 6a nochmal',                 { type:'term', id:'cat' });
/* Referenzbeispiel aus der Projekt-Notiz: "nochmal" darf die Frage nicht
   in einen Wiederhol-Befehl umdeuten — der Fachbegriff muss gewinnen. */
check('erklaer mir das nochmal mit CAN',        { type:'term', id:'can' });
check('nochmal',                                { type:'command', cmd:'repeat' });
check('wiederhol das bitte',                    { type:'command', cmd:'repeat' });
check('was bedeutet campus area network',       { type:'term', id:'can' });
check('was ist ein hub',                        { type:'term', id:'hub' });
check('erklaer mir den repeater',               { type:'term', id:'repeater' });
check('wie funktioniert ein medienkonverter',   { type:'term', id:'medienkonv' });
check('was ist dämpfung',                       { type:'term', id:'daempfung' });
check('erzähl mir was über singlemode',         { type:'term', id:'lwlsm' });
check('was ist der unterschied bei multimode',  { type:'term', id:'lwlmm' });
check('was ist strukturierte verkabelung',      { type:'term', id:'structcab' });
check('erklaer den primärbereich',              { type:'term', id:'primaer' });
check('was ist vollduplex',                     { type:'term', id:'vollduplex' });
check('was ist eine mesh topologie',            { type:'term', id:'mesh' });
check('wofür steht ieee',                       { type:'term', id:'ieee' });
check('was ist ein wide area network',          { type:'term', id:'wan' });
check('was heisst crosstalk',                   { type:'term', id:'crosstalk' });

console.log('=== 2. Tie-Breaking: spezifischer schlaegt kurz ===');
check('was ist ein campus area network',        { type:'term', id:'can' });
check('erklaer mir lwl singlemode',             { type:'term', id:'lwlsm' });
check('was ist die ring topologie',             { type:'term', id:'ring' });

console.log('=== 3. Risiko-Aliase: "man" darf nicht ueberall feuern ===');
check('wie macht man das denn',                 { type:'term', id:'man', unsicher:true });
check('was ist ein metropolitan area network',  { type:'term', id:'man', unsicher:false });

console.log('=== 4. Steuerbefehle ===');
check('spring zu topologien',                   { type:'command', cmd:'jump' });
check('geh zu den übertragungsmedien',          { type:'command', cmd:'jump' });
check('nächstes kapitel',                       { type:'command', cmd:'next' });
check('zurück',                                 { type:'command', cmd:'prev' });
check('pause',                                  { type:'command', cmd:'pause' });
check('weiter',                                 { type:'command', cmd:'resume' });
check('wo bin ich',                             { type:'command', cmd:'recap' });
check('übersicht',                              { type:'command', cmd:'overview' });

/* ===========================================================================
   4c. ZUSAMMENFASSUNG vs. RECAP vs. ÜBERSICHT — drei ähnlich klingende
       Wünsche, die drei völlig verschiedene Dinge tun.
   ---------------------------------------------------------------------------
     summary   springt ins Kapitel "Zusammenfassung" der laufenden Schicht
     recap     sagt in EINEM Satz, wo man gerade steht
     overview  liest die Kapitelliste vor

   Bis 18.08.2026 lagen "zusammenfassung"/"zusammenfassen" im recap-Befehl.
   Wer das sagte, bekam also die Wo-bin-ich-Ansage statt des Merkblocks.
   Diese Tests halten die neue Trennung fest.
   =========================================================================== */
console.log('=== 4c. Zusammenfassung / Recap / Uebersicht sauber getrennt ===');
check('fass mal zusammen',                      { type:'command', cmd:'summary' });
check('gib mir die zusammenfassung',            { type:'command', cmd:'summary' });
check('kannst du das zusammenfassen',           { type:'command', cmd:'summary' });
check('nochmal das wichtigste bitte',           { type:'command', cmd:'summary' });
check('fass das kurz zusammen',                 { type:'command', cmd:'summary' });
check('fass zusammen',                          { type:'command', cmd:'summary' });
/* Darf NICHT feuern: "zusammen" allein ist ein normales deutsches Wort */
check('wie gehört das alles zusammen',          { type:'none' });
check('wo waren wir',                           { type:'command', cmd:'recap' });
check('wo bin ich gerade',                      { type:'command', cmd:'recap' });
check('inhaltsverzeichnis',                     { type:'command', cmd:'overview' });
check('welche kapitel gibt es',                 { type:'command', cmd:'overview' });

/* ===========================================================================
   4d. SITZUNG BEENDEN
   ---------------------------------------------------------------------------
   Der riskanteste neue Befehl: "ende" und "fertig" stecken in ganz normalen
   Saetzen. Wuerde er zu breit greifen, wuerde mitten im Hoeren die
   Abschluss-Zusammenfassung starten — maximal aergerlich.
   Deshalb nur vollstaendige Wendungen, und diese Tests halten das fest.
   =========================================================================== */
console.log('=== 4d. Sitzung beenden — greift nur bei klaren Wendungen ===');
check('ich bin fertig',                         { type:'command', cmd:'ende' });
check('das reicht für heute',                   { type:'command', cmd:'ende' });
check('schluss für heute',                      { type:'command', cmd:'ende' });
check('ich höre auf',                           { type:'command', cmd:'ende' });
check('feierabend',                             { type:'command', cmd:'ende' });

/* Darf AUF KEINEN FALL feuern — normale Formulierungen mit "ende"/"fertig" */
check('wo eine nachricht anfängt und wo sie endet',       { type:'none' });
check('ist das damit fertig verkabelt',                   { type:'none' });
/* Und ein Fachbegriff im selben Satz muss weiterhin gewinnen */
check('was ist am ende einer bus topologie',              { type:'term', id:'bus' });

/* ===========================================================================
   NEUANFANG vs. WIEDERHOLEN — die riskanteste Abgrenzung im Matcher
   ---------------------------------------------------------------------------
   Seit die Pausentaste dort fortsetzt, wo tatsaechlich aufgehoert wurde
   (18.08.2026), braucht es einen eigenen Weg zurueck an den Kapitelanfang.

   Die Gefahr dabei: "kannst du nochmal von vorne beginnen" enthaelt das Wort
   "nochmal" und wuerde ohne korrekte Reihenfolge vom Wiederhol-Befehl
   geschluckt — der aber nur den EINEN unterbrochenen Abschnitt wiederholt,
   nicht das Kapitel. Der Nutzer bekaeme dann etwas anderes als das, worum
   er gebeten hat, ohne zu verstehen warum.

   Diese Tests halten die Grenze fest.
   =========================================================================== */
console.log('=== 4b. Neuanfang des Kapitels vs. einzelnen Abschnitt wiederholen ===');
/* Soll das ganze Kapitel neu starten */
check('kannst du hier nochmal von vorne beginnen',        { type:'command', cmd:'restart' });
check('kannst du bitte nochmal von vorne beginnen',       { type:'command', cmd:'restart' });
check('ich habe gerade den faden verloren',               { type:'command', cmd:'restart' });
check('ich hab den faden verloren bitte von vorne',       { type:'command', cmd:'restart' });
check('fang nochmal von vorn an',                         { type:'command', cmd:'restart' });
check('das kapitel nochmal bitte',                        { type:'command', cmd:'restart' });
check('ich bin da nicht mehr mitgekommen',                { type:'command', cmd:'restart' });

/* Soll NUR den unterbrochenen Abschnitt wiederholen — kein Neuanfang */
check('kannst du das bitte nochmal wiederholen',          { type:'command', cmd:'repeat' });
check('nochmal bitte',                                    { type:'command', cmd:'repeat' });
check('wiederhol das',                                    { type:'command', cmd:'repeat' });

/* Und der Klassiker, der WEDER das eine noch das andere sein darf:
   hier steckt ein Fachbegriff drin, also gewinnt die Antwort. */
check('erklaer mir das nochmal mit can',                  { type:'term', id:'can' });

console.log('=== 5. Falsch-Positive dürfen NICHT als Sprungbefehl gelten ===');
check('wie gehört das alles zusammen',          { type:'none' });

console.log('=== 6. Ehrlicher Fallback in Layer 1 ===');
/* Diese drei gehoeren fachlich in Schicht 3. In Layer 1 muss der Matcher
   sie ablehnen — den Wegweiser in die richtige Schicht baut app.js darauf
   auf (inAndererSchicht), NICHT der Matcher. */
check('was ist eine ip adresse',                { type:'none' });
check('erklaer mir routing protokolle',         { type:'none' });
check('wie funktioniert dns',                   { type:'none' });

/* ===========================================================================
   TEIL B — LAYER 2
   =========================================================================== */
AKTIV = SCHICHTEN[1];
console.log('\n=== 7. Layer 2: Begriffe ===');
check('was ist eine mac adresse',               { type:'term', id:'mac' });
check('wofür steht oui',                        { type:'term', id:'oui' });
check('was bedeutet spoofing',                  { type:'term', id:'spoofing' });
check('erklaer mir den ethernet frame',         { type:'term', id:'frame' });
check('was ist die fcs',                        { type:'term', id:'fcs' });
check('wie gross ist die mtu',                  { type:'term', id:'mtu' });
check('was ist ein trunk port',                 { type:'term', id:'trunk' });
check('erklaer mir das native vlan',            { type:'term', id:'nativevlan' });
check('was macht die cam tabelle',              { type:'term', id:'cam' });
check('was ist csma cd',                        { type:'term', id:'csmacd' });
check('und was ist csma ca',                    { type:'term', id:'csmaca' });
check('was war nochmal aloha',                  { type:'term', id:'aloha' });
check('erklaer mir die root bridge',            { type:'term', id:'rootbridge' });
check('was sind bpdus',                         { type:'term', id:'bpdu' });
check('was ist rstp',                           { type:'term', id:'rstp' });
check('was bedeutet konvergenz',                { type:'term', id:'konvergenz' });
check('was ist eine ssid',                      { type:'term', id:'ssid' });
check('erklaer mir wpa3',                       { type:'term', id:'wpa3' });
check('was ist eine kollisionsdomaene',         { type:'term', id:'kollisionsdomaene' });
check('was ist port security',                  { type:'term', id:'portsecurity' });
check('erklaer mir mac flooding',               { type:'term', id:'macflooding' });
check('was ist ein duplex mismatch',            { type:'term', id:'duplexmismatch' });
check('erzähl mir was über wireshark',          { type:'term', id:'wireshark' });

console.log('=== 8. Layer 2: Tie-Breaking und Abgrenzungen ===');
/* "mac flooding" (mehrwortig) muss das kurze "mac" schlagen */
check('was ist mac flooding',                   { type:'term', id:'macflooding' });
/* "spanning tree" muss das kurze "stp" schlagen */
check('erklaer mir das spanning tree protocol', { type:'term', id:'stp' });
/* "broadcast domaene" gegen "broadcast mac" */
check('was ist die broadcast domaene',          { type:'term', id:'broadcastdomaene' });
/* Fachbegriff schlaegt den weichen Wiederhol-Befehl auch hier */
check('erklaer mir das nochmal mit vlan',       { type:'term', id:'vlan' });

console.log('=== 9. Layer 2: Befehle und Fallback ===');
check('spring zu spanning tree',                { type:'command', cmd:'jump' });
check('nächstes kapitel',                       { type:'command', cmd:'next' });
check('ich habe den faden verloren',            { type:'command', cmd:'restart' });
/* Gehoert in Schicht 3 — in Layer 2 kein Treffer */
check('was ist ein default gateway',            { type:'none' });
check('erklaer mir subnetting',                 { type:'none' });

/* ===========================================================================
   TEIL C — LAYER 3
   =========================================================================== */
AKTIV = SCHICHTEN[2];
console.log('\n=== 10. Layer 3: Begriffe ===');
check('was ist eine ip adresse',                { type:'term', id:'ipv4' });
check('erklaer mir die adressklassen',          { type:'term', id:'klassen' });
check('was sind private adressen',              { type:'term', id:'privat' });
check('was ist apipa',                          { type:'term', id:'apipa' });
check('was bedeutet cidr',                      { type:'term', id:'cidr' });
check('erklaer mir den prefix',                 { type:'term', id:'prefix' });
check('was ist vlsm',                           { type:'term', id:'vlsm' });
check('erklaer mir ipv6',                       { type:'term', id:'ipv6' });
check('was ist eine link local adresse',        { type:'term', id:'ipv6typen' });
check('wie funktioniert arp',                   { type:'term', id:'arp' });
check('was ist ndp',                            { type:'term', id:'ndp' });
check('was ist anycast',                        { type:'term', id:'anycast' });
check('erklaer mir icmp',                       { type:'term', id:'icmp' });
check('was macht igmp',                         { type:'term', id:'igmp' });
check('was ist die ttl',                        { type:'term', id:'ttl' });
check('was ist longest prefix match',           { type:'term', id:'lpm' });
check('erklaer mir ospf',                       { type:'term', id:'ospf' });
check('was ist bgp',                            { type:'term', id:'bgp' });
check('was ist ein default gateway',            { type:'term', id:'gateway' });
check('was ist die administrative distance',    { type:'term', id:'addistance' });
check('erklaer mir nat',                        { type:'term', id:'nat' });
check('was ist pat',                            { type:'term', id:'pat' });
check('was ist ein layer 3 switch',             { type:'term', id:'l3switch' });
check('erklaer mir ipsec',                      { type:'term', id:'ipsec' });
check('was ist der tunnel modus',               { type:'term', id:'modi' });
check('was ist ein vpn',                        { type:'term', id:'vpn' });
check('erklaer mir split tunneling',            { type:'term', id:'tunneling' });
check('was ist stateful inspection',            { type:'term', id:'firewall' });
check('was ist ein thin client',                { type:'term', id:'thinclient' });
check('was ist asymmetrische verschluesselung', { type:'term', id:'asymmetrisch' });
check('erklaer mir arp spoofing',               { type:'term', id:'arpspoofing' });

console.log('=== 11. Layer 3: Tie-Breaking und Abgrenzungen ===');
/* Das kurze "arp" darf das spezifischere "arp spoofing" nicht schlagen */
check('was ist arp spoofing',                   { type:'term', id:'arpspoofing' });
/* "ipsec" darf nicht als "ip" durchgehen */
check('was leistet ipsec',                      { type:'term', id:'ipsec' });
/* "ipv6" darf nicht als "ip adresse" durchgehen */
check('wie ist ipv6 aufgebaut',                 { type:'term', id:'ipv6' });
/* "default gateway" (mehrwortig) schlaegt das kurze "gateway" — selbe ID,
   aber der Test sichert, dass ueberhaupt der richtige Eintrag gewinnt */
check('wozu brauche ich das default gateway',   { type:'term', id:'gateway' });
/* Fachbegriff schlaegt den weichen Wiederhol-Befehl */
check('erklaer mir das nochmal mit nat',        { type:'term', id:'nat' });

console.log('=== 12. Layer 3: Befehle und Fallback ===');
check('spring zu routing',                      { type:'command', cmd:'jump' });
check('nochmal bitte',                          { type:'command', cmd:'repeat' });
check('ich bin da nicht mehr mitgekommen',      { type:'command', cmd:'restart' });
/* Gehoert in Schicht 1 — in Layer 3 kein Treffer */
check('was ist eine ring topologie',            { type:'none' });

/* ===========================================================================
   TEIL D — STRUKTUR-INTEGRITAET ALLER DREI SCHICHTEN
   =========================================================================== */
console.log('\n=== 13. Content-Integritaet (alle Schichten) ===');
let strukturFehler = [];

SCHICHTEN.forEach(s => {
  const chapterIds = new Set(s.podcast.chapters.map(c => c.id));

  /* Kapitel-IDs innerhalb einer Schicht müssen eindeutig sein, sonst
     springt "spring zu X" auf das falsche Kapitel. */
  const chSeen = new Set();
  s.podcast.chapters.forEach(c => {
    if (chSeen.has(c.id)) strukturFehler.push(`${s.name}: doppelte Kapitel-ID "${c.id}"`);
    chSeen.add(c.id);
    if (!c.titel || !c.kurz) strukturFehler.push(`${s.name}: Kapitel "${c.id}" ohne Titel/Kurzbeschreibung`);
  });

  s.register.forEach(e => {
    if (!chapterIds.has(e.chapter)) strukturFehler.push(`${s.name}: Register "${e.id}" zeigt auf unbekanntes Kapitel "${e.chapter}"`);
    if (!e.antwort || e.antwort.length < 20) strukturFehler.push(`${s.name}: Register "${e.id}" hat keine brauchbare Antwort`);
    if (!e.aliases || !e.aliases.length) strukturFehler.push(`${s.name}: Register "${e.id}" hat keine Aliase`);
    if (!e.label) strukturFehler.push(`${s.name}: Register "${e.id}" hat kein Label`);
  });

  const seen = new Set();
  s.register.forEach(e => {
    if (seen.has(e.id)) strukturFehler.push(`${s.name}: doppelte Register-ID "${e.id}"`);
    seen.add(e.id);
  });

  /* Ein Alias, der in DERSELBEN Schicht zweimal vorkommt, macht das
     Tie-Breaking zum Zufall. Innerhalb einer Schicht darf das nicht sein. */
  const aliasHeimat = new Map();
  s.register.forEach(e => {
    [e.label, ...e.aliases].forEach(a => {
      const n = Matcher.norm(a);
      if (!n) return;
      if (aliasHeimat.has(n) && aliasHeimat.get(n) !== e.id) {
        strukturFehler.push(`${s.name}: Alias "${n}" gehört zu "${aliasHeimat.get(n)}" UND zu "${e.id}"`);
      }
      aliasHeimat.set(n, e.id);
    });
  });

  /* Mindestlaenge bewusst niedrig: in der Dialogfassung sind kurze Einwuerfe
     ("Weiter.", "Zweiter.") gewollt und ein Qualitaetsmerkmal, kein Fehler. */
  s.podcast.chapters.forEach(c => {
    if (!c.segments || !c.segments.length) strukturFehler.push(`${s.name}: Kapitel "${c.id}" hat keine Segmente`);
    c.segments.forEach((seg, i) => {
      if (!seg.text || !seg.text.trim()) strukturFehler.push(`${s.name}: Kapitel "${c.id}" Segment ${i} ist leer`);
      if (seg.voice !== 'a' && seg.voice !== 'b') strukturFehler.push(`${s.name}: Kapitel "${c.id}" Segment ${i} hat ungueltige Stimme "${seg.voice}"`);
    });
  });

  /* Jede Schicht muss Titel, Untertitel und Quellenangabe tragen — die
     Oberflaeche und die Quellenanzeige lesen das direkt aus. */
  ['titel', 'untertitel', 'quelle', 'id'].forEach(f => {
    if (!s.podcast[f]) strukturFehler.push(`${s.name}: Feld "${f}" fehlt im Podcast-Objekt`);
  });

  /* ---------------------------------------------------------------------
     ZUSAMMENFASSUNG UND ÜBERGANG muessen als eigene Kapitel existieren.
     ---------------------------------------------------------------------
     Der Sprachbefehl "fass zusammen" sucht in app.js gezielt nach der
     Kapitel-ID 'zusammenfassung'. Fehlt sie in einer Schicht, laeuft der
     Befehl dort ins Leere — und zwar still, weil man es beim Hoeren der
     anderen Schichten nicht merkt. Deshalb hier hart geprueft.

     Zusaetzlich: die Zusammenfassung muss das VORLETZTE Kapitel sein und
     der Uebergang das letzte. Sonst endet ein Layer mitten im Merkblock
     statt mit der Bruecke zur naechsten Schicht.
     --------------------------------------------------------------------- */
  const idxZus = s.podcast.chapters.findIndex(c => c.id === 'zusammenfassung');
  const idxUeb = s.podcast.chapters.findIndex(c => c.id === 'uebergang');
  const anzahl = s.podcast.chapters.length;

  if (idxZus < 0) strukturFehler.push(`${s.name}: Kapitel "zusammenfassung" fehlt — der Befehl "fass zusammen" liefe ins Leere`);
  else if (idxZus !== anzahl - 2) strukturFehler.push(`${s.name}: "zusammenfassung" steht an Position ${idxZus + 1}, erwartet wird das vorletzte Kapitel (${anzahl - 1})`);

  if (idxUeb < 0) strukturFehler.push(`${s.name}: Kapitel "uebergang" fehlt`);
  else if (idxUeb !== anzahl - 1) strukturFehler.push(`${s.name}: "uebergang" steht an Position ${idxUeb + 1}, erwartet wird das letzte Kapitel (${anzahl})`);

  /* Das alte kombinierte Kapitel darf nicht mehr existieren. */
  if (s.podcast.chapters.some(c => c.id === 'fazit')) {
    strukturFehler.push(`${s.name}: altes Kapitel "fazit" noch vorhanden — es wurde in "zusammenfassung" + "uebergang" aufgeteilt`);
  }

  /* Die Zusammenfassung soll ein echter Block sein, kein Dreizeiler —
     genau das war der Kritikpunkt von ruckG4zz an Layer 1. */
  if (idxZus >= 0 && s.podcast.chapters[idxZus].segments.length < 12) {
    strukturFehler.push(`${s.name}: Zusammenfassung hat nur ${s.podcast.chapters[idxZus].segments.length} Segmente — zu duenn fuer einen Merkblock`);
  }

  /* ---------------------------------------------------------------------
     EINLEITUNG (nur Layer 1, neu 19.08.2026)
     ---------------------------------------------------------------------
     Layer 1 ist der Einstieg in die ganze Reihe und traegt deshalb den
     Rahmen: was das OSI-Modell ist, wie es zu TCP/IP steht, und warum
     unten angefangen wird. Drei Dinge werden hart geprueft, weil sie beim
     stillen Verschwinden niemandem auffallen wuerden:

       1. Das Kapitel existiert und steht GANZ VORNE. Steht es woanders,
          kommt der Rahmen nach dem Stoff — sinnlos.
       2. Alle sieben englischen Schichtnamen kommen darin vor. Das war
          die ausdrueckliche Anforderung von ruckG4zz ("wenigstens 1x
          gehoert bekommen"). Faellt beim Ueberarbeiten leicht raus.
       3. Die PDU-Kette ist vollstaendig. Beliebte IHK-Frage, und eine
          Kette mit vier statt fuenf Gliedern ist beim Hoeren nicht zu
          bemerken.
     --------------------------------------------------------------------- */
  if (s.podcast.id === 'neint1-l1') {
    const idxEin = s.podcast.chapters.findIndex(c => c.id === 'einleitung');
    if (idxEin < 0) {
      strukturFehler.push(`${s.name}: Kapitel "einleitung" fehlt — der Reihe fehlt der Rahmen`);
    } else {
      if (idxEin !== 0) strukturFehler.push(`${s.name}: "einleitung" steht an Position ${idxEin + 1}, gehoert aber ganz nach vorne`);

      const text = s.podcast.chapters[idxEin].segments.map(x => x.text).join(' ');

      ['Physical Layer', 'Data Link Layer', 'Network Layer', 'Transport Layer',
       'Session Layer', 'Presentation Layer', 'Application Layer'].forEach(n => {
        if (!text.includes(n)) strukturFehler.push(`${s.name}: englischer Schichtname "${n}" fehlt in der Einleitung`);
      });

      if (!/Data, Segment, Paket, Frame, Bits/.test(text)) {
        strukturFehler.push(`${s.name}: die PDU-Kette "Data, Segment, Paket, Frame, Bits" fehlt oder ist unvollstaendig`);
      }
      if (!/Referenzmodell/.test(text) || !/Implementierungsmodell/.test(text)) {
        strukturFehler.push(`${s.name}: der IHK-Merksatz Referenz- vs. Implementierungsmodell fehlt in der Einleitung`);
      }
    }

    /* HIER STAND EIN TEST GEGEN "NACKTE KUERZEL-SALVEN" (19.08.2026)
       ---------------------------------------------------------------
       Er sicherte die Annahme ab, eine Aufzaehlung wie "BAN, PAN, LAN
       und WLAN, CAN, MAN, WAN, GAN" wuerde von der Stimme buchstabiert
       und muesse mit Halbsaetzen unterlegt werden.

       Der Hoerbefund von ruckG4zz war eindeutig das Gegenteil: die
       nackte Aufzaehlung klang BESSER. Der Umbau wurde zurueckgerollt,
       und damit ist auch dieser Test gegenstandslos — ein Test, der
       eine widerlegte Annahme erzwingt, ist schlimmer als kein Test.
       Bewusst geloescht statt auskommentiert stehen zu lassen. */
  }

  /* Layer 2 und 3 muessen im Einstieg einen Rueckblick auf die vorherige
     Schicht tragen (Wunsch ruckG4zz 18.08.2026). Layer 1 hat keine. */
  if (s.podcast.id !== 'neint1-l1') {
    const einstieg = s.podcast.chapters[0];
    const hatRueckblick = einstieg.segments.some(seg => /rückblick|rueckblick/i.test(seg.text));
    if (!hatRueckblick) strukturFehler.push(`${s.name}: im Einstieg fehlt der Rueckblick auf die vorherige Schicht`);
  }
});

/* Die Podcast-IDs muessen sich zwischen den Schichten unterscheiden. */
const alleIds = SCHICHTEN.map(s => s.podcast.id);
if (new Set(alleIds).size !== alleIds.length) strukturFehler.push('Podcast-IDs sind nicht eindeutig');

/* ===========================================================================
   TEIL E — MODERATION: die Platzhalter muessen zusammenpassen
   ---------------------------------------------------------------------------
   app.js fuellt {schicht}, {begriff}, {kapitel} und {kurz}. Steht in einem
   Baustein ein Platzhalter, den niemand fuellt, spricht die App woertlich
   "Layer geschweifte Klammer schicht" vor — genau so ein Fehler faellt beim
   Lesen nicht auf, beim Hoeren sofort.
   =========================================================================== */
console.log('=== 14. Moderations-Platzhalter ===');
const ERLAUBT = {
  wortmeldung: [], antwortStart: [], uebergabe: [],
  keinTreffer: ['schicht'], keinTrefferAbschluss: [],
  andereSchicht: ['schicht', 'begriff'], andereSchichtAbschluss: [],
  schichtwechsel: ['fertig', 'naechste', 'thema'],
  zurueck: ['kapitel'], wiedereinstieg: ['kapitel', 'kurz'],
  sprung: ['kapitel'], neustart: ['kapitel', 'kurz'],
  mikroAnsage: [], wiederholung: [], reaktionen: []
};

Object.keys(ERLAUBT).forEach(k => {
  const liste = MODERATION[k];
  if (!Array.isArray(liste) || !liste.length) {
    strukturFehler.push(`MODERATION."${k}" fehlt oder ist leer`);
    return;
  }
  liste.forEach(t => {
    const gefunden = (String(t).match(/\{(\w+)\}/g) || []).map(x => x.slice(1, -1));
    gefunden.forEach(g => {
      if (!ERLAUBT[k].includes(g)) {
        strukturFehler.push(`MODERATION."${k}": unbekannter Platzhalter {${g}} in "${t}"`);
      }
    });
  });
});

/* Der Kein-Treffer-Text darf keine Schicht mehr fest verdrahtet haben. */
melde(!MODERATION.keinTreffer.some(t => /Layer eins|Schicht eins/i.test(t)),
  'MODERATION.keinTreffer nennt noch fest "Layer eins" statt {schicht}');

/* ---------------------------------------------------------------------------
   AUTOMATISCHER SCHICHTÜBERGANG
   ---------------------------------------------------------------------------
   Laeuft eine Schicht durch, schliesst die naechste ohne Zutun an — Vorgabe
   ruckG4zz, weil beim Autofahren kein Knopf gedrueckt werden kann.

   Damit das nicht still scheitert, muessen drei Dinge stimmen:
     1. der Baustein existiert ueberhaupt
     2. JEDER Text nennt beide Schichten — ein Uebergang, der nicht sagt,
        wohin es geht, ist beim Hoeren wertlos
     3. genug Varianten fuer alle Uebergaenge, die es real gibt
   --------------------------------------------------------------------------- */
console.log('=== 14b. Automatischer Schichtuebergang ===');
melde(Array.isArray(MODERATION.schichtwechsel) && MODERATION.schichtwechsel.length > 0,
  'MODERATION.schichtwechsel fehlt — der automatische Uebergang bliebe stumm');

if (Array.isArray(MODERATION.schichtwechsel)) {
  const unvollstaendig = MODERATION.schichtwechsel.filter(
    t => !/\{fertig\}/.test(t) || !/\{naechste\}/.test(t));
  melde(unvollstaendig.length === 0,
    `MODERATION.schichtwechsel: ${unvollstaendig.length} Text(e) nennen nicht beide Schichten`);

  /* Die Auswahl laeuft in app.js deterministisch ueber den Schicht-Index
     (vonIdx % liste.length). Bei drei Schichten gibt es zwei Uebergaenge —
     mit weniger als zwei Varianten klaenge beide Male derselbe Satz. */
  melde(MODERATION.schichtwechsel.length >= SCHICHTEN.length - 1,
    `MODERATION.schichtwechsel hat nur ${MODERATION.schichtwechsel.length} Varianten fuer ${SCHICHTEN.length - 1} Uebergaenge`);
}

/* Jede Schicht ausser der letzten braucht ein 'thema' fuer die Ueberleitung.
   Geprueft wird gegen app.js, weil die Angabe dort in LAYERS steht. */
{
  const appQuelle = fs.readFileSync(path.join(here, 'app.js'), 'utf8');
  const themen = (appQuelle.match(/thema:\s*'[^']+'/g) || []).length;
  melde(themen >= SCHICHTEN.length,
    `In app.js sind nur ${themen} 'thema'-Angaben hinterlegt, gebraucht werden ${SCHICHTEN.length}`);
}

/* ===========================================================================
   TEIL F — DIALOG-QUALITAET
   =========================================================================== */
console.log('=== 15. Dialog-Qualitaet (alle Schichten) ===');
let dialogFehler = [];
let langeMonologe = 0;

SCHICHTEN.forEach(s => {
  s.podcast.chapters.forEach(c => {
    let laufend = null, kette = 0;
    c.segments.forEach((seg, i) => {
      if (seg.voice === laufend) {
        kette++;
        if (kette >= 3) dialogFehler.push(`${s.name}, Kapitel "${c.id}": Stimme ${seg.voice} spricht ab Segment ${i - kette} zu lange am Stueck`);
      } else { laufend = seg.voice; kette = 1; }
      // Ein einzelnes Segment sollte kein Vortrag sein
      if (seg.text.length > 420) langeMonologe++;
    });

    // Verhaeltnis der Sprechanteile — grob ausgewogen?
    const a = c.segments.filter(x => x.voice === 'a').length;
    const b = c.segments.filter(x => x.voice === 'b').length;
    const anteil = Math.min(a, b) / Math.max(a, b);
    if (anteil < 0.45) dialogFehler.push(`${s.name}, Kapitel "${c.id}": Sprechanteile unausgewogen (A=${a}, B=${b})`);
  });
});

if (dialogFehler.length) { fail += dialogFehler.length; fails.push(...dialogFehler.map(s => '  ' + s)); }
else pass++;

if (strukturFehler.length) { fail += strukturFehler.length; fails.push(...strukturFehler.map(s => '  ' + s)); }
else pass++;

/* ===========================================================================
   KENNZAHLEN
   =========================================================================== */
console.log('\n--------------------------------------------------');
let gesSeg = 0, gesZeichen = 0, gesBegriffe = 0, gesAliase = 0;

SCHICHTEN.forEach(s => {
  const seg = s.podcast.chapters.reduce((n, c) => n + c.segments.length, 0);
  const zei = s.podcast.chapters.reduce((n, c) => n + c.segments.reduce((m, x) => m + x.text.length, 0), 0);
  const ali = s.register.reduce((n, e) => n + e.aliases.length, 0);
  gesSeg += seg; gesZeichen += zei; gesBegriffe += s.register.length; gesAliase += ali;

  console.log(`${s.name}:  ${String(s.podcast.chapters.length).padStart(2)} Kapitel · ` +
              `${String(seg).padStart(3)} Segmente · ${String(zei).padStart(6)} Zeichen ` +
              `(~${Math.round(zei / 900)} Min.) · ${String(s.register.length).padStart(2)} Begriffe · ` +
              `${ali} Aliase · Ø Replik ${Math.round(zei / seg)} Zeichen`);
});

console.log('--------------------------------------------------');
console.log(`Gesamt:   ${gesSeg} Segmente · ${gesZeichen} Zeichen (~${Math.round(gesZeichen / 900)} Min. Hoerzeit)`);
console.log(`          ${gesBegriffe} Register-Begriffe · ${gesAliase} Aliase`);
console.log(`Repliken ueber 420 Zeichen: ${langeMonologe}`);
console.log('--------------------------------------------------');
console.log(`Tests bestanden:      ${pass}`);
console.log(`Tests fehlgeschlagen: ${fail}`);
if (fails.length) { console.log('\nFEHLER:'); fails.forEach(f => console.log(f)); }
console.log('');
process.exit(fail ? 1 : 0);
