# FISI-Podcast-App — OSI - Modell

Hörfassung der NEINT1-Enzyklopädie, Kapitel **Layer 1 (Bitübertragungsschicht)**.
PWA, kostenneutral, ohne Fremdcode.

## Schnellstart (lokal testen)

```
node start-server.js
```

Dann im Browser `http://localhost:8080` öffnen. **localhost** gilt als sicherer
Kontext — das Mikrofon funktioniert hier bereits, ohne dass ein Hosting steht.

Matching-Engine testen:

```
node test-matcher.js
```

## Dateien

| Datei | Zweck |
|---|---|
| `index.html` | Oberfläche + CSS (Dark-Mode, türkise NEINT1-Linie) |
| `content-l1.js` | **Podcast-Skript + Begriffsregister.** Der Inhalt. |
| `matcher.js` | Offline-Erkennung: Befehle, Begriffe, Tie-Breaking |
| `speech.js` | Sprach-Abstraktionsschicht (`speak`/`listen`) |
| `app.js` | Player, Recap, Fortschritt, Frage-Flow |
| `sw.js` / `manifest.webmanifest` | PWA-Hülle |
| `test-matcher.js` | 36 Tests gegen die Matching-Engine |
| `start-server.js` | lokaler Testserver |

## Hosting über GitHub Pages (für das Handy nötig)

Am Handy braucht das Mikrofon **echtes HTTPS**. Über die lokale IP
(`http://192.168.x.x:8080`) bleibt es gesperrt — die Textfrage geht trotzdem.

1. Neues öffentliches Repo anlegen, z.B. `fisi-podcast`
2. Inhalt dieses `app/`-Ordners ins Repo-Root pushen
3. Repo → *Settings* → *Pages* → Source: `main`, Ordner `/ (root)`
4. Nach ein paar Minuten erreichbar unter
   `https://<benutzername>.github.io/fisi-podcast/`
5. Am Handy in Chrome öffnen → Menü → *Zum Startbildschirm hinzufügen*

## Ehrliche Grenzen dieses Piloten

Drei Punkte, die von der ursprünglichen Planung abweichen — nicht kaschiert:

1. **Hintergrundwiedergabe bei gesperrtem Bildschirm ist nicht zuverlässig.**
   Die Web Speech API ist kein Media-Element; Android pausiert sie beim Sperren
   oft. Das eingebaute stille Loop-Audio plus Media Session verbessert die
   Chance und blendet die Mediensteuerung ein, garantiert das Weiterlaufen aber
   **nicht**. Zuverlässig wird das erst mit vorgerenderten Audiodateien
   (Cloud-TTS) — kostenpflichtig, daher bewusst draußen.

2. **Zwei Stimmen hängen an den installierten System-Stimmen.** Sind zwei
   deutsche Stimmen da, werden sie genutzt. Ist nur eine da (auf Android häufig),
   werden die Sprecher ersatzweise über die Tonhöhe unterschieden. Die App sagt
   das im Technik-Check offen an, statt so zu tun als wären es zwei Personen.

3. **Spracherkennung braucht Internet.** Chrome verarbeitet das Audio
   serverseitig (i.d.R. bei Google). Der Rest — Skript, Matching, Fortschritt —
   läuft vollständig offline und lokal.

## Sicherheit

- Mikrofon **nur** per bewusstem Tastendruck, nie Dauerlauschen, kein
  `continuous`-Modus.
- Kein Drittanbieter-Code, keine Analytics, kein SDK. Alles lesbarer Klartext.
- Einziger externer Datenfluss: das Audio der Spracherkennung (Punkt 3 oben).

## Inhaltsregel

Faktenquelle ist ausschließlich `NEINT1_OSI_Enzyklopaedie_FINAL.html`,
Section `sec-l1`. Nichts ist hinzuerfunden. Findet die Engine keinen Treffer,
sagt sie das ehrlich, statt zu raten — der Eskalations-Button zu einer Live-KI
ist sichtbar, aber **inaktiv** (wäre kostenpflichtig, nur nach Freigabe).

Ändert sich NEINT1 inhaltlich, wird `content-l1.js` nachgezogen. Es wird
bewusst **nicht** zur Laufzeit aus der HTML geparst.

---
Erstellt und geprüft durch Claude Opus 4.1 · v1 · 18.08.2026
