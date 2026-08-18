/* =============================================================================
   FISI-Podcast-App — Inhaltsmodul: NEINT1, Layer 3 (Vermittlungsschicht)
   DIALOG-FASSUNG v1
   -----------------------------------------------------------------------------
   FAKTENQUELLE (einzige Quelle der Wahrheit):
     03 Bereiche/FISI-Umschulung/00_Lernunterstützung/
     03_NEINT1_Netzwerke und Internettechnologien [Grundlagen]/
     NEINT1_OSI_Enzyklopaedie_FINAL.html  ->  Section  id="sec-l3"

   Dieses Skript ist eine ABGELEITETE PRÄSENTATIONSFORM (Hörfassung) dieser
   Section. Es enthält keinerlei erfundene Fachinhalte: jede Zahl, jede
   Definition und jedes Beispiel steht so in der Enzyklopädie. Was
   hinzugekommen ist, sind ausschliesslich Gesprächselemente (Nachfragen,
   Zustimmung, Überleitungen) — also Form, nicht Inhalt.

   Schicht 3 ist laut Enzyklopädie das mit Abstand prüfungsträchtigste
   Kapitel. Entsprechend länger ist diese Folge: zwanzig Kapitel statt elf
   wie bei Layer 1 — bewusst nicht gekürzt, aber in kleine Kapitel zerlegt,
   damit man gezielt hineinspringen kann.

   ROLLEN — geteilt (siehe Kopf von content-l2.js):
     'a' = Stimme A (männlich)   ·   'b' = Stimme B (weiblich)
   Beide erklären, beide fragen nach.

   SCHREIBWEISE VON ZAHLEN (bewusste Entscheidung, damit die Stimme sauber
   liest UND das Transkript lesbar bleibt):
     · Mengen und Bit-Angaben als Wort  ("zweiunddreissig Bit")
     · IP-Adressen und Masken in Ziffern ("192.168.10.0", "255.255.255.0") —
       das liest eine deutsche Stimme zuverlässig als Zahlenfolge vor
     · Prefixe NIE in Schrägstrich-Schreibweise im Sprechtext, sondern
       ausgeschrieben ("Prefix vierundzwanzig") — ein Schrägstrich vor einer
       Zahl ist für eine TTS-Stimme mehrdeutig
     · IPv6-Adressen werden beschrieben statt Zeichen für Zeichen vorgelesen
   ========================================================================== */

