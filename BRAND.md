# Melly · Regeln

Melly ist Marlons persönliches Pixel-Maskottchen: ein Creme-Blob im Einreiher. Name aus dem M&M-Kürzel **MEL**.

## Modell (fix)
- Raster 22×19 px (Figur), Arbeitsfläche 36×32 (`src/model.js`: `GW/GH/OX/OY`).
- Creme-Körper `C`, Schatten rechts `c` (Licht von links). Augen 2×2 `E`, Bäckchen `P`. **Kein Mund** – Ausnahmen: überrascht (kleines o), Gähnen.
- Einreiher `N`/`n`, weißes Hemd `W`, **Krawatte = Einstecktuch = Akzentfarbe `A`**, dunklerer Knoten `a`. Weiße Sneaker.
- Kontur `O` wird automatisch gesetzt und ist **überall dunkel** – funktioniert auf Weiß, Papier, M&M-Navy, Schwarz, Cyan.
- 6 Anzug-Kombis (`COMBOS`). Neue Kombi: Anzugfarbe muss sich vom M&M-Navy `#041C2C` abheben; Akzent kontrastiert zum Anzug.
- **Outfits** (`src/outfits.js`) verkleiden Melly für Anlässe (z. B. Weihnachtsmann). Sie ändern Farben und legen Accessoires darüber, nie das Modell selbst. Augen, Kontur und Silhouette bleiben erkennbar Melly; Krawatte/Einstecktuch bleiben sichtbar.
- Ansichten: `F` vorne, `Q`/`QL` 3/4, `S`/`SL` Profil, `QB`/`QBL` 3/4 hinten, `B` hinten.

## Checkliste für jede neue oder geänderte Pose
1. **Perspektive:** Melly schaut auf sein Objekt, nicht wir. Was er liest/hält, ist zu ihm gewandt (Laptop-Deckel, Klemmbrett schräg im Profil).
2. **Objekte auf Creme brauchen eigene Kontur** (`O`), sonst verschwinden sie (Tasse vor dem Gesicht).
3. **Arme sind Ausstülpungen**: 2 px dick, Hände 2×2. Keine 1-px-Stäbchen, keine Punkt-Hände mitten auf dem Sakko. Arm vor dem Körper: hellerer Ärmel `l` + Kontur `O` darunter.
4. **Füße bleiben am Boden.** Schuhe nie verschieben ohne Neuzeichnen; Kicks über `kickR/kickL`, Tippen über `toeUp/tapMark`.
5. **Ruhe**: Beim Schlafen nickt nur der Kopf (`headDy`), Körper bleibt stehen. Ganze Figur bewegen (`dy/dx`) nur bei Sprung, Zittern, Laufen.
6. **Große Bewegungen mit Zwischenposition** (z. B. `armHalfR` vor dem Winken, Tasse über Kinnhöhe zum Mund).
7. **Dynamik über Ansichten**, wo es Sinn ergibt: zur Seite drehen (3/4) statt nur Augen schieben; Profil für Objekte, die er betrachtet.
8. **Farben mit Sinn:** keine dekorativen Akzentfarben, keine blinkenden Logos. Gelb `Y` nur für Licht (Glühbirne). Rot `R` für Alarm (Bug, Ausrufezeichen), Grün `V` für erledigt. Ausnahme Outfits: dort sind Kostümfarben erlaubt (z. B. Rot beim Weihnachtsmann).
9. Keine Formen, die sich als etwas anderes lesen (Krawatte ≠ Zunge, Brett ≠ Handy, Hand ≠ Kasten). Im Zweifel im Kontaktbogen in 1×/2× prüfen.
10. Läuft auf Weiß **und** Navy (Kontaktbogen zeigt beides).
