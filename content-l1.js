/* =============================================================================
   FISI-Podcast-App — Inhaltsmodul: NEINT1, Layer 1 (Bitübertragungsschicht)
   -----------------------------------------------------------------------------
   FAKTENQUELLE (einzige Quelle der Wahrheit):
     03 Bereiche/FISI-Umschulung/00_Lernunterstützung/
     03_NEINT1_Netzwerke und Internettechnologien [Grundlagen]/
     NEINT1_OSI_Enzyklopaedie_FINAL.html  ->  Section  id="sec-l1"

   Dieses Skript ist eine ABGELEITETE PRÄSENTATIONSFORM (Hörfassung) dieser
   Section. Es enthält keinerlei erfundene Inhalte: jede Zahl, jede Definition
   und jedes Beispiel steht so in der Enzyklopädie. Ändert sich NEINT1
   inhaltlich, wird diese Datei nachgezogen — sie wird NICHT zur Laufzeit
   aus der HTML geparst (bewusste Entscheidung, siehe Projekt-Notiz).

   Stimmen:  'a' = Stimme A (männlich),  'b' = Stimme B (weiblich)
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
        { voice: 'a', text: 'Willkommen. Wir fangen ganz unten an, auf Schicht 1 des OSI-Modells, der Bitübertragungsschicht. Auf Englisch: Physical Layer.' },
        { voice: 'b', text: 'Ganz unten heißt hier wirklich ganz unten. Beim Empfänger kommt zuerst nichts weiter an als ein physikalisches Signal. Spannungspegel auf Kupfer, Lichtimpulse in der Faser, Funkwellen in der Luft. Mehr ist da erst mal nicht.' },
        { voice: 'a', text: 'Schicht 1 macht daraus einen Strom aus Bits, also aus Nullen und Einsen. Und das war es dann auch schon. Keine Absender, keine Struktur, keine Bedeutung.' },
        { voice: 'b', text: 'Das klingt nach wenig, ist aber genau der Punkt. Diese Schicht hat exakt eine Aufgabe, und sie ist der Startpunkt, von dem aus alles Weitere aufgebaut wird. Merk dir schon mal die Dateneinheit, die PDU dieser Schicht: das Bit.' },
        { voice: 'a', text: 'Im TCP/IP-Modell entspricht das dem Netzzugang. Der Verbindungstyp ist Punkt zu Punkt. Und für die IHK-Prüfung gilt: die Relevanz dieser Schicht ist hoch. Hier wird gerne gefragt.' }
      ]
    },

    /* ---------------------------------------------------------------- 02 */
    {
      id: 'aufgabe',
      titel: 'Aufgabe',
      kurz: 'Was Schicht 1 tut — und was ausdrücklich nicht',
      segments: [
        { voice: 'b', text: 'Also, die Aufgabe im Klartext: Schicht 1 überträgt rohe Bits über ein physisches Medium. Als elektrische Signale, als Lichtimpulse oder als Funkwellen.' },
        { voice: 'a', text: 'Und jetzt kommt der Teil, der in Prüfungen mindestens genauso wichtig ist: was sie nicht tut. Sie hat kein Verständnis von Adressen. Keine Frames. Keine Fehlerkorrektur. Nur reine Signalübertragung.' },
        { voice: 'b', text: 'Wenn du dich in einer Prüfungsaufgabe fragst, ob etwas noch auf Schicht 1 gehört, ist das dein Prüfstein. Sobald irgendwo eine Adresse im Spiel ist, sobald etwas erkennt, wo eine Nachricht anfängt und aufhört, sobald etwas Fehler bemerkt — dann bist du schon mindestens eine Schicht höher.' }
      ]
    },

    /* ---------------------------------------------------------------- 03 */
    {
      id: 'ausdehnung',
      titel: 'Netzwerkausdehnung',
      kurz: 'BAN, PAN, LAN, WLAN, CAN, MAN, WAN, GAN',
      segments: [
        { voice: 'a', text: 'Reden wir über Netzwerkausdehnung, auf Englisch Network Scope. Dahinter steckt eine simple Frage: wie weit reicht ein Netz? Danach werden Netze in Kategorien einsortiert, und die gehen von winzig bis weltumspannend.' },
        { voice: 'b', text: 'Wir gehen von klein nach groß. Ganz unten steht das BAN, das Body Area Network. Reichweite: Zentimeter bis etwa zwei Meter. Typische Vertreter sind Fitness-Tracker und medizinische Sensoren, technisch über Bluetooth Low Energy oder NFC.' },
        { voice: 'a', text: 'Eine Stufe darüber das PAN, das Personal Area Network. Bis etwa zehn Meter. Das klassische Beispiel: dein Smartphone und deine Bluetooth-Kopfhörer.' },
        { voice: 'b', text: 'Dann kommt das LAN, das Local Area Network. Zehn Meter bis mehrere hundert Meter. Das ist dein Büro- oder Heimnetz, mit Servern und Switches.' },
        { voice: 'a', text: 'Das WLAN, also Wireless LAN, ist die funkbasierte Variante davon. Dreißig bis hundert Meter je Access Point. Und ein wichtiger Unterschied: statt des Kabelverfahrens arbeitet es mit CSMA/CA.' },
        { voice: 'b', text: 'Weiter zum CAN, dem Campus Area Network. Ein bis fünf Kilometer. Da geht es um mehrere LANs auf einem gemeinsamen Uni- oder Firmengelände.' },
        { voice: 'a', text: 'Das MAN, das Metropolitan Area Network, deckt fünf bis hundert Kilometer ab. Also ein Netz innerhalb einer Stadt oder Region.' },
        { voice: 'b', text: 'Das WAN, das Wide Area Network, geht von hundert bis mehrere tausend Kilometer. Es verbindet LANs und MANs über Länder und Kontinente hinweg. Denk an das Internet-Backbone.' },
        { voice: 'a', text: 'Und ganz oben das GAN, das Global Area Network. Weltweit. Es verbindet WANs global — das Internet selbst ist das Beispiel.' },
        { voice: 'b', text: 'Und jetzt das, was du dir wirklich merken solltest, weil es die ganze Tabelle auf einen Satz eindampft: die Kategorien sind ineinander verschachtelt. BAN steckt in PAN, PAN in LAN, LAN in CAN, CAN in MAN, MAN in WAN, WAN in GAN.' },
        { voice: 'a', text: 'Jede größere Kategorie besteht also aus mehreren kleineren. Ein CAN ist nichts anderes als mehrere verbundene LANs. Ein WAN verbindet mehrere MANs und CANs. Wenn du das verstanden hast, musst du die Reichweiten nicht stur auswendig lernen — du kannst sie dir herleiten.' }
      ]
    },

    /* ---------------------------------------------------------------- 04 */
    {
      id: 'medien',
      titel: 'Übertragungsmedien',
      kurz: 'Kupfer, Lichtwellenleiter, Funk — und die Stecker dazu',
      segments: [
        { voice: 'b', text: 'Kommen wir zu den Übertragungsmedien. Also zu der Frage: worüber laufen die Bits eigentlich physisch?' },
        { voice: 'a', text: 'Erstens: Kupfer, in Form von Twisted-Pair-Kabeln. Das sind verdrillte Adernpaare. Du findest die Abkürzungen UTP für ungeschirmt und STP für geschirmt.' },
        { voice: 'b', text: 'Bei Kupfer entscheidet die Kategorie über Geschwindigkeit und Reichweite, und hier lohnt sich Genauigkeit, weil die IHK genau da nachhakt. Cat 5e schafft ein Gigabit pro Sekunde über hundert Meter.' },
        { voice: 'a', text: 'Cat 6 schafft ebenfalls ein Gigabit pro Sekunde bis hundert Meter. Aber: zehn Gigabit pro Sekunde nur bis etwa siebenunddreißig bis fünfundfünfzig Meter, je nach Störumgebung. Festgelegt ist das in IEEE 802.3an.' },
        { voice: 'b', text: 'Und Cat 6a schafft die vollen zehn Gigabit pro Sekunde über die kompletten hundert Meter. Das ist der Unterschied, auf den es ankommt: Cat 6 bricht bei zehn Gigabit früh ein, Cat 6a nicht.' },
        { voice: 'a', text: 'Zweitens: Lichtwellenleiter, kurz LWL. Davon gibt es zwei Sorten, und die musst du auseinanderhalten können.' },
        { voice: 'b', text: 'LWL Multimode, auf Englisch MM fiber. Lichtquelle ist eine LED oder ein VCSEL. Gedacht für kurze bis mittlere Strecken, bis etwa fünfhundertfünfzig Meter. Der Kerndurchmesser liegt bei fünfzig zu hundertfünfundzwanzig Mikrometer. Ältere Kabel sind meist orange, moderne OM3- und OM4-Kabel meist aqua beziehungsweise türkis.' },
        { voice: 'a', text: 'LWL Singlemode, englisch SM fiber. Lichtquelle ist ein Laser. Für lange Strecken im Kilometerbereich. Kerndurchmesser: neun zu hundertfünfundzwanzig Mikrometer, also deutlich kleiner. Farbe meist gelb.' },
        { voice: 'b', text: 'Kleine Eselsbrücke für die Zahlen: der kleinere Kern gehört zur größeren Reichweite. Neun Mikrometer, Singlemode, Kilometer. Fünfzig Mikrometer, Multimode, ein paar hundert Meter.' },
        { voice: 'a', text: 'Drittens: Funk, also Wireless. Elektromagnetische Wellen, WLAN auf zwei Komma vier, fünf oder sechs Gigahertz. Zwei Eigenschaften solltest du im Kopf haben: es ist störanfällig, und es ist ein geteiltes Medium.' },
        { voice: 'b', text: 'Und die Stecker, weil das gerne abgefragt wird: bei Kupfer ist es RJ45. Bei Lichtwellenleitern hast du LC, SC und ST. LC ist heute der Standard in Rechenzentren, weil er den kleineren Formfaktor hat.' }
      ]
    },

    /* ---------------------------------------------------------------- 05 */
    {
      id: 'verkabelung',
      titel: 'Strukturierte & integrierte Verkabelung',
      kurz: 'Primär-, Sekundär-, Tertiärbereich',
      segments: [
        { voice: 'a', text: 'Jetzt zu einem Thema, das fast garantiert in irgendeiner Form in der Prüfung auftaucht: die strukturierte Verkabelung, englisch structured cabling.' },
        { voice: 'b', text: 'Die Definition: ein einheitliches, herstellerunabhängiges Verkabelungssystem nach genormten Ebenen. Und das Entscheidende daran: es wird unabhängig von der späteren Nutzung geplant. Du legst die Infrastruktur, ohne schon zu wissen, was am Ende genau daran hängt.' },
        { voice: 'a', text: 'Es gibt drei Ebenen. Erste Ebene: der Primärbereich, auch Campus- oder Geländeverkabelung. Er verbindet den Standortverteiler, kurz SV, mit dem Gebäudeverteiler, kurz GV. Kabeltyp: Glasfaser Singlemode, wegen der großen Distanzen. Das ist ausdrücklich IHK-relevant.' },
        { voice: 'b', text: 'Zweite Ebene: der Sekundärbereich, die Steigbereichsverkabelung. Sie verbindet den Gebäudeverteiler mit dem Etagenverteiler, kurz EV. Hier kommt Kupfer in Cat 6a zum Einsatz, bei größeren Steigstrecken auch LWL Multimode.' },
        { voice: 'a', text: 'Dritte Ebene: der Tertiärbereich, die Etagenverkabelung. Sie verbindet den Etagenverteiler mit der Anschlussdose. Im Regelfall Kupfer in Cat 6a, Glasfaser nur bei Sonderanwendungen, zum Beispiel bei der Anbindung eines Serverraums.' },
        { voice: 'b', text: 'Und dahinter steckt eine Faustregel, die dir die ganze Tabelle ersetzt: je näher am Endgerät, desto eher Kupfer. Weil es günstiger und für kurze Strecken völlig ausreichend ist.' },
        { voice: 'a', text: 'Und umgekehrt: je größer die Distanz und je mehr Backbone, desto eher Glasfaser. Wegen der Dämpfung und wegen der Bandbreite. Wenn du das verinnerlicht hast, kannst du dir die Ebenen herleiten statt sie auswendig zu lernen.' },
        { voice: 'b', text: 'Ein Begriff wird gerne damit verwechselt: die integrierte Verkabelung, englisch integrated cabling. Die ist etwas anderes. Da trägt ein einziges Kabelsystem mehrere Dienste gemeinsam.' },
        { voice: 'a', text: 'Also zum Beispiel Daten, Telefonie und Gebäudeleittechnik über dieselbe Infrastruktur, statt für jeden Dienst getrennt zu verkabeln. Kurz gesagt: strukturiert bezieht sich auf die genormten Ebenen, integriert auf das gemeinsame Tragen mehrerer Dienste.' },
        { voice: 'b', text: 'Noch ein Praxispunkt zur Ausfallsicherheit. Im reinen Sterntyp hängt jede Etage einzeln am Gebäudeverteiler. Fällt die Steigleitung zu einer Etage aus, ist genau diese Etage vom Netz getrennt.' },
        { voice: 'a', text: 'Mit einer Etagenkopplung baust du zusätzliche Backup-Verbindungen zwischen benachbarten Etagenverteilern ein, also Erdgeschoss zu erstem Obergeschoss zu zweitem Obergeschoss. Fällt dann die Steigleitung einer Etage zum Gebäudeverteiler aus, bleibt sie über die Nachbaretage erreichbar.' },
        { voice: 'b', text: 'Keine Etage geht komplett verloren. Das kostet zusätzliches Kabel, erhöht aber die Ausfallsicherheit spürbar. Genau so eine Abwägung — Kosten gegen Verfügbarkeit — ist typisches Prüfungsmaterial.' }
      ]
    },

    /* ---------------------------------------------------------------- 06 */
    {
      id: 'modi',
      titel: 'Übertragungsmodi',
      kurz: 'Simplex, Halbduplex, Vollduplex',
      segments: [
        { voice: 'a', text: 'Übertragungsmodi, englisch Transmission Modes. Drei Stück, schnell erklärt, und mit Beispielen, die hängen bleiben.' },
        { voice: 'b', text: 'Simplex: nur eine Richtung, fest. Radio und Fernsehausstrahlung. Der Sender sendet, du empfängst, und zurück geht nichts.' },
        { voice: 'a', text: 'Halbduplex, englisch Half-Duplex: beide Richtungen, aber nicht gleichzeitig. Das Walkie-Talkie ist das Standardbeispiel — einer redet, der andere hört, dann Wechsel. Technisch relevant: altes Hub-Ethernet mit CSMA/CD arbeitete so.' },
        { voice: 'b', text: 'Vollduplex, englisch Full-Duplex: beide Richtungen gleichzeitig. Modernes Switch-Ethernet und das Telefon. Beide können reden, ohne sich gegenseitig zu blockieren.' },
        { voice: 'a', text: 'Der Zusammenhang, den du dir merken solltest: Hub bedeutet Halbduplex und CSMA/CD, Switch bedeutet Vollduplex. Das taucht später bei Schicht 2 wieder auf.' }
      ]
    },

    /* ---------------------------------------------------------------- 07 */
    {
      id: 'topologien',
      titel: 'Netzwerktopologien',
      kurz: 'Bus, Ring, Stern, Vermascht',
      segments: [
        { voice: 'b', text: 'Netzwerktopologien. Also: wie sind Geräte und Verbindungen im Netz angeordnet? Vier Grundformen, jeweils mit einem klaren Vorteil und einem klaren Nachteil. Genau dieses Gegensatzpaar wird abgefragt.' },
        { voice: 'a', text: 'Bus. Vorteil: wenig Kabel, günstige Installation. Nachteil: ein Kabelbruch legt das gesamte Segment lahm, und alles hängt in einer gemeinsamen Kollisionsdomäne.' },
        { voice: 'b', text: 'In der Praxis war das historisch bei 10BASE2- und 10BASE5-Koaxialnetzen im Einsatz. Heute in reiner Form praktisch verschwunden. Aber: logisch lebt das Bus-Prinzip weiter, überall dort, wo ein Medium gemeinsam genutzt wird — klassisches WLAN zum Beispiel, oder alte Hub-Segmente.' },
        { voice: 'a', text: 'Ring. Vorteil: definierter Zugriff über ein Token, dadurch keine Kollisionen im ursprünglichen Sinn. Nachteil: ein Bruch kann den ganzen Ring stören. Ausnahme ist der Dual-Ring, wie bei FDDI.' },
        { voice: 'b', text: 'Praxis: Token Ring nach IEEE 802.5 und FDDI in älteren Unternehmens- und Backbone-Netzen. Heute weitgehend durch Stern-Ethernet abgelöst. Das Grundprinzip überlebt aber in manchen Industrial-Ethernet-Ringtopologien mit Redundanzprotokollen.' },
        { voice: 'a', text: 'Stern. Das ist heute der Standard. Vorteil: der Ausfall eines Kabels betrifft nur ein einziges Gerät, und das Netz ist einfach erweiterbar. Nachteil: das zentrale Gerät, also der Switch, ist ein Single Point of Failure.' },
        { voice: 'b', text: 'Praxis ist schlicht der Normalfall in jedem Büro und jedem Zuhause: ein Patchkabel von jedem Endgerät zu einem zentralen Switch im Serverraum oder Verteilerschrank.' },
        { voice: 'a', text: 'Vermascht, englisch Mesh. Vorteil: sehr hohe Redundanz und Ausfallsicherheit, viele alternative Wege. Nachteil: hoher Verkabelungs- und Kostenaufwand. Bei Vollvermaschung brauchst du n mal n minus eins, geteilt durch zwei Verbindungen.' },
        { voice: 'b', text: 'Die Formel solltest du dir merken, die wird gerne als Rechenaufgabe gestellt. Bei zehn Geräten sind das zehn mal neun geteilt durch zwei, also fünfundvierzig Verbindungen.' },
        { voice: 'a', text: 'Praxis für Mesh: Rechenzentrums-Backbones, WAN-Verbindungen zwischen Standorten, und im Kleinen die Mesh-WLAN-Systeme im Heimnetz, wo mehrere Access Points sich gegenseitig als Fallback-Pfade nutzen.' },
        { voice: 'b', text: 'Und jetzt der Punkt, an dem in Prüfungen die meisten stolpern: physisch ist fast jedes LAN heute eine Stern-Topologie, weil jedes Kabel zum Switch geht. Logisch kann trotzdem etwas anderes laufen, zum Beispiel ein emulierter Bus.' },
        { voice: 'a', text: 'Die IHK fragt physische und logische Topologie gerne getrennt ab. Wenn in der Aufgabe das Wort logisch steht, ist nicht die Verkabelung gemeint, sondern wie sich die Kommunikation verhält.' }
      ]
    },

    /* ---------------------------------------------------------------- 08 */
    {
      id: 'geraete',
      titel: 'Geräte auf Schicht 1',
      kurz: 'Hub, Repeater, Medienkonverter',
      segments: [
        { voice: 'b', text: 'Geräte auf Schicht 1. Es sind genau drei, und die Liste ist deshalb so wertvoll, weil alles, was nicht draufsteht, eben nicht auf Schicht 1 gehört.' },
        { voice: 'a', text: 'Der Hub. Er verteilt ein eingehendes Signal elektrisch an alle Ports. Ohne jedes Verständnis von Adressen. Folge: alle Ports bilden eine gemeinsame Kollisionsdomäne. Heute durch Switches abgelöst.' },
        { voice: 'b', text: 'Der Repeater. Er verstärkt beziehungsweise regeneriert ein schwaches Signal, um die Reichweite über die Grenze des Mediums hinaus zu verlängern. Er versteht nichts vom Inhalt, er macht das Signal nur wieder sauber.' },
        { voice: 'a', text: 'Der Medienkonverter. Er wandelt zwischen Medientypen, typischerweise Kupfer über RJ45 auf LWL. Wichtig: er verändert die übertragenen Daten inhaltlich nicht. Er übersetzt nur die physikalische Form.' },
        { voice: 'b', text: 'Und die Merkhilfe dazu: alle drei sind stur. Keines dieser Geräte weiß, wer sendet oder wer empfangen soll. Sobald ein Gerät Adressen auswertet — wie ein Switch mit MAC-Adressen — ist es kein Schicht-1-Gerät mehr.' }
      ]
    },

    /* ---------------------------------------------------------------- 09 */
    {
      id: 'standards',
      titel: 'Ethernet-Standards IEEE 802.3',
      kurz: 'Von 10BASE-T bis 10GBASE-T',
      segments: [
        { voice: 'a', text: 'Ethernet-Standards. Vorher kurz die Abkürzung, die überall auftaucht: IEEE, ausgeschrieben Institute of Electrical and Electronics Engineers.' },
        { voice: 'b', text: 'Das ist ein internationales Gremium, das unter anderem die 802er-Normenfamilie definiert. Die beiden, die du kennen musst: 802.3 ist Ethernet, also kabelgebunden. 802.11 ist WLAN, also Funk. Wenn irgendwo IEEE 802 Punkt irgendwas steht, ist immer ein von diesem Gremium festgelegter Standard gemeint.' },
        { voice: 'a', text: 'Jetzt die konkreten Standards. 10BASE-T: zehn Megabit pro Sekunde über Kupfer ab Cat 3.' },
        { voice: 'b', text: '100BASE-TX: hundert Megabit pro Sekunde, das ist Fast Ethernet, über Kupfer in Cat 5.' },
        { voice: 'a', text: '1000BASE-T: ein Gigabit pro Sekunde, also Gigabit Ethernet, über Kupfer ab Cat 5e.' },
        { voice: 'b', text: '10GBASE-T: zehn Gigabit pro Sekunde, über Kupfer ab Cat 6a. Und jetzt merkst du hoffentlich, wie sich der Kreis zu den Medien schließt — genau deshalb war die Cat-6-gegen-Cat-6a-Unterscheidung vorhin so wichtig.' },
        { voice: 'a', text: 'Zwei Glasfaser-Standards noch. 1000BASE-SX: ein Gigabit pro Sekunde über LWL Multimode, für kurze Strecken. Das S steht für short.' },
        { voice: 'b', text: 'Und 1000BASE-LX: ein Gigabit pro Sekunde über LWL Singlemode, für lange Strecken. L wie long. Über dieses Buchstabenpaar, S und L, kannst du dir Multimode und Singlemode zuverlässig merken.' },
        { voice: 'a', text: 'Und die Systematik generell: die Zahl vorne ist die Geschwindigkeit, BASE steht für Basisbandübertragung, und was hinten steht, verrät dir das Medium. T wie Twisted Pair, also Kupfer. S und L stehen für die Glasfaservarianten.' }
      ]
    },

    /* ---------------------------------------------------------------- 10 */
    {
      id: 'fehler',
      titel: 'Typische Fehlerquellen',
      kurz: 'Was auf Schicht 1 in der Praxis schiefgeht',
      segments: [
        { voice: 'b', text: 'Typische Fehlerquellen auf Schicht 1. Das ist der Teil, der dir später im Praktikum und im Job am häufigsten begegnet — und in Prüfungen als Fehlersuche-Aufgabe.' },
        { voice: 'a', text: 'Erstens: Dämpfung, englisch Attenuation. Das Signal wird über die Distanz schwächer. Bei Kupfer stärker ausgeprägt als bei Lichtwellenleitern. Das ist einer der Gründe, weshalb Glasfaser für lange Strecken bevorzugt wird.' },
        { voice: 'b', text: 'Zweitens: Kabelbruch oder Wackelkontakt. Das ist meist die häufigste reale Fehlerursache überhaupt. Oft rein mechanisch — ein Knick, eine Zugbelastung.' },
        { voice: 'a', text: 'Drittens: elektromagnetische Störungen, also Interference und Crosstalk. Crosstalk ist das Übersprechen zwischen benachbarten Adernpaaren. Dazu kommen externe Störquellen wie Motoren oder Leuchtstoffröhren in der Nähe von Kupferkabeln.' },
        { voice: 'b', text: 'Viertens: das falsche Kabel für die Strecke. Zum Beispiel Cat 5e für zehn Gigabit pro Sekunde eingesetzt. Oder eine Kabellänge, die über die Hundert-Meter-Grenze hinausgeht.' },
        { voice: 'a', text: 'Fünftens: verschmutzte oder beschädigte LWL-Stecker. Und da unterschätzen viele, wie empfindlich das ist — schon kleinste Verunreinigungen an der Faserendfläche verschlechtern die Signalqualität spürbar.' },
        { voice: 'b', text: 'Sechstens: defekte Transceiver beziehungsweise SFP-Module. Wichtig dabei: Modul und Kabeltyp müssen zusammenpassen. Ein Multimode-Modul an einer Singlemode-Faser funktioniert nicht.' },
        { voice: 'a', text: 'Ein Muster, das dir bei Fehlersuche-Aufgaben hilft: wenn gar nichts geht, denk zuerst an Kabelbruch und Stecker. Wenn es sporadisch oder nur bei hoher Last hakt, denk an Dämpfung, Störungen oder ein unterdimensioniertes Kabel.' }
      ]
    },

    /* ---------------------------------------------------------------- 11 */
    {
      id: 'fazit',
      titel: 'Kurzübersicht & Übergang',
      kurz: 'Zusammenfassung und Brücke zu Schicht 2',
      segments: [
        { voice: 'b', text: 'Fassen wir Layer 1 in wenigen Sätzen zusammen. Rohe Bits über ein Medium: Kupfer, Lichtwellenleiter oder Funk. Kein Adressbegriff. Geräte sind Hub, Repeater und Medienkonverter.' },
        { voice: 'a', text: 'Und alle Topologie- und Verkabelungsfragen — strukturiert wie integriert — sind hier verankert. Wenn eine Prüfungsaufgabe nach Primär-, Sekundär- und Tertiärbereich fragt, bist du auf Schicht 1.' },
        { voice: 'b', text: 'Und jetzt der Übergang. Wir haben einen ununterbrochenen Strom aus Bits. Aber: wo fängt eine Nachricht an, wo hört sie auf? Wer im lokalen Netz hat gesendet, für wen ist sie bestimmt? War die Übertragung überhaupt fehlerfrei?' },
        { voice: 'a', text: 'Schicht 1 kann keine dieser Fragen beantworten. Sie kennt weder Adressen noch Anfang und Ende. Genau hier setzt Schicht 2 an.' },
        { voice: 'b', text: 'Sie schneidet aus dem Bitstrom klar abgegrenzte Rahmen, also Frames. Sie versieht sie mit MAC-Adressen für Absender und Ziel. Und sie hängt eine Prüfsumme an, um Übertragungsfehler zu erkennen.' },
        { voice: 'a', text: 'Aus bedeutungslosen Bits wird damit eine adressierbare Einheit. Weiter geht es dann mit der Sicherungsschicht. Für heute bist du mit Layer 1 durch.' }
      ]
    }
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
              wächst mit der Nutzung, ruckG4zz prüft und ergänzt.
     antwort  gesprochene Kurzantwort. Wortlaut aus der NEINT1-Glossar-
              Definition abgeleitet, nichts hinzuerfunden.
   ========================================================================== */

