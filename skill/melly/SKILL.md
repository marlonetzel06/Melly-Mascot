---
name: melly
description: "Melly – Marlons Pixel-Maskottchen (Creme-Blob im Anzug). Liefert fertige Assets (GIF, PNG, Sprite-Sheet) in 6 Anzug-Kombis, baut neue Posen oder passt bestehende an – als Code, mit Render-Selbstprüfung und Feedback-Schleife. Auslöser: 'Melly', '/melly', 'Maskottchen für den Post', 'Melly winkend/jubelnd/…', 'neue Pose für Melly', 'Melly anpassen', 'Melly exportieren'."
---

# Melly

Quelle der Wahrheit: Repo **`C:\Users\MEtzel\Melly-Mascot`** (GitHub `marlonetzel06/Melly-Mascot`). Alle Befehle dort ausführen. Vorher `BRAND.md` lesen – sie ist verbindlich.

## Aufbau
- `src/model.js` Raster je Ansicht, Palette, `COMBOS` · `src/core.js` Frame-Builder + Bausteine (Augen, Arme, Füße, `walkFrames`) · `src/props.js` Objekte/Effekte
- `src/poses/<id>.js` eine Datei pro Animation: `{ id, title, category, desc, still, frames: (lib) => [...] }` · `src/registry.js` Liste aller Posen
- `node tools/preview.mjs <id|all> [--combo <n|slug>]` → `out/preview/<id>.png` (alle Frames, Weiß + Navy, Index + ms; Standbild orange markiert)
- `node tools/export.mjs <id|all> [--combo all|<n|slug>] [--version v1]` → `dist/<version>/<kombi>/{gif,png,sheet}/`
- `npm run gallery` → http://localhost:8777 (Galerie, Kombi-Umschalter)

## A · Asset liefern
1. Passende Pose in `src/registry.js`/Galerie suchen (Kategorien: Bewegung, Arbeit, Reaktion, Alltag).
2. Liegt sie schon in `dist/`? Sonst `node tools/export.mjs <id> --combo <kombi>`.
3. Pfad zur GIF/PNG ausgeben. GIF = animiert + transparent (LinkedIn, Folien), PNG = Standbild (Karussell), Sheet + JSON = für Video/Motion-Tools.

## B · Neue Pose / Pose anpassen
1. Ähnliche Pose als Vorlage lesen. Neue Datei `src/poses/<id>.js` anlegen **und in `src/registry.js` eintragen** (oder vorhandene Datei ändern).
2. Nur mit Bausteinen + Deltas arbeiten: `frame(mods, ms, { view, dx, dy, headDy, pal })`. Baustein = `(p, S) => …`; `p(x,y,token)` Körper/Objekte, `S` folgt dem nickenden Kopf (Gesicht). Fehlt ein Baustein/Objekt → in `core.js`/`props.js` ergänzen, nicht in der Pose kopieren. Koordinaten siehe unten.
3. **Selbstprüfung (Pflicht):** `node tools/preview.mjs <id>` und das PNG ansehen (bei vielen Frames zusätzlich `--scale 10 --out out/detail`). Gegen die Checkliste in `BRAND.md` prüfen, Probleme selbst beheben, erneut prüfen. Erst dann dem Nutzer zeigen (PNG + Galerie-Link).
4. Feedback umsetzen, bis der Nutzer „passt“ sagt.
5. Export: nur die gewünschte Kombi, sonst alle (`node tools/export.mjs <id>`). Commit/PR nur auf Zuruf: eigener Branch (`feat: Pose <id>` / `fix: Pose <id> …`), PR auf GitHub, **nie selbst mergen**, `dist/` mit committen. Die globalen Regeln des Nutzers (Entwicklungszyklus, Test im frischen Subagent) gelten zusätzlich.

## Koordinaten & Eigenheiten
- Figur 0..21 × 0..18, Arbeitsfläche erlaubt x −7..28 und y −10..21 (alles außerhalb wird abgeschnitten).
- Augen: vorne x 7–8/13–14 · `Q` 9–10/14–15 · `QL` 6–7/11–12 · Profil `S` 14–15 (jeweils y 5–6). Brauen y 3–4 (`effort` vorne, `qEffort(left)` in 3/4).
- Arme vorne x 2 und 19 (y 10–12), Hände y 13 · Schuhe y 17 · Sakko y 9–15.
- `headDy` (Nicken) wirkt **nur in Ansicht `F`**; in anderen Ansichten Kopfbewegung über Augen/Brauen ausdrücken.
- Die automatische Kontur umrandet **jedes** Pixel, auch Effekte: dünne helle Linien werden auf Weiß zu Ringen → Effekte in Grau/Farbe und mit 1 px Abstand zur Figur.
- Richtungsangaben („rechts“) sind **Bildseite**, außer der Nutzer sagt ausdrücklich „seine rechte Hand“. Im Zweifel kurz nachfragen.

## Nicht
- Das Modell (`HEAD`, `BODY`, Ansichten, Palette) nicht für eine einzelne Pose ändern – Modelländerungen nur auf ausdrücklichen Wunsch.
- Keine Bilder generieren oder malen außerhalb dieses Codes; keine fremden Maskottchen (Clawd, VS-Code-Tierchen) verwenden.
