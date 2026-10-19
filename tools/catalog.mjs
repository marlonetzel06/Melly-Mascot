// Erzeugt den Bild-Katalog im README (zwischen den KATALOG-Markern) aus Registry + dist.
// node tools/catalog.mjs [--version v1]
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { POSES, CATEGORIES, OUTFITS, ACCESSORIES, fitsOutfit, fitsAccessory } from '../src/registry.js';
import { EXPRESSIONS } from '../src/expressions.js';
import { COMBOS, TURNAROUND, VIEW_LABELS, slug } from '../src/model.js';
import { parseArgs } from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const version = args.version || readdirSync('dist').filter(d => /^v\d+$/.test(d)).sort((a, b) => a.slice(1) - b.slice(1)).pop();
const base = `dist/${version}`, main = slug(COMBOS[0][0]);
const START = '<!-- KATALOG:START -->', END = '<!-- KATALOG:END -->';
const missing = [];
const img = (path, w, alt) => { if (!existsSync(path)) missing.push(path); return `<img src="${path}" width="${w}" alt="${alt}">`; };
const table = (cells, cols) => {
  const rows = [];
  for (let i = 0; i < cells.length; i += cols) rows.push('<tr>' + cells.slice(i, i + cols).map(c => `<td align="center" valign="top">${c}</td>`).join('') + '</tr>');
  return `<table>\n${rows.join('\n')}\n</table>`;
};
const details = (summary, inner) => `<details>\n<summary>${summary}</summary>\n\n${inner}\n</details>\n\n`;

let md = `${START}\n<!-- Automatisch erzeugt mit \`npm run catalog\` – nicht von Hand bearbeiten. -->\n\n`;
md += `<p align="center">${img(`${base}/${main}/gif/winken.gif`, 288, 'Melly winkt')}</p>\n\n`;
md += `**Melly** ist ein Pixel-Maskottchen als Code: Creme-Blob im Einreiher, Name aus dem Kürzel MEL. ${POSES.length} Posen · ${COMBOS.length} Anzug-Kombis · ${OUTFITS.length} Outfit(s) · ${ACCESSORIES.length} Accessoires · ${TURNAROUND.length} Ansichten · ${EXPRESSIONS.length} Gesichtsausdrücke. Asset-Stand: \`${version}\`.\n\n`;

md += `## Katalog\nKomplette Figur-Referenz – zum Aufklappen.\n\n`;
md += details(`<b>Anzug-Kombis</b> · ${COMBOS.length}`, `Krawatte und Einstecktuch haben immer die Akzentfarbe.\n\n` + table(COMBOS.map(c => `${img(`${base}/${slug(c[0])}/png/mimik-neutral.png`, 96, c[0])}<br><sub>${c[0].replace(' · ', '<br>')}</sub>`), 6));

let outfitsInner = `Kostüme, die über jede passende Pose gelegt werden (eigene Farben + Accessoires). Ordner: \`${base}/outfit-<id>/\`.\n\n`;
for (const o of OUTFITS) {
  const own = POSES.filter(p => p.outfit === o.id);
  const picks = ['winken', 'jubeln', 'daumen-hoch', 'kaffee', 'schlafen'].map(i => POSES.find(p => p.id === i)).filter(p => p && fitsOutfit(p, o.id));
  const fits = POSES.filter(p => (!p.outfit || p.outfit === o.id) && !p.accessories && fitsOutfit(p, o.id)).length;
  outfitsInner += `**${o.title}** (\`${o.id}\`) — ${o.desc} Läuft mit ${fits} Posen.\n\n`;
  outfitsInner += table([...own, ...picks].map(p => `${img(`${base}/outfit-${o.id}/gif/${p.id}.gif`, 144, p.title)}<br><b>${p.title}</b><br><code>${p.id}</code>`), 3) + '\n\n';
}
md += details(`<b>Outfits</b> · ${OUTFITS.length}`, outfitsInner.trimEnd());