const REGISTER_L1 = [
  /* --- Medien ------------------------------------------------------------ */
  {
    id: 'twistedpair', label: 'Twisted-Pair (Kupfer)', chapter: 'medien',
    aliases: ['twisted pair', 'twistedpair', 'twisted-pair', 'kupferkabel', 'kupfer', 'utp', 'stp', 'u t p', 's t p', 'verdrillt', 'adernpaare', 'cat kabel', 'catkabel'],
    antwort: 'Twisted-Pair ist ein Kupferkabel aus verdrillten Adernpaaren. Reichweite und Geschwindigkeit hängen von der Kategorie ab: Cat 5e schafft ein Gigabit pro Sekunde bis hundert Meter, Cat 6 zehn Gigabit nur bis etwa siebenunddreißig bis fünfundfünfzig Meter, Cat 6a die vollen zehn Gigabit über hundert Meter. UTP ist ungeschirmt, STP ist geschirmt. Der Stecker ist RJ45.'
  },
  {
    id: 'cat', label: 'Kabelkategorien (Cat 5e / 6 / 6a)', chapter: 'medien',
    aliases: ['cat5e', 'cat 5e', 'cat fünf e', 'cat5', 'cat 5', 'cat6', 'cat 6', 'cat sechs', 'cat6a', 'cat 6a', 'cat sechs a', 'cat3', 'cat 3', 'kategorie', 'kabelkategorie'],
    antwort: 'Die Kategorie entscheidet, was ein Kupferkabel leisten kann. Cat 5e: ein Gigabit pro Sekunde über hundert Meter. Cat 6: ein Gigabit bis hundert Meter, aber zehn Gigabit nur bis etwa siebenunddreißig bis fünfundfünfzig Meter je nach Störumgebung, festgelegt in IEEE 802.3an. Cat 6a: volle zehn Gigabit pro Sekunde über hundert Meter.'
  },
  {
    id: 'lwlmm', label: 'LWL Multimode', chapter: 'medien',
    aliases: ['multimode', 'multi mode', 'multi-mode', 'mm fiber', 'mm faser', 'om3', 'om4', 'o m drei', 'o m vier'],
    antwort: 'LWL Multimode ist ein Lichtwellenleiter mit größerem Kerndurchmesser, fünfzig zu hundertfünfundzwanzig Mikrometer. Lichtquelle ist eine LED oder ein VCSEL. Gedacht für kurze bis mittlere Strecken bis etwa fünfhundertfünfzig Meter. Ältere Kabel sind meist orange, moderne OM3- und OM4-Kabel aqua beziehungsweise türkis.'
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
    aliases: ['primärbereich', 'primaerbereich', 'primärbereich', 'primär', 'primaer', 'geländeverkabelung', 'campusverkabelung', 'campus verkabelung', 'standortverteiler', 'sv'],
    antwort: 'Der Primärbereich ist die Campus- beziehungsweise Geländeverkabelung. Er verbindet den Standortverteiler SV mit dem Gebäudeverteiler GV. Kabeltyp ist Glasfaser Singlemode wegen der großen Distanzen. Dieser Punkt ist ausdrücklich IHK-relevant.'
  },
  {
    id: 'sekundaer', label: 'Sekundärbereich', chapter: 'verkabelung',
    aliases: ['sekundärbereich', 'sekundaerbereich', 'sekundär', 'sekundaer', 'steigbereich', 'steigbereichsverkabelung', 'steigleitung', 'gebäudeverteiler', 'gebaeudeverteiler', 'gv'],
    antwort: 'Der Sekundärbereich ist die Steigbereichsverkabelung. Er verbindet den Gebäudeverteiler GV mit dem Etagenverteiler EV. Kabeltyp ist Kupfer in Cat 6a, bei größeren Steigstrecken auch LWL Multimode.'
  },
  {
    id: 'tertiaer', label: 'Tertiärbereich', chapter: 'verkabelung',
    aliases: ['tertiärbereich', 'tertiaerbereich', 'tertiär', 'tertiaer', 'etagenverkabelung', 'etagenverteiler', 'ev', 'anschlussdose'],
    antwort: 'Der Tertiärbereich ist die Etagenverkabelung. Er verbindet den Etagenverteiler EV mit der Anschlussdose. Im Regelfall Kupfer in Cat 6a, Glasfaser nur bei Sonderanwendungen wie der Anbindung eines Serverraums.'
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
    antwort: 'Die vermaschte Topologie, englisch Mesh, bietet sehr hohe Redundanz und Ausfallsicherheit mit vielen alternativen Wegen. Nachteil ist der hohe Verkabelungs- und Kostenaufwand: bei Vollvermaschung brauchst du n mal n minus eins geteilt durch zwei Verbindungen. Praxis: Rechenzentrums-Backbones, WAN-Verbindungen zwischen Standorten und Mesh-WLAN-Systeme im Heimnetz.'
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
    antwort: 'Der Hub ist ein Schicht-1-Gerät, das ein eingehendes Signal elektrisch an alle Ports verteilt, ohne Verständnis von Adressen. Alle Ports bilden eine gemeinsame Kollisionsdomäne. Heute durch Switches abgelöst.'
  },
  {
    id: 'repeater', label: 'Repeater', chapter: 'geraete',
    aliases: ['repeater', 'ripiter', 'verstärker', 'verstaerker', 'signalverstärker'],
    antwort: 'Der Repeater ist ein Schicht-1-Gerät, das ein schwaches Signal verstärkt beziehungsweise regeneriert, um die Reichweite über die Medien-Grenze hinaus zu verlängern.'
  },
  {
    id: 'medienkonv', label: 'Medienkonverter', chapter: 'geraete',
    aliases: ['medienkonverter', 'medien konverter', 'medienkonvertierer', 'medienwandler', 'konverter'],
    antwort: 'Der Medienkonverter ist ein Schicht-1-Gerät, das zwischen Medientypen wandelt, zum Beispiel Kupfer über RJ45 auf LWL — ohne die übertragenen Daten inhaltlich zu verändern.'
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
    antwort: 'Die wichtigsten Ethernet-Standards: 10BASE-T mit zehn Megabit pro Sekunde über Kupfer ab Cat 3. 100BASE-TX mit hundert Megabit, das ist Fast Ethernet, über Cat 5. 1000BASE-T mit einem Gigabit, also Gigabit Ethernet, über Cat 5e. 10GBASE-T mit zehn Gigabit über Cat 6a. Dazu zwei Glasfaser-Varianten: 1000BASE-SX mit einem Gigabit über LWL Multimode für kurze Strecken, und 1000BASE-LX mit einem Gigabit über LWL Singlemode für lange Strecken.'
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
    antwort: 'Typische Fehlerquellen auf Schicht 1 sind: Dämpfung über die Distanz. Kabelbruch oder Wackelkontakt, meist die häufigste reale Ursache und oft mechanisch. Elektromagnetische Störungen und Übersprechen. Das falsche Kabel für die Strecke, etwa Cat 5e für zehn Gigabit oder über hundert Meter Länge. Verschmutzte oder beschädigte LWL-Stecker, wo schon kleinste Verunreinigungen die Signalqualität spürbar verschlechtern. Und defekte Transceiver beziehungsweise SFP-Module, wobei Modul und Kabeltyp zusammenpassen müssen.'
  },

  /* --- Grundlagen -------------------------------------------------------- */
  {
    id: 'aufgabe', label: 'Aufgabe der Schicht 1', chapter: 'aufgabe',
    aliases: ['aufgabe', 'aufgabe von schicht eins', 'was macht schicht 1', 'bitübertragungsschicht', 'bituebertragungsschicht', 'physical layer', 'schicht 1', 'schicht eins', 'layer 1', 'layer eins', 'osi schicht 1'],
    antwort: 'Schicht 1 überträgt rohe Bits, also Nullen und Einsen, als elektrische Signale, Lichtimpulse oder Funkwellen über ein physisches Medium. Sie hat kein Verständnis von Adressen, Frames oder Fehlerkorrektur — nur reine Signalübertragung. Die Dateneinheit ist das Bit, im TCP/IP-Modell entspricht das dem Netzzugang.'
  },
  {
    id: 'bit', label: 'Bit (PDU)', chapter: 'intro',
    aliases: ['bit', 'pdu', 'p d u', 'dateneinheit', 'protokolldateneinheit'],
    antwort: 'Die Dateneinheit, also die PDU der Schicht 1, ist das Bit. Auf dieser Schicht gibt es nichts Größeres — keine Frames, keine Pakete, nur einen Strom aus Nullen und Einsen.'
  },
  {
    id: 'csma', label: 'CSMA/CD und CSMA/CA', chapter: 'modi',
    aliases: ['csma', 'csma cd', 'csma/cd', 'csma ca', 'csma/ca', 'c s m a'],
    antwort: 'CSMA/CD gehört zum alten Hub-Ethernet und arbeitet im Halbduplex-Betrieb. CSMA/CA wird im WLAN eingesetzt, also im funkbasierten LAN, statt des Kabelverfahrens. Beide sind Zugriffsverfahren auf ein geteiltes Medium.'
  }
];

/* Export für Modul-Nutzung (falls später gebündelt wird) */
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { PODCAST_L1, REGISTER_L1 };
}
