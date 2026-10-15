---
name: melly
description: "Melly – Marlons Pixel-Maskottchen (Creme-Blob im Anzug). Liefert fertige Assets (GIF, PNG, Sprite-Sheet) in 6 Anzug-Kombis und Outfits (z. B. Weihnachtsmann), baut neue Posen und Outfits oder passt bestehende an – als Code, mit Render-Selbstprüfung und Feedback-Schleife. Auslöser: 'Melly', '/melly', 'Maskottchen für den Post', 'Melly winkend/jubelnd/…', 'neue Pose für Melly', 'Melly als Weihnachtsmann/…', 'neues Outfit', 'Melly anpassen', 'Melly exportieren'."
---

# Melly

Quelle der Wahrheit: das Repo (GitHub `marlonetzel06/Melly-Mascot`). Alle Befehle im Repo-Root ausführen (bei Worktree/Klon: dessen Root). Vorher `BRAND.md` lesen – sie ist verbindlich.

## Begriffe
- **Modell** = die Figur selbst (fix) · **Kombi** = Anzug- + Akzentfarbe (6 Stück) · **Outfit** = Kostüm über dem Modell (eigene Farben + Accessoires, z. B. `weihnachten`) · **Pose** = Animation.
- Jede Pose läuft in jeder Kombi und in jedem Outfit, dessen Ansichten sie nutzt. Eine Pose mit `outfit: '<id>'` ist an dieses Outfit gebunden (z. B. `weihnachtsmann` mit Sack).

## Aufbau
- `src/model.js` Raster je Ansicht, Palette, `COMBOS` · `src/core.js` Frame-Builder + Bausteine (Augen, Arme, Füße, `walkFrames`) · `src/props.js` Objekte/Effekte · `src/outfits.js` Outfits
- `src/poses/<id>.js` eine Datei pro Animation: `{ id, title, category, desc, still, outfit?, frames: (lib) => [...] }` · `src/registry.js` Liste aller Posen
- `node tools/preview.mjs <id|all> [--combo <n|slug>] [--outfit <id>|none]` → `out/preview/<id>.png` (alle Frames, Weiß + Navy, Index + ms; Standbild orange markiert)
- `node tools/export.mjs <id|all> [--combo all|none|<n|slug>] [--outfit all|none|<id>] [--version v1]` → `dist/<version>/<kombi>/{gif,png,sheet}/` und `dist/<version>/outfit-<id>/…`
- `npm run gallery` → http://localhost:8777 (Galerie, Kombi- und Outfit-Umschalter)

## A · Asset liefern
1. Passende Pose in `src/registry.js`/Galerie suchen (Kategorien: Bewegung, Arbeit, Reaktion, Alltag).
2. Liegt sie schon in `dist/`? Sonst `node tools/export.mjs <id> --combo <kombi>`.
3. Pfad zur GIF/PNG ausgeben. GIF = animiert + transparent (LinkedIn, Folien), PNG = Standbild (Karussell), Sheet + JSON = für Video/Motion-Tools.

## B · Neue Pose / Pose anpassen
1. Ähnliche Pose als Vorlage lesen. Neue Datei `src/poses/<id>.js` anlegen **und in `src/registry.js` eintragen** (oder vorhandene Datei ändern).
2. Nur mit Bausteinen + Deltas arbeiten: `frame(mods, ms, { view, dx, dy, headDy, pal })`. Baustein = `(p, S) => …`; `p(x,y,token)` Körper/Objekte, `S` folgt dem nickenden Kopf (Gesicht). Fehlt ein Baustein/Objekt → in `core.js`/`props.js` ergänzen, nicht in der Pose kopieren. Koordinaten siehe unten.
3. **Selbstprüfung (Pflicht):** `node tools/preview.mjs <id>` und das PNG ansehen (bei vielen Frames zusätzlich `--scale 10 --out out/detail`). Gegen die Checkliste in `BRAND.md` prüfen, Probleme selbst beheben, erneut prüfen. Erst dann dem Nutzer zeigen (PNG + Galerie-Link).
4. Feedback umsetzen, bis der Nutzer „passt“ sagt.
5. Export: nur die gewünschte Kombi, sonst alle (`node tools/export.mjs <id>`). Bei neuer/geänderter Pose danach `npm run catalog` (aktualisiert den Bild-Katalog im README; braucht den Export in Mittelblau · Messing). Commit/PR nur auf Zuruf: eigener Branch (`feat: Pose <id>` / `fix: Pose <id> …`), PR auf GitHub, **nie selbst mergen**, `dist/` mit committen. Die globalen Regeln des Nutzers (Entwicklungszyklus, Test im frischen Subagent) gelten zusätzlich.

