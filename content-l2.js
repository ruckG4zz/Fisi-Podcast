/* =============================================================================
   FISI-Podcast-App — Inhaltsmodul: NEINT1, Layer 2 (Sicherungsschicht)
   DIALOG-FASSUNG v1
   -----------------------------------------------------------------------------
   FAKTENQUELLE (einzige Quelle der Wahrheit):
     03 Bereiche/FISI-Umschulung/00_Lernunterstützung/
     03_NEINT1_Netzwerke und Internettechnologien [Grundlagen]/
     NEINT1_OSI_Enzyklopaedie_FINAL.html  ->  Section  id="sec-l2"

   Dieses Skript ist eine ABGELEITETE PRÄSENTATIONSFORM (Hörfassung) dieser
   Section. Es enthält keinerlei erfundene Fachinhalte: jede Zahl, jede
   Definition und jedes Beispiel steht so in der Enzyklopädie. Was
   hinzugekommen ist, sind ausschliesslich Gesprächselemente (Nachfragen,
   Zustimmung, Überleitungen) — also Form, nicht Inhalt.

   ROLLEN — bewusst GETEILT (Vorgabe ruckG4zz, 18.08.2026):
     'a' = Stimme A (männlich)
     'b' = Stimme B (weiblich)
   Beide erklären, beide fragen nach. Wer welchen Teil trägt, wechselt von
   Kapitel zu Kapitel — es gibt keinen festen Erklärer und keinen festen
   Moderator.

   STILREGELN (aus dem Layer-1-Durchgang übernommen, dort bewährt):
     · kurze Wechsel statt langer Blöcke, niemand hält einen Vortrag
     · echte Überleitungen: ein Kapitel schliesst ab und übergibt,
       statt das nächste Thema anzukündigen
     · KEINE deutsch/englisch-Doppelnennungen ("Vollduplex/Full-Duplex") —
       pro Begriff eine Bezeichnung, konsequent durchgehalten
     · Zahlen als Wort, wo sie gesprochen werden; punktierte IP-Adressen
       und Masken bleiben in Ziffernschreibweise (die liest die Stimme
       zuverlässig als Zahlenfolge vor)

   ABKÜRZUNGEN: bleiben hier im Klartext stehen (VLAN, FCS, BPDU …). Die
   Aussprache-Aufbereitung passiert zentral in speech.js (TTS_FIX) — nicht
   im Skripttext, damit der Transkript-Text lesbar bleibt.
   ========================================================================== */