let accInner = `Kleine Extras zum An- und Abschalten, kombinierbar mit jeder Kombi und jedem Outfit. Ordner: \`${base}/accessoire-<id>/\` (Mittelblau).\n\n`;
for (const a of ACCESSORIES) {
  const own = POSES.filter(p => p.accessories?.includes(a.id));
  const picks = ['winken', 'kaffee'].map(i => POSES.find(p => p.id === i)).filter(p => p && fitsAccessory(p, a.id));
  const fits = POSES.filter(p => !p.outfit && (!p.accessories || p.accessories.includes(a.id)) && fitsAccessory(p, a.id)).length;
  accInner += `**${a.title}** (\`${a.id}\`) — ${a.desc} Läuft mit ${fits} Posen.\n\n`;
  accInner += table([...own, ...picks].map(p => `${img(`${base}/accessoire-${a.id}/gif/${p.id}.gif`, 144, p.title)}<br><b>${p.title}</b><br><code>${p.id}</code>`), 3) + '\n\n';
}
md += details(`<b>Accessoires</b> · ${ACCESSORIES.length}`, accInner.trimEnd());

md += details(`<b>Ansichten</b> · ${TURNAROUND.length}`, table(TURNAROUND.map(v => `${img(`${base}/${main}/png/ansicht-${slug(VIEW_LABELS[v])}.png`, 72, VIEW_LABELS[v])}<br><sub>${VIEW_LABELS[v]}</sub>`), 8));

md += details(`<b>Mimik</b> · ${EXPRESSIONS.length}`, table(EXPRESSIONS.map(e => `${img(`${base}/${main}/png/mimik-${e.id}.png`, 72, e.title)}<br><sub>${e.title}</sub>`), 5));

let posenInner = `Alle als animiertes GIF (transparent), Standbild-PNG und Sprite-Sheet in jeder Kombi. Gezeigt: ${COMBOS[0][0]}.\n\n`;
for (const cat of CATEGORIES) {
  const list = POSES.filter(p => p.category === cat);
  if (!list.length) continue;
  posenInner += `#### ${cat}\n` + table(list.map(p => `${img(`${base}/${p.outfit ? 'outfit-' + p.outfit : p.accessories ? 'accessoire-' + p.accessories[0] : main}/gif/${p.id}.gif`, 144, p.title)}<br><b>${p.title}</b><br><code>${p.id}</code><br><sub>${p.desc}</sub>`), 3) + '\n\n';
}
md += details(`<b>Posen &amp; Animationen</b> · ${POSES.length}`, posenInner.trimEnd());

md += `## Nutzung
| Zweck | Befehl |
|---|---|
| Galerie mit Kombi-Umschalter | \`npm run gallery\` → http://localhost:8777 |
| Kontaktbogen einer Pose (Selbstprüfung) | \`node tools/preview.mjs <id> [--outfit <id>] [--acc <id>,<id>]\` |
| Export (GIF, PNG, Sprite-Sheet) | \`node tools/export.mjs <id\\|all> [--combo <kombi>] [--outfit <id>] [--acc <id>]\` |
| Diesen Katalog aktualisieren | \`npm run catalog\` |

Kombi-Ordner: ${COMBOS.map(c => `\`${slug(c[0])}\``).join(', ')}.
Dateien: \`${base}/<kombi>/gif/<id>.gif\` · \`png/<id>.png\` (Standbild) · \`png/ansicht-*.png\` · \`png/mimik-*.png\` · \`sheet/<id>.png\` + \`.json\`. Outfits: \`${base}/outfit-<id>/…\`, Accessoires: \`${base}/accessoire-<id>/…\` (gleiche Struktur).
Neue Posen baut der Skill **melly** (\`.claude/skills/melly/SKILL.md\`); Regeln in \`BRAND.md\`.
${END}`;

const readme = existsSync('README.md') ? readFileSync('README.md', 'utf8') : '# Melly-Mascot\n';
const out = readme.includes(START) ? readme.replace(new RegExp(`${START}[\\s\\S]*?${END}`), md) : `${readme.trimEnd()}\n\n${md}\n`;
writeFileSync('README.md', out);
if (missing.length) { console.error(`Fehlende Assets (${missing.length}) – erst exportieren:\n  ` + missing.slice(0, 10).join('\n  ')); process.exit(1); }
console.log(`README.md aktualisiert (${version}, ${POSES.length} Posen).`);
