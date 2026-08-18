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
        { voice: 'b', text: 'Wir fangen heute ganz unten an. Schicht eins des OSI-Modells, die Bitübertragungsschicht.' },
        { voice: 'a', text: 'Ganz unten heißt hier übrigens wirklich ganz unten. Darunter kommt nichts mehr.' },
        { voice: 'b', text: 'Dann steigen wir da direkt ein. Was kommt beim Empfänger eigentlich an?' },
        { voice: 'a', text: 'Erst mal nichts weiter als ein physikalisches Signal. Spannungspegel auf Kupfer, Lichtimpulse in der Faser, Funkwellen in der Luft. Mehr ist da nicht.' },
        { voice: 'b', text: 'Kein Absender, keine Nachricht, gar nichts?' },
        { voice: 'a', text: 'Nichts davon. Schicht eins macht daraus einen Strom aus Bits, also Nullen und Einsen. Und damit ist ihre Arbeit erledigt. Keine Absender, keine Struktur, keine Bedeutung.' },
        { voice: 'b', text: 'Das klingt fast enttäuschend wenig.' },
        { voice: 'a', text: 'Der Gedanke kommt oft. Nur ist es eben das Fundament, auf dem alles Weitere steht. Ohne diese Schicht hat keine der darüberliegenden etwas, womit sie arbeiten könnte.' },
        { voice: 'b', text: 'Fairer Punkt. Dann halten wir gleich fest, was prüfungsrelevant ist: die Dateneinheit dieser Schicht, die PDU, ist das Bit.' },
        { voice: 'a', text: 'Richtig. Und im TCP/IP-Modell entspricht sie dem Netzzugang, der Verbindungstyp ist Punkt zu Punkt.' },
        { voice: 'b', text: 'Wie oft begegnet einem das in der IHK-Prüfung?' },
        { voice: 'a', text: 'Die Relevanz ist hoch, hier wird gerne gefragt. Das Zuhören lohnt sich also.' }
      ]
    },

    /* ---------------------------------------------------------------- 02 */
    {
      id: 'aufgabe',
      titel: 'Aufgabe',
      kurz: 'Was Schicht 1 tut — und was ausdrücklich nicht',
      segments: [
        { voice: 'b', text: 'Bringen wir die Aufgabe auf einen Satz herunter.' },
        { voice: 'a', text: 'Schicht eins überträgt rohe Bits über ein physisches Medium. Als elektrische Signale, als Lichtimpulse oder als Funkwellen.' },
        { voice: 'b', text: 'Das war der Satz. Jetzt kommt aber der Teil, der in Prüfungen mindestens genauso oft drankommt, oder?' },
        { voice: 'a', text: 'Der wichtigere sogar: was sie ausdrücklich nicht tut. Sie hat kein Verständnis von Adressen. Keine Frames. Keine Fehlerkorrektur. Nur reine Signalübertragung.' },
        { voice: 'b', text: 'Und woran erkenne ich in einer Aufgabe, ob ich noch auf Schicht eins bin?' },
        { voice: 'a', text: 'Dafür gibt es einen brauchbaren Prüfstein. Sobald irgendwo eine Adresse im Spiel ist, bist du drüber.' },
        { voice: 'b', text: 'Nur bei Adressen?' },
        { voice: 'a', text: 'Nicht nur. Auch sobald etwas erkennt, wo eine Nachricht anfängt und wo sie aufhört. Oder sobald etwas bemerkt, dass ein Fehler passiert ist. Alle drei Dinge liegen mindestens eine Schicht höher.' },
        { voice: 'b', text: 'Also drei Warnsignale: Adresse, Anfang und Ende, Fehlererkennung. Taucht eines davon auf, bin ich raus aus Schicht eins.' },
        { voice: 'a', text: 'So würde ich es mir merken, ja. Das trägt dich durch die meisten Zuordnungsaufgaben.' }
      ]
    },

    /* ---------------------------------------------------------------- 03 */
    {
      id: 'ausdehnung',
      titel: 'Netzwerkausdehnung',
      kurz: 'BAN, PAN, LAN, WLAN, CAN, MAN, WAN, GAN',
      segments: [
        { voice: 'a', text: 'Damit haben wir geklärt, was diese Schicht macht. Dann lass uns anschauen, in welchen Größenordnungen sich das Ganze überhaupt abspielt.' },
        { voice: 'b', text: 'Du meinst die Netzwerkausdehnung. Dahinter steckt eine ziemlich simple Frage: wie weit reicht ein Netz?' },
        { voice: 'a', text: 'Und danach werden Netze in Kategorien einsortiert, von winzig bis weltumspannend.' },
        { voice: 'b', text: 'Dann gehen wir die von klein nach groß durch. Ganz unten steht das BAN, das Body Area Network. Reichweite: Zentimeter bis etwa zwei Meter.' },
        { voice: 'a', text: 'Zwei Meter, das ist buchstäblich am Körper. Fitness-Tracker, medizinische Sensoren. Technisch läuft das über Bluetooth Low Energy oder NFC.' },
        { voice: 'b', text: 'Eine Stufe größer wird es beim PAN, dem Personal Area Network. Bis etwa zehn Meter.' },
        { voice: 'a', text: 'Das Beispiel dafür hat vermutlich jeder gerade in der Tasche: Smartphone und Bluetooth-Kopfhörer.' },
        { voice: 'b', text: 'Und dann kommt der Begriff, den wirklich jeder kennt.' },
        { voice: 'a', text: 'Das LAN, Local Area Network. Zehn Meter bis mehrere hundert Meter. Dein Büro- oder Heimnetz, mit Servern und Switches.' },
        { voice: 'b', text: 'WLAN ist dann einfach das LAN ohne Kabel?' },
        { voice: 'a', text: 'Im Prinzip ja, Wireless LAN, dreißig bis hundert Meter je Access Point. Ein Unterschied ist aber prüfungsrelevant: statt des Kabelverfahrens arbeitet es mit CSMA/CA.' },
        { voice: 'b', text: 'Den Punkt nehmen wir mit, der kommt später nochmal. Weiter nach oben: das CAN, Campus Area Network, ein bis fünf Kilometer.' },
        { voice: 'a', text: 'Da geht es um mehrere LANs auf einem gemeinsamen Uni- oder Firmengelände.' },
        { voice: 'b', text: 'Und wenn ich die ganze Stadt abdecken will?' },
        { voice: 'a', text: 'Dann bist du beim MAN, dem Metropolitan Area Network. Fünf bis hundert Kilometer, also ein Netz innerhalb einer Stadt oder Region.' },
        { voice: 'b', text: 'Darüber wird es international, nehme ich an.' },
        { voice: 'a', text: 'Dann sprichst du vom WAN, Wide Area Network. Hundert bis mehrere tausend Kilometer, es verbindet LANs und MANs über Länder und Kontinente. Denk ans Internet-Backbone.' },
        { voice: 'b', text: 'Bleibt die oberste Stufe: das GAN, Global Area Network. Weltweit, verbindet WANs global. Das Internet selbst ist das Beispiel.' },
        { voice: 'a', text: 'Damit sind wir einmal durch. Acht Abkürzungen.' },
        { voice: 'b', text: 'Und jetzt die Frage, die sich beim Zuhören aufdrängt: muss man die wirklich alle mit Zahlen auswendig lernen?' },
        { voice: 'a', text: 'Muss man nicht, und das ist der eigentlich wichtige Punkt. Die Kategorien sind nämlich ineinander verschachtelt.' },
        { voice: 'b', text: 'Erklär das mal genauer.' },
        { voice: 'a', text: 'BAN steckt in PAN, PAN in LAN, LAN in CAN, CAN in MAN, MAN in WAN, WAN in GAN. Jede größere Kategorie besteht aus mehreren kleineren.' },
        { voice: 'b', text: 'Ein CAN ist also nichts anderes als eine Handvoll LANs.' },
        { voice: 'a', text: 'So ist es. Und ein WAN verbindet mehrere MANs und CANs. Wer das Prinzip einmal verstanden hat, leitet sich die Reihenfolge her, statt sie stur auswendig zu lernen.' }
      ]
    },

    /* ---------------------------------------------------------------- 04 */
    {
      id: 'medien',
      titel: 'Übertragungsmedien',
      kurz: 'Kupfer, Lichtwellenleiter, Funk — und die Stecker dazu',
      segments: [
        { voice: 'b', text: 'Wir wissen jetzt, wie weit Netze reichen. Bleibt die Frage, worüber die Bits physisch eigentlich laufen.' },
        { voice: 'a', text: 'Da gibt es drei Familien: Kupfer, Lichtwellenleiter und Funk. Fangen wir mit Kupfer an.' },
        { voice: 'b', text: 'Das sind die Netzwerkkabel, die jeder schon mal in der Hand hatte. Twisted-Pair, verdrillte Adernpaare.' },
        { voice: 'a', text: 'Und dazu zwei Abkürzungen, die du auseinanderhalten solltest: UTP für ungeschirmt, STP für geschirmt.' },
        { voice: 'b', text: 'Was entscheidet denn, wie schnell so ein Kabel ist?' },
        { voice: 'a', text: 'Die Kategorie. Hier lohnt sich Genauigkeit, weil die IHK an genau dieser Stelle nachhakt. Cat fünf e schafft ein Gigabit pro Sekunde über hundert Meter.' },
        { voice: 'b', text: 'Und bei Cat sechs?' },
        { voice: 'a', text: 'Da wird es interessant. Cat sechs schafft ebenfalls ein Gigabit pro Sekunde bis hundert Meter. Aber zehn Gigabit pro Sekunde nur bis etwa siebenunddreißig bis fünfundfünfzig Meter, je nach Störumgebung.' },
        { voice: 'b', text: 'Moment, das ist ja nicht mal die Hälfte.' },
        { voice: 'a', text: 'Und genau das ist die Falle. Festgelegt ist das in IEEE 802.3an. Cat sechs a dagegen schafft die vollen zehn Gigabit pro Sekunde über die kompletten hundert Meter.' },
        { voice: 'b', text: 'Ich fasse zusammen: Cat sechs bricht bei zehn Gigabit früh ein, Cat sechs a nicht.' },
        { voice: 'a', text: 'Präzise auf den Punkt. Wenn du dir aus diesem Kapitel eine einzige Sache mitnimmst, dann diese.' },
        { voice: 'b', text: 'Dann zur zweiten Familie, den Lichtwellenleitern, kurz LWL. Davon gibt es zwei Sorten, die man auseinanderhalten muss: Multimode und Singlemode.' },
        { voice: 'a', text: 'Bei Multimode ist die Lichtquelle eine LED oder ein VCSEL. Gedacht für kurze bis mittlere Strecken, bis etwa fünfhundertfünfzig Meter. Der Kerndurchmesser liegt bei fünfzig zu hundertfünfundzwanzig Mikrometer.' },
        { voice: 'b', text: 'Kann man die im Serverraum am Aussehen erkennen?' },
        { voice: 'a', text: 'Oft ja. Ältere Kabel sind meist orange, moderne OM drei und OM vier eher aqua beziehungsweise türkis.' },
        { voice: 'b', text: 'Und Singlemode?' },
        { voice: 'a', text: 'Da ist die Lichtquelle ein Laser, gedacht für lange Strecken im Kilometerbereich. Kerndurchmesser neun zu hundertfünfundzwanzig Mikrometer, also deutlich kleiner. Farbe meist gelb.' },
        { voice: 'b', text: 'Das klingt erst mal widersprüchlich. Der kleinere Kern schafft die größere Strecke?' },
        { voice: 'a', text: 'Klingt verkehrt herum, ist aber so. Und daraus lässt sich eine schöne Eselsbrücke bauen: neun Mikrometer, Singlemode, Kilometer. Fünfzig Mikrometer, Multimode, ein paar hundert Meter. Kleiner Kern, große Reichweite.' },
        { voice: 'b', text: 'Die merke ich mir. Bleibt die dritte Familie, der Funk.' },
        { voice: 'a', text: 'Elektromagnetische Wellen, WLAN auf zwei Komma vier, fünf oder sechs Gigahertz. Zwei Eigenschaften solltest du im Kopf haben: es ist störanfällig, und es ist ein geteiltes Medium.' },
        { voice: 'b', text: 'Geteiltes Medium heißt, alle funken auf demselben Kanal?' },
        { voice: 'a', text: 'Sinngemäß ja. Der Punkt kommt bei den Topologien nochmal auf uns zu.' },
        { voice: 'b', text: 'Eine Sache fehlt noch: die Stecker. Wird das abgefragt?' },
        { voice: 'a', text: 'Gerne sogar. Bei Kupfer ist es RJ45, bei Lichtwellenleitern hast du LC, SC und ST.' },
        { voice: 'b', text: 'Und welcher davon ist heute der Standard?' },
        { voice: 'a', text: 'LC, vor allem in Rechenzentren, weil er den kleineren Formfaktor hat. Da zählt jeder Millimeter Platz im Rack.' }
      ]
    },

    /* ---------------------------------------------------------------- 05 */
    {
      id: 'verkabelung',
      titel: 'Strukturierte & integrierte Verkabelung',
      kurz: 'Primär-, Sekundär-, Tertiärbereich',
      segments: [
        { voice: 'a', text: 'Wir haben jetzt die Kabel selbst durch. Als Nächstes wird es darum gehen, wie man die in einem Gebäude überhaupt sinnvoll verlegt.' },
        { voice: 'b', text: 'Die strukturierte Verkabelung. Ein Thema, von dem es heißt, es tauche fast garantiert in der Prüfung auf.' },
        { voice: 'a', text: 'Das ist keine Übertreibung, damit sollte man sich anfreunden.' },
        { voice: 'b', text: 'Dann fangen wir bei der Definition an: ein einheitliches, herstellerunabhängiges Verkabelungssystem nach genormten Ebenen.' },
        { voice: 'a', text: 'Und das Entscheidende dabei: es wird unabhängig von der späteren Nutzung geplant.' },
        { voice: 'b', text: 'Also verlegt man Kabel, ohne zu wissen, was mal dran hängt?' },
        { voice: 'a', text: 'So ist es gemeint. Du legst die Infrastruktur so, dass sie für alles taugt, was später kommen könnte. Dafür gibt es drei Ebenen.' },
        { voice: 'b', text: 'Die erste ist der Primärbereich, auch Campus- oder Geländeverkabelung genannt. Er verbindet den Standortverteiler, kurz SV, mit dem Gebäudeverteiler, kurz GV.' },
        { voice: 'a', text: 'Und dort liegt Glasfaser Singlemode, wegen der großen Distanzen. Das ist ausdrücklich IHK-relevant, das sollte sitzen.' },
        { voice: 'b', text: 'Weiter zur zweiten Ebene.' },
        { voice: 'a', text: 'Der Sekundärbereich, die Steigbereichsverkabelung. Sie verbindet den Gebäudeverteiler mit dem Etagenverteiler, kurz EV. Hier kommt Kupfer in Cat sechs a zum Einsatz, bei größeren Steigstrecken auch LWL Multimode.' },
        { voice: 'b', text: 'Und die dritte?' },
        { voice: 'a', text: 'Der Tertiärbereich, die Etagenverkabelung. Vom Etagenverteiler zur Anschlussdose. Im Regelfall Kupfer in Cat sechs a, Glasfaser nur bei Sonderanwendungen, etwa der Anbindung eines Serverraums.' },
        { voice: 'b', text: 'Drei Ebenen, drei Kabeltypen. Steckt da eine Logik dahinter, oder muss man das stumpf lernen?' },
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
        { voice: 'b', text: 'Die Kabel liegen jetzt. Als Nächstes wird spannend, in welche Richtungen darüber überhaupt gesprochen werden darf.' },
        { voice: 'a', text: 'Die Übertragungsmodi. Drei Stück, und die sind schnell erklärt. Simplex heißt: nur eine Richtung, fest.' },
        { voice: 'b', text: 'Gib mir ein Beispiel.' },
        { voice: 'a', text: 'Radio oder Fernsehausstrahlung. Der Sender sendet, du empfängst, zurück geht nichts.' },
        { voice: 'b', text: 'Der zweite Modus ist Halbduplex. Beide Richtungen, aber nicht gleichzeitig.' },
        { voice: 'a', text: 'Standardbeispiel ist das Walkie-Talkie: einer redet, der andere hört, dann Wechsel.' },
        { voice: 'b', text: 'Und die technische Entsprechung im Netzwerk?' },
        { voice: 'a', text: 'Altes Hub-Ethernet mit CSMA/CD arbeitete genau so.' },
        { voice: 'b', text: 'Bleibt der dritte.' },
        { voice: 'a', text: 'Vollduplex. Beide Richtungen gleichzeitig, modernes Switch-Ethernet und das Telefon. Beide Seiten können reden, ohne sich gegenseitig zu blockieren.' },
        { voice: 'b', text: 'Gibt es dazu einen Zusammenhang, den man sich merken sollte?' },
        { voice: 'a', text: 'Einen sehr nützlichen sogar: Hub bedeutet Halbduplex und CSMA/CD. Switch bedeutet Vollduplex.' },
        { voice: 'b', text: 'Die Geräteart verrät also den Modus.' },
        { voice: 'a', text: 'Im Kern ja. Und das taucht bei Schicht zwei nochmal auf, insofern lohnt es sich gleich doppelt.' }
      ]
    },

    /* ---------------------------------------------------------------- 07 */
    {
      id: 'topologien',
      titel: 'Netzwerktopologien',
      kurz: 'Bus, Ring, Stern, Vermascht',
      segments: [
        { voice: 'a', text: 'Wir wissen jetzt, in welche Richtungen gesendet wird. Was noch fehlt, ist die Anordnung: wie sind Geräte und Verbindungen zueinander aufgestellt?' },
        { voice: 'b', text: 'Die Netzwerktopologien. Vier Grundformen, und bei jeder gibt es einen klaren Vorteil und einen klaren Nachteil.' },
        { voice: 'a', text: 'Genau dieses Gegensatzpaar wird in Prüfungen abgefragt. Also merk dir immer beides zusammen.' },
        { voice: 'b', text: 'Fangen wir mit dem Bus an. Vorteil: wenig Kabel, günstige Installation.' },
        { voice: 'a', text: 'Nachteil: ein Kabelbruch legt das gesamte Segment lahm, und alles hängt in einer gemeinsamen Kollisionsdomäne.' },
        { voice: 'b', text: 'Gibt es das heute überhaupt noch irgendwo?' },
        { voice: 'a', text: 'In reiner Form praktisch nicht mehr. Historisch war das bei 10BASE2- und 10BASE5-Koaxialnetzen im Einsatz.' },
        { voice: 'b', text: 'Also reine Prüfungsgeschichte?' },
        { voice: 'a', text: 'Das wäre zu kurz gegriffen. Logisch lebt das Bus-Prinzip weiter, überall dort, wo ein Medium gemeinsam genutzt wird. Klassisches WLAN zum Beispiel, oder alte Hub-Segmente.' },
        { voice: 'b', text: 'Da schließt sich der Kreis zum geteilten Medium von vorhin. Weiter zum Ring.' },
        { voice: 'a', text: 'Vorteil: definierter Zugriff über ein Token, dadurch keine Kollisionen im ursprünglichen Sinn. Nachteil: ein Bruch kann den ganzen Ring stören.' },
        { voice: 'b', text: 'Lässt sich das nicht absichern?' },
        { voice: 'a', text: 'Doch, mit einem Dual-Ring wie bei FDDI. Das ist die Ausnahme von der Regel.' },
        { voice: 'b', text: 'Und wo lief der Ring in der Praxis?' },
        { voice: 'a', text: 'Token Ring nach IEEE 802.5 und FDDI, in älteren Unternehmens- und Backbone-Netzen. Heute weitgehend durch Stern-Ethernet abgelöst. Das Grundprinzip überlebt aber in manchen Industrial-Ethernet-Ringtopologien mit Redundanzprotokollen.' },
        { voice: 'b', text: 'Damit sind wir bei der Topologie, die vermutlich überall verbaut ist: dem Stern. Heute der Standard.' },
        { voice: 'a', text: 'Vorteil: der Ausfall eines Kabels betrifft nur ein einziges Gerät, und das Netz ist einfach erweiterbar.' },
        { voice: 'b', text: 'Und der Haken?' },
        { voice: 'a', text: 'Das zentrale Gerät, also der Switch, ist ein Single Point of Failure. Fällt der aus, steht alles.' },
        { voice: 'b', text: 'Das beschreibt im Grunde jedes Büro.' },
        { voice: 'a', text: 'So sieht die Praxis aus: ein Patchkabel von jedem Endgerät zu einem zentralen Switch im Serverraum oder Verteilerschrank. Zuhause nicht anders.' },
        { voice: 'b', text: 'Bleibt die vierte Form, die vermaschte Topologie.' },
        { voice: 'a', text: 'Vorteil: sehr hohe Redundanz und Ausfallsicherheit, viele alternative Wege. Nachteil: hoher Verkabelungs- und Kostenaufwand.' },
        { voice: 'b', text: 'Wie hoch ist hoch? Gibt es dazu eine Formel?' },
        { voice: 'a', text: 'Es gibt eine, und die wird gerne als Rechenaufgabe gestellt. Bei Vollvermaschung brauchst du n mal n minus eins, geteilt durch zwei Verbindungen.' },
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
        { voice: 'b', text: 'Der Switch ist jetzt zweimal gefallen, gehört aber gar nicht hierher. Klären wir also, welche Geräte tatsächlich auf Schicht eins sitzen.' },
        { voice: 'a', text: 'Genau drei. Und die Liste ist vor allem deshalb wertvoll, weil alles, was nicht draufsteht, eben nicht auf Schicht eins gehört.' },
        { voice: 'b', text: 'Das erste ist der Hub. Er verteilt ein eingehendes Signal elektrisch an alle Ports, ohne jedes Verständnis von Adressen.' },
        { voice: 'a', text: 'Ohne jedes, wörtlich genommen.' },
        { voice: 'b', text: 'An alle Ports? Auch an die, für die es gar nicht bestimmt ist?' },
        { voice: 'a', text: 'Er weiß es ja nicht besser. Die Folge: alle Ports bilden eine gemeinsame Kollisionsdomäne. Deshalb ist der Hub heute durch Switches abgelöst.' },
        { voice: 'b', text: 'Nummer zwei ist der Repeater.' },
        { voice: 'a', text: 'Er verstärkt beziehungsweise regeneriert ein schwaches Signal, um die Reichweite über die Grenze des Mediums hinaus zu verlängern.' },
        { voice: 'b', text: 'Versteht der, was er da weiterreicht?' },
        { voice: 'a', text: 'Kein bisschen. Er macht das Signal nur wieder sauber, der Inhalt ist ihm völlig egal.' },
        { voice: 'b', text: 'Und das dritte Gerät?' },
        { voice: 'a', text: 'Der Medienkonverter. Er wandelt zwischen Medientypen, typischerweise Kupfer über RJ45 auf LWL.' },
        { voice: 'b', text: 'Verändert der die Daten dabei?' },
        { voice: 'a', text: 'Nein, und das ist ein wichtiger Punkt. Er übersetzt nur die physikalische Form, inhaltlich bleibt alles unangetastet.' },
        { voice: 'b', text: 'Wenn ich das zusammenziehe: alle drei sind stur. Keines dieser Geräte weiß, wer sendet oder wer empfangen soll.' },
        { voice: 'a', text: 'Das ist die Merkhilfe, ja. Sturheit als Erkennungszeichen.' },
        { voice: 'b', text: 'Und sobald eines das doch weiß?' },
        { voice: 'a', text: 'Dann ist es kein Schicht-eins-Gerät mehr. Ein Switch wertet MAC-Adressen aus, damit ist er raus aus dieser Liste.' }
      ]
    },

    /* ---------------------------------------------------------------- 09 */
    {
      id: 'standards',
      titel: 'Ethernet-Standards IEEE 802.3',
      kurz: 'Von 10BASE-T bis 10GBASE-T',
      segments: [
        { voice: 'a', text: 'Bevor wir zu den Standards kommen, sollten wir eine Abkürzung klären, die ständig auftaucht. Was steckt hinter IEEE?' },
        { voice: 'b', text: 'Institute of Electrical and Electronics Engineers. Ein internationales Gremium, das unter anderem die 802er-Normenfamilie definiert.' },
        { voice: 'a', text: 'Und welche davon sollte man kennen?' },
        { voice: 'b', text: 'Vor allem zwei: 802.3 ist Ethernet, also kabelgebunden. 802.11 ist WLAN, also Funk.' },
        { voice: 'a', text: 'Steht also irgendwo IEEE 802 Punkt irgendwas, ist immer ein von diesem Gremium festgelegter Standard gemeint. Mehr Geheimnis steckt da nicht dahinter.' },
        { voice: 'b', text: 'Dann zu den konkreten Ethernet-Standards.' },
        { voice: 'a', text: '10BASE-T: zehn Megabit pro Sekunde über Kupfer ab Cat drei.' },
        { voice: 'b', text: 'Eine Stufe höher?' },
        { voice: 'a', text: '100BASE-TX: hundert Megabit pro Sekunde, bekannt als Fast Ethernet, über Kupfer in Cat fünf.' },
        { voice: 'b', text: 'Dann kommt der Gigabit-Bereich.' },
        { voice: 'a', text: '1000BASE-T: ein Gigabit pro Sekunde über Kupfer ab Cat fünf e. Und 10GBASE-T: zehn Gigabit pro Sekunde über Kupfer ab Cat sechs a.' },
        { voice: 'b', text: 'Moment, Cat sechs a. Das hatten wir vorhin schon einmal.' },
        { voice: 'a', text: 'Und jetzt schließt sich der Kreis. Deshalb war die Unterscheidung zwischen Cat sechs und Cat sechs a vorhin so wichtig. Die Standards bauen direkt darauf auf.' },
        { voice: 'b', text: 'Bleiben die Glasfaser-Varianten.' },
        { voice: 'a', text: 'Zwei sollte man kennen. 1000BASE-SX: ein Gigabit pro Sekunde über LWL Multimode, für kurze Strecken. Das S steht für short.' },
        { voice: 'b', text: 'Dann ist L vermutlich long.' },
        { voice: 'a', text: 'Guter Riecher. 1000BASE-LX: ein Gigabit pro Sekunde über LWL Singlemode, für lange Strecken. Über dieses Buchstabenpaar lassen sich Multimode und Singlemode zuverlässig merken.' },
        { voice: 'b', text: 'Gibt es eine Systematik hinter diesen Namen generell?' },
        { voice: 'a', text: 'Eine sehr hilfreiche sogar. Die Zahl vorne ist die Geschwindigkeit, BASE steht für Basisbandübertragung. Und was hinten steht, verrät dir das Medium.' },
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
        { voice: 'b', text: 'So viel zur Theorie. Kommen wir zu dem Teil, der einem im Job vermutlich am häufigsten begegnet: was geht auf Schicht eins in der Praxis schief?' },
        { voice: 'a', text: 'Sechs typische Fehlerquellen. In Prüfungen kommt das gerne als Fehlersuche-Aufgabe.' },
        { voice: 'b', text: 'Die erste ist die Dämpfung. Das Signal wird über die Distanz schwächer.' },
        { voice: 'a', text: 'Und bei Kupfer stärker ausgeprägt als bei Lichtwellenleitern.' },
        { voice: 'b', text: 'Womit sich erklärt, warum Glasfaser die langen Strecken übernimmt.' },
        { voice: 'a', text: 'Einer der Hauptgründe, ja. Zweite Fehlerquelle: Kabelbruch oder Wackelkontakt.' },
        { voice: 'b', text: 'Wie häufig ist das wirklich?' },
        { voice: 'a', text: 'Das ist meist die häufigste reale Fehlerursache überhaupt. Und oft rein mechanisch: ein Knick, eine Zugbelastung. Nichts Exotisches.' },
        { voice: 'b', text: 'Also erst ans Kabel denken, bevor man kompliziert wird.' },
        { voice: 'a', text: 'Ein Reflex, der dir viel Zeit spart. Dritte Quelle: elektromagnetische Störungen, also Interference und Crosstalk.' },
        { voice: 'b', text: 'Crosstalk ist das Übersprechen zwischen benachbarten Adernpaaren, richtig?' },
        { voice: 'a', text: 'So ist es. Dazu kommen externe Störquellen wie Motoren oder Leuchtstoffröhren in der Nähe von Kupferkabeln.' },
        { voice: 'b', text: 'Leuchtstoffröhren hätte ich jetzt nicht auf dem Zettel gehabt.' },
        { voice: 'a', text: 'Ist trotzdem ein Klassiker. Vierte Fehlerquelle: das falsche Kabel für die Strecke. Etwa Cat fünf e für zehn Gigabit pro Sekunde eingesetzt.' },
        { voice: 'b', text: 'Oder schlicht zu lang?' },
        { voice: 'a', text: 'Auch das, eine Kabellänge über die Hundert-Meter-Grenze hinaus. Beides kommt in der Praxis ständig vor.' },
        { voice: 'b', text: 'Bleiben zwei. Die fünfte?' },
        { voice: 'a', text: 'Verschmutzte oder beschädigte LWL-Stecker. Da unterschätzen viele, wie empfindlich das ist.' },
        { voice: 'b', text: 'Wie empfindlich denn?' },
        { voice: 'a', text: 'Schon kleinste Verunreinigungen an der Faserendfläche verschlechtern die Signalqualität spürbar. Ein Fingerabdruck reicht.' },
        { voice: 'b', text: 'Und die sechste?' },
        { voice: 'a', text: 'Defekte Transceiver beziehungsweise SFP-Module. Wichtig dabei: Modul und Kabeltyp müssen zusammenpassen.' },
        { voice: 'b', text: 'Also kein Multimode-Modul an einer Singlemode-Faser.' },
        { voice: 'a', text: 'Funktioniert nicht. Und das ist ein Fehler, den man beim schnellen Zusammenstecken leicht macht.' },
        { voice: 'b', text: 'Gibt es ein Muster, das bei Fehlersuche-Aufgaben weiterhilft?' },
        { voice: 'a', text: 'Ein sehr brauchbares. Wenn gar nichts geht, denk zuerst an Kabelbruch und Stecker.' },
        { voice: 'b', text: 'Und wenn es nur manchmal hakt?' },
        { voice: 'a', text: 'Wenn es sporadisch oder nur bei hoher Last hakt, denk an Dämpfung, Störungen oder ein unterdimensioniertes Kabel. Damit trennst du die Fälle ziemlich sauber.' }
      ]
    },

    /* ---------------------------------------------------------------- 11
       ZUSAMMENFASSUNG — eigenes Kapitel, bewusst vom Übergang getrennt.

       NACHGETRAGEN 18.08.2026 auf Wunsch von ruckG4zz: im Piloten war die
       Kurzübersicht nur ein Dreizeiler, der sofort in die Brücke zur
       nächsten Schicht überging — als Abschluss hat sich das nicht
       angefühlt. Jetzt ist es ein eigenständiger, anspringbarer Block
       ("fass zusammen" / "Zusammenfassung"), der vor einer Prüfung auch
       allein gehört werden kann.

       Inhalt = ausschliesslich Fakten, die in den Kapiteln davor bereits
       gesagt wurden. Es kommt nichts Neues dazu, es wird nur verdichtet.
       Grundlage ist die "Kurzübersicht Layer 1" der Enzyklopädie.
       ---------------------------------------------------------------- */
    {
      id: 'zusammenfassung',
      titel: 'Zusammenfassung Layer 1',
      kurz: 'Alles Wichtige auf einen Schlag',
      segments: [
        { voice: 'a', text: 'Damit haben wir Schicht eins komplett durch. Nehmen wir uns kurz Zeit und ziehen zusammen, was wirklich hängen bleiben sollte.' },
        { voice: 'b', text: 'Fangen wir beim Kern an. Die Aufgabe: rohe Bits über ein physisches Medium übertragen. Als elektrische Signale, als Lichtimpulse oder als Funkwellen.' },
        { voice: 'a', text: 'Und mindestens genauso wichtig, was sie nicht tut: keine Adressen, keine Frames, keine Fehlerkorrektur.' },
        { voice: 'b', text: 'Dazu der Prüfstein für Zuordnungsaufgaben: Adresse, Anfang und Ende, Fehlererkennung. Taucht eines davon auf, bist du über Schicht eins.' },
        { voice: 'a', text: 'Die Dateneinheit ist das Bit, im TCP/IP-Modell der Netzzugang, Verbindungstyp Punkt zu Punkt.' },
        { voice: 'b', text: 'Weiter mit der Ausdehnung. Von klein nach gross: BAN, PAN, LAN und WLAN, CAN, MAN, WAN, GAN.' },
        { voice: 'a', text: 'Und der eigentliche Merkpunkt dahinter: die Kategorien stecken ineinander. Ein CAN ist eine Handvoll LANs, ein WAN verbindet MANs und CANs.' },
        { voice: 'b', text: 'Dann die Medien. Bei Kupfer die Kategorien: Cat fünf e ein Gigabit pro Sekunde über hundert Meter.' },
        { voice: 'a', text: 'Cat sechs schafft zehn Gigabit nur bis etwa siebenunddreissig bis fünfundfünfzig Meter, Cat sechs a die vollen zehn Gigabit über hundert Meter. Das ist die Falle.' },
        { voice: 'b', text: 'Bei Glasfaser: Multimode mit fünfzig zu hundertfünfundzwanzig Mikrometer bis etwa fünfhundertfünfzig Meter, Singlemode mit neun zu hundertfünfundzwanzig für Kilometer.' },
        { voice: 'a', text: 'Kleiner Kern, grosse Reichweite. Und die Stecker: RJ45 bei Kupfer, LC, SC und ST bei Glasfaser.' },
        { voice: 'b', text: 'Die Verkabelung in drei Ebenen. Primärbereich vom Standortverteiler zum Gebäudeverteiler, Singlemode.' },
        { voice: 'a', text: 'Sekundärbereich vom Gebäudeverteiler zum Etagenverteiler, Cat sechs a oder Multimode. Tertiärbereich vom Etagenverteiler zur Anschlussdose, Cat sechs a.' },
        { voice: 'b', text: 'Und der Hinweis, der in Prüfungen Gold wert ist: fragt eine Aufgabe nach Primär-, Sekundär- oder Tertiärbereich, bist du garantiert auf Schicht eins.' },
        { voice: 'a', text: 'Die Übertragungsmodi: Simplex nur in eine Richtung, Halbduplex in beide aber nicht gleichzeitig, Vollduplex in beide gleichzeitig.' },
        { voice: 'b', text: 'Die Topologien: Bus, Stern, Ring und Mesh — jeweils mit ihren Vor- und Nachteilen und dem typischen Praxisbeispiel.' },
        { voice: 'a', text: 'Die Geräte dieser Schicht sind Hub, Repeater und Medienkonverter. Alle drei ohne jedes Adressverständnis.' },
        { voice: 'b', text: 'Und zum Schluss die Fehlerquellen: Kabelbruch und Stecker, wenn gar nichts geht. Dämpfung, Störungen oder ein unterdimensioniertes Kabel, wenn es nur manchmal hakt.' },
        { voice: 'a', text: 'Das ist Schicht eins. Rohe Bits über ein Medium, kein Adressbegriff, dazu alle Topologie- und Verkabelungsfragen.' },
        { voice: 'b', text: 'Wenn du das sitzen hast, kannst du weitergehen. Und genau das machen wir jetzt.' }
      ]
    },

    /* ---------------------------------------------------------------- 12 */
    {
      id: 'uebergang',
      titel: 'Übergang zu Schicht 2',
      kurz: 'Was Schicht 1 offen lässt',
      segments: [
        { voice: 'b', text: 'Dann schlagen wir zum Abschluss die Brücke nach oben. Wir haben jetzt einen Strom aus Bits. Was fehlt daran noch?' },
        { voice: 'a', text: 'Eine ganze Menge. Wo fängt eine Nachricht an, wo hört sie auf? Wer im lokalen Netz hat gesendet, für wen ist sie bestimmt? War die Übertragung überhaupt fehlerfrei?' },
        { voice: 'b', text: 'Und Schicht eins kann davon nichts beantworten.' },
        { voice: 'a', text: 'Keine einzige dieser Fragen. Sie kennt weder Adressen noch Anfang und Ende. Genau hier setzt Schicht zwei an.' },
        { voice: 'b', text: 'Die dann was anders macht?' },
        { voice: 'a', text: 'Sie schneidet aus dem Bitstrom klar abgegrenzte Rahmen, also Frames. Sie versieht sie mit MAC-Adressen für Absender und Ziel. Und sie hängt eine Prüfsumme an, um Übertragungsfehler zu erkennen.' },
        { voice: 'b', text: 'Aus bedeutungslosen Bits wird also etwas Adressierbares.' },
        { voice: 'a', text: 'Schöner kann man es kaum zusammenfassen. Weiter geht es dann mit der Sicherungsschicht.' },
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

   GEMEINSAM FUER ALLE SCHICHTEN (seit 18.08.2026, Ausweitung auf Layer 2
   und 3): Dieser Block liegt bewusst weiterhin in content-l1.js und wird
   von allen Schichten mitbenutzt — eine Quelle, keine drei Kopien.
   Deshalb steht hier nirgends mehr fest "Layer eins": der Platzhalter
   {schicht} wird von app.js mit der gerade laufenden Schicht gefuellt.
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

  /* A muss ehrlich passen — kein Treffer im Register der laufenden Schicht.
     {schicht} wird von app.js gefuellt ("Layer eins", "Layer zwei", ...). */
  keinTreffer: [
    'Ehrlich gesagt: dazu haben wir in {schicht} nichts Passendes. Das gehört vermutlich in eine andere Schicht.',
    'Da muss ich passen. In {schicht} kommt das nicht vor. Gut möglich, dass es woanders auftaucht.',
    'Das können wir hier nicht sauber beantworten. In {schicht} steht dazu nichts. Ich rate lieber nicht.'
  ],

  /* B nimmt den Kein-Treffer-Fall auf */
  keinTrefferAbschluss: [
    'Dann merken wir uns das für später.',
    'Setzen wir das auf die Liste für die anderen Schichten.',
    'Gut, dass du nicht einfach was erfindest.'
  ],

  /* ---------------------------------------------------------------------
     VERWEIS AUF EINE ANDERE SCHICHT (neu 18.08.2026 mit Layer 2 und 3)
     ---------------------------------------------------------------------
     Seit drei Schichten geladen sind, gibt es einen Fall zwischen Treffer
     und Nicht-Treffer: der Begriff kommt in der LAUFENDEN Schicht nicht
     vor, wohl aber in einer anderen.

     Bewusste Entscheidung: es wird trotzdem NICHT quer geantwortet. Der
     Podcast bleibt bei seinem Thema und sagt nur ehrlich, wo die Antwort
     zu finden ist. Sonst wuerde eine Layer-1-Folge unversehens Layer-3-
     Stoff erklaeren, den man an der Stelle noch gar nicht einordnen kann.

     {begriff} und {schicht} werden von app.js gefuellt.
     --------------------------------------------------------------------- */
  andereSchicht: [
    'Das gehört nicht hierher, sondern in {schicht} — Stichwort {begriff}. Dort gehen wir das in Ruhe durch.',
    'Guter Punkt, nur eine Etage daneben: {begriff} behandeln wir in {schicht}.',
    'Dazu sage ich hier bewusst nichts Halbes. {begriff} gehört in {schicht}, da ist es sauber erklärt.'
  ],

  /* B nimmt den Verweis auf und bietet den Wechsel an */
  andereSchichtAbschluss: [
    'Wenn du magst, wechsel oben einfach die Schicht.',
    'Du kannst jederzeit dorthin wechseln, der Stand hier bleibt gespeichert.',
    'Merk es dir für nachher, wir bleiben erst mal hier.'
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

  /* ---------------------------------------------------------------------
     ÜBERLEITUNG AM ENDE EINER SCHICHT (neu 18.08.2026)
     ---------------------------------------------------------------------
     Wird gesprochen, wenn eine Schicht komplett durchgelaufen ist und die
     naechste automatisch anschliesst.

     WARUM AUTOMATISCH UND NICHT PER KNOPF (Vorgabe ruckG4zz): gehoert wird
     unter anderem beim Autofahren. Eine Rueckfrage mit Knopfdruck waere
     dort nicht nur unbequem, sondern schlicht nicht bedienbar — der
     Podcast wuerde einfach verstummen. Deshalb laeuft es von allein
     weiter, angekuendigt statt abgefragt.

     Die Auswahl erfolgt in app.js DETERMINISTISCH ueber den Schicht-Index,
     nicht zufaellig — gleiche Begruendung wie bei den Reaktions-Einwuerfen:
     ein bei jedem Durchlauf anderer Text waere jedes Mal ein neuer Eintrag
     im Zwischenspeicher und muesste neu synthetisiert werden.

     {fertig} und {naechste} sind die Schichtnamen, {thema} der Zusatz
     ("der Sicherungsschicht"). Alle drei werden von app.js gefuellt.
     --------------------------------------------------------------------- */
  schichtwechsel: [
    'Das war {fertig}. Wir machen direkt weiter mit {naechste}, {thema}. Bleib einfach dran.',
    'Damit ist {fertig} abgeschlossen. Ohne Pause weiter zu {naechste}, {thema}.',
    'Und damit sind wir durch mit {fertig}. Es geht nahtlos weiter mit {naechste}, {thema}.'
  ],

  /* B bestätigt einen Kapitelsprung. {kapitel} ersetzt. */
  sprung: [
    'Alles klar, wir springen zu {kapitel}.',
    'Machen wir. Weiter bei {kapitel}.',
    'Gut, dann direkt zu {kapitel}.'
  ],

  /* ---------------------------------------------------------------------
     SOFORT-REAKTION beim Druck auf die Aufnahmetaste
     ---------------------------------------------------------------------
     Wird gesprochen, sobald das Mikrofon angefordert wird — und zwar
     NACHDEM der laufende Satz mitten im Wort abgeschnitten wurde.
     Bewusst sehr kurz: jede Silbe hier ist Wartezeit, bevor die Aufnahme
     wirklich losgeht.
     --------------------------------------------------------------------- */
  mikroAnsage: [
    'Oh, Moment — da kommt eine Frage. Ja bitte?',
    'Warte kurz, da meldet sich jemand. Ja?',
    'Ah, eine Zwischenfrage. Nur zu.',
    'Moment mal, da will jemand was wissen. Bitte.',
    'Halt, kurz stoppen. Was möchtest du wissen?'
  ],

  /* ---------------------------------------------------------------------
     NEUSTART DES KAPITELS ("ich habe den Faden verloren")
     ---------------------------------------------------------------------
     NACHGETRAGEN 18.08.2026: Der Sprachbefehl 'restart' wurde gebaut, der
     zugehoerige Moderations-Baustein aber vergessen — die App lief bis
     hierher auf dem Notnagel-Standardtext aus app.js (genau eine
     Formulierung, jedes Mal dieselbe). Beim Ausbau auf Layer 2 und 3 hat
     die neue Platzhalter-Pruefung in test-matcher.js das aufgedeckt.

     Ton bewusst ohne jeden Vorwurf: den Faden zu verlieren ist beim
     Zuhoeren voellig normal und soll sich nicht wie ein Fehler anfuehlen.
     {kapitel} und {kurz} werden von app.js gefuellt. */
  neustart: [
    'Kein Problem, wir nehmen {kapitel} nochmal von vorn.',
    'Machen wir. Zurück an den Anfang von {kapitel} — es ging um {kurz}.',
    'Passiert. Wir starten {kapitel} nochmal von vorne.',
    'Gern, nochmal von vorn: {kapitel}, {kurz}.'
  ],

  /* Bestätigung auf "kannst du das nochmal wiederholen" */
  wiederholung: [
    'Klar, das nehmen wir nochmal.',
    'Gerne, ich sag das nochmal.',
    'Kein Problem, nochmal von vorn.',
    'Machen wir. Das war der Abschnitt:'
  ],

  /* ---------------------------------------------------------------------
     HEBEL 3 — kurze Reaktions-Einwürfe beim Sprecherwechsel
     ---------------------------------------------------------------------
     Werden dem Segmenttext vorangestellt, damit daraus EINE Audiodatei
     wird (kein zusätzlicher Schnitt, keine zusätzliche Lücke).
     Bewusst sehr kurz und inhaltsleer gehalten: sie sollen den Wechsel
     weich machen, nicht zusätzliche Aussagen einbringen. Damit bleibt
     auch die Regel "kein erfundener Inhalt" gewahrt — hier steht nichts
     Fachliches drin, das nicht aus NEINT1 stammt.
     --------------------------------------------------------------------- */
  reaktionen: [
    'Mhm.',
    'Ah, okay.',
    'Verstehe.',
    'Ja, klar.',
    'Interessant.',
    'Gut.',
    'Aha.',
    'Stimmt.',
    'Okay, ja.',
    'Genau.'
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