const PODCAST_L2 = {
  id: 'neint1-l2',
  modul: 'NEINT1',
  titel: 'Layer 2 — Sicherungsschicht',
  untertitel: 'Data Link Layer · PDU: Frame · IHK-Relevanz: sehr hoch',
  quelle: 'NEINT1_OSI_Enzyklopaedie_FINAL.html, Section sec-l2',

  chapters: [
    /* ---------------------------------------------------------------- 01 */
    {
      id: 'intro',
      titel: 'Einstieg',
      kurz: 'Was Schicht 1 offen gelassen hat',
      segments: [
        { voice: 'b', text: 'Wir sind eine Etage höher gerutscht. Schicht zwei, die Sicherungsschicht.' },
        /* RÜCKBLICK auf die vorherige Schicht — nachgetragen 18.08.2026 auf
           Wunsch von ruckG4zz. Bewusst kurz und knackig: es ist eine
           Reorientierung für den Fall, dass Schicht eins schon eine Weile
           her ist, kein zweiter Durchgang. Inhalt entspricht der Zeile
           "Rückblick Layer 1" aus der Enzyklopädie. */
        { voice: 'a', text: 'Bevor wir einsteigen, ganz kurz der Rückblick nach unten. Falls Schicht eins schon eine Weile her ist.' },
        { voice: 'b', text: 'Dort ging es um rohe Bits über ein Medium: Kupfer, Lichtwellenleiter oder Funk. Ohne jeden Adressbegriff.' },
        { voice: 'a', text: 'Die Geräte waren Hub, Repeater und Medienkonverter. Dazu gehörten die Topologien und die strukturierte Verkabelung.' },
        { voice: 'b', text: 'Das reicht auch schon als Grundlage. Mehr brauchst du nicht, um hier einzusteigen.' },
        { voice: 'a', text: 'Und wir starten genau da, wo Schicht eins aufgehört hat. Was kommt von unten bei uns an?' },
        { voice: 'b', text: 'Eine lückenlose Folge aus Nullen und Einsen. Kein Anfang, kein Ende, keine Adressen.' },
        { voice: 'a', text: 'Damit lässt sich noch nichts anfangen. Genau die Frage löst diese Schicht als Erstes: wo beginnt und endet eine Nachricht, und für wen im lokalen Netz ist sie bestimmt.' },
        { voice: 'b', text: 'Und wie löst sie das konkret?' },
        { voice: 'a', text: 'Sie schneidet den Bitstrom in klar abgegrenzte Frames. Jeder bekommt eine Absender- und eine Ziel-MAC-Adresse und dazu eine Prüfsumme.' },
        { voice: 'b', text: 'Dann halten wir das Formelle gleich fest, das kommt in Prüfungen gerne als Zuordnungsaufgabe. Die Dateneinheit dieser Schicht, die PDU, ist der Frame.' },
        { voice: 'a', text: 'Im TCP/IP-Modell gehört sie zum Netzzugang, der Verbindungstyp ist Punkt zu Punkt.' },
        { voice: 'b', text: 'Und wie sieht es mit der Prüfungsrelevanz aus?' },
        { voice: 'a', text: 'Sehr hoch. Damit liegt sie noch über Schicht eins, und die war schon hoch.' },
        { voice: 'b', text: 'Dann lohnt sich das Zuhören hier doppelt.' }
      ]
    },

    /* ---------------------------------------------------------------- 02 */
    {
      id: 'aufgabe',
      titel: 'Aufgabe',
      kurz: 'Vier Aufgaben, eine bewusste Lücke',
      segments: [
        { voice: 'a', text: 'Bevor wir in die Details gehen: was macht diese Schicht eigentlich, wenn man es auf die Kernaufgaben herunterbricht?' },
        { voice: 'b', text: 'Es sind vier. Erstens adressiert sie Geräte im lokalen Netz, und zwar über die MAC-Adresse.' },
        { voice: 'a', text: 'Zweitens?' },
        { voice: 'b', text: 'Zweitens verpackt sie Bits in Frames. Drittens erkennt sie Übertragungsfehler. Und viertens regelt sie den Medienzugriff, also wer wann senden darf.' },
        { voice: 'a', text: 'Bei Punkt drei muss man sehr genau hinhören. Sie erkennt Fehler — sie korrigiert sie nicht.' },
        { voice: 'b', text: 'Das ist der Unterschied, an dem in der Prüfung gerne jemand hängen bleibt.' },
        { voice: 'a', text: 'Was passiert denn dann mit einem fehlerhaften Frame?' },
        { voice: 'b', text: 'Der wird verworfen. Nicht repariert, nicht angefragt, einfach weggeworfen. Wer die Wiederholung organisiert, sitzt weiter oben.' },
        { voice: 'a', text: 'Merken wir uns also: Fehlererkennung ja, Fehlerkorrektur nein.' },
        { voice: 'b', text: 'Und der Medienzugriff, den nehmen wir uns später in einem eigenen Kapitel vor, der hat es verdient.' }
      ]
    },

    /* ---------------------------------------------------------------- 03 */
    {
      id: 'mac',
      titel: 'MAC-Adresse',
      kurz: '48 Bit, OUI, Broadcast, Spoofing',
      segments: [
        { voice: 'b', text: 'Fangen wir mit der Adresse an, an der auf dieser Schicht alles hängt. Die MAC-Adresse.' },
        { voice: 'a', text: 'Wie lang ist die?' },
        { voice: 'b', text: 'Achtundvierzig Bit, also sechs Byte. Geschrieben wird sie hexadezimal, zum Beispiel 00:1A:2B:3C:4D:5E.' },
        { voice: 'a', text: 'Und die sechs Byte haben zwei unterschiedliche Bedeutungen, richtig?' },
        { voice: 'b', text: 'Genau. Die ersten drei Byte sind die OUI, die Herstellerkennung. Die vergibt die IEEE, jeder Hersteller bekommt seinen eigenen Block.' },
        { voice: 'a', text: 'Und die letzten drei Byte?' },
        { voice: 'b', text: 'Die sind die geräteindividuelle Seriennummer. Zusammen ergibt das eine Adresse, die weltweit eindeutig sein soll.' },
        { voice: 'a', text: 'Sein soll ist ein gutes Stichwort. Die Adresse ist fest ins Netzwerkinterface eingebrannt.' },
        { voice: 'b', text: 'Aber?' },
        { voice: 'a', text: 'Aber sie lässt sich softwareseitig überschreiben. Das nennt sich Spoofing: man täuscht absichtlich eine falsche, fremde Adresse vor.' },
        { voice: 'b', text: 'Wozu macht man das?' },
        { voice: 'a', text: 'Zum Beispiel um Zugriffskontrollen zu umgehen oder um sich als ein anderes Gerät auszugeben. Deshalb ist die MAC-Adresse allein kein Sicherheitsmerkmal.' },
        { voice: 'b', text: 'Eine Adresse fällt aus der Reihe: FF:FF:FF:FF:FF:FF, sechsmal FF.' },
        { voice: 'a', text: 'Das ist die Broadcast-MAC. Die adressiert alle Geräte im LAN-Segment gleichzeitig.' },
        { voice: 'b', text: 'Jetzt die Frage, die sich beim Lernen aufdrängt: wozu die MAC-Adresse, wenn es doch die IP-Adresse gibt?' },
        { voice: 'a', text: 'Weil sie etwas anderes leistet. Die MAC-Adresse identifiziert ein Gerät eindeutig innerhalb eines physischen Segments. Die IP-Adresse liegt eine Schicht höher, wird logisch vergeben und kann sich ändern.' },
        { voice: 'b', text: 'Und wer arbeitet mit der MAC-Adresse?' },
        { voice: 'a', text: 'Der Switch. Er nimmt die Ziel-MAC eines Frames, schlägt sie in seiner CAM-Tabelle nach und findet dort den Port, an dem das Zielgerät hängt.' },
        { voice: 'b', text: 'Und schickt den Frame dann nur dorthin.' },
        { voice: 'a', text: 'Nur dorthin. Ein Hub würde ihn stattdessen an alle Ports fluten. Der Unterschied kommt gleich noch ausführlicher.' }
      ]
    },

    /* ---------------------------------------------------------------- 04 */
    {
      id: 'frame',
      titel: 'Ethernet-Frame',
      kurz: 'Feldaufbau, Grössen, Header und Trailer',
      segments: [
        { voice: 'a', text: 'Wir haben jetzt die Adresse. Schauen wir uns an, in was sie eigentlich eingebettet ist: den Ethernet-Frame.' },
        { voice: 'b', text: 'Gehen wir ihn von vorne nach hinten durch?' },
        { voice: 'a', text: 'Genau so. Ganz vorne steht die Präambel, sieben Byte. Die dient der Synchronisation der Empfänger-Taktung.' },
        { voice: 'b', text: 'Danach kommt ein einzelnes Byte, der Start Frame Delimiter.' },
        { voice: 'a', text: 'Der markiert den Frame-Beginn. Dann folgen die beiden Adressfelder: Ziel-MAC, sechs Byte, und Quell-MAC, ebenfalls sechs Byte.' },
        { voice: 'b', text: 'Kurzer Einwurf, weil es viele verwirrt: die Zieladresse steht vor der Absenderadresse.' },
        { voice: 'a', text: 'Richtig herum gedacht ist das sogar logisch. Ein Switch muss zuerst wissen, wohin das Ding soll.' },
        { voice: 'b', text: 'Danach kommt das Typfeld, zwei Byte. Was steht da drin?' },
        { voice: 'a', text: 'Der EtherType. Er gibt an, welches Protokoll als Nächstes folgt. Steht dort der Wert null acht null null in hexadezimaler Schreibweise, folgt IPv4. Steht dort acht sechs D D, folgt IPv6.' },
        { voice: 'b', text: 'Dann das eigentliche Herzstück: die Nutzdaten, sechsundvierzig bis fünfzehnhundert Byte.' },
        { voice: 'a', text: 'Und ganz am Ende die FCS, vier Byte. Das ist die CRC-Prüfsumme zur Fehlererkennung.' },
        { voice: 'b', text: 'Jetzt die Zahlen, die die IHK wirklich gerne abfragt. Die minimale Frame-Grösse liegt bei vierundsechzig Byte.' },
        { voice: 'a', text: 'Maximal sind es fünfzehnhundertachtzehn Byte. Mit VLAN-Tag fünfzehnhundertzweiundzwanzig.' },
        { voice: 'b', text: 'Warum vier Byte mehr?' },
        { voice: 'a', text: 'Weil der VLAN-Tag genau vier Byte gross ist und zusätzlich in den Frame eingefügt wird. Dazu kommen wir später noch.' },
        { voice: 'b', text: 'Und die MTU, also die maximalen Nutzdaten, liegt bei fünfzehnhundert Byte.' },
        { voice: 'a', text: 'Noch einmal zur FCS, weil es der Klassiker ist: sie erkennt Fehler, sie korrigiert sie nicht. Ein fehlerhafter Frame wird verworfen, nicht repariert.' },
        { voice: 'b', text: 'Ein Begriff fehlt noch, der überall auftaucht und selten sauber erklärt wird: der Header.' },
        { voice: 'a', text: 'Alle Steuerfelder, die vor den Nutzdaten stehen, bilden zusammen den Header. Beim Frame sind das Ziel-MAC, Quell-MAC und das Typfeld.' },
        { voice: 'b', text: 'Und das Feld ganz am Ende, die Prüfsumme?' },
        { voice: 'a', text: 'Das ist der Trailer. Genau das meint übrigens Kapselung: jede Schicht legt beim Senden ihren eigenen Header aussen um die Daten der Schicht darüber.' },
        { voice: 'b', text: 'Das heisst, in den Nutzdaten unseres Frames steckt schon das fertig gepackte Paket der Schicht drei.' },
        { voice: 'a', text: 'Verschachtelt wie ineinandergesteckte Briefumschläge. Beim Entkapseln liest Schicht zwei ihren Header, prüft die Adresse, entfernt Header und Trailer und reicht nur den Inhalt nach oben weiter.' }
      ]
    },

    /* ---------------------------------------------------------------- 05 */
    {
      id: 'wireshark',
      titel: 'Wireshark',
      kurz: 'Paketanalyse in der Praxis',
      segments: [
        { voice: 'b', text: 'Das war viel Theorie über Felder und Byte-Grössen. Kann man sich das eigentlich irgendwo real ansehen?' },
        { voice: 'a', text: 'Kann man, und dafür gibt es das Standardwerkzeug: Wireshark.' },
        { voice: 'b', text: 'Was genau tut das?' },
        { voice: 'a', text: 'Es ist ein Protokollanalysator, ein Sniffer. Er zeichnet den Datenverkehr an einer Netzwerkschnittstelle mit und zeigt jedes Frame bis auf Bit-Ebene, aufgeschlüsselt nach OSI-Schichten.' },
        { voice: 'b', text: 'Also genau die Struktur, die wir eben durchgegangen sind, nur an echten Daten.' },
        { voice: 'a', text: 'Damit lässt sich nachvollziehen, was ein Frame-Aufbau, ein Drei-Wege-Handschlag oder ein ARP-Ablauf konkret bedeutet. Nicht nur in der Theorie.' },
        { voice: 'b', text: 'Wie ist die Oberfläche aufgebaut?' },
        { voice: 'a', text: 'In drei Bereichen. Oben die Paketliste, eine chronologische Übersicht aller mitgeschnittenen Pakete mit Zeit, Quelle, Ziel, Protokoll und Info.' },
        { voice: 'b', text: 'Darunter?' },
        { voice: 'a', text: 'Die Paketdetails, eine aufklappbare Baumstruktur. Da ist jede OSI-Schicht des ausgewählten Pakets einzeln einsehbar.' },
        { voice: 'b', text: 'Und ganz unten die Bytes-Ansicht, also die rohe hexadezimale und ASCII-Darstellung.' },
        { voice: 'a', text: 'Ohne Filter ertrinkt man da allerdings sofort. Deshalb gehören ein paar Filter zum Grundhandwerkszeug.' },
        { voice: 'b', text: 'Nenn mal die wichtigsten.' },
        { voice: 'a', text: 'Mit ip.addr gefolgt von einer Adresse siehst du nur den Verkehr von und zu dieser IP. Mit tcp.port gleich vierhundertdreiundvierzig nur den HTTPS-Verkehr.' },
        { voice: 'b', text: 'Und wenn ich nur ein bestimmtes Protokoll will?' },
        { voice: 'a', text: 'Dann tippst du es einfach hin: arp zeigt nur ARP-Pakete, icmp nur ICMP-Pakete, also zum Beispiel Ping, und http nur unverschlüsselten Web-Verkehr.' },
        { voice: 'b', text: 'Es gibt noch einen Filter, der nur die SYN-Pakete zeigt, also den ersten Schritt eines Verbindungsaufbaus.' },
        { voice: 'a', text: 'Der kombiniert zwei Bedingungen: das SYN-Flag gesetzt und das ACK-Flag nicht gesetzt. Damit siehst du genau die Verbindungsversuche.' },
        { voice: 'b', text: 'Die Paketliste ist ausserdem farbig. Bedeutet das etwas?' },
        { voice: 'a', text: 'Die Farbcodierung ist konfigurierbar, folgt aber standardmässig einem festen Schema. HTTP hellgrün, DNS blau-lila, TCP-Fehler und Wiederholungen schwarz-rot.' },
        { voice: 'b', text: 'Ein Praxistipp zum Schluss, weil es eine typische Verwechslung ist.' },
        { voice: 'a', text: 'Capture-Filter und Display-Filter sind zwei verschiedene Dinge. Der Capture-Filter greift vor der Aufzeichnung, der Display-Filter danach. Und sie haben unterschiedliche Syntax.' }
      ]
    },

    /* ---------------------------------------------------------------- 06 */
    {
      id: 'switch',
      titel: 'Switch und Hub',
      kurz: 'CAM-Tabelle, Flooding, Forwarding, Filtering',
      segments: [
        { voice: 'a', text: 'Wir haben den Switch jetzt zweimal gestreift. Zeit, ihn dem Hub direkt gegenüberzustellen.' },
        { voice: 'b', text: 'Der entscheidende Unterschied ist das Adressverständnis. Der Hub hat keines, gar keines. Der Switch lernt MAC-Adressen.' },
        { voice: 'a', text: 'Und was folgt daraus für die Weiterleitung?' },
        { voice: 'b', text: 'Der Hub schickt alles an alle Ports, das nennt sich Flooding. Der Switch leitet gezielt an den richtigen Port weiter.' },
        { voice: 'a', text: 'Der dritte Unterschied ist der, den Prüfungsaufgaben lieben: die Kollisionsdomäne.' },
        { voice: 'b', text: 'Beim Hub gibt es genau eine, gemeinsam für alle Ports. Beim Switch hat jeder Port seine eigene.' },
        { voice: 'a', text: 'Und daraus folgt der vierte Punkt: der Hub kann nur Halbduplex, beim Switch ist Vollduplex möglich.' },
        { voice: 'b', text: 'Sammeln wir die Vorteile des Switches: gezielte Weiterleitung statt Fluten, eigene Kollisionsdomäne pro Port, Vollduplex, und er ist VLAN-fähig.' },
        { voice: 'a', text: 'Fairerweise auch die Nachteile. Er ist teurer als ein Hub. Broadcasts werden trotzdem an alle Ports im selben VLAN geflutet. Und es gibt einen Angriffsvektor namens CAM-Table-Overflow.' },
        { voice: 'b', text: 'Zu dem kommen wir später noch. Hat der Hub überhaupt noch einen Vorteil?' },
        { voice: 'a', text: 'Auf dem Papier: sehr günstig und extrem einfach aufgebaut, ohne jede Konfiguration.' },
        { voice: 'b', text: 'Und in der Praxis?' },
        { voice: 'a', text: 'Im aktiven Unternehmensbetrieb praktisch nicht mehr in Gebrauch. Kein Adressverständnis, immer Flooding, eine gemeinsame Kollisionsdomäne, nur Halbduplex.' },
        { voice: 'b', text: 'Bleibt die Frage, wie der Switch das eigentlich hinbekommt. Woher weiss er, welcher Port zu welcher Adresse gehört?' },
        { voice: 'a', text: 'Über die CAM-Tabelle. Das ist seine MAC-Adresstabelle: sie ordnet Port und MAC-Adresse einander zu.' },
        { voice: 'b', text: 'Und danach richtet sich sein Verhalten. Es gibt genau drei Grundverhalten, die sollte man auseinanderhalten können.' },
        { voice: 'a', text: 'Das erste ist Flooding. Ist die Ziel-MAC unbekannt, geht der Frame an alle Ports ausser dem Eingangsport.' },
        { voice: 'b', text: 'Das zweite ist Forwarding. Ist die Ziel-MAC bekannt, geht der Frame gezielt nur an den passenden Port.' },
        { voice: 'a', text: 'Und das dritte ist Filtering. Liegen Quelle und Ziel im selben Port-Segment, wird der Frame gar nicht weitergeleitet.' },
        { voice: 'b', text: 'Flooding, Forwarding, Filtering. Drei Wörter, die man sich gut zusammen merken kann.' }
      ]
    },

    /* ---------------------------------------------------------------- 07 */
    {
      id: 'zugriff',
      titel: 'Medienzugriff',
      kurz: 'CSMA/CD, CSMA/CA und der Vorläufer ALOHA',
      segments: [
        { voice: 'b', text: 'Der Switch regelt also, wohin etwas geht. Offen ist noch die vierte Aufgabe von ganz am Anfang: wer darf überhaupt wann senden?' },
        { voice: 'a', text: 'Das sind die Medienzugriffsverfahren. Und beide, die wir brauchen, tragen dasselbe Grundprinzip im Namen: CSMA.' },
        { voice: 'b', text: 'Wofür steht das?' },
        { voice: 'a', text: 'Carrier Sense Multiple Access. Carrier Sense heisst: ein Gerät hört erst das Medium ab, ob schon jemand sendet, bevor es selbst sendet. Multiple Access heisst: viele Teilnehmer teilen sich dasselbe Medium.' },
        { voice: 'b', text: 'Und dann trennen sich die Wege. Die erste Variante ist CSMA/CD, mit Collision Detection.' },
        { voice: 'a', text: 'Das ist das klassische Ethernet mit Hub, also Halbduplex. Vor dem Senden wird gelauscht, und wenn es trotzdem zur Kollision kommt, brechen beide ab und senden nach einer zufälligen Wartezeit erneut.' },
        { voice: 'b', text: 'Zufällig ist dabei wichtig, sonst würden beide gleichzeitig wieder loslegen.' },
        { voice: 'a', text: 'Genau darum geht es. Die zweite Variante ist CSMA/CA, mit Collision Avoidance, und die läuft im WLAN nach 802.11.' },
        { voice: 'b', text: 'Warum dort ein anderes Verfahren?' },
        { voice: 'a', text: 'Weil sich Kollisionen im Funk kaum zuverlässig erkennen lassen. Also werden sie von vornherein vermieden, statt hinterher festgestellt.' },
        { voice: 'b', text: 'Und wie?' },
        { voice: 'a', text: 'Der Kanal wird vor dem Senden abgehört, dazu kommt eine zufällige Wartezeit. Optional lässt sich der Kanal zusätzlich per RTS/CTS reservieren — aber nicht bei jedem Paket.' },
        { voice: 'b', text: 'Jetzt die Frage, die sich stellt, wenn man moderne Netze kennt: Hubs gibt es kaum noch, jeder Switch-Port hat seine eigene Kollisionsdomäne.' },
        { voice: 'a', text: 'Richtig, bei modernem Vollduplex-Switching entfällt CSMA/CD faktisch. Es passiert schlicht nichts mehr, was erkannt werden müsste.' },
        { voice: 'b', text: 'Trotzdem lernen wir es.' },
        { voice: 'a', text: 'Weil die Prüfung das klassische Funktionsprinzip trotzdem gerne abfragt. Ärgerlich, aber so ist es.' },
        { voice: 'b', text: 'Es gibt noch einen dritten Begriff in dieser Familie, der historisch davorliegt: ALOHA.' },
        { voice: 'a', text: 'Der Vorläufer von CSMA/CA aus den siebziger Jahren, aus einem Hawaii-Funknetz namens ALOHAnet.' },
        { voice: 'b', text: 'Was hat der anders gemacht?' },
        { voice: 'a', text: 'Die Geräte senden einfach drauflos, ohne vorher zu lauschen. Bei einer Kollision wird nach zufälliger Wartezeit erneut gesendet.' },
        { voice: 'b', text: 'Sehr einfach, aber vermutlich furchtbar bei viel Verkehr.' },
        { voice: 'a', text: 'Ineffizient, genau. CSMA/CA hat den Ansatz verbessert, indem es vor dem Senden erst den Kanal abhört.' },
        { voice: 'b', text: 'Und wo begegnet uns ALOHA in der Prüfung?' },
        { voice: 'a', text: 'Meist als falsche Antwortoption, um es von CSMA/CA abzugrenzen. Wer den Unterschied kennt, hakt das in Sekunden ab.' }
      ]
    },

    /* ---------------------------------------------------------------- 08 */
    {
      id: 'ieee',
      titel: 'IEEE 802-Familie',
      kurz: 'Welche Nummer regelt was',
      segments: [
        { voice: 'a', text: 'Uns sind jetzt mehrfach diese 802-Nummern begegnet. Die werden in der Prüfung gerne einzeln abgefragt, also gehen wir sie sauber durch.' },
        { voice: 'b', text: 'Fangen wir mit der an, die uns gleich noch beschäftigt: 802.1Q.' },
        { voice: 'a', text: 'Das ist VLAN Tagging. Der Standard regelt die VLAN-Kennzeichnung im Ethernet-Frame, also den Vier-Byte-Tag, den wir vorhin schon hatten.' },
        { voice: 'b', text: 'Weiter mit 802.1D.' },
        { voice: 'a', text: 'Das Spanning Tree Protocol. Es verhindert Schleifen in redundanten Switch-Topologien. Konvergenz rund dreissig bis fünfzig Sekunden.' },
        { voice: 'b', text: 'Und die schnellere Weiterentwicklung davon ist 802.1w.' },
        { voice: 'a', text: 'Rapid Spanning Tree. Konvergenz meist innerhalb weniger Sekunden.' },
        { voice: 'b', text: 'Dann gibt es noch 802.1X, gross geschrieben. Das ist etwas ganz anderes.' },
        { voice: 'a', text: 'Port-based Network Access Control. Also portbasierte Authentifizierung, bevor ein Gerät überhaupt Netzzugriff bekommt, zum Beispiel über RADIUS.' },
        { voice: 'b', text: 'Bleiben zwei, die aus der Reihe fallen: 802.3 und 802.11.' },
        { voice: 'a', text: '802.3 ist Ethernet, also das kabelgebundene LAN: Frame-Aufbau, Kabeltypen und Kabelstandards, CSMA/CD.' },
        { voice: 'b', text: 'Und 802.11 ist WLAN: Frequenzbänder, CSMA/CA, Verschlüsselung mit WPA2 und WPA3.' },
        { voice: 'a', text: 'Jetzt die Merkregel, die Ordnung in diese Nummern bringt.' },
        { voice: 'b', text: 'Die will ich hören, weil das sonst reines Auswendiglernen ist.' },
        { voice: 'a', text: 'Alle Standards mit der Gruppierung 802.1 — also 802.1Q, 802.1D, 802.1w und 802.1X — regeln das Switching- und Zugriffsverhalten auf Schicht zwei.' },
        { voice: 'b', text: 'Und 802.3 und 802.11 ohne diese Gruppierung?' },
        { voice: 'a', text: 'Die beschreiben jeweils ein komplettes Übertragungsmedium. Einmal Kabel, einmal Funk.' },
        { voice: 'b', text: 'Das ist eine brauchbare Trennlinie. Punkt eins gleich Verhalten, alles andere gleich Medium.' }
      ]
    },

    /* ---------------------------------------------------------------- 09 */
    {
      id: 'vlan',
      titel: 'VLAN',
      kurz: 'Access, Trunk und das Native VLAN',
      segments: [
        { voice: 'b', text: 'Dann lösen wir jetzt ein, was wir zweimal versprochen haben. 802.1Q, also das VLAN.' },
        { voice: 'a', text: 'Was macht es im Kern?' },
        { voice: 'b', text: 'Es teilt ein physisches Netz logisch in mehrere getrennte Broadcast-Domänen.' },
        { voice: 'a', text: 'Also ein Switch, aber mehrere Netze darin, die sich gegenseitig nicht sehen.' },
        { voice: 'b', text: 'Technisch läuft das über den VLAN-Tag. Der ist vier Byte gross und wird in den Ethernet-Frame eingefügt.' },
        { voice: 'a', text: 'Daher kamen die vier Byte mehr bei der maximalen Frame-Grösse.' },
        { voice: 'b', text: 'Jetzt zu den Port-Typen, denn die kommen in Prüfungsaufgaben ständig vor. Der erste ist der Access-Port.' },
        { voice: 'a', text: 'Der gehört zu genau einem VLAN. Da hängen die Endgeräte dran, und der Verkehr ist dort ungetaggt.' },
        { voice: 'b', text: 'Und der zweite ist der Trunk-Port.' },
        { voice: 'a', text: 'Der transportiert mehrere VLANs gleichzeitig zwischen Switches. Dort ist der Verkehr getaggt, sonst wüsste die Gegenseite nicht, welcher Frame zu welchem VLAN gehört.' },
        { voice: 'b', text: 'Kurz gemerkt: Access für Endgeräte, ungetaggt. Trunk zwischen Switches, getaggt.' },
        { voice: 'a', text: 'Bleibt ein Sonderfall, der gern zum Stolperstein wird: das Native VLAN.' },
        { voice: 'b', text: 'Was ist das genau?' },
        { voice: 'a', text: 'Das eine VLAN auf einem Trunk-Port, dessen Frames ohne Tag übertragen werden. Standardmässig ist das meist VLAN eins.' },
        { voice: 'b', text: 'Und was ist daran gefährlich?' },
        { voice: 'a', text: 'Es muss auf beiden Seiten eines Trunks identisch konfiguriert sein. Sonst drohen Fehlzustellungen oder eine Sicherheitslücke namens VLAN-Hopping.' },
        { voice: 'b', text: 'Das ist ein typischer Prüfungspunkt. Native VLAN auf beiden Seiten gleich, sonst wird es unangenehm.' }
      ]
    },

    /* ---------------------------------------------------------------- 10 */
    {
      id: 'stp',
      titel: 'Spanning Tree',
      kurz: 'Root Bridge, BPDUs, Portrollen',
      segments: [
        { voice: 'a', text: 'Wir hatten es bei den Standards schon kurz: 802.1D, das Spanning Tree Protocol. Das verdient jetzt seinen eigenen Platz.' },
        { voice: 'b', text: 'Welches Problem löst es?' },
        { voice: 'a', text: 'Es verhindert Loops in vermaschten, also redundant verkabelten Switch-Topologien. Und zwar, indem es redundante Pfade blockiert, bis sie gebraucht werden.' },
        { voice: 'b', text: 'Redundanz will man ja eigentlich haben.' },
        { voice: 'a', text: 'Will man auch. Nur ohne Schutz kreist ein Frame in einer Schleife endlos weiter. Deshalb bleibt das Kabel liegen, der Pfad wird nur logisch stillgelegt.' },
        { voice: 'b', text: 'Es gibt zwei Ausbaustufen. Das klassische STP nach 802.1D braucht rund dreissig bis fünfzig Sekunden Konvergenzzeit.' },
        { voice: 'a', text: 'Und RSTP nach 802.1w ist typischerweise innerhalb weniger Sekunden wieder stabil, häufig deutlich schneller. Das ist heute der Standard.' },
        { voice: 'b', text: 'Konvergenz ist auch so ein Wort, das man erklären können sollte.' },
        { voice: 'a', text: 'Das ist der Zustand, in dem alle Switches ein einheitliches, stabiles Bild der Topologie haben und alle Pfade endgültig feststehen. Die Konvergenzzeit sagt, wie lange das nach einer Änderung dauert.' },
        { voice: 'b', text: 'Jetzt der Teil, um den sich alles dreht: die Root Bridge.' },
        { voice: 'a', text: 'Das ist der eine Switch im gesamten Baum, der als fester Bezugspunkt dient. Alle anderen berechnen ihren jeweils kürzesten Pfad zu ihr hin.' },
        { voice: 'b', text: 'Und warum braucht es diesen einen Bezugspunkt überhaupt?' },
        { voice: 'a', text: 'Ohne ihn könnte jeder Switch nur lokal entscheiden, welche Pfade er blockiert. Das würde Schleifen nicht zuverlässig verhindern.' },
        { voice: 'b', text: 'Dann gehen wir die Wahl in vier Schritten durch. Schritt eins: jeder Switch bildet seine Bridge-ID.' },
        { voice: 'a', text: 'Die besteht aus zwei Teilen: der Priorität — Standardwert zweiunddreissigtausendsiebenhundertachtundsechzig, konfigurierbar in Viertausendsechsundneunziger-Schritten — und der MAC-Adresse des Switches.' },
        { voice: 'b', text: 'Schritt zwei: die Switches tauschen BPDUs aus.' },
        { voice: 'a', text: 'Bridge Protocol Data Units. Damit schicken sie sich gegenseitig ihre Bridge-IDs und vergleichen sie.' },
        { voice: 'b', text: 'Schritt drei ist dann die eigentliche Wahl.' },
        { voice: 'a', text: 'Der Switch mit der niedrigsten Bridge-ID gewinnt. Bei gleicher Priorität entscheidet die niedrigere MAC-Adresse.' },
        { voice: 'b', text: 'Niedrigste gewinnt, das ist die Kernaussage. Und Schritt vier?' },
        { voice: 'a', text: 'Alle übrigen Switches legen pro Port eine Rolle relativ zur Root Bridge fest. Davon gibt es drei.' },
        { voice: 'b', text: 'Die erste ist der Root Port.' },
        { voice: 'a', text: 'Der Port mit dem günstigsten, also kürzesten Pfad zur Root Bridge. Genau einer pro Nicht-Root-Switch, und er leitet Daten weiter.' },
        { voice: 'b', text: 'Die zweite ist der Designated Port.' },
        { voice: 'a', text: 'Der Port an einem Netzsegment mit dem günstigsten Pfad zur Root Bridge. Der leitet ebenfalls weiter.' },
        { voice: 'b', text: 'Und die dritte ist der Blocked Port.' },
        { voice: 'a', text: 'Ein redundanter Port, der aktiv blockiert wird, um eine Schleife zu verhindern. Er springt erst ein, wenn der aktive Pfad ausfällt.' },
        { voice: 'b', text: 'Ich mache mal ein Bild daraus, weil das sonst abstrakt bleibt. Die Root Bridge ist die Sonne, um die sich der ganze Switch-Baum ausrichtet.' },
        { voice: 'a', text: 'Und jeder andere Switch fragt sich nur: welcher meiner Ports bringt mich am günstigsten zu dieser einen Sonne? Der wird aktiv, alle redundanten Alternativen werden blockiert.' },
        { voice: 'b', text: 'Zum Schluss noch der Fallstrick, den die IHK liebt.' },
        { voice: 'a', text: 'Die Root Bridge selbst hat keinen Root Port. Sie ist ja der Bezugspunkt. Alle ihre Ports sind Designated Ports.' },
        { voice: 'b', text: 'Das ist ein Punkt, an dem man ohne Nachdenken danebengreift.' }
      ]
    },

    /* ---------------------------------------------------------------- 11 */
    {
      id: 'wlan',
      titel: 'WLAN',
      kurz: 'Access Point, Bänder, WPA2 und WPA3',
      segments: [
        { voice: 'b', text: 'Bisher war fast alles Kabel. Schauen wir auf die Funkseite dieser Schicht: WLAN nach 802.11.' },
        { voice: 'a', text: 'Das Zugriffsverfahren kennen wir schon, das ist CSMA/CA. Wer sind die Beteiligten?' },
        { voice: 'b', text: 'Im Infrastruktur-Modus ist der Access Point das zentrale Gerät. Er verbindet die Funkclients mit dem kabelgebundenen Netz.' },
        { voice: 'a', text: 'Er übernimmt für das WLAN also eine ähnliche Rolle wie ein Switch oder Hub im Kabelnetz.' },
        { voice: 'b', text: 'Und der zweite Begriff ist die SSID, der Name des Netzes.' },
        { voice: 'a', text: 'Den sendet der Access Point als Beacon aus, damit Clients das Netz überhaupt finden und sich verbinden können.' },
        { voice: 'b', text: 'Dann zu den Frequenzbändern, das sind drei. Das erste ist 2,4 Gigahertz.' },
        { voice: 'a', text: 'Grosse Reichweite, durchdringt Wände besser. Der Preis dafür: hohe Störanfälligkeit, weil viele andere Geräte dieses Band nutzen, Bluetooth zum Beispiel oder die Mikrowelle.' },
        { voice: 'b', text: 'Und es gibt dort nur drei nicht überlappende Kanäle: eins, sechs und elf.' },
        { voice: 'a', text: 'Dazu die geringere Bandbreite. Das zweite Band ist 5 Gigahertz.' },
        { voice: 'b', text: 'Kleinere Reichweite, dafür geringere Störanfälligkeit und weniger überlastet. Und deutlich mehr Kanäle mit höheren Datenraten.' },
        { voice: 'a', text: 'Das dritte ist 6 Gigahertz, bekannt als Wi-Fi 6E. Die kleinste Reichweite von allen.' },
        { voice: 'b', text: 'Dafür sehr geringe Störanfälligkeit, weil kaum Altgeräte in diesem Band unterwegs sind. Und noch mehr Kanäle und Bandbreite.' },
        { voice: 'a', text: 'Die Faustregel dahinter: je höher die Frequenz, desto kürzer die Reichweite und desto ruhiger das Band.' },
        { voice: 'b', text: 'Bleibt das Thema, bei dem man in der Prüfung Punkte liegen lässt, wenn man die Reihenfolge nicht kennt: die Verschlüsselung.' },
        { voice: 'a', text: 'Vier Stufen, historisch. Ganz am Anfang steht WEP, das arbeitet mit RC4.' },
        { voice: 'b', text: 'Und gilt als gebrochen. Nicht mehr verwenden.' },
        { voice: 'a', text: 'Danach kam WPA mit TKIP, dem Temporal Key Integrity Protocol. Das wechselt Schlüssel dynamisch.' },
        { voice: 'b', text: 'War als Übergangslösung auf vorhandener Hardware gedacht, hat aber bekannte Schwachstellen und gilt heute ebenfalls als unsicher.' },
        { voice: 'a', text: 'Dann WPA2. Das verschlüsselt mit AES über CCMP und ist deutlich stärker als TKIP. Heutiger Mindeststandard.' },
        { voice: 'b', text: 'Aber nicht makellos, oder?' },
        { voice: 'a', text: 'Es ist anfällig für Offline-Wörterbuchangriffe auf den Vier-Wege-Handschlag. Genau da setzt WPA3 an.' },
        { voice: 'b', text: 'Was macht WPA3 anders?' },
        { voice: 'a', text: 'Es nutzt AES über GCMP und ersetzt den Handschlag durch SAE, Simultaneous Authentication of Equals. Damit schützt es gegen genau diese Offline-Angriffe und bietet Forward Secrecy.' },
        { voice: 'b', text: 'Dann die Merkhilfe: TKIP ist alt und unsicher, das war WPA. AES ist der Standard, das sind WPA2 und WPA3.' },
        { voice: 'a', text: 'Und ganz wichtig für die Abgrenzungsfrage: WPA3 unterscheidet sich von WPA2 vor allem durch das robustere Anmeldeverfahren, nicht durch einen komplett neuen Verschlüsselungsalgorithmus.' },
        { voice: 'b', text: 'Also SAE statt Handschlag, nicht AES raus und etwas anderes rein.' }
      ]
    },

    /* ---------------------------------------------------------------- 12 */
    {
      id: 'domaenen',
      titel: 'Domänen im Vergleich',
      kurz: 'Kollision, Broadcast und Schicht 1 gegen Schicht 2',
      segments: [
        { voice: 'a', text: 'Ein Begriffspaar ist uns jetzt mehrfach begegnet, und es wird ständig verwechselt. Kollisionsdomäne und Broadcast-Domäne.' },
        { voice: 'b', text: 'Dann sortieren wir das. Die Kollisionsdomäne zuerst.' },
        { voice: 'a', text: 'Das ist der Bereich, in dem sich Geräte eine gemeinsame Übertragungskapazität teilen und dadurch Kollisionen entstehen können.' },
        { voice: 'b', text: 'Und begrenzt wird sie durch den Switch. Jeder Port ist eine eigene Kollisionsdomäne.' },
        { voice: 'a', text: 'Die Broadcast-Domäne ist der Bereich, in dem ein Broadcast-Frame von allen Geräten empfangen wird.' },
        { voice: 'b', text: 'Und die wird nicht vom Switch begrenzt.' },
        { voice: 'a', text: 'Genau da liegt der Fallstrick. Begrenzt wird sie durch einen Router oder durch VLAN-Grenzen. Ein Switch leitet Broadcasts an alle Ports im selben VLAN weiter.' },
        { voice: 'b', text: 'Also in einem Satz: ein Switch trennt Kollisionsdomänen, aber nicht automatisch Broadcast-Domänen.' },
        { voice: 'a', text: 'Dafür braucht es VLANs oder einen Router. Das ist ein klassischer IHK-Fallstrick, der genau so gestellt wird.' },
        { voice: 'b', text: 'Weil wir gerade beim Sortieren sind: stellen wir Schicht eins und Schicht zwei einmal direkt nebeneinander.' },
        { voice: 'a', text: 'Dateneinheit: unten das Bit, hier der Frame.' },
        { voice: 'b', text: 'Adressierung: unten keine, hier die MAC-Adresse.' },
        { voice: 'a', text: 'Geräte: unten Hub und Repeater, hier Switch und Bridge.' },
        { voice: 'b', text: 'Und Fehlerbehandlung: unten keine, hier FCS und CRC — Erkennung, keine Korrektur.' },
        { voice: 'a', text: 'Bei der Fehlerbehandlung gibt es einen Feinschliff, den man kennen sollte, wenn jemand nachhakt.' },
        { voice: 'b', text: 'Nämlich?' },
        { voice: 'a', text: 'Keine Fehlerbehandlung auf Schicht eins meint die logische Fehlerkorrektur, also zum Beispiel eine Neuübertragung.' },
        { voice: 'b', text: 'Und physikalisch?' },
        { voice: 'a', text: 'Physikalische Leitungscodes wie 8b/10b, 64b/66b oder Scrambling haben durchaus gewisse Fehlererkennungseigenschaften auf Bit-Ebene.' },
        { voice: 'b', text: 'Das ist dann aber Feindetail und nicht der Kern der Schicht-eins-Aufgabe.' },
        { voice: 'a', text: 'So würde ich es in einer Prüfung auch formulieren. Erst die klare Linie, dann der Feinschliff, wenn danach gefragt wird.' }
      ]
    },

    /* ---------------------------------------------------------------- 13 */
    {
      id: 'sicherheit',
      titel: 'Port Security',
      kurz: 'MAC Flooding und der CAM Table Overflow',
      segments: [
        { voice: 'b', text: 'Wir haben vorhin einen Angriffsvektor erwähnt und vertagt. Den holen wir jetzt nach.' },
        { voice: 'a', text: 'MAC Flooding, auch CAM Table Overflow genannt. Was passiert da?' },
        { voice: 'b', text: 'Ein Angreifer sendet gezielt sehr viele gefälschte MAC-Adressen, um die CAM-Tabelle des Switches zu überfüllen.' },
        { voice: 'a', text: 'Und was macht der Switch, wenn seine Tabelle voll ist?' },
        { voice: 'b', text: 'Er fällt ins Flooding-Verhalten zurück und sendet Frames wie ein Hub an alle Ports.' },
        { voice: 'a', text: 'Womit der Angreifer den Datenverkehr mitlesen kann. Der Switch verliert also genau die Eigenschaft, die ihn vom Hub unterscheidet.' },
        { voice: 'b', text: 'Elegant böse, ehrlich gesagt. Und die Gegenmassnahme heisst Port Security.' },
        { voice: 'a', text: 'Die begrenzt beziehungsweise definiert, welche und wie viele MAC-Adressen an einem Switch-Port erlaubt sind.' },
        { voice: 'b', text: 'Und wenn jemand dagegen verstösst?' },
        { voice: 'a', text: 'Dann kann der Port zum Beispiel gesperrt werden. Damit schützt Port Security gleich zweifach: gegen unautorisierte Geräte und gegen MAC Flooding.' },
        { voice: 'b', text: 'Also die Antwort auf den Angriff von eben, direkt am selben Gerät.' }
      ]
    },

    /* ---------------------------------------------------------------- 14 */
    {
      id: 'fehler',
      titel: 'Fehlerquellen',
      kurz: 'Sechs Klassiker auf Schicht 2',
      segments: [
        { voice: 'a', text: 'Wie auf Schicht eins schauen wir uns zum Abschluss an, was in der Praxis typischerweise schiefgeht. Sechs Klassiker.' },
        { voice: 'b', text: 'Der erste ist der Duplex-Mismatch.' },
        { voice: 'a', text: 'Switch-Port und Endgerät handeln unterschiedliche Duplex-Einstellungen aus, ein Problem der Auto-Negotiation. Das führt zu massiven Kollisionen und Fehlerpaketen.' },
        { voice: 'b', text: 'Der zweite ist der Broadcast-Sturm.' },
        { voice: 'a', text: 'Der entsteht durch eine physische Schleife ohne Schutz durch STP oder RSTP. So etwas kann ein Netzsegment komplett lahmlegen.' },
        { voice: 'b', text: 'Damit ist auch klar, warum Spanning Tree kein Luxus ist.' },
        { voice: 'a', text: 'Der dritte ist die VLAN-Fehlkonfiguration: falsches Tagging auf Trunk-Ports oder ein Native-VLAN-Mismatch zwischen zwei Switches.' },
        { voice: 'b', text: 'Auch das hatten wir schon als Stolperstein. Der vierte ist der MAC-Adresskonflikt.' },
        { voice: 'a', text: 'Zwei Geräte mit identischer MAC-Adresse im selben Segment, meist durch Spoofing entstanden.' },
        { voice: 'b', text: 'Der fünfte ist der CAM-Table-Overflow, den wir gerade hatten. Der kann absichtlich herbeigeführt sein oder schlicht durch Fehlkonfiguration entstehen.' },
        { voice: 'a', text: 'Und der sechste ist eine fehlerhafte FCS.' },
        { voice: 'b', text: 'Also Bitfehler, die durch Störungen auf Schicht eins verursacht wurden.' },
        { voice: 'a', text: 'Die fallen dann hier oben als ungültige Prüfsumme auf und führen zum Verwerfen des Frames.' },
        { voice: 'b', text: 'Das ist ein schönes Beispiel dafür, wie die Schichten zusammenhängen. Die Ursache liegt unten, sichtbar wird sie eine Etage höher.' }
      ]
    },

    /* ---------------------------------------------------------------- 15
       ZUSAMMENFASSUNG — eigenes Kapitel, getrennt vom Übergang.
       Siehe Begründung im gleichnamigen Kapitel von content-l1.js.
       Grundlage: "Kurzübersicht Layer 2" der Enzyklopädie, verdichtet aus
       Fakten, die in den Kapiteln davor bereits gesagt wurden.
       ---------------------------------------------------------------- */
    {
      id: 'zusammenfassung',
      titel: 'Zusammenfassung Layer 2',
      kurz: 'Alles Wichtige auf einen Schlag',
      segments: [
        { voice: 'a', text: 'Damit haben wir Schicht zwei durch. Nehmen wir uns kurz Zeit und ziehen zusammen, was hängen bleiben sollte.' },
        { voice: 'b', text: 'Die vier Aufgaben zuerst: Geräte im lokalen Netz über die MAC-Adresse adressieren, Bits in Frames verpacken, Übertragungsfehler erkennen und den Medienzugriff regeln.' },
        { voice: 'a', text: 'Und die Feinheit, die Punkte bringt: Fehler erkennen ja, Fehler korrigieren nein. Ein fehlerhafter Frame wird verworfen, nicht repariert.' },
        { voice: 'b', text: 'Die MAC-Adresse: achtundvierzig Bit, also sechs Byte, hexadezimal. Erste drei Byte OUI als Herstellerkennung, letzte drei Byte Seriennummer.' },
        { voice: 'a', text: 'Eingebrannt, aber per Spoofing überschreibbar. Und sechsmal FF ist die Broadcast-MAC für alle Geräte im Segment.' },
        { voice: 'b', text: 'Der Frame-Aufbau: Präambel sieben Byte, Start Frame Delimiter ein Byte, Ziel- und Quell-MAC je sechs Byte, Typfeld zwei Byte, Nutzdaten sechsundvierzig bis fünfzehnhundert, FCS vier Byte.' },
        { voice: 'a', text: 'Die Zahlen dazu: minimal vierundsechzig Byte, maximal fünfzehnhundertachtzehn, mit VLAN-Tag fünfzehnhundertzweiundzwanzig. MTU fünfzehnhundert.' },
        { voice: 'b', text: 'Der Switch lernt MAC-Adressen in der CAM-Tabelle. Drei Grundverhalten: Flooding bei unbekanntem Ziel, Forwarding bei bekanntem, Filtering im selben Port-Segment.' },
        { voice: 'a', text: 'Der Hub dagegen hat kein Adressverständnis, flutet immer, hat eine gemeinsame Kollisionsdomäne und kann nur Halbduplex.' },
        { voice: 'b', text: 'Die Zugriffsverfahren: CSMA/CD mit Kollisionserkennung im klassischen Ethernet, CSMA/CA mit Kollisionsvermeidung im WLAN.' },
        { voice: 'a', text: 'Bei den Standards: 802.1Q ist VLAN, 802.1D ist Spanning Tree, 802.1w ist Rapid Spanning Tree, 802.1X ist portbasierte Authentifizierung.' },
        { voice: 'b', text: 'Und 802.3 ist Ethernet, 802.11 ist WLAN. Merkregel: die 802.1er regeln Verhalten, die anderen beiden je ein komplettes Medium.' },
        { voice: 'a', text: 'VLAN trennt ein physisches Netz logisch in mehrere Broadcast-Domänen. Access-Port ungetaggt für Endgeräte, Trunk-Port getaggt zwischen Switches.' },
        { voice: 'b', text: 'Und das Native VLAN muss auf beiden Seiten eines Trunks gleich sein, sonst drohen Fehlzustellungen oder VLAN-Hopping.' },
        { voice: 'a', text: 'Spanning Tree verhindert Schleifen. Root Bridge ist der Switch mit der niedrigsten Bridge-ID, bei gleicher Priorität entscheidet die niedrigere MAC-Adresse.' },
        { voice: 'b', text: 'Portrollen: Root Port zur Root Bridge, Designated Port am Segment, Blocked Port als blockierte Reserve. Und die Root Bridge selbst hat keinen Root Port.' },
        { voice: 'a', text: 'Konvergenz bei STP dreissig bis fünfzig Sekunden, bei RSTP meist wenige Sekunden.' },
        { voice: 'b', text: 'Beim WLAN: Access Point und SSID, die drei Bänder mit zwei Komma vier, fünf und sechs Gigahertz.' },
        { voice: 'a', text: 'Und die Verschlüsselungsreihe: WEP mit RC4 gebrochen, WPA mit TKIP unsicher, WPA2 mit AES über CCMP als Mindeststandard, WPA3 mit SAE statt Handschlag.' },
        { voice: 'b', text: 'Dann der Klassiker, der ständig verwechselt wird: ein Switch trennt Kollisionsdomänen, aber nicht automatisch Broadcast-Domänen.' },
        { voice: 'a', text: 'Dafür braucht es VLANs oder einen Router. Diese Frage kommt genau so.' },
        { voice: 'b', text: 'Zum Schluss die Sicherheit: MAC Flooding überfüllt die CAM-Tabelle, bis der Switch wie ein Hub flutet. Port Security begrenzt die erlaubten MAC-Adressen pro Port.' },
        { voice: 'a', text: 'Und die Fehlerquellen: Duplex-Mismatch, Broadcast-Sturm, VLAN-Fehlkonfiguration, MAC-Adresskonflikt, CAM-Table-Overflow und eine fehlerhafte FCS.' },
        { voice: 'b', text: 'Dazu Wireshark als Werkzeug, um sich das alles an echten Paketen anzusehen. Das ist Schicht zwei.' }
      ]
    },

    /* ---------------------------------------------------------------- 16 */
    {
      id: 'uebergang',
      titel: 'Übergang zu Schicht 3',
      kurz: 'Warum MAC-Adressen nicht weit genug reichen',
      segments: [
        { voice: 'b', text: 'Ein Protokoll haben wir bewusst ausgelassen, und das sollten wir ansagen: ARP.' },
        { voice: 'a', text: 'Das Address Resolution Protocol verbindet MAC- und IP-Adressen. Wir behandeln es ausführlich in Schicht drei, weil es IP-Adressen voraussetzt.' },
        { voice: 'b', text: 'Was ein guter Übergang ist. Wir erreichen jetzt jedes Gerät — aber nur innerhalb desselben lokalen Netzes.' },
        { voice: 'a', text: 'Also innerhalb derselben Broadcast-Domäne. Sobald das Ziel in einem anderen Netz liegt, endet unsere Reichweite.' },
        { voice: 'b', text: 'Warum eigentlich genau?' },
        { voice: 'a', text: 'Weil MAC-Adressen nicht routbar sind. Ein Switch kennt nur sein eigenes Segment, darüber hinaus ist er blind.' },
        { voice: 'b', text: 'Und da übernimmt Schicht drei.' },
        { voice: 'a', text: 'Sie führt mit der IP-Adresse eine logische, netzübergreifende Adressierung ein und bestimmt per Routing den Weg über Netzgrenzen hinweg.' },
        { voice: 'b', text: 'Dafür wird unser Frame wieder ausgepackt.' },
        { voice: 'a', text: 'Und zum Vorschein kommt das IP-Paket, das eben noch als Nutzdaten darin steckte. Weiter geht es mit der Vermittlungsschicht.' },
        { voice: 'b', text: 'Für heute bist du mit Schicht zwei durch. Bis zum nächsten Mal.' }
      ]
    }
  ]
};

