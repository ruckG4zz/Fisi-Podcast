/* =============================================================================
   FISI-Podcast-App — Inhaltsmodul: NEINT1, Layer 1 (Bitübertragungsschicht)
   DIALOG-FASSUNG v2
   -----------------------------------------------------------------------------
   FAKTENQUELLE (einzige Quelle der Wahrheit):
     03 Bereiche/FISI-Umschulung/00_Lernunterstützung/
     03_NEINT1_Netzwerke und Internettechnologien [Grundlagen]/
     NEINT1_OSI_Enzyklopaedie_FINAL.html  ->  Section  id="sec-l1"

   Dieses Skript ist eine ABGELEITETE PRÄSENTATIONSFORM (Hörfassung) dieser
   Section. Es enthält keinerlei erfundene Fachinhalte: jede Zahl, jede
   Definition und jedes Beispiel steht so in der Enzyklopädie. Was
   hinzugekommen ist, sind ausschliesslich Gespraechselemente (Nachfragen,
   Zustimmung, Ueberleitungen) — also Form, nicht Inhalt.

   ROLLEN
     'a' = Stimme A (männlich)  — der Erklaerende. Bringt die Fachsubstanz,
                                  ruhig und strukturiert.
     'b' = Stimme B (weiblich)  — die Moderierende. Stellt genau die Fragen,
                                  die sich der Lernende selbst stellt, hakt
                                  nach, fasst zusammen, sortiert ein.

   STILREGEL: kurze Wechsel statt langer Bloecke. Niemand haelt hier einen
   Vortrag — die beiden reden miteinander.
   ========================================================================== */