const PODCAST_L3 = {
  id: 'neint1-l3',
  modul: 'NEINT1',
  titel: 'Layer 3 — Vermittlungsschicht',
  untertitel: 'Network Layer · PDU: Paket · IHK-Relevanz: sehr hoch',
  quelle: 'NEINT1_OSI_Enzyklopaedie_FINAL.html, Section sec-l3',

  chapters: [
    /* ---------------------------------------------------------------- 01 */
    {
      id: 'intro',
      titel: 'Einstieg',
      kurz: 'Warum ein Frame nicht weit genug kommt',
      segments: [
        { voice: 'a', text: 'Schicht drei, die Vermittlungsschicht. Und wieder starten wir mit dem, was von unten ankommt.' },
        { voice: 'b', text: 'Aus Schicht zwei kommt ein sauber abgegrenzter Frame, mit Absender- und Ziel-MAC-Adresse.' },
        { voice: 'a', text: 'Womit wir jedes Gerät erreichen. Allerdings nur innerhalb desselben lokalen Netzes.' },
        { voice: 'b', text: 'Und der Grund dafür ist wichtig: MAC-Adressen sind nicht routbar. Ein Switch kennt nur sein eigenes Segment.' },
        { voice: 'a', text: 'Diese Schicht löst also die Frage, die Schicht zwei offen liess: wie erreicht ein Paket ein Ziel in einem ganz anderen Netz?' },
        { voice: 'b', text: 'Und wie tut sie das?' },
        { voice: 'a', text: 'Sie packt den Frame aus, führt mit der IP-Adresse eine logische, netzübergreifende Adressierung ein und bestimmt per Routing den Weg über Netzgrenzen hinweg.' },
        { voice: 'b', text: 'Zum Vorschein kommt dabei das IP-Paket, das eben noch als Nutzdaten im Frame steckte.' },
        { voice: 'a', text: 'Und damit ist auch die PDU dieser Schicht geklärt: das Paket.' },
        { voice: 'b', text: 'Im TCP/IP-Modell entspricht sie der Internet-Schicht. Beim Verbindungstyp muss man genau hinschauen, das ist zweigeteilt.' },
        { voice: 'a', text: 'Die Adressierung ist Ende zu Ende, die Weiterleitung dagegen Hop by Hop, also von Router zu Router.' },
        { voice: 'b', text: 'Und die Prüfungsrelevanz?' },
        { voice: 'a', text: 'Sehr hoch. Das hier ist laut Enzyklopädie das mit Abstand prüfungsträchtigste Kapitel überhaupt.' },
        { voice: 'b', text: 'Deshalb machen wir es auch in vielen kleinen Kapiteln statt in wenigen grossen. Dann kann man gezielt zurückspringen.' }
      ]
    },

    /* ---------------------------------------------------------------- 02 */
    {
      id: 'aufgabe',
      titel: 'Aufgabe',
      kurz: 'Logische Adressierung und Routing',
      segments: [
        { voice: 'b', text: 'Bringen wir die Aufgabe auf zwei Begriffe herunter.' },
        { voice: 'a', text: 'Logische Adressierung über IP-Adressen. Und Routing.' },
        { voice: 'b', text: 'Routing heisst konkret?' },
        { voice: 'a', text: 'Den Weg eines Pakets über mehrere Netzwerke hinweg zu bestimmen, vom Sender zum Empfänger — auch wenn die beiden nicht im selben lokalen Netz liegen.' },
        { voice: 'b', text: 'Das Wort logisch trägt dabei viel Gewicht.' },
        { voice: 'a', text: 'Es ist der Unterschied zur MAC-Adresse. Die ist eingebrannt und gehört zum Gerät. Die IP-Adresse wird vergeben und kann sich ändern.' },
        { voice: 'b', text: 'Also: MAC sagt, wer du bist. IP sagt, wo du gerade bist.' },
        { voice: 'a', text: 'So kann man es sich merken. Und weil sie vergeben wird, lässt sie sich in Netze und Teilnetze ordnen — genau das macht Routing überhaupt erst möglich.' }
      ]
    },

    /* ---------------------------------------------------------------- 03 */
    {
      id: 'ipv4',
      titel: 'IPv4-Adresse',
      kurz: 'Oktette, Klassen, private Bereiche, APIPA',
      segments: [
        { voice: 'a', text: 'Dann zur Adresse selbst. Wie ist eine IPv4-Adresse aufgebaut?' },
        { voice: 'b', text: 'Zweiunddreissig Bit, aufgeteilt in vier Oktette zu je acht Bit, dezimal geschrieben und mit Punkten getrennt. Zum Beispiel 192.168.1.10.' },
        { voice: 'a', text: 'Und jedes Oktett kann Werte von null bis 255 annehmen.' },
        { voice: 'b', text: 'Weil acht Bit genau diesen Wertebereich abdecken. Historisch wurden diese Adressen in Klassen eingeteilt, von A bis E.' },
        { voice: 'a', text: 'Das ist heute durch CIDR ersetzt, also durch klassenloses Adressieren. Aber?' },
        { voice: 'b', text: 'Aber die IHK fragt die Klassen teilweise noch ab. Also gehen wir sie durch.' },
        { voice: 'a', text: 'Klasse A: erstes Oktett eins bis 126, Standard-Netzmaske Prefix acht, also 255.0.0.0.' },
        { voice: 'b', text: 'Klasse B: erstes Oktett 128 bis 191, Prefix sechzehn, also 255.255.0.0.' },
        { voice: 'a', text: 'Klasse C: erstes Oktett 192 bis 223, Prefix vierundzwanzig, also 255.255.255.0.' },
        { voice: 'b', text: 'Dann wird es speziell. Klasse D, erstes Oktett 224 bis 239, ist Multicast und damit kein Hostnetz.' },
        { voice: 'a', text: 'Und Klasse E, 240 bis 255, ist reserviert beziehungsweise experimentell. Da begegnet einem im Alltag nichts.' },
        { voice: 'b', text: 'Ein Block fehlt noch, der ständig gebraucht wird: die privaten Adressbereiche nach RFC 1918.' },
        { voice: 'a', text: 'Das sind drei. 10.0.0.0 mit Prefix acht, 172.16.0.0 mit Prefix zwölf und 192.168.0.0 mit Prefix sechzehn.' },
        { voice: 'b', text: 'Und die Besonderheit dieser Bereiche?' },
        { voice: 'a', text: 'Sie sind nicht im Internet routbar. Für einen Internetzugriff brauchen sie deshalb NAT — dazu kommen wir später ausführlich.' },
        { voice: 'b', text: 'Bleibt ein vierter Bereich, der eigentlich ein Alarmsignal ist: 169.254.0.0 mit Prefix sechzehn.' },
        { voice: 'a', text: 'Das ist APIPA, Automatic Private IP Addressing. Diese Adresse vergibt sich ein Windows-Host selbst, wenn kein DHCP-Server antwortet.' },
        { voice: 'b', text: 'Wichtig zur Abgrenzung: das ist kein RFC-1918-Bereich, sondern ein eigener Link-Local-Bereich.' },
        { voice: 'a', text: 'Und praktisch gedacht: wer so eine Adresse auf einem Rechner sieht, hat kein Adressproblem, sondern ein DHCP-Problem im Netz.' },
        { voice: 'b', text: 'Das ist ein Befund, der in Fehlersuche-Aufgaben gerne als versteckter Hinweis auftaucht.' }
      ]
    },

    /* ---------------------------------------------------------------- 04 */
    {
      id: 'cidr',
      titel: 'CIDR & Subnetzmasken',
      kurz: 'Prefix, Hosttabelle, Blockgrösse',
      segments: [
        { voice: 'b', text: 'Wir haben jetzt dreimal Prefix gesagt, ohne es zu erklären. Das holen wir nach, denn ohne den Begriff geht auf dieser Schicht gar nichts.' },
        { voice: 'a', text: 'Der Prefix ist die Zahl nach dem Schrägstrich. Er gibt an, wie viele Bit der Adresse von links gezählt fest zum Netzanteil gehören.' },
        { voice: 'b', text: 'Und der Rest?' },
        { voice: 'a', text: 'Ist der Hostanteil. Prefix vierundzwanzig heisst also: die ersten vierundzwanzig Bit sind Netz, die restlichen acht Bit stehen für Hostadressen zur Verfügung.' },
        { voice: 'b', text: 'Und dann gibt es dieselbe Information nochmal in einer zweiten Schreibweise.' },
        { voice: 'a', text: 'Die klassische Subnetzmaske, 255.255.255.0. Das ist exakt dasselbe wie Prefix vierundzwanzig, nur anders aufgeschrieben.' },
        { voice: 'b', text: 'Das ist ein Punkt, an dem viele stolpern. Es sind nicht zwei Konzepte, es ist eins in zwei Schreibweisen.' },
        { voice: 'a', text: 'Gehen wir die wichtigsten Werte durch, das ist reine Handwerkskunde. Prefix acht: Maske 255.0.0.0, nutzbar 16.777.214 Hosts. Das entspricht Klasse A.' },
        { voice: 'b', text: 'Prefix sechzehn: Maske 255.255.0.0, 65.534 Hosts, entspricht Klasse B.' },
        { voice: 'a', text: 'Prefix zwanzig: Maske 255.255.240.0, 4.094 Hosts. Prefix zweiundzwanzig: 255.255.252.0, 1.022 Hosts.' },
        { voice: 'b', text: 'Prefix dreiundzwanzig: 255.255.254.0, 510 Hosts. Prefix vierundzwanzig: 255.255.255.0, 254 Hosts, entspricht Klasse C.' },
        { voice: 'a', text: 'Jetzt wird es kleinteilig, und genau das kommt in Rechenaufgaben. Prefix fünfundzwanzig: 255.255.255.128, 126 Hosts.' },
        { voice: 'b', text: 'Prefix sechsundzwanzig: 255.255.255.192, 62 Hosts. Prefix siebenundzwanzig: 255.255.255.224, 30 Hosts.' },
        { voice: 'a', text: 'Prefix achtundzwanzig: 255.255.255.240, 14 Hosts. Prefix neunundzwanzig: 255.255.255.248, 6 Hosts.' },
        { voice: 'b', text: 'Und Prefix dreissig: 255.255.255.252, 2 Hosts. Das ist der Klassiker für eine Punkt-zu-Punkt-Verbindung.' },
        { voice: 'a', text: 'Zwei Sonderfälle bleiben. Prefix einunddreissig, Maske 255.255.255.254, ergibt ebenfalls zwei nutzbare Adressen — festgelegt in RFC 3021 für Punkt-zu-Punkt-Links.' },
        { voice: 'b', text: 'Und Prefix zweiunddreissig, Maske 255.255.255.255, ist genau ein Host. Das nennt man eine Host-Route.' },
        { voice: 'a', text: 'Die Tabelle muss man übrigens nicht auswendig lernen, wenn man die Formel kennt.' },
        { voice: 'b', text: 'Die lautet: zwei hoch zweiunddreissig minus Prefix, und davon zwei abziehen.' },
        { voice: 'a', text: 'Die beiden abgezogenen sind die Netzadresse und die Broadcast-Adresse. Die kann man nicht an Geräte vergeben.' },
        { voice: 'b', text: 'Und die zwei Ausnahmen dazu hatten wir gerade: Prefix einunddreissig, weil bei Punkt zu Punkt keine Broadcast-Reservierung nötig ist, und Prefix zweiunddreissig als einzelner Host.' },
        { voice: 'a', text: 'Dann fehlt noch das Werkzeug, mit dem man Subnetzgrenzen im Kopf ausrechnet. Dafür braucht man die Maskenwerte pro Oktett.' },
        { voice: 'b', text: 'Ein Subnetzbit ergibt 128, zwei ergeben 192, drei ergeben 224, vier ergeben 240.' },
        { voice: 'a', text: 'Fünf ergeben 248, sechs ergeben 252, sieben ergeben 254 und acht ergeben 255.' },
        { voice: 'b', text: 'Dazu gehören die Blockgrössen: 128, 64, 32, 16, 8, 4, 2 und 1.' },
        { voice: 'a', text: 'Und dafür gibt es eine Merkregel, die einem das Rechnen abnimmt: 256 minus letzter Maskenwert ergibt die Blockgrösse.' },
        { voice: 'b', text: 'Machen wir das an einem Beispiel.' },
        { voice: 'a', text: 'Maske endet auf 192. 256 minus 192 ergibt 64. Also liegen die Subnetze auf null, 64, 128 und 192.' },
        { voice: 'b', text: 'Das ist der Rechentrick, mit dem eine Subnetting-Aufgabe von zehn Minuten auf zwei schrumpft.' }
      ]
    },

    /* ---------------------------------------------------------------- 05 */
    {
      id: 'vlsm',
      titel: 'VLSM',
      kurz: 'Masken nach Bedarf statt starr gleich gross',
      segments: [
        { voice: 'a', text: 'Damit können wir Netze teilen. Bleibt die Frage, ob man immer in gleich grosse Stücke teilen muss.' },
        { voice: 'b', text: 'Muss man nicht, und genau dafür gibt es VLSM: Variable Length Subnet Masking.' },
        { voice: 'a', text: 'Was macht es anders?' },
        { voice: 'b', text: 'Die Maske wird pro Teilnetz individuell an den tatsächlichen Hostbedarf angepasst, statt das Netz starr in gleich grosse Subnetze zu zerlegen.' },
        { voice: 'a', text: 'Und der Gewinn dabei ist gespartes Adressmaterial.' },
        { voice: 'b', text: 'Es gibt eine Grundregel, die man unbedingt einhalten sollte: immer die grössten benötigten Subnetze zuerst zuweisen, danach die kleineren.' },
        { voice: 'a', text: 'Warum diese Reihenfolge?' },
        { voice: 'b', text: 'So bleibt der Adressraum zusammenhängend, und nichts muss später fragmentiert nachgeschoben werden.' },
        { voice: 'a', text: 'Dann gehen wir das Vorgehen in vier Schritten durch. Schritt eins: alle benötigten Teilnetze nach Hostbedarf absteigend sortieren, das grösste zuerst.' },
        { voice: 'b', text: 'Schritt zwei: pro Teilnetz das kleinstmögliche Prefix bestimmen, das den Bedarf noch deckt. Dafür ist die Tabelle von eben da.' },
        { voice: 'a', text: 'Schritt drei: die Netzadressen der Reihe nach vergeben, jeweils direkt hinter dem vorherigen Block fortlaufend.' },
        { voice: 'b', text: 'Und Schritt vier: zum Schluss die kleinsten Teilnetze einsortieren, etwa Prefix dreissig für Punkt-zu-Punkt-Links.' },
        { voice: 'a', text: 'Das rechnen wir einmal durch, sonst bleibt es abstrakt. Ausgangsnetz ist 192.168.10.0 mit Prefix vierundzwanzig.' },
        { voice: 'b', text: 'Gebraucht werden Teilnetze für 100, 50 und 20 Hosts.' },
        { voice: 'a', text: 'Also das grösste zuerst: 100 Hosts. Das kleinste passende ist Prefix fünfundzwanzig mit 126 nutzbaren Adressen.' },
        { voice: 'b', text: 'Das ergibt 192.168.10.0 mit Prefix fünfundzwanzig, im letzten Oktett also der Bereich von null bis 127.' },
        { voice: 'a', text: 'Weiter mit 50 Hosts. Da reicht Prefix sechsundzwanzig mit 62 nutzbaren Adressen.' },
        { voice: 'b', text: 'Und das schliesst direkt an: 192.168.10.128 mit Prefix sechsundzwanzig, im letzten Oktett von 128 bis 191.' },
        { voice: 'a', text: 'Bleiben 20 Hosts. Dafür genügt Prefix siebenundzwanzig mit 30 nutzbaren Adressen.' },
        { voice: 'b', text: 'Also 192.168.10.192 mit Prefix siebenundzwanzig, im letzten Oktett von 192 bis 223.' },
        { voice: 'a', text: 'Und was ab 224 übrig bleibt, steht noch zur Verfügung.' },
        { voice: 'b', text: 'Genau das ist der Punkt von VLSM. Hätte man stur in gleich grosse Blöcke geteilt, wäre der Rest längst verbraucht.' }
      ]
    },

    /* ---------------------------------------------------------------- 06 */
    {
      id: 'ipv6',
      titel: 'IPv6-Adresse',
      kurz: '128 Bit, Kurzschreibweise, Adresstypen',
      segments: [
        { voice: 'b', text: 'Wechseln wir die Adressfamilie. IPv6.' },
        { voice: 'a', text: 'Der grösste Unterschied ist die Länge: 128 Bit statt zweiunddreissig.' },
        { voice: 'b', text: 'Und aufgeteilt wird das anders.' },
        { voice: 'a', text: 'In acht Gruppen zu je sechzehn Bit, hexadezimal geschrieben und durch Doppelpunkte getrennt.' },
        { voice: 'b', text: 'Ausgeschrieben ist so eine Adresse allerdings ein Monster. Deshalb gibt es zwei Kürzungsregeln.' },
        { voice: 'a', text: 'Regel eins: führende Nullen dürfen je Gruppe entfallen. Aus einer Gruppe mit vier Stellen wird dann eine mit einer.' },
        { voice: 'b', text: 'Regel zwei: eine zusammenhängende Folge von Nullgruppen darf einmalig durch einen doppelten Doppelpunkt ersetzt werden.' },
        { voice: 'a', text: 'Das Wort einmalig ist entscheidend. Zweimal wäre nicht mehr eindeutig auflösbar.' },
        { voice: 'b', text: 'Ein Beispiel: eine Adresse, die mit 2001 beginnt, dann d b 8 hat und danach nur noch Nullen bis zur letzten Gruppe mit einer Eins.' },
        { voice: 'a', text: 'Die schrumpft von acht ausgeschriebenen Gruppen auf drei sichtbare Teile zusammen. Derselbe Wert, nur lesbar.' },
        { voice: 'b', text: 'Und die Standard-Präfixlänge im LAN?' },
        { voice: 'a', text: 'Prefix vierundsechzig. Das ist bei IPv6 der Normalfall im lokalen Netz, nicht die Ausnahme.' },
        { voice: 'b', text: 'Dann zu den Adresstypen, das sind vier. Der erste ist Global Unicast, im Bereich 2000 mit Prefix drei.' },
        { voice: 'a', text: 'Das ist die weltweit routbare, öffentliche Adresse.' },
        { voice: 'b', text: 'Der zweite ist Link-Local, Bereich f e 80 mit Prefix zehn.' },
        { voice: 'a', text: 'Die gilt nur im lokalen Segment und wird automatisch vergeben. Die hat also jedes Gerät, ohne dass jemand etwas konfiguriert.' },
        { voice: 'b', text: 'Der dritte ist Unique Local, kurz ULA, Bereich f c null null mit Prefix sieben.' },
        { voice: 'a', text: 'Das ist das private Gegenstück, funktional wie die RFC-1918-Bereiche bei IPv4.' },
        { voice: 'b', text: 'Und der vierte ist Multicast, Bereich f f null null mit Prefix acht. Also Gruppenadressierung.' },
        { voice: 'a', text: 'Womit wir bei der Aussage sind, die in Prüfungen sicher drankommt: IPv6 kennt kein Broadcast mehr.' },
        { voice: 'b', text: 'Und das ist keine Lücke, sondern Absicht: die Funktion wird vollständig durch Multicast ersetzt.' },
        { voice: 'a', text: 'Zum Schluss noch der Zusammenhang, ohne den IPv6-Subnetting nicht funktioniert: jede Hex-Ziffer entspricht genau vier Bit.' },
        { voice: 'b', text: 'Rechnen wir das an einem Beispiel durch.' },
        { voice: 'a', text: 'Nimm Prefix zweiundfünfzig. Zweiundfünfzig Bit sind dreizehn volle Hex-Ziffern. Das Prefix liegt also mitten in einer Hex-Gruppe.' },
        { voice: 'b', text: 'Und die restlichen Bit dieser Gruppe?' },
        { voice: 'a', text: 'Die stehen für Subnetze zur Verfügung, bis bei Prefix vierundsechzig der Hostanteil beginnt.' }
      ]
    },

    /* ---------------------------------------------------------------- 07 */
    {
      id: 'arp',
      titel: 'ARP & NDP',
      kurz: 'Von der IP-Adresse zur MAC-Adresse',
      segments: [
        { voice: 'a', text: 'Jetzt schliessen wir eine Lücke, die wir in Schicht zwei bewusst offen gelassen haben: ARP.' },
        { voice: 'b', text: 'Das Address Resolution Protocol. Welches Problem löst es?' },
        { voice: 'a', text: 'Ein Gerät kennt die IP-Adresse des Ziels, braucht aber für den Frame die MAC-Adresse. ARP löst das eine ins andere auf.' },
        { voice: 'b', text: 'Und wie läuft das ab?' },
        { voice: 'a', text: 'Über einen Broadcast, sinngemäss: Wer hat IP X? Das Gerät mit dieser Adresse antwortet per Unicast mit seiner MAC-Adresse.' },
        { voice: 'b', text: 'Also Frage an alle, Antwort von genau einem.' },
        { voice: 'a', text: 'Und das Ergebnis wird im ARP-Cache zwischengespeichert, damit nicht bei jedem Paket neu gefragt werden muss.' },
        { voice: 'b', text: 'Bei IPv6 heisst das Ganze anders: NDP, das Neighbor Discovery Protocol.' },
        { voice: 'a', text: 'Das ersetzt ARP und arbeitet über ICMPv6, mit Neighbor Solicitation und Neighbor Advertisement.' },
        { voice: 'b', text: 'Es kann aber mehr als nur das.' },
        { voice: 'a', text: 'Deutlich mehr: es übernimmt zusätzlich die Router-Erkennung und die automatische Adressvergabe, also SLAAC.' },
        { voice: 'b', text: 'Bleibt eine Einordnungsfrage, die in der Prüfung gerne kommt: auf welcher Schicht liegt ARP eigentlich?' },
        { voice: 'a', text: 'Es arbeitet an der Grenze zwischen Schicht zwei und drei. Es löst eine IP-Adresse aus Schicht drei in eine MAC-Adresse aus Schicht zwei auf.' },
        { voice: 'b', text: 'Deshalb wird es oft dieser Schicht zugeordnet.' },
        { voice: 'a', text: 'Wichtig ist die saubere Formulierung: ARP ist damit kein klassisches Layer-3-Routing-Protokoll, sondern ein Hilfsprotokoll zur Kopplung von IP- und MAC-Adressierung.' },
        { voice: 'b', text: 'Das ist genau der Satz, der in einer Prüfungsantwort den Unterschied macht.' }
      ]
    },

    /* ---------------------------------------------------------------- 08 */
    {
      id: 'adressarten',
      titel: 'Adressierungsarten',
      kurz: 'Unicast, Broadcast, Multicast, Anycast',
      segments: [
        { voice: 'b', text: 'Wir haben gerade Broadcast und Unicast in einem Ablauf gesehen. Machen wir daraus eine saubere Übersicht, das sind vier Arten.' },
        { voice: 'a', text: 'Die erste ist Unicast: ein Sender schickt Daten an genau einen bestimmten Empfänger.' },
        { voice: 'b', text: 'Also die normale Eins-zu-eins-Kommunikation.' },
        { voice: 'a', text: 'Und der absolute Regelfall. Ein Webseitenaufruf zu einem bestimmten Server, zum Beispiel.' },
        { voice: 'b', text: 'Die zweite ist Broadcast: ein Sender schickt Daten an alle Geräte im lokalen Netzsegment gleichzeitig, ohne sie einzeln zu adressieren.' },
        { voice: 'a', text: 'Wozu braucht man das?' },
        { voice: 'b', text: 'Immer dann, wenn der Absender die Zieladresse noch gar nicht kennt. Also: Wer hat diese IP? Das ist ARP. Oder: Ich suche einen DHCP-Server.' },
        { voice: 'a', text: 'Die dritte ist Multicast: ein Sender schickt an eine definierte Gruppe von Empfängern, die sich aktiv für diese Gruppe angemeldet haben.' },
        { voice: 'b', text: 'Der Unterschied zum Broadcast ist also die Anmeldung. Nicht alle, sondern die, die sich gemeldet haben.' },
        { voice: 'a', text: 'Einsatz zum Beispiel Video-Streaming an mehrere Teilnehmer, ohne für jeden einzeln zu senden. Oder die Verteilung von Routing-Updates, etwa bei OSPF.' },
        { voice: 'b', text: 'Und die vierte ist Anycast, die ungewöhnlichste von allen.' },
        { voice: 'a', text: 'Dieselbe Adresse ist auf mehreren, verteilten Geräten gleichzeitig aktiv. Das Netz liefert die Anfrage automatisch an den aus Routing-Sicht nächstgelegenen aus.' },
        { voice: 'b', text: 'Klassische Beispiele sind DNS-Root-Server und CDN-Knoten.' },
        { voice: 'a', text: 'Der Zweck ist hohe Verfügbarkeit und kurze Wege, ohne dass der Client den nächsten Server selbst kennen muss.' },
        { voice: 'b', text: 'Jetzt der Vergleich zwischen IPv4 und IPv6, denn da gibt es einen entscheidenden Unterschied.' },
        { voice: 'a', text: 'Unicast gibt es in beiden. Broadcast gibt es nur bei IPv4, zum Beispiel als 255.255.255.255 — bei IPv6 gar nicht mehr.' },
        { voice: 'b', text: 'Multicast gibt es in beiden: bei IPv4 im Bereich 224.0.0.0 mit Prefix vier, bei IPv6 im Bereich f f null null mit Prefix acht.' },
        { voice: 'a', text: 'Und Anycast gibt es ebenfalls in beiden. Bei IPv4 über Routing realisiert, etwa bei DNS-Root-Servern oder 8.8.8.8, bei IPv6 im Standard fest vorgesehen.' },
        { voice: 'b', text: 'Wenn du dir eine Sache aus diesem Kapitel merkst: IPv6 hat kein Broadcast. Das ist die Frage, die kommt.' }
      ]
    },

    /* ---------------------------------------------------------------- 09 */
    {
      id: 'icmp',
      titel: 'ICMP & IGMP',
      kurz: 'Ping, Traceroute und Multicast-Gruppen',
      segments: [
        { voice: 'a', text: 'Zwei Protokolle gehören noch fest zu dieser Schicht, und mit einem davon arbeitet jeder täglich: ICMP.' },
        { voice: 'b', text: 'Das Internet Control Message Protocol. Wofür ist es da?' },
        { voice: 'a', text: 'Für Diagnose- und Fehlermeldungen auf IP-Ebene.' },
        { voice: 'b', text: 'Und es hat eine Eigenheit, die gerne abgefragt wird: es hat keinen Port.' },
        { voice: 'a', text: 'Kein TCP, kein UDP, sondern ein eigenes Protokoll direkt über IP. Wer bei ICMP nach einer Portnummer sucht, sucht vergeblich.' },
        { voice: 'b', text: 'Die bekannteste Anwendung ist Echo Request und Echo Reply.' },
        { voice: 'a', text: 'Also der Ping. Host A sendet einen Echo Request, das ist Typ acht. Host B antwortet mit einem Echo Reply, das ist Typ null.' },
        { voice: 'b', text: 'Es gibt zwei weitere Meldungen, die man kennen sollte: Destination Unreachable und Time Exceeded.' },
        { voice: 'a', text: 'Und Time Exceeded ist gleichzeitig die Grundlage von Traceroute. Das lohnt sich anzuschauen, weil es so elegant gebaut ist.' },
        { voice: 'b', text: 'Dann erklär mal.' },
        { voice: 'a', text: 'Traceroute sendet Pakete mit steigender TTL: erst eins, dann zwei, dann drei und so weiter.' },
        { voice: 'b', text: 'Und TTL ist der Zähler im IP-Header, den jeder Router um eins verringert.' },
        { voice: 'a', text: 'Genau. Jeder Router, der die TTL auf null herunterzählt, schickt ein ICMP Time Exceeded zurück.' },
        { voice: 'b', text: 'Und weil er dabei seine eigene Adresse mitschickt, wird Hop für Hop der Pfad sichtbar.' },
        { voice: 'a', text: 'Der eigentliche Zweck der TTL ist übrigens ein anderer: sie verhindert, dass Pakete endlos im Kreis laufen.' },
        { voice: 'b', text: 'Traceroute nutzt also nur geschickt aus, was ohnehin da ist. Dann zum zweiten Protokoll, IGMP.' },
        { voice: 'a', text: 'Das Internet Group Management Protocol verwaltet, welche Hosts Mitglied einer Multicast-Gruppe sind.' },
        { voice: 'b', text: 'Wozu muss das jemand wissen?' },
        { voice: 'a', text: 'Damit Router wissen, wohin Multicast-Verkehr überhaupt weitergeleitet werden muss.' },
        { voice: 'b', text: 'In der Praxis heisst das: ein Host meldet sich per IGMP als Mitglied an, der Router leitet den Multicast-Stream daraufhin gezielt nur an diesen Host weiter.' },
        { voice: 'a', text: 'Und ein Host, der nicht beigetreten ist, bekommt den Verkehr gar nicht erst zu sehen. Genau das ist der Unterschied zum Broadcast.' }
      ]
    },

    /* ---------------------------------------------------------------- 10 */
    {
      id: 'routing',
      titel: 'Routing',
      kurz: 'Routingtabelle, Longest Prefix Match, RIP, OSPF, BGP',
      segments: [
        { voice: 'b', text: 'Dann zum zweiten grossen Wort aus der Aufgabenbeschreibung: Routing.' },
        { voice: 'a', text: 'Router leiten Pakete anhand der Routingtabelle zwischen unterschiedlichen Netzen weiter. Die Tabelle ist das Regelwerk.' },
        { voice: 'b', text: 'Und wenn mehrere Einträge auf dasselbe Ziel passen?' },
        { voice: 'a', text: 'Dann gilt Longest Prefix Match: der spezifischste, also längste passende Eintrag gewinnt.' },
        { voice: 'b', text: 'Also schlägt eine Route mit Prefix vierundzwanzig eine Route mit Prefix sechzehn zum selben Ziel.' },
        { voice: 'a', text: 'Immer. Je genauer die Route das Ziel beschreibt, desto höher ihr Vorrang.' },
        { voice: 'b', text: 'Wie kommen die Einträge in die Tabelle? Da gibt es zwei Wege.' },
        { voice: 'a', text: 'Statisches Routing heisst: manuell eingetragene Routen. Der Nachteil daran ist, dass es keine automatische Anpassung bei einem Ausfall gibt.' },
        { voice: 'b', text: 'Und dynamisches Routing?' },
        { voice: 'a', text: 'Da tauschen die Router ihre Informationen automatisch untereinander aus. Die bekanntesten Protokolle dafür sind OSPF, BGP und RIP.' },
        { voice: 'b', text: 'Die gehen wir kurz einzeln durch, weil ihre Einsatzgebiete unterschiedlich sind. Fangen wir mit RIP an.' },
        { voice: 'a', text: 'RIP ist ein Distanzvektor-Protokoll und rechnet mit dem Hopcount. Es ist für kleine Netze gedacht, gilt als veraltet und kann maximal fünfzehn Hops.' },
        { voice: 'b', text: 'Fünfzehn ist eine echte Grenze, kein Richtwert. Danach gilt das Ziel als unerreichbar.' },
        { voice: 'a', text: 'OSPF dagegen ist ein Link-State-Protokoll. Einsatz innerhalb eines Unternehmens beziehungsweise eines autonomen Systems, mit schneller Konvergenz.' },
        { voice: 'b', text: 'Und BGP ist ein Pfadvektor-Protokoll, eingesetzt zwischen autonomen Systemen.' },
        { voice: 'a', text: 'Das ist sozusagen das Internet-Routing-Protokoll. Ohne BGP finden die grossen Netze nicht zueinander.' },
        { voice: 'b', text: 'Kurz zum Mitnehmen: RIP klein und veraltet, OSPF innen, BGP aussen.' }
      ]
    },

    /* ---------------------------------------------------------------- 11 */
    {
      id: 'routingbegriffe',
      titel: 'Weitere Routing-Begriffe',
      kurz: 'Default Gateway, Metrik, Administrative Distance',
      segments: [
        { voice: 'a', text: 'Um Routing herum gibt es vier Begriffe, die ständig fallen. Den ersten kennt jeder aus seinen eigenen Netzwerkeinstellungen.' },
        { voice: 'b', text: 'Das Default Gateway. Die IP-Adresse, meist die eines Routers, an die ein Host alle Pakete schickt, deren Ziel nicht im eigenen Subnetz liegt.' },
        { voice: 'a', text: 'Und jetzt der Punkt, den Prüfungsaufgaben gerne prüfen: was passiert ohne Default Gateway?' },
        { voice: 'b', text: 'Dann kann ein Host nur innerhalb seines eigenen Subnetzes aktiv Daten senden.' },
        { voice: 'a', text: 'Ganz wichtig dabei die Feinheit: erreichbar ist er für Geräte im selben Subnetz trotzdem. Das Gateway wird nur für den Weg nach draussen gebraucht.' },
        { voice: 'b', text: 'Der zweite Begriff ist die Routing-Metrik. Das ist die Bewertungszahl, mit der ein Routingprotokoll den besten Weg bestimmt.' },
        { voice: 'a', text: 'Und die ist je nach Protokoll etwas anderes. Bei RIP ist es der Hopcount, bei OSPF die Cost, abgeleitet aus der Bandbreite.' },
        { voice: 'b', text: 'Und es gibt noch ein drittes: EIGRP rechnet mit Bandbreite, Verzögerung und Last.' },
        { voice: 'a', text: 'Wichtig dabei: EIGRP ist Cisco-proprietär und nicht dasselbe wie OSPF. Das wird gern verwechselt.' },
        { voice: 'b', text: 'Bei der Metrik gilt übrigens: niedriger ist besser.' },
        { voice: 'a', text: 'Der dritte Begriff ist die Administrative Distance. Ein Vertrauenswert.' },
        { voice: 'b', text: 'Vertrauen worin?' },
        { voice: 'a', text: 'In die Quelle einer Route. Gibt es mehrere Routen zum selben Ziel, entscheidet dieser Wert, welcher Quelle Vorrang gegeben wird — statische Route, OSPF oder BGP.' },
        { voice: 'b', text: 'Und auch hier gewinnt der niedrigere Wert.' },
        { voice: 'a', text: 'Eine ehrliche Einordnung gehört dazu: das ist kein universelles OSI-Konzept, sondern herstellerspezifisch, vor allem von Cisco geprägt.' },
        { voice: 'b', text: 'Andere Hersteller nennen dasselbe Grundprinzip oft Route Preference oder ähnlich.' },
        { voice: 'a', text: 'Bleibt der vierte Begriff: CIDR-Summarization, auch Route Summarization genannt.' },
        { voice: 'b', text: 'Da werden mehrere zusammenhängende Netze zu einem einzigen, grösseren Routing-Eintrag zusammengefasst.' },
        { voice: 'a', text: 'Ein Beispiel: 192.168.0.0 und 192.168.1.0, beide mit Prefix vierundzwanzig, werden zu 192.168.0.0 mit Prefix dreiundzwanzig.' },
        { voice: 'b', text: 'Und der Zweck ist, die Routingtabellen kleiner zu halten.' },
        { voice: 'a', text: 'Was bei den Grössenordnungen im Internet kein Schönheitsthema ist, sondern eine Notwendigkeit.' }
      ]
    },

    /* ---------------------------------------------------------------- 12 */
    {
      id: 'nat',
      titel: 'NAT',
      kurz: 'Statisch, dynamisch und PAT',
      segments: [
        { voice: 'b', text: 'Jetzt lösen wir ein Versprechen aus dem Adresskapitel ein. Private Adressen sind nicht im Internet routbar — was macht man dagegen?' },
        { voice: 'a', text: 'NAT, Network Address Translation. Es übersetzt private IP-Adressen in eine öffentliche und wieder zurück.' },
        { voice: 'b', text: 'Und es gibt drei Varianten, die man auseinanderhalten sollte. Die erste ist statisches NAT.' },
        { voice: 'a', text: 'Eine feste Eins-zu-eins-Zuordnung zwischen einer privaten und einer öffentlichen IP-Adresse.' },
        { voice: 'b', text: 'Die zweite ist dynamisches NAT.' },
        { voice: 'a', text: 'Da bekommen private Adressen wechselnd eine Adresse aus einem öffentlichen Adresspool zugeteilt.' },
        { voice: 'b', text: 'Und die dritte ist die, die praktisch überall läuft: PAT, auch NAPT genannt.' },
        { voice: 'a', text: 'Port Address Translation. Da teilen sich viele private Adressen eine einzige öffentliche Adresse.' },
        { voice: 'b', text: 'Und wie wird unterschieden, welche Antwort zu welchem Gerät gehört?' },
        { voice: 'a', text: 'Über die Portnummern. Das ist der ganze Trick dabei.' },
        { voice: 'b', text: 'Das ist der Normalfall im Heimrouter. Wer zu Hause zehn Geräte im Netz hat, nutzt genau das, meist ohne es zu wissen.' },
        { voice: 'a', text: 'Und weil es so verbreitet ist, ist es auch ein beliebtes Prüfungsthema.' }
      ]
    },

    /* ---------------------------------------------------------------- 13 */
    {
      id: 'geraete',
      titel: 'Geräte & RFCs',
      kurz: 'Router, Layer-3-Switch, Paketfilter, wichtige RFCs',
      segments: [
        { voice: 'a', text: 'Halten wir fest, welche Geräte auf dieser Schicht arbeiten. Das sind drei.' },
        { voice: 'b', text: 'Der Router, der Layer-3-Switch und die klassische Paketfilter-Firewall, die IP-Adressen und Protokoll prüft.' },
        { voice: 'a', text: 'Beim zweiten stutzt man beim Lernen zu Recht. Ein Switch war doch gerade noch Schicht zwei.' },
        { voice: 'b', text: 'Und das bleibt auch so. Ein normaler Switch arbeitet mit MAC-Adressen auf Schicht zwei, daran ändert sich nichts.' },
        { voice: 'a', text: 'Der Layer-3-Switch ist ein eigenständiges, zusätzliches Gerät. Er kann alles, was ein normaler Switch kann.' },
        { voice: 'b', text: 'Und zusätzlich?' },
        { voice: 'a', text: 'Er kann zwischen VLANs beziehungsweise Subnetzen anhand von IP-Adressen routen, also das, was sonst ein Router tut.' },
        { voice: 'b', text: 'Warum nimmt man dann nicht einfach einen Router?' },
        { voice: 'a', text: 'Wegen der Geschwindigkeit. Der Layer-3-Switch macht das meist mit spezieller Hardware, mit ASICs, und ist dadurch sehr schnell.' },
        { voice: 'b', text: 'Er ersetzt den normalen Switch also nicht, sondern ergänzt ihn um Routing-Fähigkeiten.' },
        { voice: 'a', text: 'In der Praxis findet man ihn oft im Backbone grösserer Netze, wo Router-Funktion in hoher Geschwindigkeit gebraucht wird.' },
        { voice: 'b', text: 'Dann noch die RFCs, die zu dieser Schicht gehören. Die tauchen in Prüfungen als Zuordnungsaufgabe auf.' },
        { voice: 'a', text: 'RFC 791 ist die IPv4-Spezifikation. RFC 1918 legt die privaten IPv4-Adressbereiche fest.' },
        { voice: 'b', text: 'RFC 3021 regelt die Subnetze mit Prefix einunddreissig für Punkt-zu-Punkt-Links.' },
        { voice: 'a', text: 'Und für IPv6 gibt es zwei: RFC 4291 beschreibt die Adressarchitektur, RFC 8200 ist die IPv6-Spezifikation selbst.' },
        { voice: 'b', text: 'Fünf Nummern. Die kann man sich als Paar merken: 791 und 8200 sind die beiden Spezifikationen, 1918 und 4291 die beiden Adressthemen.' },
        { voice: 'a', text: 'Und 3021 ist der Sonderfall für Punkt zu Punkt.' }
      ]
    },

    /* ---------------------------------------------------------------- 14 */
    {
      id: 'ipsec',
      titel: 'IPsec',
      kurz: 'Schutzziele, AH und ESP, Transport und Tunnel',
      segments: [
        { voice: 'b', text: 'Kommen wir zum Sicherheitsteil dieser Schicht. Der beginnt mit IPsec.' },
        { voice: 'a', text: 'Das ist ein Protokollrahmen zur gesicherten Kommunikation auf Schicht drei. Er verschlüsselt und authentifiziert IP-Pakete.' },
        { voice: 'b', text: 'Und zwar unabhängig davon, welches Protokoll darüber läuft, also gleich ob TCP oder UDP.' },
        { voice: 'a', text: 'Das ist der Vorteil, wenn Schutz so weit unten ansetzt: die Anwendung darüber muss nichts davon wissen.' },
        { voice: 'b', text: 'Klassischer Einsatz sind Standort-zu-Standort- oder Client-zu-Standort-VPNs.' },
        { voice: 'a', text: 'IPsec verfolgt vier Ziele. Das erste ist Vertraulichkeit: die Daten werden verschlüsselt, sodass Dritte den Inhalt nicht mitlesen können.' },
        { voice: 'b', text: 'Das zweite ist Integrität. Es wird erkannt, ob Daten unterwegs verändert wurden, über eine Prüfsumme beziehungsweise einen Hash über den Inhalt.' },
        { voice: 'a', text: 'Das dritte ist Authentizität: es wird bestätigt, dass das Paket wirklich vom angegebenen Absender stammt.' },
        { voice: 'b', text: 'Und das vierte ist der Schutz vor Replay-Angriffen.' },
        { voice: 'a', text: 'Der verhindert, dass ein mitgeschnittenes, gültiges Paket später einfach erneut eingespielt wird. Umgesetzt wird das über Sequenznummern.' },
        { voice: 'b', text: 'Dafür bringt IPsec zwei Protokolle mit. Das erste ist der Authentication Header.' },
        { voice: 'a', text: 'Der leistet Integrität und Authentizität — aber keine Verschlüsselung. Das muss man wissen, das ist eine typische Fangfrage.' },
        { voice: 'b', text: 'Und das zweite ist ESP, Encapsulating Security Payload.' },
        { voice: 'a', text: 'Das verschlüsselt und liefert optional zusätzlich Integrität und Authentizität. In der Praxis ist ESP der Regelfall.' },
        { voice: 'b', text: 'Dann bleiben die zwei Betriebsarten, und die werden gerne verwechselt. Zuerst der Transport-Modus.' },
        { voice: 'a', text: 'Da werden nur die Nutzdaten geschützt, der ursprüngliche IP-Header bleibt sichtbar. Typisch für Host-zu-Host-Verbindungen.' },
        { voice: 'b', text: 'Und der Tunnel-Modus?' },
        { voice: 'a', text: 'Da wird das komplette Original-Paket verschlüsselt, inklusive seines IP-Headers, und in ein neues Paket mit neuem äusseren IP-Header verpackt.' },
        { voice: 'b', text: 'Das ist der Standardmodus bei Site-to-Site-VPNs zwischen zwei Routern oder Firewalls.' },
        { voice: 'a', text: 'Die Kurzfassung: Transport schützt den Inhalt, Tunnel versteckt zusätzlich, wer ursprünglich mit wem spricht.' }
      ]
    },

    /* ---------------------------------------------------------------- 15 */
    {
      id: 'vpn',
      titel: 'VPN',
      kurz: 'Sicherheitsziele, Verbindungsarten, Tunneling',
      segments: [
        { voice: 'a', text: 'IPsec ist gerade mehrfach im Zusammenhang mit VPN gefallen. Sauber getrennt: was ist ein VPN überhaupt?' },
        { voice: 'b', text: 'Ein VPN baut über ein unsicheres Netz, meist das Internet, eine logisch abgeschottete, verschlüsselte Verbindung auf.' },
        { voice: 'a', text: 'Als läge zwischen den Endpunkten ein eigenes privates Kabel.' },
        { voice: 'b', text: 'Und jetzt die Abgrenzung, die wirklich wichtig ist: IPsec ist ein mögliches Verschlüsselungsverfahren für den Tunnel.' },
        { voice: 'a', text: 'Aber kein Synonym für VPN selbst. Das wird ständig durcheinandergeworfen.' },
        { voice: 'b', text: 'An der Stelle steht in der Enzyklopädie ein Merksatz vom Dozenten, den wir mitnehmen sollten: die drei Sicherheitsziele.' },
        { voice: 'a', text: 'Die gelten nicht nur für VPN, sondern für Sicherheit allgemein — und sind IHK-Dauerbrenner.' },
        { voice: 'b', text: 'Erstens Vertraulichkeit: nur berechtigte Empfänger können die Daten lesen. Umgesetzt durch Verschlüsselung.' },
        { voice: 'a', text: 'Zweitens Integrität: die Daten wurden unterwegs nicht unbemerkt verändert. Umgesetzt durch Prüfsumme beziehungsweise Hash.' },
        { voice: 'b', text: 'Drittens Authentizität: der Absender ist wirklich der, der er vorgibt zu sein. Umgesetzt über Zertifikat, Signatur oder einen Pre-Shared-Key.' },
        { voice: 'a', text: 'Diese drei sollte man im Schlaf aufsagen können. Dann zu den Verbindungsarten, das sind zwei.' },
        { voice: 'b', text: 'Die erste ist Site-to-Site. Da werden zwei komplette Standorte dauerhaft über ihre Gateways verbunden, also über Router oder Firewalls.' },
        { voice: 'a', text: 'Und das Gateway übernimmt die Ver- und Entschlüsselung. Die einzelnen Clients merken davon nichts.' },
        { voice: 'b', text: 'Für sie sieht es aus wie ein gemeinsames Netz. Typischer Fall: Filiale und Hauptsitz.' },
        { voice: 'a', text: 'Die zweite ist End-to-Site, auch Remote Access genannt.' },
        { voice: 'b', text: 'Da baut ein einzelnes Endgerät individuell eine Verbindung zum zentralen Gateway auf, zum Beispiel ein Homeoffice-Laptop.' },
        { voice: 'a', text: 'Der Preis dafür: jeder Client braucht eine eigene VPN-Software beziehungsweise Konfiguration.' },
        { voice: 'b', text: 'Bleibt eine Entscheidung, die in der Praxis oft diskutiert wird: was läuft eigentlich alles durch den Tunnel?' },
        { voice: 'a', text: 'Dafür gibt es zwei Betriebsarten. Bei Full Tunneling, auch Closed Tunneling, wird sämtlicher Datenverkehr des Clients durch den Tunnel zur Firma geleitet.' },
        { voice: 'b', text: 'Auch ganz normales Surfen?' },
        { voice: 'a', text: 'Auch das. Das geht dann von der Firma aus ins Internet. Vorteil: maximale Kontrolle und Sicherheit für den Arbeitgeber.' },
        { voice: 'b', text: 'Und der Nachteil ist höhere Latenz und mehr Bandbreitenlast auf der Firmenseite.' },
        { voice: 'a', text: 'Die Alternative ist Split Tunneling: nur der Verkehr zum Firmennetz läuft durch den Tunnel, normales Surfen geht direkt über den eigenen Anschluss.' },
        { voice: 'b', text: 'Das spart Bandbreite und Latenz.' },
        { voice: 'a', text: 'Kostet aber Sicht: der Arbeitgeber hat keine Kontrolle über den restlichen Verkehr. Ein potenzielles Risiko, falls das Gerät kompromittiert wird.' },
        { voice: 'b', text: 'Also eine klassische Abwägung zwischen Kontrolle und Effizienz. Beides ist vertretbar, je nach Anforderung.' }
      ]
    },

    /* ---------------------------------------------------------------- 16 */
    {
      id: 'firewall',
      titel: 'Firewall',
      kurz: 'Paketfilter, Stateful Inspection, Next-Gen',
      segments: [
        { voice: 'b', text: 'Wir haben die Firewall bei den Geräten schon erwähnt, jetzt gehen wir sie sauber durch.' },
        { voice: 'a', text: 'Ihre Aufgabe ist, Netzwerkverkehr anhand von Regeln zu kontrollieren und zu filtern.' },
        { voice: 'b', text: 'Und sie ist oft genau der Punkt, an dem auch die VPN-Tunnel von eben enden.' },
        { voice: 'a', text: 'Es gibt drei Stufen. Die erste ist der Paketfilter, arbeitet stateless.' },
        { voice: 'b', text: 'Der prüft jedes Paket einzeln anhand von IP-Adresse, Port und Protokoll.' },
        { voice: 'a', text: 'Und kennt dabei keinen Verbindungskontext. Jedes Paket wird für sich betrachtet, ohne Gedächtnis.' },
        { voice: 'b', text: 'Die zweite Stufe ist Stateful Inspection.' },
        { voice: 'a', text: 'Die merkt sich den Zustand bestehender Verbindungen. Antwortpakete einer selbst initiierten Verbindung lässt sie dadurch automatisch durch.' },
        { voice: 'b', text: 'Was die Regelwerke deutlich einfacher macht, weil man nicht jede Rückrichtung einzeln freigeben muss.' },
        { voice: 'a', text: 'Die dritte Stufe ist die Next-Generation-Firewall.' },
        { voice: 'b', text: 'Die bringt zusätzlich Deep Packet Inspection, Anwendungserkennung und Intrusion Prevention mit.' },
        { voice: 'a', text: 'Der entscheidende Unterschied: sie schaut auch in den Inhalt, nicht nur in den Header.' },
        { voice: 'b', text: 'Also drei Stufen an Tiefe: einzelnes Paket, Verbindungszustand, Inhalt.' }
      ]
    },

    /* ---------------------------------------------------------------- 17 */
    {
      id: 'remote',
      titel: 'Fernzugriff',
      kurz: 'RDP, RD Gateway, Thin und Zero Client',
      segments: [
        { voice: 'a', text: 'Ein Thema fehlt noch, das eng mit Fernzugriff zusammenhängt: RDP.' },
        { voice: 'b', text: 'Das Remote Desktop Protocol. Es überträgt Bildschirminhalt und Eingaben zwischen einem Client und einem entfernten Rechner oder Server.' },
        { voice: 'a', text: 'Der Nutzer arbeitet also, als säse er direkt davor.' },
        { voice: 'b', text: 'Dazu gibt es das Remote Desktop Gateway. Was macht das?' },
        { voice: 'a', text: 'Es kapselt den RDP-Verkehr in eine HTTPS-Verbindung über Port 443.' },
        { voice: 'b', text: 'Und was gewinnt man dadurch?' },
        { voice: 'a', text: 'Kontrollierten Fernzugriff auf interne Rechner, ohne dass dafür ein separates VPN aufgebaut werden muss. Der RDP-Port selbst muss nach aussen nicht offen sein.' },
        { voice: 'b', text: 'Was sicherheitstechnisch ein grosser Unterschied ist. Ein offener RDP-Port ins Internet ist eine Einladung.' },
        { voice: 'a', text: 'Zentrale Authentifizierung und Zugriffsrichtlinien laufen dann über das Gateway.' },
        { voice: 'b', text: 'Zum Fernzugriff gehören zwei Gerätetypen, die man auseinanderhalten sollte. Der erste ist der Thin Client.' },
        { voice: 'a', text: 'Ein schlankes Endgerät mit einem eigenen, meist reduzierten Betriebssystem, das im Wesentlichen nur eine Verbindung zu einem Server oder einer virtuellen Desktop-Umgebung aufbaut, etwa per RDP.' },
        { voice: 'b', text: 'Es braucht kaum lokale Rechenleistung und lässt sich zentral verwalten.' },
        { voice: 'a', text: 'Der zweite ist der Zero Client, noch minimalistischer.' },
        { voice: 'b', text: 'Wie viel minimalistischer?' },
        { voice: 'a', text: 'Kein lokales Betriebssystem, meist reine Firmware beziehungsweise Hardware. Er startet direkt in die Verbindung zum Server.' },
        { voice: 'b', text: 'Der Vorteil ist praktisch keine lokale Angriffsfläche.' },
        { voice: 'a', text: 'Der Preis dafür: keinerlei Offline-Nutzung möglich. Ohne Server ist das Gerät ein Briefbeschwerer.' },
        { voice: 'b', text: 'Beide Konzepte verlagern Rechenleistung und Daten auf den Server, das Endgerät speichert nichts dauerhaft.' },
        { voice: 'a', text: 'Und daraus ergibt sich der Vorteil für Unternehmen: Diebstahl oder Verlust des Geräts ist kein Datenschutzrisiko, weil keine Daten lokal liegen.' }
      ]
    },

    /* ---------------------------------------------------------------- 18 */
    {
      id: 'krypto',
      titel: 'Verschlüsselung',
      kurz: 'Symmetrisch, asymmetrisch und die Praxis-Kombination',
      segments: [
        { voice: 'b', text: 'Verschlüsselung ist uns jetzt an mehreren Stellen begegnet: bei VPN, bei IPsec, und schon in Schicht zwei beim WLAN.' },
        { voice: 'a', text: 'Deshalb lohnt es sich, die zwei Grundprinzipien einmal sauber gegenüberzustellen. Das erste ist symmetrische Verschlüsselung.' },
        { voice: 'b', text: 'Da nutzen beide Seiten denselben geheimen Schlüssel zum Ver- und Entschlüsseln.' },
        { voice: 'a', text: 'Der Vorteil ist Geschwindigkeit. Der Nachteil steckt in der Voraussetzung.' },
        { voice: 'b', text: 'Nämlich, dass der Schlüssel sicher übertragen werden muss, bevor die eigentliche Kommunikation überhaupt beginnt.' },
        { voice: 'a', text: 'Und genau das ist ein Henne-Ei-Problem. Das bekannteste Verfahren dieser Art ist AES.' },
        { voice: 'b', text: 'Das zweite Prinzip ist asymmetrische Verschlüsselung. Da hat jede Seite ein Schlüsselpaar: einen öffentlichen und einen privaten Schlüssel.' },
        { voice: 'a', text: 'Und der Zusammenhang zwischen beiden ist der Kern: was mit dem öffentlichen Schlüssel verschlüsselt wurde, kann nur der zugehörige private Schlüssel entschlüsseln.' },
        { voice: 'b', text: 'Damit ist kein vorheriger Schlüsselaustausch nötig. Der öffentliche Schlüssel darf ruhig jeder haben.' },
        { voice: 'a', text: 'Der Preis dafür ist, dass es deutlich rechenintensiver ist. Das bekannteste Verfahren hier ist RSA.' },
        { voice: 'b', text: 'Dann stellt sich die Frage, warum man sich überhaupt entscheiden muss. Man kann doch beides haben.' },
        { voice: 'a', text: 'Kann man, und genau das macht die Praxis. Beim TLS-Handshake oder bei IPsec mit IKE wird asymmetrisch nur genutzt, um sich auf einen gemeinsamen symmetrischen Schlüssel zu einigen.' },
        { voice: 'b', text: 'Und die eigentlichen Nutzdaten laufen dann symmetrisch verschlüsselt.' },
        { voice: 'a', text: 'Um Geschwindigkeit zu gewinnen. Man nimmt also von beiden genau das, was sie am besten können.' },
        { voice: 'b', text: 'Asymmetrisch löst das Austauschproblem, symmetrisch macht die Arbeit. Das ist ein Satz, der in einer Prüfung gut aussieht.' }
      ]
    },

    /* ---------------------------------------------------------------- 19 */
    {
      id: 'fehler',
      titel: 'Fehlerquellen',
      kurz: 'Sieben Klassiker auf Schicht 3',
      segments: [
        { voice: 'a', text: 'Wie in den Schichten davor schauen wir zum Abschluss darauf, was in der Praxis typischerweise schiefgeht. Hier sind es sieben.' },
        { voice: 'b', text: 'Der erste ist die falsche Subnetzmaske.' },
        { voice: 'a', text: 'Dann berechnet das Gerät sein eigenes Netz falsch. Es erreicht Ziele im selben physischen Segment nicht — oder versucht unnötig zu routen.' },
        { voice: 'b', text: 'Der zweite ist ein fehlendes oder falsches Default Gateway.' },
        { voice: 'a', text: 'Das hat ein sehr charakteristisches Fehlerbild: die Kommunikation innerhalb des eigenen Subnetzes funktioniert, alles darüber hinaus nicht.' },
        { voice: 'b', text: 'Das ist ein Befund, an dem man die Ursache fast schon ablesen kann.' },
        { voice: 'a', text: 'Der dritte ist der IP-Adresskonflikt: zwei Geräte mit identischer IP im selben Netz.' },
        { voice: 'b', text: 'Häufige Ursachen sind ein parallel betriebener DHCP-Server oder eine statische Fehlkonfiguration.' },
        { voice: 'a', text: 'Der vierte sind Routing-Fehler: fehlende, falsche oder sich widersprechende statische Routen — bis hin zu Routing-Loops.' },
        { voice: 'b', text: 'Der fünfte ist eine falsche NAT- oder PAT-Konfiguration.' },
        { voice: 'a', text: 'Etwa wenn eine Portweiterleitung nicht stimmt oder interne Geräte nicht korrekt ins Internet übersetzt werden.' },
        { voice: 'b', text: 'Der sechste sind ARP-Probleme: ein veralteter Eintrag im ARP-Cache — oder ARP-Spoofing.' },
        { voice: 'a', text: 'Also gefälschte ARP-Antworten. Das ist die Basis für Man-in-the-Middle-Angriffe und damit weit mehr als ein Betriebsproblem.' },
        { voice: 'b', text: 'Und der siebte sind MTU-Probleme.' },
        { voice: 'a', text: 'Pakete werden zu gross für ein Zwischennetz und müssen fragmentiert werden. Ist das Dont-Fragment-Bit gesetzt, gehen sie stattdessen verloren.' },
        { voice: 'b', text: 'Das ist einer der unangenehmsten Fehler überhaupt, weil kleine Pakete durchkommen und nur grosse verschwinden.' },
        { voice: 'a', text: 'Wodurch es aussieht, als würde das Netz nur manchmal funktionieren. Wer das Muster kennt, spart sich Stunden.' }
      ]
    },

    /* ---------------------------------------------------------------- 20 */
    {
      id: 'fazit',
      titel: 'Kurzübersicht & Übergang',
      kurz: 'Zusammenfassung und Brücke zu Schicht 4',
      segments: [
        { voice: 'b', text: 'Damit ist Schicht drei durch. Und das war die längste Etappe bisher, also fassen wir sorgfältig zusammen.' },
        { voice: 'a', text: 'IP-Adressierung in Version vier und sechs, Subnetting und VLSM, dazu ARP und NDP.' },
        { voice: 'b', text: 'Routing mit allem, was dazugehört: statisch und dynamisch, OSPF, BGP und RIP, Default Gateway, Metrik, Administrative Distance und Summarization.' },
        { voice: 'a', text: 'Dann NAT und PAT, ICMP und IGMP, die vier Adressierungsarten Unicast, Broadcast, Multicast und Anycast.' },
        { voice: 'b', text: 'Und der Sicherheitsteil: IPsec mit AH und ESP sowie Transport- und Tunnel-Modus, VPN mit Site-to-Site und End-to-Site und die beiden Tunneling-Arten.' },
        { voice: 'a', text: 'Dazu Firewall-Grundlagen, RDP mit dem RD Gateway, Thin und Zero Client und die symmetrische wie asymmetrische Verschlüsselung.' },
        { voice: 'b', text: 'Zur Einordnung nochmal der Rückblick: Schicht zwei war MAC-Adressierung, CAM-Tabelle, CSMA/CD gegen CSMA/CA, VLAN und Trunking, Spanning Tree mit Root Bridge, Broadcast- gegen Kollisionsdomäne.' },
        { voice: 'a', text: 'Und Schicht eins waren Bits über ein Medium, Hub und Repeater, Topologien und Verkabelung.' },
        { voice: 'b', text: 'Dann schlagen wir die Brücke nach oben. Mit IP-Adressen und Routing findet das Paket seinen Weg über beliebig viele Netze bis zum Zielgerät.' },
        { voice: 'a', text: 'Aber damit steht nur fest, welches Gerät gemeint ist.' },
        { voice: 'b', text: 'Und nicht, welche der vielen laufenden Anwendungen darauf die Daten bekommen soll.' },
        { voice: 'a', text: 'Ein Server betreibt gleichzeitig Webdienst, Mailserver und SSH. Die IP-Adresse allein kann die drei nicht auseinanderhalten.' },
        { voice: 'b', text: 'Genau da setzt Schicht vier an.' },
        { voice: 'a', text: 'Sie adressiert über Portnummern nicht mehr das Gerät, sondern den konkreten Prozess darauf.' },
        { voice: 'b', text: 'Und sie entscheidet mit TCP oder UDP, ob die Übertragung zuverlässig und verbindungsorientiert oder schlank und verbindungslos abläuft.' },
        { voice: 'a', text: 'Aus dem IP-Paket wird dafür ausgepackt, was als Nutzlast darin steckte: das Segment bei TCP, das Datagramm bei UDP.' },
        { voice: 'b', text: 'Weiter geht es dann mit der Transportschicht. Für heute bist du mit Schicht drei durch — und das war das dickste Brett.' }
      ]
    }
  ]
};