/* =============================================================================
   BEGRIFFSREGISTER LAYER 2 — Basis für freie Zwischenfragen und Sprung-Navigation
   -----------------------------------------------------------------------------
   Aufbau identisch zu REGISTER_L1:
     id       eindeutig
     label    Anzeigename
     chapter  Kapitel-ID aus PODCAST_L2 (für "spring dahin")
     aliases  Schreib-/Aussprache-/Buchstabiervarianten, wie sie aus der
              Spracherkennung kommen können. ERSTENTWURF — wächst mit der
              Nutzung, ruckG4zz prüft/ergänzt nach echten Hörbefunden.
     antwort  gesprochene Kurzantwort. Wortlaut aus der NEINT1-Section
              sec-l2 abgeleitet, nichts hinzuerfunden.

   HINWEIS ZU KURZEN ALIASEN: Der Matcher erzwingt Wortgrenzen und behandelt
   die Liste RISKY (matcher.js) gesondert. Aliase, die zugleich deutsche
   Alltagswörter sind, sind hier bewusst NICHT aufgenommen.
   ========================================================================== */

const REGISTER_L2 = [
  /* --- MAC & Adressierung ------------------------------------------------ */
  {
    id: 'mac', label: 'MAC-Adresse', chapter: 'mac',
    aliases: ['mac adresse', 'mac', 'media access control', 'media access control address', 'hardwareadresse', 'physikalische adresse', 'mac address'],
    antwort: 'Die MAC-Adresse ist achtundvierzig Bit lang, also sechs Byte, und wird hexadezimal geschrieben. Die ersten drei Byte sind die OUI, die von der IEEE vergebene Herstellerkennung, die letzten drei Byte die geräteindividuelle Seriennummer. Sie ist fest ins Netzwerkinterface eingebrannt, lässt sich aber softwareseitig überschreiben. Sie identifiziert ein Gerät eindeutig innerhalb eines physischen Segments.'
  },
  {
    id: 'oui', label: 'OUI (Herstellerkennung)', chapter: 'mac',
    aliases: ['oui', 'o u i', 'organizationally unique identifier', 'herstellerkennung', 'hersteller kennung'],
    antwort: 'Die OUI ist der Organizationally Unique Identifier: die ersten drei Byte einer MAC-Adresse. Das ist die Herstellerkennung, vergeben von der IEEE. Die letzten drei Byte sind dann die geräteindividuelle Seriennummer.'
  },
  {
    id: 'spoofing', label: 'MAC-Spoofing', chapter: 'mac',
    aliases: ['spoofing', 'mac spoofing', 'gespooft', 'spoofen', 'adresse faelschen', 'mac faelschen'],
    antwort: 'Spoofing heisst, dass die eingebrannte MAC-Adresse softwareseitig überschrieben und absichtlich eine falsche, fremde Adresse vorgetäuscht wird. Zweck ist zum Beispiel, Zugriffskontrollen zu umgehen oder sich als ein anderes Gerät auszugeben.'
  },
  {
    id: 'broadcastmac', label: 'Broadcast-MAC', chapter: 'mac',
    aliases: ['broadcast mac', 'broadcast adresse', 'ff ff ff', 'sechsmal ff', 'alle geraete adressieren'],
    antwort: 'Die Broadcast-MAC ist FF:FF:FF:FF:FF:FF, also sechsmal FF. Sie adressiert alle Geräte im LAN-Segment gleichzeitig.'
  },

  /* --- Frame ------------------------------------------------------------- */
  {
    id: 'frame', label: 'Ethernet-Frame', chapter: 'frame',
    aliases: ['frame', 'ethernet frame', 'frames', 'rahmen', 'frame aufbau', 'frame struktur', 'frame structure'],
    antwort: 'Der Ethernet-Frame besteht aus Präambel mit sieben Byte, Start Frame Delimiter mit einem Byte, Ziel-MAC und Quell-MAC mit je sechs Byte, dem Typfeld mit zwei Byte, den Nutzdaten mit sechsundvierzig bis fünfzehnhundert Byte und der FCS mit vier Byte. Minimale Frame-Grösse sind vierundsechzig Byte, maximal fünfzehnhundertachtzehn, mit VLAN-Tag fünfzehnhundertzweiundzwanzig.'
  },
  {
    id: 'praeambel', label: 'Präambel & SFD', chapter: 'frame',
    aliases: ['praeambel', 'preambel', 'start frame delimiter', 'sfd', 's f d', 'synchronisation'],
    antwort: 'Die Präambel ist sieben Byte gross und dient der Synchronisation der Empfänger-Taktung. Der Start Frame Delimiter ist ein Byte gross und markiert den Frame-Beginn.'
  },
  {
    id: 'ethertype', label: 'EtherType (Typfeld)', chapter: 'frame',
    aliases: ['ethertype', 'ether type', 'typfeld', 'typ laenge', 'typ feld'],
    antwort: 'Das Typfeld, der EtherType, ist zwei Byte gross und gibt an, welches Protokoll folgt. Der Wert null acht null null in hexadezimaler Schreibweise steht für IPv4, der Wert acht sechs D D für IPv6.'
  },
  {
    id: 'fcs', label: 'FCS / CRC-Prüfsumme', chapter: 'frame',
    aliases: ['fcs', 'f c s', 'frame check sequence', 'crc', 'c r c', 'pruefsumme', 'checksumme'],
    antwort: 'Die FCS, die Frame Check Sequence, ist vier Byte gross und enthält eine CRC-Prüfsumme zur Fehlererkennung. Wichtig: sie erkennt Fehler, korrigiert sie aber nicht. Ein fehlerhafter Frame wird verworfen, nicht repariert.'
  },
  {
    id: 'mtu', label: 'MTU', chapter: 'frame',
    aliases: ['mtu', 'm t u', 'maximum transmission unit', 'maximale nutzdaten'],
    antwort: 'Die MTU ist die maximale Nutzlast und liegt bei Ethernet bei fünfzehnhundert Byte. Der Frame insgesamt ist maximal fünfzehnhundertachtzehn Byte gross, mit VLAN-Tag fünfzehnhundertzweiundzwanzig.'
  },
  {
    id: 'header', label: 'Header, Trailer & Kapselung', chapter: 'frame',
    aliases: ['header', 'kopfdaten', 'trailer', 'kapselung', 'encapsulation', 'entkapseln', 'entkapselung'],
    antwort: 'Alle Steuerfelder vor den Nutzdaten bilden den Header, beim Frame also Ziel-MAC, Quell-MAC und Typfeld. Das Feld am Ende, die FCS, ist der Trailer. Kapselung heisst: jede Schicht legt beim Senden ihren eigenen Header aussen um die Daten der Schicht darüber. Beim Entkapseln liest Schicht zwei ihren Header, prüft die Adresse, entfernt Header und Trailer und reicht nur den Inhalt nach oben weiter.'
  },

  /* --- Wireshark --------------------------------------------------------- */
  {
    id: 'wireshark', label: 'Wireshark', chapter: 'wireshark',
    aliases: ['wireshark', 'wire shark', 'sniffer', 'protokollanalysator', 'paketanalyse', 'mitschneiden'],
    antwort: 'Wireshark ist ein Protokollanalysator, also ein Sniffer. Er zeichnet den Datenverkehr an einer Netzwerkschnittstelle mit und zeigt jedes Frame bis auf Bit-Ebene, aufgeschlüsselt nach OSI-Schichten. Die Oberfläche hat drei Bereiche: Paketliste, Paketdetails als aufklappbare Baumstruktur und die Bytes-Ansicht als Hex-Dump.'
  },
  {
    id: 'filter', label: 'Capture- vs. Display-Filter', chapter: 'wireshark',
    aliases: ['capture filter', 'display filter', 'filter syntax', 'wireshark filter'],
    antwort: 'Capture-Filter und Display-Filter sind zwei unterschiedliche Dinge mit unterschiedlicher Syntax. Der Capture-Filter greift vor der Aufzeichnung, der Display-Filter erst danach. Typische Display-Filter sind ip.addr für eine bestimmte IP, tcp.port für einen Port, oder schlicht arp, icmp und http für einzelne Protokolle.'
  },

  /* --- Switch ------------------------------------------------------------ */
  {
    id: 'switch', label: 'Switch', chapter: 'switch',
    aliases: ['switch', 'switches', 'switching', 'bridge'],
    antwort: 'Der Switch arbeitet auf Schicht zwei und lernt MAC-Adressen. Er leitet Frames gezielt an den richtigen Port weiter statt an alle zu fluten, gibt jedem Port eine eigene Kollisionsdomäne, ermöglicht Vollduplex und ist VLAN-fähig. Nachteile: teurer als ein Hub, Broadcasts werden trotzdem an alle Ports im selben VLAN geflutet, und der CAM-Table-Overflow ist ein Angriffsvektor.'
  },
  {
    id: 'hubvergleich', label: 'Hub gegen Switch', chapter: 'switch',
    aliases: ['hub', 'hub vergleich', 'unterschied hub switch', 'hub oder switch'],
    antwort: 'Der Hub arbeitet auf Schicht eins und hat kein Adressverständnis. Er flutet immer an alle Ports, hat eine gemeinsame Kollisionsdomäne für alle Ports und kann nur Halbduplex. Sein einziger Vorteil ist der sehr günstige, extrem einfache Aufbau ohne Konfiguration. Im aktiven Unternehmensbetrieb ist er praktisch nicht mehr in Gebrauch.'
  },
  {
    id: 'cam', label: 'CAM-Tabelle', chapter: 'switch',
    aliases: ['cam tabelle', 'cam table', 'mac adresstabelle', 'mac tabelle', 'content addressable memory', 'adresstabelle'],
    antwort: 'Die CAM-Tabelle ist die MAC-Adresstabelle des Switches. Sie ordnet Port und MAC-Adresse einander zu. Daraus ergeben sich drei Grundverhalten: Flooding bei unbekannter Ziel-MAC, Forwarding bei bekannter Ziel-MAC und Filtering, wenn Quelle und Ziel im selben Port-Segment liegen.'
  },
  {
    id: 'flooding', label: 'Flooding, Forwarding, Filtering', chapter: 'switch',
    aliases: ['flooding', 'forwarding', 'filtering', 'fluten', 'weiterleiten', 'grundverhalten'],
    antwort: 'Flooding heisst: die Ziel-MAC ist unbekannt, der Frame geht an alle Ports ausser dem Eingangsport. Forwarding heisst: die Ziel-MAC ist bekannt, der Frame geht gezielt nur an den passenden Port. Filtering heisst: Quelle und Ziel liegen im selben Port-Segment, der Frame wird nicht weitergeleitet.'
  },

  /* --- Medienzugriff ----------------------------------------------------- */
  {
    id: 'csma', label: 'CSMA (Grundprinzip)', chapter: 'zugriff',
    aliases: ['csma', 'c s m a', 'carrier sense multiple access', 'carrier sense'],
    antwort: 'CSMA steht für Carrier Sense Multiple Access. Carrier Sense heisst, dass ein Gerät erst das Medium abhört, ob bereits jemand sendet, bevor es selbst sendet. Multiple Access heisst, dass sich viele Teilnehmer dasselbe Medium teilen.'
  },
  {
    id: 'csmacd', label: 'CSMA/CD', chapter: 'zugriff',
    aliases: ['csma cd', 'collision detection', 'kollisionserkennung', 'c d verfahren'],
    antwort: 'CSMA/CD ist CSMA mit Kollisionserkennung und gehört zum klassischen Halbduplex-Ethernet am Hub. Vor dem Senden wird gelauscht. Senden trotzdem zwei Geräte gleichzeitig, erkennen beide die Kollision, brechen ab und senden nach einer zufälligen Wartezeit erneut. Bei modernem Vollduplex-Switching entfällt das faktisch, weil jeder Port eine eigene Kollisionsdomäne hat.'
  },
  {
    id: 'csmaca', label: 'CSMA/CA', chapter: 'zugriff',
    aliases: ['csma ca', 'collision avoidance', 'kollisionsvermeidung', 'rts cts', 'c a verfahren'],
    antwort: 'CSMA/CA ist CSMA mit Kollisionsvermeidung und wird im WLAN nach 802.11 eingesetzt. Da sich Kollisionen im Funk kaum zuverlässig erkennen lassen, werden sie von vornherein vermieden: der Kanal wird vor dem Senden abgehört, dazu kommt eine zufällige Wartezeit. Optional lässt sich der Kanal per RTS/CTS reservieren, aber nicht bei jedem Paket.'
  },
  {
    id: 'aloha', label: 'ALOHA', chapter: 'zugriff',
    aliases: ['aloha', 'alohanet', 'aloha net'],
    antwort: 'ALOHA ist der historische Vorläufer von CSMA/CA aus den siebziger Jahren, aus dem Hawaii-Funknetz ALOHAnet. Geräte senden dabei einfach drauflos, ohne vorher zu lauschen, und senden bei einer Kollision nach zufälliger Wartezeit erneut. Sehr einfach, aber ineffizient bei viel Verkehr. In der Prüfung taucht ALOHA meist nur als falsche Antwortoption zur Abgrenzung von CSMA/CA auf.'
  },

  /* --- IEEE-Standards ---------------------------------------------------- */
  {
    id: 'ieee8021q', label: 'IEEE 802.1Q', chapter: 'ieee',
    aliases: ['802.1q', '802 1 q', '802 1q', 'achthundertzwei punkt eins q', 'vlan tagging', 'vlan tag'],
    antwort: 'IEEE 802.1Q regelt das VLAN Tagging, also die VLAN-Kennzeichnung im Ethernet-Frame. Der Tag ist vier Byte gross und wird in den Frame eingefügt.'
  },
  {
    id: 'ieee8021d', label: 'IEEE 802.1D', chapter: 'ieee',
    aliases: ['802.1d', '802 1 d', '802 1d', 'achthundertzwei punkt eins d'],
    antwort: 'IEEE 802.1D ist das Spanning Tree Protocol. Es verhindert Schleifen in redundanten Switch-Topologien, die Konvergenzzeit liegt bei rund dreissig bis fünfzig Sekunden.'
  },
  {
    id: 'ieee8021w', label: 'IEEE 802.1w', chapter: 'ieee',
    aliases: ['802.1w', '802 1 w', '802 1w', 'achthundertzwei punkt eins w'],
    antwort: 'IEEE 802.1w ist Rapid Spanning Tree, die schnellere Weiterentwicklung von STP. Die Konvergenz liegt meist innerhalb weniger Sekunden.'
  },
  {
    id: 'ieee8021x', label: 'IEEE 802.1X', chapter: 'ieee',
    aliases: ['802.1x', '802 1 x', '802 1x', 'port based network access control', 'portbasierte authentifizierung', 'radius'],
    antwort: 'IEEE 802.1X ist Port-based Network Access Control, also portbasierte Authentifizierung, bevor ein Gerät Netzzugriff erhält. Umgesetzt wird das zum Beispiel über RADIUS.'
  },
  {
    id: 'ieee8023', label: 'IEEE 802.3', chapter: 'ieee',
    aliases: ['802.3', '802 3', 'achthundertzwei punkt drei', 'ethernet standard'],
    antwort: 'IEEE 802.3 ist Ethernet, also das kabelgebundene LAN. Der Standard regelt Frame-Aufbau, Kabeltypen und Kabelstandards sowie CSMA/CD.'
  },
  {
    id: 'ieee80211', label: 'IEEE 802.11', chapter: 'ieee',
    aliases: ['802.11', '802 11', 'achthundertzwei punkt elf', 'wlan standard'],
    antwort: 'IEEE 802.11 ist WLAN, also das funkbasierte LAN. Der Standard regelt Frequenzbänder, CSMA/CA und die Verschlüsselung mit WPA2 und WPA3.'
  },
  {
    id: 'ieeemerke', label: 'Merkregel zur 802-Familie', chapter: 'ieee',
    aliases: ['802 familie', '802 standards', 'ieee 802', 'standardfamilie', 'merkregel 802'],
    antwort: 'Alle Standards der Gruppe 802.1 — also 802.1Q, 802.1D, 802.1w und 802.1X — regeln Switching- und Zugriffsverhalten auf Schicht zwei. 802.3 und 802.11 beschreiben dagegen jeweils ein komplettes Übertragungsmedium: einmal Kabel, einmal Funk.'
  },

  /* --- VLAN -------------------------------------------------------------- */
  {
    id: 'vlan', label: 'VLAN', chapter: 'vlan',
    aliases: ['vlan', 'v lan', 'virtual local area network', 'virtuelles netz', 'vlans'],
    antwort: 'Ein VLAN teilt ein physisches Netz logisch in mehrere getrennte Broadcast-Domänen. Geregelt ist das in IEEE 802.1Q, der VLAN-Tag ist vier Byte gross und wird in den Ethernet-Frame eingefügt.'
  },
  {
    id: 'accessport', label: 'Access-Port', chapter: 'vlan',
    aliases: ['access port', 'accessport', 'untagged', 'ungetaggt'],
    antwort: 'Ein Access-Port gehört zu genau einem VLAN. Dort hängen die Endgeräte, und der Verkehr ist ungetaggt.'
  },
  {
    id: 'trunk', label: 'Trunk-Port', chapter: 'vlan',
    aliases: ['trunk', 'trunk port', 'trunkport', 'tagged', 'getaggt', 'trunking'],
    antwort: 'Ein Trunk-Port transportiert mehrere VLANs gleichzeitig zwischen Switches. Der Verkehr ist dort getaggt, damit die Gegenseite jeden Frame dem richtigen VLAN zuordnen kann.'
  },
  {
    id: 'nativevlan', label: 'Native VLAN', chapter: 'vlan',
    aliases: ['native vlan', 'natives vlan', 'vlan hopping', 'vlan eins'],
    antwort: 'Das Native VLAN ist das eine VLAN auf einem Trunk-Port, dessen Frames ohne Tag übertragen werden, standardmässig meist VLAN eins. Wichtig für die Prüfung: es muss auf beiden Seiten eines Trunks identisch konfiguriert sein, sonst drohen Fehlzustellungen oder die Sicherheitslücke VLAN-Hopping.'
  },

  /* --- Spanning Tree ----------------------------------------------------- */
  {
    id: 'stp', label: 'Spanning Tree Protocol', chapter: 'stp',
    aliases: ['spanning tree', 'spanning tree protocol', 'stp', 's t p', 'schleifenverhinderung', 'loop verhindern'],
    antwort: 'Das Spanning Tree Protocol nach IEEE 802.1D verhindert Schleifen in redundant verkabelten Switch-Netzen. Es berechnet einen schleifenfreien Baum, blockiert überzählige Pfade und hält sie als Reserve bereit. Die klassische Konvergenzzeit liegt bei rund dreissig bis fünfzig Sekunden.'
  },
  {
    id: 'rstp', label: 'RSTP (Rapid Spanning Tree)', chapter: 'stp',
    aliases: ['rstp', 'r s t p', 'rapid spanning tree', 'rapid stp'],
    antwort: 'RSTP, das Rapid Spanning Tree Protocol nach IEEE 802.1w, ist die schnellere Weiterentwicklung von STP. Nach einer Topologieänderung ist das Netz meist innerhalb weniger Sekunden wieder stabil statt erst nach dreissig bis fünfzig Sekunden. Heute ist das der Standard.'
  },
  {
    id: 'rootbridge', label: 'Root Bridge', chapter: 'stp',
    aliases: ['root bridge', 'rootbridge', 'wurzel bridge', 'root switch'],
    antwort: 'Die Root Bridge ist der eine Switch im gesamten STP-Baum, der als fester Bezugspunkt dient. Alle anderen berechnen ihren kürzesten Pfad zu ihr hin. Gewählt wird der Switch mit der niedrigsten Bridge-ID, bei gleicher Priorität entscheidet die niedrigere MAC-Adresse. Fallstrick: die Root Bridge selbst hat keinen Root Port, alle ihre Ports sind Designated Ports.'
  },
  {
    id: 'bridgeid', label: 'Bridge-ID', chapter: 'stp',
    aliases: ['bridge id', 'bridgeid', 'bridge prioritaet', 'prioritaet switch', 'zweiunddreissigtausend'],
    antwort: 'Die Bridge-ID besteht aus der Priorität und der MAC-Adresse des Switches. Der Standardwert der Priorität ist zweiunddreissigtausendsiebenhundertachtundsechzig, konfigurierbar in Viertausendsechsundneunziger-Schritten. Der Switch mit der niedrigsten Bridge-ID wird zur Root Bridge.'
  },
  {
    id: 'bpdu', label: 'BPDU', chapter: 'stp',
    aliases: ['bpdu', 'b p d u', 'bridge protocol data unit', 'bpdus'],
    antwort: 'BPDUs, die Bridge Protocol Data Units, sind die Nachrichten, die Switches untereinander austauschen, um STP oder RSTP zu berechnen: Wahl der Root Bridge, Ermittlung der Pfadkosten und Festlegung der Portrollen.'
  },
  {
    id: 'portrollen', label: 'Portrollen im STP', chapter: 'stp',
    aliases: ['portrollen', 'port rollen', 'root port', 'designated port', 'blocked port', 'alternate port', 'blockierter port'],
    antwort: 'Es gibt drei Portrollen. Der Root Port ist der Port mit dem günstigsten Pfad zur Root Bridge, genau einer pro Nicht-Root-Switch, und er leitet weiter. Der Designated Port ist der Port an einem Netzsegment mit dem günstigsten Pfad zur Root Bridge, er leitet ebenfalls weiter. Der Blocked Port ist ein redundanter Port, der aktiv blockiert wird, um eine Schleife zu verhindern, und erst einspringt, wenn der aktive Pfad ausfällt.'
  },
  {
    id: 'konvergenz', label: 'Konvergenz', chapter: 'stp',
    aliases: ['konvergenz', 'konvergenzzeit', 'convergence'],
    antwort: 'Konvergenz ist der Zustand, in dem alle Switches ein einheitliches, stabiles Bild der Topologie haben und alle Pfade endgültig feststehen. Die Konvergenzzeit gibt an, wie lange das nach einer Änderung dauert: bei STP rund dreissig bis fünfzig Sekunden, bei RSTP meist wenige Sekunden.'
  },

  /* --- WLAN -------------------------------------------------------------- */
  {
    id: 'accesspoint', label: 'Access Point', chapter: 'wlan',
    aliases: ['access point', 'accesspoint', 'infrastruktur modus', 'funkclient'],
    antwort: 'Der Access Point ist im Infrastruktur-Modus das zentrale Gerät im WLAN. Er verbindet die Funkclients mit dem kabelgebundenen Netz und übernimmt damit eine ähnliche Rolle wie ein Switch oder Hub im LAN.'
  },
  {
    id: 'ssid', label: 'SSID', chapter: 'wlan',
    aliases: ['ssid', 's s i d', 'service set identifier', 'netzwerkname', 'beacon'],
    antwort: 'Die SSID, der Service Set Identifier, ist der Name des WLAN-Netzes. Der Access Point sendet ihn als Beacon aus, damit Clients das Netz finden und sich verbinden können.'
  },
  {
    id: 'baender', label: 'WLAN-Frequenzbänder', chapter: 'wlan',
    aliases: ['frequenzband', 'frequenzbaender', 'baender', '2 4 ghz', 'fuenf ghz', 'sechs ghz', 'wifi 6e', 'kanaele'],
    antwort: 'Es gibt drei Bänder. 2,4 Gigahertz hat die grosse Reichweite und durchdringt Wände besser, ist aber hoch störanfällig und hat nur drei nicht überlappende Kanäle: eins, sechs und elf. 5 Gigahertz hat kleinere Reichweite, geringere Störanfälligkeit und deutlich mehr Kanäle mit höheren Datenraten. 6 Gigahertz, bekannt als Wi-Fi 6E, hat die kleinste Reichweite, sehr geringe Störanfälligkeit und noch mehr Kanäle.'
  },
  {
    id: 'wep', label: 'WEP', chapter: 'wlan',
    aliases: ['wep', 'w e p', 'wired equivalent privacy', 'rc4', 'r c 4'],
    antwort: 'WEP, Wired Equivalent Privacy, ist die erste WLAN-Verschlüsselung und basiert auf der Stromchiffre RC4. Sie gilt seit Langem als gebrochen und darf nicht mehr verwendet werden.'
  },
  {
    id: 'wpa', label: 'WPA & TKIP', chapter: 'wlan',
    aliases: ['wpa', 'w p a', 'wi fi protected access', 'tkip', 't k i p', 'temporal key integrity protocol'],
    antwort: 'WPA war der Nachfolger von WEP und als Übergangslösung mit TKIP auf vorhandener Hardware gedacht. TKIP, das Temporal Key Integrity Protocol, wechselt Schlüssel dynamisch, hat aber bekannte Schwächen. WPA gilt heute als unsicher und wurde von WPA2 und WPA3 abgelöst.'
  },
  {
    id: 'wpa2', label: 'WPA2', chapter: 'wlan',
    aliases: ['wpa2', 'wpa 2', 'w p a zwei', 'aes', 'a e s', 'ccmp', 'c c m p', 'advanced encryption standard'],
    antwort: 'WPA2 verschlüsselt mit AES über CCMP und ist deutlich stärker als TKIP. Es ist der heutige Mindeststandard, aber anfällig für Offline-Wörterbuchangriffe auf den Vier-Wege-Handschlag. AES ist der moderne symmetrische Verschlüsselungsalgorithmus, CCMP die Betriebsart, mit der WPA2 und WPA3 tatsächlich verschlüsseln.'
  },
  {
    id: 'wpa3', label: 'WPA3 & SAE', chapter: 'wlan',
    aliases: ['wpa3', 'wpa 3', 'w p a drei', 'sae', 's a e', 'simultaneous authentication of equals', 'forward secrecy', 'gcmp'],
    antwort: 'WPA3 nutzt AES über GCMP und ersetzt den WPA2-Vier-Wege-Handschlag durch SAE, Simultaneous Authentication of Equals. Damit schützt es zusätzlich gegen Offline-Wörterbuchangriffe und bietet Forward Secrecy. Der Unterschied zu WPA2 liegt vor allem im robusteren Anmeldeverfahren, nicht in einem komplett neuen Verschlüsselungsalgorithmus.'
  },

  /* --- Domänen ----------------------------------------------------------- */
  {
    id: 'kollisionsdomaene', label: 'Kollisionsdomäne', chapter: 'domaenen',
    aliases: ['kollisionsdomaene', 'kollisions domaene', 'collision domain', 'kollisionsbereich'],
    antwort: 'Die Kollisionsdomäne ist der Bereich, in dem sich Geräte eine gemeinsame Übertragungskapazität teilen und Kollisionen entstehen können. Begrenzt wird sie durch den Switch: jeder Port ist eine eigene Kollisionsdomäne.'
  },
  {
    id: 'broadcastdomaene', label: 'Broadcast-Domäne', chapter: 'domaenen',
    aliases: ['broadcast domaene', 'broadcastdomaene', 'broadcast domain', 'broadcastbereich'],
    antwort: 'Die Broadcast-Domäne ist der Bereich, in dem ein Broadcast-Frame von allen Geräten empfangen wird. Begrenzt wird sie durch einen Router oder durch VLAN-Grenzen. Klassischer Fallstrick: ein Switch trennt Kollisionsdomänen, aber nicht automatisch Broadcast-Domänen — dafür braucht es VLANs oder einen Router.'
  },
  {
    id: 'vergleich12', label: 'Schicht 1 gegen Schicht 2', chapter: 'domaenen',
    aliases: ['vergleich schicht', 'unterschied schicht eins zwei', 'schicht eins gegen schicht zwei', 'leitungscode', '8b 10b'],
    antwort: 'Dateneinheit: Schicht eins Bit, Schicht zwei Frame. Adressierung: Schicht eins keine, Schicht zwei MAC-Adresse. Geräte: Schicht eins Hub und Repeater, Schicht zwei Switch und Bridge. Fehlerbehandlung: Schicht eins keine, Schicht zwei FCS und CRC zur Erkennung ohne Korrektur. Feinschliff: keine Fehlerbehandlung auf Schicht eins meint die logische Korrektur; physikalische Leitungscodes wie 8b/10b oder Scrambling haben durchaus Fehlererkennungseigenschaften auf Bit-Ebene.'
  },

  /* --- Sicherheit -------------------------------------------------------- */
  {
    id: 'portsecurity', label: 'Port Security', chapter: 'sicherheit',
    aliases: ['port security', 'portsecurity', 'port sicherheit'],
    antwort: 'Port Security begrenzt beziehungsweise definiert, welche und wie viele MAC-Adressen an einem Switch-Port erlaubt sind. Bei Verstoss kann der Port zum Beispiel gesperrt werden. Das schützt gegen unautorisierte Geräte und gegen MAC Flooding.'
  },
  {
    id: 'macflooding', label: 'MAC Flooding / CAM Table Overflow', chapter: 'sicherheit',
    aliases: ['mac flooding', 'macflooding', 'cam table overflow', 'cam overflow', 'tabelle ueberfuellen'],
    antwort: 'Beim MAC Flooding, auch CAM Table Overflow genannt, sendet ein Angreifer gezielt sehr viele gefälschte MAC-Adressen, um die CAM-Tabelle des Switches zu überfüllen. Ist die Tabelle voll, fällt der Switch ins Flooding-Verhalten zurück und sendet Frames wie ein Hub an alle Ports — dadurch lässt sich Datenverkehr mitlesen.'
  },

  /* --- Fehlerquellen ----------------------------------------------------- */
  {
    id: 'duplexmismatch', label: 'Duplex-Mismatch', chapter: 'fehler',
    aliases: ['duplex mismatch', 'duplexmismatch', 'auto negotiation', 'autonegotiation'],
    antwort: 'Beim Duplex-Mismatch handeln Switch-Port und Endgerät unterschiedliche Duplex-Einstellungen aus, ein Problem der Auto-Negotiation. Die Folge sind massive Kollisionen und Fehlerpakete.'
  },
  {
    id: 'broadcaststurm', label: 'Broadcast-Sturm', chapter: 'fehler',
    aliases: ['broadcast sturm', 'broadcaststurm', 'broadcast storm', 'schleife im netz'],
    antwort: 'Ein Broadcast-Sturm entsteht durch eine physische Schleife ohne Schutz durch STP oder RSTP. Er kann ein Netzsegment komplett lahmlegen.'
  },
  {
    id: 'l2fehler', label: 'Fehlerquellen auf Schicht 2', chapter: 'fehler',
    aliases: ['fehlerquellen', 'typische fehler', 'was geht schief', 'fehlersuche schicht zwei'],
    antwort: 'Sechs Klassiker: Duplex-Mismatch durch Auto-Negotiation-Probleme, Broadcast-Sturm durch eine Schleife ohne STP-Schutz, VLAN-Fehlkonfiguration mit falschem Tagging oder Native-VLAN-Mismatch, MAC-Adresskonflikt durch gespoofte Adressen, CAM-Table-Overflow, und eine fehlerhafte FCS durch Bitfehler aus Schicht eins.'
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PODCAST_L2, REGISTER_L2 };
}