## C · Neues Outfit / Outfit anpassen
1. In `src/outfits.js` Eintrag anlegen: `{ id, title, desc, pal, layers }`.
   - `pal`: überschreibt Kombi-Farben (Anzug `N/n/l`, Akzent `A/a`) und darf eigene Tokens definieren (belegt sind die Tokens in `BASE_PX` + `N n l A a`; freie Buchstaben per grep prüfen). Overrides wirken auf alles im Frame, auch auf Arme/Objekte mit diesen Tokens. Token, die auch Posen brauchen (z. B. Jute `J/j` für den Sack), gehören in `BASE_PX` (`src/model.js`).
   - `layers`: `{ <Ansicht>: (opt) => [Bausteine] }`, gezeichnet **vor** den Posen-Bausteinen (Arme/Objekte liegen darüber). `opt` = Frame-Optionen der Pose (z. B. `opt.wobble` für Wippen). Kopfschmuck mit `S`, damit er beim Nicken mitgeht.
   - `figures`: `{ <Figur-ID>: (opt) => [Bausteine] }` für eigene Figuren in Ansicht `-` (Liegen `lie`, Neigung `lean26/45/63` aus `props.js`), in Sprite-Koordinaten der Figur, gezeichnet direkt nach ihr. Mütze und Anzug je Stufe zeichnen; was der Schwerkraft folgt (Zipfel), nicht mitdrehen, sondern als Zustände anlegen, die die Pose per Frame-Option wählt (`opt.tip`, Beispiel `weihnachten`).
   - Eine Pose passt zum Outfit, wenn das Outfit für **alle** ihre Ansichten `layers` hat (Frames mit eigener Figur: `figures` für diese Figur). Erst `F` bauen; weitere Ansichten nur, wenn gewünscht.
2. Selbstprüfung: `node tools/preview.mjs winken --outfit <id>` plus `jubeln` (Sprung, Höhe), `schulterzucken` (Nicken: Kopfschmuck muss mitgehen) und 1–2 Posen mit Armen/Objekten vor dem Körper (`kaffee`, `laptop`). Checkliste in `BRAND.md` gilt.
3. Optional eigene Pose mit `outfit: '<id>'` (wie `weihnachtsmann.js`), sonst reicht das Outfit.
4. Export immer für alle passenden Posen: `node tools/export.mjs all --combo none --outfit <id>` → `dist/<version>/outfit-<id>/` (der Katalog verlinkt feste Beispielposen), danach `npm run catalog`. Commit/PR wie in B.

## Koordinaten & Eigenheiten
- Figur 0..21 × 0..18, Arbeitsfläche erlaubt x −7..28 und y −10..21 (alles außerhalb wird abgeschnitten).
- Augen: vorne x 7–8/13–14 · `Q` 9–10/14–15 · `QL` 6–7/11–12 · Profil `S` 14–15 (jeweils y 5–6). Brauen y 3–4 (`effort` vorne, `qEffort(left)` in 3/4).
- Kopfschmuck: Kopf beginnt bei y 0; Mützen/Hüte liegen auf y −6..1 (höher nicht: `jubeln` springt mit `dy −3`, oberhalb y −9 wird abgeschnitten). Trennung zum Kopf: eine Zeile Abstand lassen (automatische Kontur) oder bei Krempe direkt auf dem Kopf (Pelzband) eine Zeile `O` setzen – sonst verschwimmt Weiß mit Creme.
- Arme vorne x 2 und 19 (y 10–12), Hände y 13 · Schuhe y 17 · Sakko y 9–15.
- Bewegte Arme mit `arm(side, oberarm°, unterarm°, { sh, view, finger })` (Schulter-Pivot, 0° hängt, 90° waagerecht, 135° hoch, negativ = vor den Körper); Hände/Arme vor Kopf oder Körper als Stufen mit `limb(side, bodyPixel, headPixel)` (Beispiele `facepalm(stage)`, `chin(stage)` in `props.js`). Zeigen auf Objekte: Kategorie „Zeigen“ (`src/poses/zeigen-varianten.js`, 4 Winkel × vorne/hinten/Tafel × links/rechts). Regeln für Bögen und Timing: `BRAND.md` → Animation.
- `headDy` (Nicken) wirkt **nur in Ansicht `F`**; in anderen Ansichten Kopfbewegung über Augen/Brauen ausdrücken.
- Die automatische Kontur umrandet **jedes** Pixel, auch Effekte: dünne helle Linien werden auf Weiß zu Ringen → Effekte in Grau/Farbe und mit 1 px Abstand zur Figur.
- Richtungsangaben („rechts“) sind **Bildseite**, außer der Nutzer sagt ausdrücklich „seine rechte Hand“. Im Zweifel kurz nachfragen.

## Nicht
- Das Modell (`HEAD`, `BODY`, Ansichten, Palette) nicht für eine einzelne Pose oder ein Outfit ändern – Kostüme gehören in `src/outfits.js` – Modelländerungen nur auf ausdrücklichen Wunsch.
- Keine Bilder generieren oder malen außerhalb dieses Codes; keine fremden Maskottchen (Clawd, VS-Code-Tierchen) verwenden.