/* =============================================================================
   BEGRIFFSREGISTER LAYER 3
   -----------------------------------------------------------------------------
   Aufbau wie REGISTER_L1/REGISTER_L2. Alle Antworten aus Section sec-l3
   abgeleitet, nichts hinzuerfunden.

   HINWEIS ZU KURZEN ALIASEN: Der Matcher erzwingt Wortgrenzen. Aliase, die
   zugleich deutsche Alltagswörter oder Verlegenheitslaute sind (z.B. "ah"
   für Authentication Header), sind hier bewusst NICHT aufgenommen — sie
   würden bei jeder zweiten Frage feuern.
   ========================================================================== */

const REGISTER_L3 = [
  /* --- IPv4 -------------------------------------------------------------- */
  {
    id: 'ipv4', label: 'IPv4-Adresse', chapter: 'ipv4',
    aliases: ['ipv4', 'ip v4', 'ip vier', 'ip adresse', 'ip adressen', 'oktett', 'oktette', 'internet protocol version 4'],
    antwort: 'Eine IPv4-Adresse ist zweiunddreissig Bit lang, aufgeteilt in vier Oktette zu je acht Bit, dezimal geschrieben und durch Punkte getrennt, zum Beispiel 192.168.1.10. Jedes Oktett kann Werte von null bis 255 annehmen. Im Unterschied zur MAC-Adresse wird sie logisch vergeben und kann sich ändern. Sie ist die Grundlage für netzübergreifendes Routing.'
  },
  {
    id: 'klassen', label: 'IP-Adressklassen A bis E', chapter: 'ipv4',
    aliases: ['adressklassen', 'ip klassen', 'klasse a', 'klasse b', 'klasse c', 'klasse d', 'klasse e', 'klassen einteilung'],
    antwort: 'Klasse A hat als erstes Oktett eins bis 126 und die Standardmaske 255.0.0.0. Klasse B 128 bis 191 mit 255.255.0.0. Klasse C 192 bis 223 mit 255.255.255.0. Klasse D ist 224 bis 239 und für Multicast reserviert, also kein Hostnetz. Klasse E ist 240 bis 255 und reserviert beziehungsweise experimentell. Heute ist das durch CIDR ersetzt, die IHK fragt es aber teils noch ab.'
  },
  {
    id: 'privat', label: 'Private IP-Bereiche (RFC 1918)', chapter: 'ipv4',
    aliases: ['private adressen', 'private bereiche', 'rfc 1918', 'rfc1918', 'privater adressbereich', 'nicht routbar'],
    antwort: 'Die privaten Bereiche nach RFC 1918 sind 10.0.0.0 mit Prefix acht, 172.16.0.0 mit Prefix zwölf und 192.168.0.0 mit Prefix sechzehn. Sie sind nicht im Internet routbar und brauchen für einen Internetzugriff NAT.'
  },
  {
    id: 'apipa', label: 'APIPA', chapter: 'ipv4',
    aliases: ['apipa', 'automatic private ip addressing', '169 254', 'link local ipv4', 'selbstvergebene adresse'],
    antwort: 'APIPA ist Automatic Private IP Addressing: eine selbstvergebene Link-Local-Adresse aus 169.254.0.0 mit Prefix sechzehn, die ein Windows-Host sich selbst gibt, wenn kein DHCP-Server antwortet. Das ist kein RFC-1918-Bereich und praktisch ein Anzeichen für ein DHCP-Problem im Netz.'
  },

  /* --- CIDR & Subnetting ------------------------------------------------- */
  {
    id: 'cidr', label: 'CIDR', chapter: 'cidr',
    aliases: ['cidr', 'c i d r', 'classless inter domain routing', 'klassenlos'],
    antwort: 'CIDR steht für Classless Inter-Domain Routing: die klassenlose Schreibweise der Netzgrösse über einen Prefix statt über die alten Klassen A, B und C. Das erlaubt beliebige Netzgrenzen und damit eine effiziente Adressvergabe.'
  },
  {
    id: 'prefix', label: 'Prefix & Subnetzmaske', chapter: 'cidr',
    aliases: ['prefix', 'praefix', 'subnetzmaske', 'netzmaske', 'maske', 'netzanteil', 'hostanteil'],
    antwort: 'Der Prefix ist die Zahl nach dem Schrägstrich. Er gibt an, wie viele Bit von links fest zum Netzanteil gehören, der Rest ist der Hostanteil. Prefix vierundzwanzig heisst: die ersten vierundzwanzig Bit sind Netz, die restlichen acht Bit sind Hostadressen. CIDR-Prefix und klassische Subnetzmaske, also 255.255.255.0, bezeichnen genau dasselbe.'
  },
  {
    id: 'hostformel', label: 'Formel für nutzbare Hosts', chapter: 'cidr',
    aliases: ['nutzbare hosts', 'hostformel', 'wie viele hosts', 'anzahl hosts', 'hosts berechnen'],
    antwort: 'Die Formel lautet: zwei hoch zweiunddreissig minus Prefix, davon zwei abziehen. Abgezogen werden Netzadresse und Broadcast-Adresse. Ausnahmen sind Prefix einunddreissig für Punkt-zu-Punkt-Links, da ist keine Broadcast-Reservierung nötig, und Prefix zweiunddreissig als einzelne Host-Route.'
  },
  {
    id: 'blockgroesse', label: 'Blockgrösse & Maskenwerte', chapter: 'cidr',
    aliases: ['blockgroesse', 'block groesse', 'maskenwert', 'subnetzbits', 'merkregel maske', '256 minus'],
    antwort: 'Die Maskenwerte je Oktett sind der Reihe nach 128, 192, 224, 240, 248, 252, 254 und 255. Die zugehörigen Blockgrössen sind 128, 64, 32, 16, 8, 4, 2 und 1. Merkregel: 256 minus letzter Maskenwert ergibt die Blockgrösse. Bei einer Maske, die auf 192 endet, sind das 64 — die Subnetze liegen dann auf null, 64, 128 und 192.'
  },
  {
    id: 'vlsm', label: 'VLSM', chapter: 'vlsm',
    aliases: ['vlsm', 'v l s m', 'variable length subnet masking', 'variable subnetzmaske', 'subnetting nach bedarf'],
    antwort: 'VLSM, Variable Length Subnet Masking, passt die Maske pro Teilnetz individuell an den tatsächlichen Hostbedarf an, statt starr gleich grosse Subnetze zu bilden. Das spart Adressraum. Grundregel: immer die grössten benötigten Subnetze zuerst zuweisen, danach die kleineren — so bleibt der Adressraum zusammenhängend.'
  },

  /* --- IPv6 -------------------------------------------------------------- */
  {
    id: 'ipv6', label: 'IPv6-Adresse', chapter: 'ipv6',
    aliases: ['ipv6', 'ip v6', 'ip sechs', 'internet protocol version 6', 'hexadezimale adresse'],
    antwort: 'Eine IPv6-Adresse ist 128 Bit lang, in acht Gruppen zu je sechzehn Bit, hexadezimal und durch Doppelpunkte getrennt. Führende Nullen dürfen je Gruppe entfallen, eine zusammenhängende Nullgruppen-Folge darf einmalig durch einen doppelten Doppelpunkt ersetzt werden. Die Standard-Präfixlänge im LAN ist vierundsechzig. Broadcast entfällt und wird vollständig durch Multicast ersetzt.'
  },
  {
    id: 'ipv6typen', label: 'IPv6-Adresstypen', chapter: 'ipv6',
    aliases: ['global unicast', 'link local', 'unique local', 'ula', 'u l a', 'adresstyp', 'fe80', 'fc00'],
    antwort: 'Es gibt vier Typen. Global Unicast im Bereich 2000 mit Prefix drei ist weltweit routbar und öffentlich. Link-Local im Bereich f e 80 mit Prefix zehn gilt nur im lokalen Segment und wird automatisch vergeben. Unique Local, kurz ULA, im Bereich f c null null mit Prefix sieben ist das private Gegenstück zu RFC 1918. Und Multicast liegt im Bereich f f null null mit Prefix acht.'
  },
  {
    id: 'hexbit', label: 'Hex-Ziffern und Bits', chapter: 'ipv6',
    aliases: ['hexadezimal', 'hex ziffer', 'vier bit', 'ipv6 subnetting', 'hex in binaer'],
    antwort: 'Jede Hex-Ziffer entspricht genau vier Bit. Ein Prefix wie zweiundfünfzig liegt damit mitten in einer Hex-Gruppe, denn zweiundfünfzig Bit sind dreizehn volle Hex-Ziffern. Die restlichen Bit dieser Gruppe stehen für Subnetze zur Verfügung, bevor bei Prefix vierundsechzig der Hostanteil beginnt.'
  },

  /* --- ARP / NDP --------------------------------------------------------- */
  {
    id: 'arp', label: 'ARP', chapter: 'arp',
    aliases: ['arp', 'a r p', 'address resolution protocol', 'adressaufloesung', 'arp cache'],
    antwort: 'ARP, das Address Resolution Protocol, löst bei IPv4 eine bekannte IP-Adresse in die zugehörige MAC-Adresse auf: per Broadcast wird gefragt, wer eine bestimmte IP hat, das betreffende Gerät antwortet per Unicast mit seiner MAC-Adresse. Das Ergebnis landet im ARP-Cache. ARP arbeitet an der Grenze zwischen Schicht zwei und drei und ist ein Hilfsprotokoll, kein Routing-Protokoll.'
  },
  {
    id: 'ndp', label: 'NDP', chapter: 'arp',
    aliases: ['ndp', 'n d p', 'neighbor discovery protocol', 'neighbor solicitation', 'slaac', 'icmpv6'],
    antwort: 'NDP, das Neighbor Discovery Protocol, ist das IPv6-Gegenstück zu ARP. Es arbeitet über ICMPv6 mit Neighbor Solicitation und Neighbor Advertisement und übernimmt zusätzlich die Router-Erkennung sowie die automatische Adressvergabe, also SLAAC.'
  },

  /* --- Adressierungsarten ------------------------------------------------ */
  {
    id: 'unicast', label: 'Unicast', chapter: 'adressarten',
    aliases: ['unicast', 'uni cast', 'eins zu eins'],
    antwort: 'Unicast ist die Eins-zu-eins-Kommunikation: ein Sender an genau einen Empfänger. Das ist der absolute Regelfall, zum Beispiel der Aufruf einer bestimmten Webseite. Unicast gibt es bei IPv4 und IPv6.'
  },
  {
    id: 'broadcast', label: 'Broadcast', chapter: 'adressarten',
    aliases: ['broadcast', 'broad cast', 'an alle senden'],
    antwort: 'Broadcast ist ein Sender an alle Geräte im lokalen Segment gleichzeitig, zum Beispiel bei einer ARP-Anfrage oder der Suche nach einem DHCP-Server. Typisch dann, wenn der Absender die Zieladresse noch nicht kennt. Bei IPv4 vorhanden, etwa als 255.255.255.255 — bei IPv6 gibt es Broadcast nicht mehr.'
  },
  {
    id: 'multicast', label: 'Multicast', chapter: 'adressarten',
    aliases: ['multicast', 'multi cast', 'gruppenadressierung', 'empfaengergruppe'],
    antwort: 'Multicast ist ein Sender an eine definierte Empfängergruppe, die sich aktiv angemeldet hat — nicht an alle. Bei IPv4 liegt der Bereich bei 224.0.0.0 mit Prefix vier, bei IPv6 bei f f null null mit Prefix acht. Einsatz zum Beispiel Streaming oder die Verteilung von OSPF-Updates.'
  },
  {
    id: 'anycast', label: 'Anycast', chapter: 'adressarten',
    aliases: ['anycast', 'any cast', 'naechster empfaenger', 'cdn knoten'],
    antwort: 'Bei Anycast liegt dieselbe Adresse auf mehreren verteilten Geräten. Das Netz liefert die Anfrage an den aus Routing-Sicht nächsten aus. Einsatz zum Beispiel DNS-Root-Server oder CDN-Knoten. Ziel sind hohe Verfügbarkeit und kurze Wege, ohne dass der Client den nächsten Server selbst kennen muss.'
  },

  /* --- ICMP / IGMP ------------------------------------------------------- */
  {
    id: 'icmp', label: 'ICMP', chapter: 'icmp',
    aliases: ['icmp', 'i c m p', 'internet control message protocol', 'ping', 'echo request', 'echo reply'],
    antwort: 'ICMP, das Internet Control Message Protocol, ist ein Diagnose- und Fehlermeldeprotokoll direkt über IP, ohne Port — also weder TCP noch UDP. Beispiele sind Echo Request und Echo Reply, also der Ping, dazu Destination Unreachable und Time Exceeded. Beim Ping sendet Host A einen Echo Request vom Typ acht, Host B antwortet mit einem Echo Reply vom Typ null.'
  },
  {
    id: 'igmp', label: 'IGMP', chapter: 'icmp',
    aliases: ['igmp', 'i g m p', 'internet group management protocol', 'multicast gruppe', 'gruppenbeitritt'],
    antwort: 'IGMP, das Internet Group Management Protocol, verwaltet die Mitgliedschaft von Hosts in Multicast-Gruppen, damit Router wissen, wohin Multicast-Verkehr weiterzuleiten ist. Ein Host, der nicht beigetreten ist, bekommt den Multicast-Verkehr gar nicht erst zu sehen.'
  },
  {
    id: 'ttl', label: 'TTL & Traceroute', chapter: 'icmp',
    aliases: ['ttl', 't t l', 'time to live', 'traceroute', 'time exceeded', 'hop fuer hop'],
    antwort: 'Die TTL, Time To Live, ist ein Zähler im IP-Header, den jeder Router um eins verringert. Erreicht sie null, wird das Paket verworfen und ein ICMP Time Exceeded gesendet. Das verhindert endlos kreisende Pakete und ist die Grundlage von Traceroute: das sendet Pakete mit steigender TTL, sodass Hop für Hop der Pfad sichtbar wird.'
  },

  /* --- Routing ----------------------------------------------------------- */
  {
    id: 'routing', label: 'Routing & Routingtabelle', chapter: 'routing',
    aliases: ['routing', 'routingtabelle', 'routing tabelle', 'router', 'statisches routing', 'dynamisches routing'],
    antwort: 'Router leiten Pakete anhand der Routingtabelle zwischen unterschiedlichen Netzen weiter. Statisches Routing heisst manuell eingetragene Routen ohne automatische Anpassung bei Ausfall. Beim dynamischen Routing tauschen die Router ihre Informationen automatisch aus, zum Beispiel über OSPF, BGP oder RIP.'
  },
  {
    id: 'lpm', label: 'Longest Prefix Match', chapter: 'routing',
    aliases: ['longest prefix match', 'laengster prefix', 'spezifischste route'],
    antwort: 'Longest Prefix Match ist die Auswahlregel im Routing: von mehreren passenden Einträgen gewinnt der spezifischste, also längste Prefix. So schlägt eine Route mit Prefix vierundzwanzig eine Route mit Prefix sechzehn zum selben Ziel.'
  },
  {
    id: 'rip', label: 'RIP', chapter: 'routing',
    aliases: ['rip', 'r i p', 'distanzvektor', 'hopcount', 'hop count'],
    antwort: 'RIP ist ein Distanzvektor-Protokoll und arbeitet mit dem Hopcount. Es ist für kleine Netze gedacht, gilt als veraltet und kann maximal fünfzehn Hops.'
  },
  {
    id: 'ospf', label: 'OSPF', chapter: 'routing',
    aliases: ['ospf', 'o s p f', 'link state', 'link state protokoll'],
    antwort: 'OSPF ist ein Link-State-Protokoll und wird innerhalb eines Unternehmens beziehungsweise eines autonomen Systems eingesetzt. Es zeichnet sich durch schnelle Konvergenz aus. Seine Metrik ist die Cost, abgeleitet aus der Bandbreite.'
  },
  {
    id: 'bgp', label: 'BGP', chapter: 'routing',
    aliases: ['bgp', 'b g p', 'pfadvektor', 'autonome systeme', 'autonomes system'],
    antwort: 'BGP ist ein Pfadvektor-Protokoll und wird zwischen autonomen Systemen eingesetzt. Es ist damit das Internet-Routing-Protokoll.'
  },
  {
    id: 'gateway', label: 'Default Gateway', chapter: 'routingbegriffe',
    aliases: ['default gateway', 'standardgateway', 'standard gateway', 'gateway'],
    antwort: 'Das Default Gateway ist die IP-Adresse, meist die eines Routers, an die ein Host alle Pakete schickt, deren Ziel nicht im eigenen Subnetz liegt. Ohne Gateway kann ein Host nur innerhalb seines eigenen Subnetzes aktiv senden — erreichbar ist er für Geräte im selben Subnetz aber trotzdem.'
  },
  {
    id: 'metrik', label: 'Routing-Metrik', chapter: 'routingbegriffe',
    aliases: ['metrik', 'routing metrik', 'cost', 'eigrp', 'e i g r p', 'bester weg'],
    antwort: 'Die Routing-Metrik ist die Bewertungszahl, mit der ein Routingprotokoll den besten Weg bestimmt — Hopcount bei RIP, Cost aus der Bandbreite bei OSPF, und Bandbreite plus Verzögerung plus Last bei EIGRP, das Cisco-proprietär und nicht mit OSPF zu verwechseln ist. Niedriger ist besser.'
  },
  {
    id: 'addistance', label: 'Administrative Distance', chapter: 'routingbegriffe',
    aliases: ['administrative distance', 'administrative distanz', 'vertrauenswert', 'route preference'],
    antwort: 'Die Administrative Distance ist ein Vertrauenswert, der bei mehreren Routen zum selben Ziel entscheidet, welcher Quelle Vorrang gebührt — statische Route, OSPF oder BGP. Der niedrigere Wert gewinnt. Das ist herstellerspezifisch, vor allem von Cisco geprägt, und kein OSI-Standardkonzept; andere Hersteller nennen es oft Route Preference.'
  },
  {
    id: 'summarization', label: 'CIDR-Summarization', chapter: 'routingbegriffe',
    aliases: ['summarization', 'route summarization', 'zusammenfassen von routen', 'routen zusammenfassen', 'supernetting'],
    antwort: 'Bei der CIDR-Summarization werden mehrere zusammenhängende Netze zu einem einzigen, grösseren Routing-Eintrag zusammengefasst. Beispiel: 192.168.0.0 und 192.168.1.0, beide mit Prefix vierundzwanzig, werden zu 192.168.0.0 mit Prefix dreiundzwanzig. Zweck ist, die Routingtabellen kleiner zu halten.'
  },

  /* --- NAT --------------------------------------------------------------- */
  {
    id: 'nat', label: 'NAT', chapter: 'nat',
    aliases: ['nat', 'network address translation', 'adressuebersetzung', 'statisches nat', 'dynamisches nat'],
    antwort: 'NAT, Network Address Translation, übersetzt private IP-Adressen in öffentliche und wieder zurück, weil private Adressen nicht im Internet geroutet werden. Varianten: statisches NAT mit fester Eins-zu-eins-Zuordnung, dynamisches NAT mit wechselnden Adressen aus einem Pool, und PAT beziehungsweise NAPT, bei dem sich viele private Adressen eine öffentliche teilen.'
  },
  {
    id: 'pat', label: 'PAT / NAPT', chapter: 'nat',
    aliases: ['pat', 'napt', 'n a p t', 'port address translation', 'portnummern unterscheidung', 'heimrouter'],
    antwort: 'PAT, auch NAPT genannt, ist die NAT-Variante, bei der sich viele private IP-Adressen eine einzige öffentliche Adresse teilen. Die Unterscheidung läuft über die Portnummern. Das ist der Normalfall im Heimrouter.'
  },

  /* --- Geräte & RFCs ----------------------------------------------------- */
  {
    id: 'l3switch', label: 'Layer-3-Switch', chapter: 'geraete',
    aliases: ['layer 3 switch', 'layer3 switch', 'l3 switch', 'asic', 'asics'],
    antwort: 'Ein Layer-3-Switch kann alles, was ein normaler Switch kann, und zusätzlich zwischen VLANs beziehungsweise Subnetzen anhand von IP-Adressen routen — wie ein Router, meist über spezielle Hardware, also ASICs, und dadurch sehr schnell. Er ersetzt den normalen Switch nicht, sondern ergänzt ihn um Routing-Fähigkeiten. Zu finden ist er oft im Backbone grösserer Netze.'
  },
  {
    id: 'rfcs', label: 'Wichtige RFCs auf Schicht 3', chapter: 'geraete',
    aliases: ['rfc', 'rfcs', 'rfc 791', 'rfc 3021', 'rfc 4291', 'rfc 8200'],
    antwort: 'RFC 791 ist die IPv4-Spezifikation, RFC 1918 legt die privaten IPv4-Adressbereiche fest, RFC 3021 regelt Subnetze mit Prefix einunddreissig für Punkt-zu-Punkt-Links, RFC 4291 beschreibt die IPv6-Adressarchitektur und RFC 8200 ist die IPv6-Spezifikation.'
  },

  /* --- IPsec ------------------------------------------------------------- */
  {
    id: 'ipsec', label: 'IPsec', chapter: 'ipsec',
    aliases: ['ipsec', 'ip sec', 'internet protocol security'],
    antwort: 'IPsec ist ein Protokollrahmen zur gesicherten Kommunikation auf Schicht drei. Er verschlüsselt und authentifiziert IP-Pakete, unabhängig davon, welches Protokoll darüber läuft. Klassischer Einsatz sind Standort-zu-Standort- oder Client-zu-Standort-VPNs. Seine vier Ziele sind Vertraulichkeit, Integrität, Authentizität und Schutz vor Replay-Angriffen über Sequenznummern.'
  },
  {
    id: 'ahesp', label: 'AH und ESP', chapter: 'ipsec',
    aliases: ['authentication header', 'esp', 'e s p', 'encapsulating security payload'],
    antwort: 'Der Authentication Header leistet Integrität und Authentizität, aber keine Verschlüsselung. ESP, die Encapsulating Security Payload, verschlüsselt und liefert optional zusätzlich Integrität und Authentizität — in der Praxis ist ESP der Regelfall.'
  },
  {
    id: 'modi', label: 'Transport- und Tunnel-Modus', chapter: 'ipsec',
    aliases: ['transport modus', 'tunnel modus', 'transportmodus', 'tunnelmodus'],
    antwort: 'Im Transport-Modus werden nur die Nutzdaten geschützt, der ursprüngliche IP-Header bleibt sichtbar — typisch für Host-zu-Host-Verbindungen. Im Tunnel-Modus wird das komplette Original-Paket inklusive IP-Header verschlüsselt und in ein neues Paket mit neuem äusseren IP-Header verpackt. Das ist der Standardmodus bei Site-to-Site-VPNs zwischen zwei Routern oder Firewalls.'
  },

  /* --- VPN --------------------------------------------------------------- */
  {
    id: 'vpn', label: 'VPN', chapter: 'vpn',
    aliases: ['vpn', 'v p n', 'virtual private network', 'tunnel'],
    antwort: 'Ein VPN baut über ein unsicheres Netz, meist das Internet, eine logisch abgeschottete, verschlüsselte Verbindung auf — als läge zwischen den Endpunkten ein eigenes privates Kabel. IPsec ist dabei ein mögliches Verfahren für den Tunnel, aber kein Synonym für VPN selbst.'
  },
  {
    id: 'schutzziele', label: 'Die drei Sicherheitsziele', chapter: 'vpn',
    aliases: ['sicherheitsziele', 'schutzziele', 'vertraulichkeit', 'integritaet', 'authentizitaet', 'drei ziele'],
    antwort: 'Die drei Sicherheitsziele sind: Vertraulichkeit — nur berechtigte Empfänger können die Daten lesen, umgesetzt durch Verschlüsselung. Integrität — die Daten wurden unterwegs nicht unbemerkt verändert, umgesetzt durch Prüfsumme oder Hash. Und Authentizität — der Absender ist wirklich der, der er vorgibt zu sein, umgesetzt über Zertifikat, Signatur oder Pre-Shared-Key. Sie gelten nicht nur für VPN, sondern für Sicherheit allgemein.'
  },
  {
    id: 'verbindungsarten', label: 'Site-to-Site und End-to-Site', chapter: 'vpn',
    aliases: ['site to site', 'end to site', 'remote access', 'standort zu standort', 'verbindungsart'],
    antwort: 'Bei Site-to-Site werden zwei komplette Standorte dauerhaft über ihre Gateways verbunden, also Router oder Firewalls, die auch die Ver- und Entschlüsselung übernehmen. Die Clients merken davon nichts, typisch Filiale und Hauptsitz. Bei End-to-Site, auch Remote Access genannt, baut ein einzelnes Endgerät individuell eine Verbindung zum zentralen Gateway auf. Jeder Client braucht dafür eine eigene VPN-Software.'
  },
  {
    id: 'tunneling', label: 'Split und Full Tunneling', chapter: 'vpn',
    aliases: ['split tunneling', 'full tunneling', 'closed tunneling', 'splittunneling'],
    antwort: 'Bei Full beziehungsweise Closed Tunneling läuft sämtlicher Datenverkehr des Clients durch den Tunnel zur Firma und von dort erst ins Internet: maximale Kontrolle, aber höhere Latenz und mehr Bandbreitenlast. Bei Split Tunneling läuft nur der Verkehr zum Firmennetz durch den Tunnel, normales Surfen geht direkt über den eigenen Anschluss: spart Bandbreite und Latenz, entzieht dem Arbeitgeber aber die Sicht auf den restlichen Verkehr.'
  },

  /* --- Firewall & Fernzugriff -------------------------------------------- */
  {
    id: 'firewall', label: 'Firewall', chapter: 'firewall',
    aliases: ['firewall', 'paketfilter', 'stateful inspection', 'stateless', 'next generation firewall', 'ngfw', 'deep packet inspection'],
    antwort: 'Eine Firewall filtert Netzwerkverkehr anhand von Regeln. Es gibt drei Stufen: der Paketfilter arbeitet stateless und prüft jedes Paket einzeln anhand von IP, Port und Protokoll, ohne Verbindungskontext. Stateful Inspection merkt sich den Zustand bestehender Verbindungen und lässt Antwortpakete automatisch durch. Die Next-Generation-Firewall bringt zusätzlich Deep Packet Inspection, Anwendungserkennung und Intrusion Prevention mit und schaut damit auch in den Inhalt.'
  },
  {
    id: 'rdp', label: 'RDP & RD Gateway', chapter: 'remote',
    aliases: ['rdp', 'r d p', 'remote desktop protocol', 'remote desktop gateway', 'rd gateway', 'fernzugriff'],
    antwort: 'RDP, das Remote Desktop Protocol, überträgt Bildschirminhalt und Eingaben zwischen Client und einem entfernten Rechner. Ein Remote Desktop Gateway kapselt RDP in eine HTTPS-Verbindung über Port 443 und erlaubt so kontrollierten Fernzugriff auf interne Rechner, ohne separates VPN — der RDP-Port selbst muss nach aussen nicht offen sein. Authentifizierung und Zugriffsrichtlinien laufen zentral über das Gateway.'
  },
  {
    id: 'thinclient', label: 'Thin Client & Zero Client', chapter: 'remote',
    aliases: ['thin client', 'zero client', 'thinclient', 'zeroclient', 'terminal'],
    antwort: 'Ein Thin Client ist ein schlankes Endgerät mit eigenem, meist reduziertem Betriebssystem, das im Wesentlichen nur eine Verbindung zu einem Server oder einer virtuellen Desktop-Umgebung aufbaut, etwa per RDP. Ein Zero Client ist noch minimalistischer: kein lokales Betriebssystem, meist reine Firmware, er startet direkt in die Verbindung. Praktisch keine lokale Angriffsfläche, dafür keinerlei Offline-Nutzung. Beide verlagern Rechenleistung und Daten auf den Server.'
  },

  /* --- Verschlüsselung --------------------------------------------------- */
  {
    id: 'symmetrisch', label: 'Symmetrische Verschlüsselung', chapter: 'krypto',
    aliases: ['symmetrisch', 'symmetrische verschluesselung', 'gleicher schluessel'],
    antwort: 'Bei symmetrischer Verschlüsselung nutzen beide Seiten denselben geheimen Schlüssel zum Ver- und Entschlüsseln. Das ist schnell, aber der Schlüssel muss sicher übertragen werden, bevor die eigentliche Kommunikation beginnt. Bekanntestes Verfahren ist AES.'
  },
  {
    id: 'asymmetrisch', label: 'Asymmetrische Verschlüsselung', chapter: 'krypto',
    aliases: ['asymmetrisch', 'asymmetrische verschluesselung', 'schluesselpaar', 'oeffentlicher schluessel', 'privater schluessel', 'rsa'],
    antwort: 'Bei asymmetrischer Verschlüsselung hat jede Seite ein Schlüsselpaar aus öffentlichem und privatem Schlüssel. Was mit dem öffentlichen Schlüssel verschlüsselt wurde, kann nur der zugehörige private Schlüssel entschlüsseln — ein vorheriger Schlüsselaustausch entfällt, dafür ist es deutlich rechenintensiver. Bekanntestes Verfahren ist RSA. In der Praxis, etwa beim TLS-Handshake oder bei IPsec mit IKE, wird asymmetrisch nur genutzt, um sich auf einen gemeinsamen symmetrischen Schlüssel zu einigen.'
  },

  /* --- Fehlerquellen ----------------------------------------------------- */
  {
    id: 'l3fehler', label: 'Fehlerquellen auf Schicht 3', chapter: 'fehler',
    aliases: ['fehlerquellen', 'typische fehler', 'fehlersuche schicht drei', 'was geht schief'],
    antwort: 'Sieben Klassiker: falsche Subnetzmaske, fehlendes oder falsches Default Gateway, IP-Adresskonflikt, Routing-Fehler bis hin zu Routing-Loops, falsche NAT- oder PAT-Konfiguration, ARP-Probleme wie ein veralteter Cache-Eintrag oder ARP-Spoofing, und MTU-Probleme durch zu grosse Pakete.'
  },
  {
    id: 'arpspoofing', label: 'ARP-Spoofing', chapter: 'fehler',
    aliases: ['arp spoofing', 'arpspoofing', 'man in the middle', 'gefaelschte arp antworten'],
    antwort: 'Beim ARP-Spoofing werden gefälschte ARP-Antworten verschickt. Das ist die Basis für Man-in-the-Middle-Angriffe. Verwandt damit ist ein schlicht veralteter Eintrag im ARP-Cache, der ebenfalls zu Erreichbarkeitsproblemen führt.'
  },
  {
    id: 'mtuproblem', label: 'MTU-Probleme', chapter: 'fehler',
    aliases: ['mtu problem', 'fragmentierung', 'dont fragment', 'zu grosse pakete'],
    antwort: 'Bei MTU-Problemen werden Pakete zu gross für ein Zwischennetz und müssen fragmentiert werden. Ist das Dont-Fragment-Bit gesetzt, gehen sie stattdessen verloren. Typisches Bild: kleine Pakete kommen durch, grosse verschwinden.'
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PODCAST_L3, REGISTER_L3 };
}