const PODCAST_L1 = {
  id: 'neint1-l1',
  modul: 'NEINT1',
  titel: 'Layer 1 — Bitübertragungsschicht',
  untertitel: 'Physical Layer · PDU: Bit · IHK-Relevanz: hoch',
  quelle: 'NEINT1_OSI_Enzyklopaedie_FINAL.html, Section sec-l1',

  chapters: [
    /* ---------------------------------------------------------------- 01 */
    {
      id: 'intro',
      titel: 'Einstieg',
      kurz: 'Worum es auf Schicht 1 überhaupt geht',
      segments: [
        { voice: 'b', text: 'Wir fangen heute ganz unten an. Schicht eins des OSI-Modells, die Bitübertragungsschicht. Auf Englisch Physical Layer.' },
        { voice: 'a', text: 'Und ganz unten heißt hier wirklich ganz unten. Es gibt nichts darunter.' },
        { voice: 'b', text: 'Dann fang mal an. Was kommt beim Empfänger überhaupt an?' },
        { voice: 'a', text: 'Erst mal nichts weiter als ein physikalisches Signal. Spannungspegel auf Kupfer, Lichtimpulse in der Faser, Funkwellen in der Luft. Mehr ist da nicht.' },
        { voice: 'b', text: 'Kein Absender, keine Nachricht, gar nichts?' },
        { voice: 'a', text: 'Genau. Schicht eins macht daraus einen Strom aus Bits, also Nullen und Einsen. Und damit ist ihre Arbeit erledigt. Keine Absender, keine Struktur, keine Bedeutung.' },
        { voice: 'b', text: 'Das klingt fast enttäuschend wenig.' },
        { voice: 'a', text: 'Ist es aber nicht. Es ist der Startpunkt, von dem aus alles Weitere aufgebaut wird. Alles, was die Schichten darüber können, steht auf diesem Fundament.' },
        { voice: 'b', text: 'Gut. Was muss ich mir für die Prüfung merken?' },
        { voice: 'a', text: 'Die Dateneinheit dieser Schicht, die PDU, ist das Bit. Im TCP/IP-Modell entspricht sie dem Netzzugang, der Verbindungstyp ist Punkt zu Punkt.' },
        { voice: 'b', text: 'Und wie oft taucht das in der IHK-Prüfung auf?' },
        { voice: 'a', text: 'Die Relevanz ist hoch. Hier wird gerne gefragt. Also lohnt sich das Zuhören.' }
      ]
    },

    /* ---------------------------------------------------------------- 02 */
    {
      id: 'aufgabe',
      titel: 'Aufgabe',
      kurz: 'Was Schicht 1 tut — und was ausdrücklich nicht',
      segments: [
        { voice: 'b', text: 'Dann sag mal in einem Satz: was ist die Aufgabe?' },
        { voice: 'a', text: 'Schicht eins überträgt rohe Bits über ein physisches Medium. Als elektrische Signale, als Lichtimpulse oder als Funkwellen.' },
        { voice: 'b', text: 'Das war der eine Satz. Und jetzt der wichtigere Teil?' },
        { voice: 'a', text: 'Genau, der kommt nämlich in Prüfungen mindestens genauso oft: was sie ausdrücklich nicht tut. Sie hat kein Verständnis von Adressen. Keine Frames. Keine Fehlerkorrektur. Nur reine Signalübertragung.' },
        { voice: 'b', text: 'Und wie erkenne ich in einer Aufgabe, ob ich noch auf Schicht eins bin?' },
        { voice: 'a', text: 'Es gibt einen guten Prüfstein. Sobald irgendwo eine Adresse im Spiel ist, bist du drüber.' },
        { voice: 'b', text: 'Nur bei Adressen?' },
        { voice: 'a', text: 'Nein, auch sobald etwas erkennt, wo eine Nachricht anfängt und wo sie aufhört. Oder sobald etwas bemerkt, dass ein Fehler passiert ist. Alle drei Dinge liegen mindestens eine Schicht höher.' },
        { voice: 'b', text: 'Also: Adresse, Anfang und Ende, Fehlererkennung. Drei Signale dafür, dass ich nicht mehr auf Schicht eins bin.' },
        { voice: 'a', text: 'So kannst du dir das merken, ja.' }
      ]
    },

    /* ---------------------------------------------------------------- 03 */
    {
      id: 'ausdehnung',
      titel: 'Netzwerkausdehnung',
      kurz: 'BAN, PAN, LAN, WLAN, CAN, MAN, WAN, GAN',
      segments: [
        { voice: 'b', text: 'Nächstes Thema: Netzwerkausdehnung. Englisch Network Scope. Was steckt dahinter?' },
        { voice: 'a', text: 'Eine ziemlich simple Frage: wie weit reicht ein Netz? Danach werden Netze in Kategorien einsortiert. Und die reichen von winzig bis weltumspannend.' },
        { voice: 'b', text: 'Dann gehen wir von klein nach groß. Was ist das Kleinste?' },
        { voice: 'a', text: 'Das BAN, Body Area Network. Reichweite: Zentimeter bis etwa zwei Meter.' },
        { voice: 'b', text: 'Zwei Meter. Was hängt denn da dran?' },
        { voice: 'a', text: 'Fitness-Tracker zum Beispiel, oder medizinische Sensoren. Technisch läuft das über Bluetooth Low Energy oder NFC.' },
        { voice: 'b', text: 'Gut, eine Stufe größer?' },
        { voice: 'a', text: 'Das PAN, Personal Area Network. Bis etwa zehn Meter. Das klassische Beispiel hast du wahrscheinlich gerade in der Tasche: Smartphone und Bluetooth-Kopfhörer.' },
        { voice: 'b', text: 'Und dann kommt der Begriff, den vermutlich jeder kennt.' },
        { voice: 'a', text: 'Das LAN, Local Area Network. Zehn Meter bis mehrere hundert Meter. Dein Büro- oder Heimnetz, mit Servern und Switches.' },
        { voice: 'b', text: 'WLAN ist dann einfach das LAN ohne Kabel?' },
        { voice: 'a', text: 'Im Prinzip ja, Wireless LAN. Dreißig bis hundert Meter je Access Point. Aber ein Unterschied ist prüfungsrelevant: statt des Kabelverfahrens arbeitet es mit CSMA/CA.' },
        { voice: 'b', text: 'Merken wir uns. Weiter nach oben.' },
        { voice: 'a', text: 'Das CAN, Campus Area Network. Ein bis fünf Kilometer. Da geht es um mehrere LANs auf einem gemeinsamen Uni- oder Firmengelände.' },
        { voice: 'b', text: 'Und wenn ich die ganze Stadt abdecken will?' },
        { voice: 'a', text: 'Dann bist du beim MAN, Metropolitan Area Network. Fünf bis hundert Kilometer, also ein Netz innerhalb einer Stadt oder Region.' },
        { voice: 'b', text: 'Darüber wird es dann international, nehme ich an.' },
        { voice: 'a', text: 'Genau, das WAN, Wide Area Network. Hundert bis mehrere tausend Kilometer. Es verbindet LANs und MANs über Länder und Kontinente. Denk ans Internet-Backbone.' },
        { voice: 'b', text: 'Und ganz oben?' },
        { voice: 'a', text: 'Das GAN, Global Area Network. Weltweit. Es verbindet WANs global. Das Internet selbst ist das Beispiel.' },
        { voice: 'b', text: 'Das sind jetzt acht Abkürzungen. Muss ich die wirklich alle mit Zahlen auswendig lernen?' },
        { voice: 'a', text: 'Musst du nicht, und das ist der eigentlich wichtige Punkt. Die Kategorien sind nämlich ineinander verschachtelt.' },
        { voice: 'b', text: 'Wie meinst du das?' },
        { voice: 'a', text: 'BAN steckt in PAN, PAN in LAN, LAN in CAN, CAN in MAN, MAN in WAN, WAN in GAN. Jede größere Kategorie besteht aus mehreren kleineren.' },
        { voice: 'b', text: 'Also ein CAN ist einfach eine Handvoll LANs?' },
        { voice: 'a', text: 'Ganz genau. Und ein WAN verbindet mehrere MANs und CANs. Wenn du dieses Prinzip verstanden hast, kannst du dir die Reihenfolge herleiten, statt sie stur auswendig zu lernen.' }
      ]
    },

    /* ---------------------------------------------------------------- 04 */
    {
      id: 'medien',
      titel: 'Übertragungsmedien',
      kurz: 'Kupfer, Lichtwellenleiter, Funk — und die Stecker dazu',
      segments: [
        { voice: 'b', text: 'Reden wir über die Übertragungsmedien. Also: worüber laufen die Bits physisch?' },
        { voice: 'a', text: 'Es gibt drei Familien. Kupfer, Lichtwellenleiter und Funk. Fangen wir mit Kupfer an.' },
        { voice: 'b', text: 'Das sind diese Netzwerkkabel, die man kennt.' },
        { voice: 'a', text: 'Genau, Twisted-Pair-Kabel. Verdrillte Adernpaare. Du findest zwei Abkürzungen: UTP für ungeschirmt, STP für geschirmt.' },
        { voice: 'b', text: 'Und was entscheidet, wie schnell so ein Kabel ist?' },
        { voice: 'a', text: 'Die Kategorie. Und hier lohnt sich Genauigkeit, weil die IHK genau da nachhakt. Cat fünf e schafft ein Gigabit pro Sekunde über hundert Meter.' },
        { voice: 'b', text: 'Und Cat sechs?' },
        { voice: 'a', text: 'Da wird es interessant. Cat sechs schafft ebenfalls ein Gigabit pro Sekunde bis hundert Meter. Aber zehn Gigabit pro Sekunde nur bis etwa siebenunddreißig bis fünfundfünfzig Meter, je nach Störumgebung.' },
        { voice: 'b', text: 'Moment. Das ist ja weniger als die Hälfte.' },
        { voice: 'a', text: 'Richtig, und genau das ist die Falle. Festgelegt ist das in IEEE 802.3an. Cat sechs a dagegen schafft die vollen zehn Gigabit pro Sekunde über die kompletten hundert Meter.' },
        { voice: 'b', text: 'Also: Cat sechs bricht bei zehn Gigabit früh ein, Cat sechs a nicht.' },
        { voice: 'a', text: 'Das ist der Unterschied, auf den es ankommt. Wenn du dir aus dem ganzen Kapitel eine Sache merkst, dann diese.' },
        { voice: 'b', text: 'Gut. Zweite Familie: Lichtwellenleiter.' },
        { voice: 'a', text: 'Kurz LWL. Davon gibt es zwei Sorten, und die musst du auseinanderhalten können. Multimode und Singlemode.' },
        { voice: 'b', text: 'Fang mit Multimode an.' },
        { voice: 'a', text: 'Multimode, englisch MM fiber. Lichtquelle ist eine LED oder ein VCSEL. Gedacht für kurze bis mittlere Strecken, bis etwa fünfhundertfünfzig Meter. Der Kerndurchmesser liegt bei fünfzig zu hundertfünfundzwanzig Mikrometer.' },
        { voice: 'b', text: 'Kann ich die im Serverraum auch am Aussehen erkennen?' },
        { voice: 'a', text: 'Oft ja. Ältere Kabel sind meist orange, moderne OM drei und OM vier meist aqua beziehungsweise türkis.' },
        { voice: 'b', text: 'Und Singlemode?' },
        { voice: 'a', text: 'Englisch SM fiber. Lichtquelle ist ein Laser. Für lange Strecken im Kilometerbereich. Kerndurchmesser neun zu hundertfünfundzwanzig Mikrometer, also deutlich kleiner. Farbe meist gelb.' },
        { voice: 'b', text: 'Das ist verwirrend. Der kleinere Kern schafft die größere Strecke?' },
        { voice: 'a', text: 'Ja, und genau daraus kannst du dir eine Eselsbrücke bauen. Neun Mikrometer, Singlemode, Kilometer. Fünfzig Mikrometer, Multimode, ein paar hundert Meter. Kleiner Kern, große Reichweite.' },
        { voice: 'b', text: 'Das hilft. Dritte Familie: Funk.' },
        { voice: 'a', text: 'Elektromagnetische Wellen. WLAN auf zwei Komma vier, fünf oder sechs Gigahertz. Zwei Eigenschaften solltest du im Kopf haben: es ist störanfällig, und es ist ein geteiltes Medium.' },
        { voice: 'b', text: 'Geteiltes Medium heißt, alle funken auf demselben Kanal?' },
        { voice: 'a', text: 'Sinngemäß ja. Und das wird später bei den Topologien nochmal wichtig.' },
        { voice: 'b', text: 'Letzte Frage zu dem Thema: die Stecker. Wird das abgefragt?' },
        { voice: 'a', text: 'Gerne sogar. Bei Kupfer ist es RJ45. Bei Lichtwellenleitern hast du LC, SC und ST.' },
        { voice: 'b', text: 'Und welcher davon ist heute Standard?' },
        { voice: 'a', text: 'LC, vor allem in Rechenzentren, weil er den kleineren Formfaktor hat. Da zählt jeder Millimeter Platz im Rack.' }
      ]
    },

    /* ---------------------------------------------------------------- 05 */
    {
      id: 'verkabelung',
      titel: 'Strukturierte & integrierte Verkabelung',
      kurz: 'Primär-, Sekundär-, Tertiärbereich',
      segments: [
        { voice: 'b', text: 'Jetzt kommt ein Thema, von dem du sagst, es taucht fast garantiert in der Prüfung auf.' },
        { voice: 'a', text: 'Die strukturierte Verkabelung, englisch structured cabling. Ja, damit solltest du dich anfreunden.' },
        { voice: 'b', text: 'Definition bitte.' },
        { voice: 'a', text: 'Ein einheitliches, herstellerunabhängiges Verkabelungssystem nach genormten Ebenen. Und das Entscheidende: es wird unabhängig von der späteren Nutzung geplant.' },
        { voice: 'b', text: 'Also ich verlege Kabel, ohne zu wissen, was mal dran hängt?' },
        { voice: 'a', text: 'Exakt. Du legst die Infrastruktur so, dass sie für alles taugt, was später kommen könnte. Dafür gibt es drei Ebenen.' },
        { voice: 'b', text: 'Erste Ebene?' },
        { voice: 'a', text: 'Der Primärbereich, auch Campus- oder Geländeverkabelung. Er verbindet den Standortverteiler, kurz SV, mit dem Gebäudeverteiler, kurz GV.' },
        { voice: 'b', text: 'Und welches Kabel liegt da?' },
        { voice: 'a', text: 'Glasfaser Singlemode, wegen der großen Distanzen. Das ist ausdrücklich IHK-relevant, das solltest du sicher können.' },
        { voice: 'b', text: 'Zweite Ebene.' },
        { voice: 'a', text: 'Der Sekundärbereich, die Steigbereichsverkabelung. Sie verbindet den Gebäudeverteiler mit dem Etagenverteiler, kurz EV. Hier kommt Kupfer in Cat sechs a zum Einsatz, bei größeren Steigstrecken auch LWL Multimode.' },
        { voice: 'b', text: 'Und die dritte.' },
        { voice: 'a', text: 'Der Tertiärbereich, die Etagenverkabelung. Vom Etagenverteiler zur Anschlussdose. Im Regelfall Kupfer in Cat sechs a, Glasfaser nur bei Sonderanwendungen, etwa der Anbindung eines Serverraums.' },
        { voice: 'b', text: 'Drei Ebenen, drei Kabeltypen. Gibt es da eine Logik, oder muss ich das stumpf lernen?' },
        { voice: 'a', text: 'Es gibt eine Faustregel, die dir die ganze Tabelle ersetzt. Je näher am Endgerät, desto eher Kupfer.' },
        { voice: 'b', text: 'Weil es billiger ist?' },
        { voice: 'a', text: 'Billiger und für kurze Strecken völlig ausreichend. Und umgekehrt: je größer die Distanz und je mehr Backbone, desto eher Glasfaser. Wegen der Dämpfung und wegen der Bandbreite.' },
        { voice: 'b', text: 'Das ist deutlich einfacher als drei Zeilen auswendig zu lernen.' },
        { voice: 'a', text: 'Und es trägt weiter, weil du damit auch Fälle beantworten kannst, die so nicht in der Tabelle stehen.' },
        { voice: 'b', text: 'Jetzt gibt es noch einen zweiten Begriff, der ähnlich klingt. Integrierte Verkabelung.' },
        { voice: 'a', text: 'Der wird gerne verwechselt, ist aber etwas völlig anderes. Da trägt ein einziges Kabelsystem mehrere Dienste gemeinsam.' },
        { voice: 'b', text: 'Zum Beispiel?' },
        { voice: 'a', text: 'Daten, Telefonie und Gebäudeleittechnik über dieselbe Infrastruktur, statt für jeden Dienst getrennt zu verkabeln.' },
        { voice: 'b', text: 'Also nochmal zum Mitschreiben: strukturiert bezieht sich auf die genormten Ebenen, integriert auf das gemeinsame Tragen mehrerer Dienste.' },
        { voice: 'a', text: 'Perfekt zusammengefasst. Genau so würde ich es in der Prüfung hinschreiben.' },
        { voice: 'b', text: 'Eine Sache noch, die mich interessiert: was passiert eigentlich, wenn so eine Steigleitung ausfällt?' },
        { voice: 'a', text: 'Gute Frage, und da gibt es zwei Bauweisen. Im reinen Sterntyp hängt jede Etage einzeln am Gebäudeverteiler. Fällt die Steigleitung zu einer Etage aus, ist genau diese Etage vom Netz getrennt.' },
        { voice: 'b', text: 'Eine ganze Etage offline. Das will niemand.' },
        { voice: 'a', text: 'Deshalb gibt es die Etagenkopplung. Da baust du zusätzliche Backup-Verbindungen zwischen benachbarten Etagenverteilern ein. Erdgeschoss zum ersten Obergeschoss, erstes zum zweiten.' },
        { voice: 'b', text: 'Und dann?' },
        { voice: 'a', text: 'Fällt die Steigleitung einer Etage zum Gebäudeverteiler aus, bleibt sie über die Nachbaretage erreichbar. Keine Etage geht komplett verloren.' },
        { voice: 'b', text: 'Klingt sinnvoll. Warum macht man das nicht immer?' },
        { voice: 'a', text: 'Weil es zusätzliches Kabel kostet. Es erhöht die Ausfallsicherheit spürbar, aber eben nicht umsonst. Genau so eine Abwägung, Kosten gegen Verfügbarkeit, ist typisches Prüfungsmaterial.' }
      ]
    },

    /* ---------------------------------------------------------------- 06 */
    {
      id: 'modi',
      titel: 'Übertragungsmodi',
      kurz: 'Simplex, Halbduplex, Vollduplex',
      segments: [
        { voice: 'b', text: 'Übertragungsmodi, englisch Transmission Modes. Drei Stück, richtig?' },
        { voice: 'a', text: 'Drei, und die sind schnell erklärt. Simplex: nur eine Richtung, fest.' },
        { voice: 'b', text: 'Beispiel?' },
        { voice: 'a', text: 'Radio, Fernsehausstrahlung. Der Sender sendet, du empfängst, zurück geht nichts.' },
        { voice: 'b', text: 'Zweiter Modus.' },
        { voice: 'a', text: 'Halbduplex, englisch Half-Duplex. Beide Richtungen, aber nicht gleichzeitig. Das Walkie-Talkie ist das Standardbeispiel: einer redet, der andere hört, dann Wechsel.' },
        { voice: 'b', text: 'Und die technische Entsprechung im Netzwerk?' },
        { voice: 'a', text: 'Altes Hub-Ethernet mit CSMA/CD arbeitete genau so.' },
        { voice: 'b', text: 'Dritter.' },
        { voice: 'a', text: 'Vollduplex, Full-Duplex. Beide Richtungen gleichzeitig. Modernes Switch-Ethernet und das Telefon. Beide können reden, ohne sich gegenseitig zu blockieren.' },
        { voice: 'b', text: 'Gibt es einen Zusammenhang, den ich mir merken sollte?' },
        { voice: 'a', text: 'Ja, und der ist nützlich: Hub bedeutet Halbduplex und CSMA/CD. Switch bedeutet Vollduplex.' },
        { voice: 'b', text: 'Also die Geräteart verrät mir den Modus.' },
        { voice: 'a', text: 'Im Kern ja. Und das taucht bei Schicht zwei nochmal auf, insofern lohnt es sich doppelt.' }
      ]
    },

    /* ---------------------------------------------------------------- 07 */
    {
      id: 'topologien',
      titel: 'Netzwerktopologien',
      kurz: 'Bus, Ring, Stern, Vermascht',
      segments: [
        { voice: 'b', text: 'Netzwerktopologien. Also: wie sind Geräte und Verbindungen angeordnet?' },
        { voice: 'a', text: 'Vier Grundformen. Und bei jeder gibt es einen klaren Vorteil und einen klaren Nachteil. Genau dieses Gegensatzpaar wird abgefragt.' },
        { voice: 'b', text: 'Dann los. Bus.' },
        { voice: 'a', text: 'Vorteil: wenig Kabel, günstige Installation. Nachteil: ein Kabelbruch legt das gesamte Segment lahm, und alles hängt in einer gemeinsamen Kollisionsdomäne.' },
        { voice: 'b', text: 'Gibt es das heute noch irgendwo?' },
        { voice: 'a', text: 'In reiner Form praktisch nicht mehr. Historisch war das bei 10BASE2- und 10BASE5-Koaxialnetzen im Einsatz.' },
        { voice: 'b', text: 'Also reine Prüfungsgeschichte?' },
        { voice: 'a', text: 'Nicht ganz. Logisch lebt das Bus-Prinzip weiter, überall dort, wo ein Medium gemeinsam genutzt wird. Klassisches WLAN zum Beispiel, oder alte Hub-Segmente.' },
        { voice: 'b', text: 'Interessant. Nächste: Ring.' },
        { voice: 'a', text: 'Vorteil: definierter Zugriff über ein Token, dadurch keine Kollisionen im ursprünglichen Sinn. Nachteil: ein Bruch kann den ganzen Ring stören.' },
        { voice: 'b', text: 'Kann man das nicht absichern?' },
        { voice: 'a', text: 'Doch, mit einem Dual-Ring, wie bei FDDI. Das ist die Ausnahme von der Regel.' },
        { voice: 'b', text: 'Und wo lief Ring in der Praxis?' },
        { voice: 'a', text: 'Token Ring nach IEEE 802.5 und FDDI, in älteren Unternehmens- und Backbone-Netzen. Heute weitgehend durch Stern-Ethernet abgelöst. Das Grundprinzip überlebt aber in manchen Industrial-Ethernet-Ringtopologien mit Redundanzprotokollen.' },
        { voice: 'b', text: 'Kommen wir zur Topologie, die vermutlich überall verbaut ist.' },
        { voice: 'a', text: 'Stern. Heute der Standard. Vorteil: der Ausfall eines Kabels betrifft nur ein einziges Gerät, und das Netz ist einfach erweiterbar.' },
        { voice: 'b', text: 'Und der Haken?' },
        { voice: 'a', text: 'Das zentrale Gerät, also der Switch, ist ein Single Point of Failure. Fällt der aus, steht alles.' },
        { voice: 'b', text: 'Das ist ja quasi jedes Büro.' },
        { voice: 'a', text: 'Genau das ist die Praxis: ein Patchkabel von jedem Endgerät zu einem zentralen Switch im Serverraum oder Verteilerschrank. Zuhause genauso.' },
        { voice: 'b', text: 'Bleibt die vierte: vermascht.' },
        { voice: 'a', text: 'Englisch Mesh. Vorteil: sehr hohe Redundanz und Ausfallsicherheit, viele alternative Wege. Nachteil: hoher Verkabelungs- und Kostenaufwand.' },
        { voice: 'b', text: 'Wie hoch ist hoch? Gibt es dazu eine Formel?' },
        { voice: 'a', text: 'Ja, und die wird gerne als Rechenaufgabe gestellt. Bei Vollvermaschung brauchst du n mal n minus eins, geteilt durch zwei Verbindungen.' },
        { voice: 'b', text: 'Rechne mir das mal an einem Beispiel vor.' },
        { voice: 'a', text: 'Nimm zehn Geräte. Also zehn mal neun, das sind neunzig, geteilt durch zwei ergibt fünfundvierzig Verbindungen.' },
        { voice: 'b', text: 'Fünfundvierzig Kabel für zehn Geräte. Das erklärt den Kostenpunkt.' },
        { voice: 'a', text: 'Deshalb findest du Mesh vor allem da, wo Ausfallsicherheit alles ist: Rechenzentrums-Backbones, WAN-Verbindungen zwischen Standorten. Im Kleinen kennst du es von Mesh-WLAN-Systemen im Heimnetz, wo sich mehrere Access Points gegenseitig als Fallback-Pfade nutzen.' },
        { voice: 'b', text: 'Jetzt habe ich noch eine Frage, bei der ich mir unsicher bin. Was ist der Unterschied zwischen physischer und logischer Topologie?' },
        { voice: 'a', text: 'Genau da stolpern in Prüfungen die meisten. Physisch ist fast jedes LAN heute eine Stern-Topologie, weil jedes Kabel zum Switch geht.' },
        { voice: 'b', text: 'Und logisch?' },
        { voice: 'a', text: 'Logisch kann trotzdem etwas anderes laufen, zum Beispiel ein emulierter Bus. Die Verkabelung sagt dir nicht zwangsläufig, wie sich die Kommunikation verhält.' },
        { voice: 'b', text: 'Und die IHK fragt das getrennt ab?' },
        { voice: 'a', text: 'Gerne sogar. Merk dir: steht in der Aufgabe das Wort logisch, ist nicht die Verkabelung gemeint, sondern das Kommunikationsverhalten.' }
      ]
    },

    /* ---------------------------------------------------------------- 08 */
    {
      id: 'geraete',
      titel: 'Geräte auf Schicht 1',
      kurz: 'Hub, Repeater, Medienkonverter',
      segments: [
        { voice: 'b', text: 'Welche Geräte gehören auf Schicht eins?' },
        { voice: 'a', text: 'Genau drei. Und die Liste ist deshalb so wertvoll, weil alles, was nicht draufsteht, eben nicht auf Schicht eins gehört.' },
        { voice: 'b', text: 'Das erste.' },
        { voice: 'a', text: 'Der Hub. Er verteilt ein eingehendes Signal elektrisch an alle Ports. Ohne jedes Verständnis von Adressen.' },
        { voice: 'b', text: 'An alle Ports? Auch an die, für die es gar nicht bestimmt ist?' },
        { voice: 'a', text: 'Er weiß es ja nicht besser. Die Folge: alle Ports bilden eine gemeinsame Kollisionsdomäne. Deshalb ist der Hub heute durch Switches abgelöst.' },
        { voice: 'b', text: 'Zweites Gerät.' },
        { voice: 'a', text: 'Der Repeater. Er verstärkt beziehungsweise regeneriert ein schwaches Signal, um die Reichweite über die Grenze des Mediums hinaus zu verlängern.' },
        { voice: 'b', text: 'Versteht der, was er da weiterreicht?' },
        { voice: 'a', text: 'Kein bisschen. Er macht das Signal nur wieder sauber. Inhalt ist ihm völlig egal.' },
        { voice: 'b', text: 'Und das dritte.' },
        { voice: 'a', text: 'Der Medienkonverter. Er wandelt zwischen Medientypen, typischerweise Kupfer über RJ45 auf LWL.' },
        { voice: 'b', text: 'Verändert der die Daten dabei?' },
        { voice: 'a', text: 'Nein, und das ist wichtig. Er übersetzt nur die physikalische Form, inhaltlich bleibt alles unangetastet.' },
        { voice: 'b', text: 'Gibt es eine Merkhilfe für alle drei?' },
        { voice: 'a', text: 'Ja: alle drei sind stur. Keines dieser Geräte weiß, wer sendet oder wer empfangen soll.' },
        { voice: 'b', text: 'Und sobald eines das doch weiß?' },
        { voice: 'a', text: 'Dann ist es kein Schicht-eins-Gerät mehr. Ein Switch zum Beispiel wertet MAC-Adressen aus. Damit ist er raus aus dieser Liste.' }
      ]
    },

    /* ---------------------------------------------------------------- 09 */
    {
      id: 'standards',
      titel: 'Ethernet-Standards IEEE 802.3',
      kurz: 'Von 10BASE-T bis 10GBASE-T',
      segments: [
        { voice: 'b', text: 'Bevor wir zu den Standards kommen: diese Abkürzung IEEE taucht ständig auf. Wofür steht die?' },
        { voice: 'a', text: 'Institute of Electrical and Electronics Engineers. Ein internationales Gremium, das unter anderem die 802er-Normenfamilie definiert.' },
        { voice: 'b', text: 'Und welche davon muss ich kennen?' },
        { voice: 'a', text: 'Vor allem zwei. 802.3 ist Ethernet, also kabelgebunden. 802.11 ist WLAN, also Funk.' },
        { voice: 'b', text: 'Also wenn irgendwo IEEE 802 Punkt irgendwas steht?' },
        { voice: 'a', text: 'Dann ist immer ein von diesem Gremium festgelegter Standard gemeint. Das ist die ganze Bedeutung.' },
        { voice: 'b', text: 'Gut. Dann die konkreten Ethernet-Standards.' },
        { voice: 'a', text: '10BASE-T: zehn Megabit pro Sekunde über Kupfer ab Cat drei.' },
        { voice: 'b', text: 'Weiter.' },
        { voice: 'a', text: '100BASE-TX: hundert Megabit pro Sekunde, das ist Fast Ethernet, über Kupfer in Cat fünf.' },
        { voice: 'b', text: 'Dann kommt Gigabit.' },
        { voice: 'a', text: '1000BASE-T: ein Gigabit pro Sekunde, Gigabit Ethernet, über Kupfer ab Cat fünf e. Und 10GBASE-T: zehn Gigabit pro Sekunde über Kupfer ab Cat sechs a.' },
        { voice: 'b', text: 'Moment, Cat sechs a. Das hatten wir vorhin schon.' },
        { voice: 'a', text: 'Genau, und jetzt schließt sich der Kreis. Deshalb war die Unterscheidung zwischen Cat sechs und Cat sechs a vorhin so wichtig. Die Standards bauen direkt darauf auf.' },
        { voice: 'b', text: 'Und die Glasfaser-Varianten?' },
        { voice: 'a', text: 'Zwei solltest du kennen. 1000BASE-SX: ein Gigabit pro Sekunde über LWL Multimode, für kurze Strecken. Das S steht für short.' },
        { voice: 'b', text: 'Dann ist L wahrscheinlich long.' },
        { voice: 'a', text: 'Richtig. 1000BASE-LX: ein Gigabit pro Sekunde über LWL Singlemode, für lange Strecken. Über dieses Buchstabenpaar kannst du dir Multimode und Singlemode zuverlässig merken.' },
        { voice: 'b', text: 'Gibt es eine Systematik hinter diesen Namen generell?' },
        { voice: 'a', text: 'Ja, und die ist sehr hilfreich. Die Zahl vorne ist die Geschwindigkeit. BASE steht für Basisbandübertragung. Und was hinten steht, verrät dir das Medium.' },
        { voice: 'b', text: 'Also T für?' },
        { voice: 'a', text: 'T wie Twisted Pair, also Kupfer. S und L stehen für die Glasfaservarianten, kurz und lang. Wenn du das einmal verstanden hast, kannst du dir auch Standards erschließen, die du noch nie gesehen hast.' }
      ]
    },

    /* ---------------------------------------------------------------- 10 */
    {
      id: 'fehler',
      titel: 'Typische Fehlerquellen',
      kurz: 'Was auf Schicht 1 in der Praxis schiefgeht',
      segments: [
        { voice: 'b', text: 'Kommen wir zum Teil, der dir später im Job vermutlich am häufigsten begegnet: was geht auf Schicht eins schief?' },
        { voice: 'a', text: 'Sechs typische Fehlerquellen. Und das kommt in Prüfungen gerne als Fehlersuche-Aufgabe.' },
        { voice: 'b', text: 'Erste.' },
        { voice: 'a', text: 'Dämpfung, englisch Attenuation. Das Signal wird über die Distanz schwächer. Bei Kupfer stärker ausgeprägt als bei Lichtwellenleitern.' },
        { voice: 'b', text: 'Deshalb also Glasfaser für lange Strecken.' },
        { voice: 'a', text: 'Das ist einer der Hauptgründe, ja. Zweite Fehlerquelle: Kabelbruch oder Wackelkontakt.' },
        { voice: 'b', text: 'Wie häufig ist das wirklich?' },
        { voice: 'a', text: 'Das ist meist die häufigste reale Fehlerursache überhaupt. Und oft rein mechanisch: ein Knick, eine Zugbelastung. Nichts Exotisches.' },
        { voice: 'b', text: 'Also erst mal ans Kabel denken, bevor man kompliziert wird.' },
        { voice: 'a', text: 'Guter Reflex. Dritte: elektromagnetische Störungen, also Interference und Crosstalk.' },
        { voice: 'b', text: 'Was genau ist Crosstalk?' },
        { voice: 'a', text: 'Übersprechen zwischen benachbarten Adernpaaren. Dazu kommen externe Störquellen wie Motoren oder Leuchtstoffröhren in der Nähe von Kupferkabeln.' },
        { voice: 'b', text: 'Leuchtstoffröhren. Damit hätte ich nicht gerechnet.' },
        { voice: 'a', text: 'Ist aber ein Klassiker. Vierte Fehlerquelle: das falsche Kabel für die Strecke. Zum Beispiel Cat fünf e für zehn Gigabit pro Sekunde eingesetzt.' },
        { voice: 'b', text: 'Oder zu lang?' },
        { voice: 'a', text: 'Genau, eine Kabellänge über die Hundert-Meter-Grenze hinaus. Beides kommt in der Praxis ständig vor.' },
        { voice: 'b', text: 'Fünfte.' },
        { voice: 'a', text: 'Verschmutzte oder beschädigte LWL-Stecker. Und da unterschätzen viele, wie empfindlich das ist.' },
        { voice: 'b', text: 'Wie empfindlich denn?' },
        { voice: 'a', text: 'Schon kleinste Verunreinigungen an der Faserendfläche verschlechtern die Signalqualität spürbar. Ein Fingerabdruck reicht.' },
        { voice: 'b', text: 'Und die sechste?' },
        { voice: 'a', text: 'Defekte Transceiver beziehungsweise SFP-Module. Wichtig dabei: Modul und Kabeltyp müssen zusammenpassen.' },
        { voice: 'b', text: 'Also kein Multimode-Modul an einer Singlemode-Faser.' },
        { voice: 'a', text: 'Funktioniert nicht. Und das ist ein Fehler, den man beim schnellen Zusammenstecken leicht macht.' },
        { voice: 'b', text: 'Gibt es ein Muster, das mir bei Fehlersuche-Aufgaben hilft?' },
        { voice: 'a', text: 'Ja, ein ganz brauchbares. Wenn gar nichts geht, denk zuerst an Kabelbruch und Stecker.' },
        { voice: 'b', text: 'Und wenn es nur manchmal hakt?' },
        { voice: 'a', text: 'Wenn es sporadisch oder nur bei hoher Last hakt, denk an Dämpfung, Störungen oder ein unterdimensioniertes Kabel. Das trennt die Fälle ganz gut.' }
      ]
    },

    /* ---------------------------------------------------------------- 11 */
    {
      id: 'fazit',
      titel: 'Kurzübersicht & Übergang',
      kurz: 'Zusammenfassung und Brücke zu Schicht 2',
      segments: [
        { voice: 'b', text: 'Fassen wir Layer eins zusammen. Was bleibt hängen?' },
        { voice: 'a', text: 'Rohe Bits über ein Medium: Kupfer, Lichtwellenleiter oder Funk. Kein Adressbegriff. Geräte sind Hub, Repeater und Medienkonverter.' },
        { voice: 'b', text: 'Und die Verkabelungsthemen?' },
        { voice: 'a', text: 'Alle Topologie- und Verkabelungsfragen, strukturiert wie integriert, sind hier verankert. Wenn eine Prüfungsaufgabe nach Primär-, Sekundär- und Tertiärbereich fragt, bist du auf Schicht eins.' },
        { voice: 'b', text: 'Dann lass uns die Brücke zur nächsten Schicht schlagen. Wir haben jetzt einen Strom aus Bits. Was fehlt?' },
        { voice: 'a', text: 'Eine ganze Menge. Wo fängt eine Nachricht an, wo hört sie auf? Wer im lokalen Netz hat gesendet, für wen ist sie bestimmt? War die Übertragung überhaupt fehlerfrei?' },
        { voice: 'b', text: 'Und Schicht eins kann davon nichts beantworten.' },
        { voice: 'a', text: 'Keine einzige dieser Fragen. Sie kennt weder Adressen noch Anfang und Ende. Genau hier setzt Schicht zwei an.' },
        { voice: 'b', text: 'Was macht die anders?' },
        { voice: 'a', text: 'Sie schneidet aus dem Bitstrom klar abgegrenzte Rahmen, also Frames. Sie versieht sie mit MAC-Adressen für Absender und Ziel. Und sie hängt eine Prüfsumme an, um Übertragungsfehler zu erkennen.' },
        { voice: 'b', text: 'Aus bedeutungslosen Bits wird also etwas Adressierbares.' },
        { voice: 'a', text: 'So kann man es auf den Punkt bringen. Weiter geht es dann mit der Sicherungsschicht.' },
        { voice: 'b', text: 'Für heute bist du mit Layer eins durch. Bis zum nächsten Mal.' }
      ]
    }
  ]
};

/* =============================================================================
   MODERATIONS-BAUSTEINE
   -----------------------------------------------------------------------------
   Damit sich eine Zwischenfrage wie ein echter Gespraechseinwurf anfuehlt und
   nicht wie eine Systemmeldung. Es wird zufaellig ausgewaehlt, damit es sich
   bei haeufiger Nutzung nicht abnutzt.

   Sprecher-Logik:  B kuendigt die Wortmeldung an  ->  A antwortet fachlich
                    ->  B leitet zurueck ins Thema.
   ========================================================================== */

const MODERATION = {
  /* B kündigt eine eingegangene Hörerfrage an */
  wortmeldung: [
    'Oh, wir haben eine Wortmeldung. Hören wir mal rein.',
    'Moment, da kommt eine Frage aus dem Publikum.',
    'Kurze Unterbrechung, da meldet sich jemand.',
    'Wir haben eine Zwischenfrage. Die nehmen wir gleich mit.',
    'Halt, Wortmeldung. Das passt gerade gut.'
  ],

  /* B übergibt an A, nachdem die Frage verstanden wurde */
  uebergabe: [
    'Kannst du das aufklären?',
    'Magst du das übernehmen?',
    'Das ist deine Baustelle.',
    'Erklär das mal.'
  ],

  /* A leitet eine Antwort ein */
  antwortStart: [
    'Klar.',
    'Gerne.',
    'Gute Frage, denn da wird oft geschludert.',
    'Machen wir.',
    'Sehr berechtigt, das ist ein Stolperstein.'
  ],

  /* A muss ehrlich passen — kein Treffer im Layer-1-Register */
  keinTreffer: [
    'Ehrlich gesagt: dazu haben wir in Layer eins nichts Passendes. Das gehört vermutlich in eine andere Schicht.',
    'Da muss ich passen. In Layer eins kommt das nicht vor. Gut möglich, dass es weiter oben auftaucht.',
    'Das können wir hier nicht sauber beantworten. In Schicht eins steht dazu nichts. Ich rate lieber nicht.'
  ],

  /* B nimmt den Kein-Treffer-Fall auf */
  keinTrefferAbschluss: [
    'Dann merken wir uns das für später.',
    'Setzen wir auf die Liste für die nächsten Schichten.',
    'Gut, dass du nicht einfach was erfindest.'
  ],

  /* B leitet zurück ins laufende Kapitel. {kapitel} wird ersetzt. */
  zurueck: [
    'So, wo waren wir? Ach ja: {kapitel}.',
    'Zurück zum Thema. Wir waren bei {kapitel}.',
    'Gut, weiter im Text. {kapitel}.',
    'Dann machen wir weiter mit {kapitel}.',
    'Wieder rein ins Thema: {kapitel}.'
  ],

  /* B beim Wiedereinstieg nach Pause/Neustart. {kapitel} und {kurz} ersetzt. */
  wiedereinstieg: [
    'Willkommen zurück. Wir waren bei {kapitel} — da ging es um {kurz}.',
    'Schön, dass du wieder da bist. Wir standen bei {kapitel}, Thema war {kurz}.',
    'Weiter geht es. Zuletzt waren wir bei {kapitel}, also {kurz}.'
  ],

  /* B bestätigt einen Kapitelsprung. {kapitel} ersetzt. */
  sprung: [
    'Alles klar, wir springen zu {kapitel}.',
    'Machen wir. Weiter bei {kapitel}.',
    'Gut, dann direkt zu {kapitel}.'
  ]
};

/* =============================================================================
   BEGRIFFSREGISTER — Basis für freie Zwischenfragen und Sprung-Navigation
   -----------------------------------------------------------------------------
   Jeder Eintrag:
     id       eindeutig, angelehnt an die def-l1-* IDs der Enzyklopädie
     label    Anzeigename
     chapter  Kapitel, in dem der Begriff behandelt wird (für "spring dahin")
     aliases  Schreib-/Aussprache-/Buchstabiervarianten, wie sie aus der
              Spracherkennung kommen können. ERSTENTWURF von Claudian —
              wächst mit der Nutzung, ruckG4zz prüft/ergänzt.
     antwort  gesprochene Kurzantwort von Stimme A. Wortlaut aus der
              NEINT1-Glossar-Definition abgeleitet, nichts hinzuerfunden.
   ========================================================================== */

const REGISTER_L1 = [
  /* --- Medien ------------------------------------------------------------ */
  {
    id: 'twistedpair', label: 'Twisted-Pair (Kupfer)', chapter: 'medien',
    aliases: ['twisted pair', 'twistedpair', 'twisted-pair', 'kupferkabel', 'kupfer', 'utp', 'stp', 'u t p', 's t p', 'verdrillt', 'adernpaare', 'cat kabel', 'catkabel'],
    antwort: 'Twisted-Pair ist ein Kupferkabel aus verdrillten Adernpaaren. Reichweite und Geschwindigkeit hängen von der Kategorie ab: Cat fünf e schafft ein Gigabit pro Sekunde bis hundert Meter, Cat sechs zehn Gigabit nur bis etwa siebenunddreißig bis fünfundfünfzig Meter, Cat sechs a die vollen zehn Gigabit über hundert Meter. UTP ist ungeschirmt, STP ist geschirmt. Der Stecker ist RJ45.'
  },
  {
    id: 'cat', label: 'Kabelkategorien (Cat 5e / 6 / 6a)', chapter: 'medien',
    aliases: ['cat5e', 'cat 5e', 'cat fünf e', 'cat5', 'cat 5', 'cat6', 'cat 6', 'cat sechs', 'cat6a', 'cat 6a', 'cat sechs a', 'cat3', 'cat 3', 'kategorie', 'kabelkategorie'],
    antwort: 'Die Kategorie entscheidet, was ein Kupferkabel leisten kann. Cat fünf e: ein Gigabit pro Sekunde über hundert Meter. Cat sechs: ein Gigabit bis hundert Meter, aber zehn Gigabit nur bis etwa siebenunddreißig bis fünfundfünfzig Meter je nach Störumgebung, festgelegt in IEEE 802.3an. Cat sechs a: volle zehn Gigabit pro Sekunde über hundert Meter.'
  },
  {
    id: 'lwlmm', label: 'LWL Multimode', chapter: 'medien',
    aliases: ['multimode', 'multi mode', 'multi-mode', 'mm fiber', 'mm faser', 'om3', 'om4', 'o m drei', 'o m vier'],
    antwort: 'LWL Multimode ist ein Lichtwellenleiter mit größerem Kerndurchmesser, fünfzig zu hundertfünfundzwanzig Mikrometer. Lichtquelle ist eine LED oder ein VCSEL. Gedacht für kurze bis mittlere Strecken bis etwa fünfhundertfünfzig Meter. Ältere Kabel sind meist orange, moderne OM drei und OM vier aqua beziehungsweise türkis.'
  },
  {
    id: 'lwlsm', label: 'LWL Singlemode', chapter: 'medien',
    aliases: ['singlemode', 'single mode', 'single-mode', 'sm fiber', 'sm faser', 'monomode'],
    antwort: 'LWL Singlemode ist ein Lichtwellenleiter mit sehr kleinem Kerndurchmesser, neun zu hundertfünfundzwanzig Mikrometer. Lichtquelle ist ein Laser. Für lange Strecken im Kilometerbereich, Kabel meist gelb. In der strukturierten Verkabelung ist das das Medium des Primärbereichs.'
  },
  {
    id: 'lwl', label: 'Lichtwellenleiter (LWL)', chapter: 'medien',
    aliases: ['lwl', 'l w l', 'lichtwellenleiter', 'glasfaser', 'glasfaserkabel', 'faser', 'fiber'],
    antwort: 'Lichtwellenleiter, kurz LWL, übertragen Daten als Lichtimpulse. Es gibt zwei Sorten: Multimode mit fünfzig zu hundertfünfundzwanzig Mikrometer Kern für kurze bis mittlere Strecken bis etwa fünfhundertfünfzig Meter, und Singlemode mit neun zu hundertfünfundzwanzig Mikrometer für lange Strecken im Kilometerbereich. Stecker sind LC, SC und ST, wobei LC heute der Standard in Rechenzentren ist.'
  },
  {
    id: 'stecker', label: 'Steckertypen', chapter: 'medien',
    aliases: ['rj45', 'r j 45', 'er jot fünfundvierzig', 'stecker', 'steckertyp', 'lc stecker', 'sc stecker', 'st stecker'],
    antwort: 'Bei Kupfer ist der Stecker RJ45. Bei Lichtwellenleitern hast du LC, SC und ST. LC ist heute Standard in Rechenzentren, weil er den kleineren Formfaktor hat.'
  },
  {
    id: 'funk', label: 'Funk / Wireless', chapter: 'medien',
    aliases: ['funk', 'wireless', 'wlan', 'w lan', 'w l a n', 'wifi', 'wi-fi', 'wai fai', 'funkwellen'],
    antwort: 'Funk überträgt über elektromagnetische Wellen. WLAN arbeitet auf zwei Komma vier, fünf oder sechs Gigahertz. Zwei Eigenschaften sind wichtig: es ist störanfällig, und es ist ein geteiltes Medium. Als Netzwerkausdehnung erreicht ein WLAN dreißig bis hundert Meter je Access Point und nutzt CSMA/CA statt des Kabelverfahrens.'
  },

  /* --- Verkabelung ------------------------------------------------------- */
  {
    id: 'structcab', label: 'Strukturierte Verkabelung', chapter: 'verkabelung',
    aliases: ['strukturierte verkabelung', 'strukturierte verkablung', 'structured cabling', 'strukturiert', 'verkabelung'],
    antwort: 'Strukturierte Verkabelung ist ein einheitliches, herstellerunabhängiges Verkabelungssystem nach genormten Ebenen: Primär-, Sekundär- und Tertiärbereich. Es wird unabhängig von der späteren Nutzung geplant. Faustregel: je näher am Endgerät, desto eher Kupfer. Je größer die Distanz und je mehr Backbone, desto eher Glasfaser.'
  },
  {
    id: 'integcab', label: 'Integrierte Verkabelung', chapter: 'verkabelung',
    aliases: ['integrierte verkabelung', 'integrated cabling', 'integriert'],
    antwort: 'Bei integrierter Verkabelung trägt ein einziges Kabelsystem mehrere Dienste gemeinsam, zum Beispiel Daten, Telefonie und Gebäudeleittechnik über dieselbe Infrastruktur, statt für jeden Dienst getrennt zu verkabeln.'
  },
  {
    id: 'primaer', label: 'Primärbereich', chapter: 'verkabelung',
    aliases: ['primärbereich', 'primaerbereich', 'primär', 'primaer', 'geländeverkabelung', 'campusverkabelung', 'campus verkabelung', 'standortverteiler', 'sv'],
    antwort: 'Der Primärbereich ist die Campus- beziehungsweise Geländeverkabelung. Er verbindet den Standortverteiler SV mit dem Gebäudeverteiler GV. Kabeltyp ist Glasfaser Singlemode wegen der großen Distanzen. Dieser Punkt ist ausdrücklich IHK-relevant.'
  },
  {
    id: 'sekundaer', label: 'Sekundärbereich', chapter: 'verkabelung',
    aliases: ['sekundärbereich', 'sekundaerbereich', 'sekundär', 'sekundaer', 'steigbereich', 'steigbereichsverkabelung', 'steigleitung', 'gebäudeverteiler', 'gebaeudeverteiler', 'gv'],
    antwort: 'Der Sekundärbereich ist die Steigbereichsverkabelung. Er verbindet den Gebäudeverteiler GV mit dem Etagenverteiler EV. Kabeltyp ist Kupfer in Cat sechs a, bei größeren Steigstrecken auch LWL Multimode.'
  },
  {
    id: 'tertiaer', label: 'Tertiärbereich', chapter: 'verkabelung',
    aliases: ['tertiärbereich', 'tertiaerbereich', 'tertiär', 'tertiaer', 'etagenverkabelung', 'etagenverteiler', 'ev', 'anschlussdose'],
    antwort: 'Der Tertiärbereich ist die Etagenverkabelung. Er verbindet den Etagenverteiler EV mit der Anschlussdose. Im Regelfall Kupfer in Cat sechs a, Glasfaser nur bei Sonderanwendungen wie der Anbindung eines Serverraums.'
  },
  {
    id: 'redundanz', label: 'Etagenkopplung / Redundanz', chapter: 'verkabelung',
    aliases: ['etagenkopplung', 'redundanz', 'backup verbindung', 'ausfallsicherheit', 'etagen redundanz'],
    antwort: 'Im reinen Sterntyp hängt jede Etage einzeln am Gebäudeverteiler. Fällt die Steigleitung zu einer Etage aus, ist genau diese Etage vom Netz getrennt. Mit einer Etagenkopplung baust du zusätzliche Backup-Verbindungen zwischen benachbarten Etagenverteilern ein. Fällt dann eine Steigleitung aus, bleibt die Etage über die Nachbaretage erreichbar. Das kostet zusätzliches Kabel, erhöht aber die Ausfallsicherheit spürbar.'
  },

  /* --- Übertragungsmodi -------------------------------------------------- */
  {
    id: 'simplex', label: 'Simplex', chapter: 'modi',
    aliases: ['simplex', 'sim plex'],
    antwort: 'Simplex ist Übertragung in nur eine Richtung, fest. Beispiele: Radio und Fernsehausstrahlung.'
  },
  {
    id: 'halbduplex', label: 'Halbduplex', chapter: 'modi',
    aliases: ['halbduplex', 'halb duplex', 'half duplex', 'half-duplex', 'halbduplexbetrieb'],
    antwort: 'Halbduplex ist Übertragung in beide Richtungen, aber nicht gleichzeitig. Beispiele: Walkie-Talkie und altes Hub-Ethernet mit CSMA/CD.'
  },
  {
    id: 'vollduplex', label: 'Vollduplex', chapter: 'modi',
    aliases: ['vollduplex', 'voll duplex', 'full duplex', 'full-duplex', 'fullduplex'],
    antwort: 'Vollduplex ist Übertragung in beide Richtungen gleichzeitig. Beispiele: modernes Switch-Ethernet und das Telefon.'
  },
  {
    id: 'duplex', label: 'Übertragungsmodi allgemein', chapter: 'modi',
    aliases: ['duplex', 'übertragungsmodus', 'uebertragungsmodus', 'übertragungsmodi', 'transmission mode'],
    antwort: 'Es gibt drei Übertragungsmodi. Simplex: nur eine Richtung, fest, wie Radio. Halbduplex: beide Richtungen, aber nicht gleichzeitig, wie beim Walkie-Talkie oder altem Hub-Ethernet mit CSMA/CD. Vollduplex: beide Richtungen gleichzeitig, wie modernes Switch-Ethernet oder das Telefon.'
  },

  /* --- Topologien -------------------------------------------------------- */
  {
    id: 'topologie', label: 'Netzwerktopologie', chapter: 'topologien',
    aliases: ['topologie', 'topologien', 'netzwerktopologie', 'netzwerktopologien', 'topolgie'],
    antwort: 'Die Netzwerktopologie beschreibt die Anordnung der Geräte und Verbindungen im Netz. Grundformen: Bus mit wenig Kabel, aber ein Kabelbruch legt das Segment lahm. Ring mit definiertem Token-Zugriff. Stern als heutiger Standard, wobei der zentrale Switch ein Single Point of Failure ist. Und Vermascht beziehungsweise Mesh mit hoher Redundanz bei hohem Aufwand. Wichtig: physische und logische Topologie können sich unterscheiden.'
  },
  {
    id: 'bus', label: 'Bus-Topologie', chapter: 'topologien',
    aliases: ['bus', 'bustopologie', 'bus topologie', 'bus-topologie', 'koax', 'koaxial', '10base2', '10base5'],
    antwort: 'Die Bus-Topologie hat als Vorteil wenig Kabel und eine günstige Installation. Nachteil: ein Kabelbruch legt das gesamte Segment lahm, und alles liegt in einer gemeinsamen Kollisionsdomäne. Historisch bei 10BASE2- und 10BASE5-Koaxialnetzen im Einsatz, heute in reiner Form praktisch verschwunden. Logisch lebt das Prinzip aber bei gemeinsam genutzten Medien weiter, etwa klassischem WLAN oder alten Hub-Segmenten.'
  },
  {
    id: 'ring', label: 'Ring-Topologie', chapter: 'topologien',
    aliases: ['ring', 'ringtopologie', 'ring topologie', 'ring-topologie', 'token ring', 'token', 'fddi', 'f d d i', 'dual ring'],
    antwort: 'Die Ring-Topologie hat als Vorteil einen definierten Zugriff über ein Token, dadurch keine Kollisionen im ursprünglichen Sinn. Nachteil: ein Bruch kann den ganzen Ring stören, außer bei einem Dual-Ring wie FDDI. Praxis war Token Ring nach IEEE 802.5 und FDDI in älteren Unternehmens- und Backbone-Netzen. Heute weitgehend durch Stern-Ethernet abgelöst.'
  },
  {
    id: 'stern', label: 'Stern-Topologie', chapter: 'topologien',
    aliases: ['stern', 'sterntopologie', 'stern topologie', 'stern-topologie', 'star', 'sternverkabelung', 'single point of failure'],
    antwort: 'Die Stern-Topologie ist heute der Standard. Vorteil: der Ausfall eines Kabels betrifft nur ein Gerät, und das Netz ist einfach erweiterbar. Nachteil: das zentrale Gerät, also der Switch, ist ein Single Point of Failure. Praxis ist der Normalfall in jedem Büro und Zuhause: ein Patchkabel von jedem Endgerät zu einem zentralen Switch.'
  },
  {
    id: 'mesh', label: 'Vermascht / Mesh', chapter: 'topologien',
    aliases: ['mesh', 'vermascht', 'vermaschung', 'vermaschte topologie', 'mesh topologie', 'vollvermaschung', 'mesh wlan'],
    antwort: 'Die vermaschte Topologie, englisch Mesh, bietet sehr hohe Redundanz und Ausfallsicherheit mit vielen alternativen Wegen. Nachteil ist der hohe Verkabelungs- und Kostenaufwand: bei Vollvermaschung brauchst du n mal n minus eins geteilt durch zwei Verbindungen. Bei zehn Geräten sind das fünfundvierzig Verbindungen. Praxis: Rechenzentrums-Backbones, WAN-Verbindungen zwischen Standorten und Mesh-WLAN-Systeme im Heimnetz.'
  },
  {
    id: 'physlog', label: 'Physische vs. logische Topologie', chapter: 'topologien',
    aliases: ['physisch und logisch', 'physische topologie', 'logische topologie', 'physikalische topologie', 'physisch logisch'],
    antwort: 'Physisch ist fast jedes LAN heute eine Stern-Topologie, weil jedes Kabel zum Switch geht. Logisch kann trotzdem etwas anderes laufen, zum Beispiel ein emulierter Bus. Die IHK fragt physische und logische Topologie gerne getrennt ab.'
  },

  /* --- Geräte ------------------------------------------------------------ */
  {
    id: 'hub', label: 'Hub', chapter: 'geraete',
    aliases: ['hub', 'hab', 'kollisionsdomäne', 'kollisionsdomaene', 'kollisionsdomane'],
    antwort: 'Der Hub ist ein Schicht-eins-Gerät, das ein eingehendes Signal elektrisch an alle Ports verteilt, ohne Verständnis von Adressen. Alle Ports bilden eine gemeinsame Kollisionsdomäne. Heute durch Switches abgelöst.'
  },
  {
    id: 'repeater', label: 'Repeater', chapter: 'geraete',
    aliases: ['repeater', 'ripiter', 'verstärker', 'verstaerker', 'signalverstärker'],
    antwort: 'Der Repeater ist ein Schicht-eins-Gerät, das ein schwaches Signal verstärkt beziehungsweise regeneriert, um die Reichweite über die Medien-Grenze hinaus zu verlängern.'
  },
  {
    id: 'medienkonv', label: 'Medienkonverter', chapter: 'geraete',
    aliases: ['medienkonverter', 'medien konverter', 'medienkonvertierer', 'medienwandler', 'konverter'],
    antwort: 'Der Medienkonverter ist ein Schicht-eins-Gerät, das zwischen Medientypen wandelt, zum Beispiel Kupfer über RJ45 auf LWL — ohne die übertragenen Daten inhaltlich zu verändern.'
  },

  /* --- Standards --------------------------------------------------------- */
  {
    id: 'ieee', label: 'IEEE', chapter: 'standards',
    aliases: ['ieee', 'i e e e', 'i triple e', 'ei tripple i', '802', 'achthundertzwei', '802.3', '802.11', '802.5'],
    antwort: 'IEEE steht für Institute of Electrical and Electronics Engineers. Das ist ein internationales Gremium, das unter anderem die 802er-Normenfamilie definiert — zum Beispiel 802.3 für Ethernet, also kabelgebunden, und 802.11 für WLAN, also Funk. Steht irgendwo IEEE 802 Punkt irgendwas, ist immer ein von diesem Gremium festgelegter Standard gemeint.'
  },
  {
    id: 'ethernetstd', label: 'Ethernet-Standards', chapter: 'standards',
    aliases: ['ethernet standard', 'ethernet standards', 'ethernetstandard', '10base-t', '10 base t', '100base-tx', '100 base tx', '1000base-t', '1000 base t', '10gbase-t', '10 g base t', '1000base-sx', '1000base-lx', 'base t', 'fast ethernet', 'gigabit ethernet'],
    antwort: 'Die wichtigsten Ethernet-Standards: 10BASE-T mit zehn Megabit pro Sekunde über Kupfer ab Cat drei. 100BASE-TX mit hundert Megabit, das ist Fast Ethernet, über Cat fünf. 1000BASE-T mit einem Gigabit, also Gigabit Ethernet, über Cat fünf e. 10GBASE-T mit zehn Gigabit über Cat sechs a. Dazu zwei Glasfaser-Varianten: 1000BASE-SX mit einem Gigabit über LWL Multimode für kurze Strecken, und 1000BASE-LX mit einem Gigabit über LWL Singlemode für lange Strecken.'
  },

  /* --- Netzwerkausdehnung ------------------------------------------------ */
  {
    id: 'ausdehnung', label: 'Netzwerkausdehnung', chapter: 'ausdehnung',
    aliases: ['netzwerkausdehnung', 'ausdehnung', 'network scope', 'reichweite', 'netzgrößen', 'netzgroessen', 'netzwerkgrößen'],
    antwort: 'Netze werden nach ihrer Reichweite kategorisiert, von klein nach groß: BAN mit Zentimetern bis zwei Meter, PAN bis zehn Meter, LAN von zehn bis mehrere hundert Meter, WLAN dreißig bis hundert Meter je Access Point, CAN ein bis fünf Kilometer, MAN fünf bis hundert Kilometer, WAN hundert bis mehrere tausend Kilometer, und GAN weltweit. Wichtig: die Kategorien sind ineinander verschachtelt — jede größere besteht aus mehreren kleineren.'
  },
  {
    id: 'ban', label: 'BAN', chapter: 'ausdehnung',
    aliases: ['ban', 'b a n', 'body area network', 'body area'],
    antwort: 'BAN steht für Body Area Network. Reichweite: Zentimeter bis etwa zwei Meter. Typische Geräte sind Fitness-Tracker und medizinische Sensoren, technisch über Bluetooth Low Energy oder NFC.'
  },
  {
    id: 'pan', label: 'PAN', chapter: 'ausdehnung',
    aliases: ['pan', 'p a n', 'personal area network', 'personal area', 'bluetooth'],
    antwort: 'PAN steht für Personal Area Network. Reichweite bis etwa zehn Meter. Klassisches Beispiel: Smartphone und Bluetooth-Kopfhörer.'
  },
  {
    id: 'lan', label: 'LAN', chapter: 'ausdehnung',
    aliases: ['lan', 'l a n', 'local area network', 'local area', 'lokales netzwerk', 'heimnetz', 'büronetz'],
    antwort: 'LAN steht für Local Area Network. Reichweite zehn Meter bis mehrere hundert Meter. Das ist das Büro- oder Heimnetz mit Servern und Switches.'
  },
  {
    id: 'can', label: 'CAN', chapter: 'ausdehnung',
    aliases: ['can', 'c a n', 'zeh a en', 'campus area network', 'campus area', 'campusnetz'],
    antwort: 'CAN steht für Campus Area Network. Reichweite ein bis fünf Kilometer. Es umfasst mehrere LANs auf einem gemeinsamen Uni- oder Firmengelände.'
  },
  {
    id: 'man', label: 'MAN', chapter: 'ausdehnung',
    aliases: ['man', 'm a n', 'em a en', 'metropolitan area network', 'metropolitan area', 'stadtnetz'],
    antwort: 'MAN steht für Metropolitan Area Network. Reichweite fünf bis hundert Kilometer. Das ist ein Netz innerhalb einer Stadt oder Region.'
  },
  {
    id: 'wan', label: 'WAN', chapter: 'ausdehnung',
    aliases: ['wan', 'w a n', 'we a en', 'wide area network', 'wide area', 'backbone', 'internet backbone'],
    antwort: 'WAN steht für Wide Area Network. Reichweite hundert bis mehrere tausend Kilometer. Es verbindet LANs und MANs über Länder und Kontinente, zum Beispiel das Internet-Backbone.'
  },
  {
    id: 'gan', label: 'GAN', chapter: 'ausdehnung',
    aliases: ['gan', 'g a n', 'geh a en', 'global area network', 'global area'],
    antwort: 'GAN steht für Global Area Network und ist weltweit. Es verbindet WANs global — das Internet selbst ist das Beispiel.'
  },

  /* --- Fehlerquellen ----------------------------------------------------- */
  {
    id: 'daempfung', label: 'Dämpfung', chapter: 'fehler',
    aliases: ['dämpfung', 'daempfung', 'dampfung', 'attenuation', 'signalabschwächung', 'abschwächung'],
    antwort: 'Dämpfung ist die Abnahme der Signalstärke über die Distanz. Bei Kupfer ist sie stärker ausgeprägt als bei Lichtwellenleitern — einer der Gründe, weshalb Glasfaser für lange Strecken bevorzugt wird.'
  },
  {
    id: 'crosstalk', label: 'Übersprechen / Störungen', chapter: 'fehler',
    aliases: ['crosstalk', 'cross talk', 'übersprechen', 'uebersprechen', 'interference', 'störung', 'stoerung', 'störungen', 'elektromagnetische störung', 'emv'],
    antwort: 'Elektromagnetische Störungen, also Interference und Crosstalk, entstehen durch Übersprechen zwischen benachbarten Adernpaaren sowie durch Störquellen wie Motoren oder Leuchtstoffröhren in der Nähe von Kupferkabeln.'
  },
  {
    id: 'fehlerquellen', label: 'Fehlerquellen Schicht 1', chapter: 'fehler',
    aliases: ['fehlerquellen', 'fehlerquelle', 'fehler', 'fehlersuche', 'störungssuche', 'kabelbruch', 'wackelkontakt', 'sfp', 's f p', 'transceiver'],
    antwort: 'Typische Fehlerquellen auf Schicht eins sind: Dämpfung über die Distanz. Kabelbruch oder Wackelkontakt, meist die häufigste reale Ursache und oft mechanisch. Elektromagnetische Störungen und Übersprechen. Das falsche Kabel für die Strecke, etwa Cat fünf e für zehn Gigabit oder über hundert Meter Länge. Verschmutzte oder beschädigte LWL-Stecker, wo schon kleinste Verunreinigungen die Signalqualität spürbar verschlechtern. Und defekte Transceiver beziehungsweise SFP-Module, wobei Modul und Kabeltyp zusammenpassen müssen.'
  },

  /* --- Grundlagen -------------------------------------------------------- */
  {
    id: 'aufgabe', label: 'Aufgabe der Schicht 1', chapter: 'aufgabe',
    aliases: ['aufgabe', 'aufgabe von schicht eins', 'was macht schicht 1', 'bitübertragungsschicht', 'bituebertragungsschicht', 'physical layer', 'schicht 1', 'schicht eins', 'layer 1', 'layer eins', 'osi schicht 1'],
    antwort: 'Schicht eins überträgt rohe Bits, also Nullen und Einsen, als elektrische Signale, Lichtimpulse oder Funkwellen über ein physisches Medium. Sie hat kein Verständnis von Adressen, Frames oder Fehlerkorrektur — nur reine Signalübertragung. Die Dateneinheit ist das Bit, im TCP/IP-Modell entspricht das dem Netzzugang.'
  },
  {
    id: 'bit', label: 'Bit (PDU)', chapter: 'intro',
    aliases: ['bit', 'pdu', 'p d u', 'dateneinheit', 'protokolldateneinheit'],
    antwort: 'Die Dateneinheit, also die PDU der Schicht eins, ist das Bit. Auf dieser Schicht gibt es nichts Größeres — keine Frames, keine Pakete, nur einen Strom aus Nullen und Einsen.'
  },
  {
    id: 'csma', label: 'CSMA/CD und CSMA/CA', chapter: 'modi',
    aliases: ['csma', 'csma cd', 'csma/cd', 'csma ca', 'csma/ca', 'c s m a'],
    antwort: 'CSMA/CD gehört zum alten Hub-Ethernet und arbeitet im Halbduplex-Betrieb. CSMA/CA wird im WLAN eingesetzt, also im funkbasierten LAN, statt des Kabelverfahrens. Beide sind Zugriffsverfahren auf ein geteiltes Medium.'
  }
];

/* Export für Modul-Nutzung (falls später gebündelt wird) */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PODCAST_L1, REGISTER_L1, MODERATION };
}
