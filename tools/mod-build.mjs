// Mod-Build: rendert Melly-Posen als SVG-Pfade für den Claude-Code-Mod (die Mod-Sandbox kann src/ nicht importieren).
// node tools/mod-build.mjs [--poses a,b,…|mod|all] [--out mod/melly-mascot/hooks/frames.ts]
// Format: FRAMES[<outfit|'-'>][<pose>] = [{ ms, p: [[token, pathData], …], pal? }]  (Farben als Token, Maße GW×GH Pixel)
//         Frames je Outfit in frames/<outfit>.ts neben --out (die Mod-Engine liest Importe nur bis 1 MiB pro Datei).
//         PAL[<kombi>][<outfit|'-'>] = { token: '#hex' }   (Anzug-Kombi und Outfit-Farben, getrennt von den Pfaden)
import { writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { POSES, OUTFITS, getPose, buildFrames, fitsOutfit } from '../src/registry.js';
import { COMBOS } from '../src/model.js';
import { outline, colorsFor, GW, GH } from '../src/render.js';
import { parseArgs } from './lib.mjs';

/** Posen, die der Mod braucht (Zustände, Reaktionen, Klick-Gesten). */
export const MOD_POSES = ['idle', 'muede', 'laufen', 'laptop', 'laptop-raus', 'laptop-weg', 'hinlegen', 'liegen-boden', 'aufstehen', 'gaehnen',
  'kaffee', 'daumen-hoch', 'jubeln', 'sauer', 'schulterzucken', 'winken', 'blick-links', 'blick-rechts'];

const args = parseArgs(process.argv.slice(2));
const list = v => String(v).split(',').map(s => s.trim()).filter(Boolean);
const poseIds = args.poses === undefined || args.poses === 'mod' ? MOD_POSES : args.poses === 'all' ? POSES.map(p => p.id) : list(args.poses);
const out = args.out || 'mod/melly-mascot/hooks/frames.ts';
const outfitIds = ['-', ...OUTFITS.map(o => o.id)];

/** Frame → Pfade je Token: pro Zeile zusammenhängende Pixel eines Tokens als ein Rechteck. */
function framePaths(frame) {
  const o = outline(frame.g), byToken = new Map();
  for (let y = 0; y < GH; y++) {
    for (let x = 0; x < GW;) {
      const c = o[y][x];
      if (c === '.') { x++; continue; }
      let w = 1;
      while (x + w < GW && o[y][x + w] === c) w++;
      byToken.set(c, (byToken.get(c) || '') + `M${x} ${y}h${w}v1h-${w}z`);
      x += w;
    }
  }
  return [...byToken];
}

const frames = {};
for (const outfit of outfitIds) {
  const bucket = (frames[outfit] = {});
  for (const id of poseIds) {
    const pose = getPose(id);
    if (!pose) throw new Error(`Unbekannte Pose '${id}'`);
    if (outfit === '-' ? pose.outfit : !(pose.outfit === outfit || (!pose.outfit && fitsOutfit(pose, outfit)))) continue;
    bucket[id] = buildFrames(pose, outfit === '-' ? null : outfit).map(f => ({ ms: f.ms, p: framePaths(f), ...(f.pal ? { pal: f.pal } : {}) }));
  }
}

const pal = {};
COMBOS.forEach((_, combo) => {
  pal[combo] = {};
  for (const outfit of outfitIds) pal[combo][outfit] = colorsFor({ outfitPal: outfit === '-' ? undefined : OUTFITS.find(o => o.id === outfit).pal }, combo);
});

const head = '// Generiert von tools/mod-build.mjs – nicht von Hand bearbeiten.\n';
const partName = outfit => (outfit === '-' ? 'basis' : outfit);
const partsDir = join(dirname(out), 'frames');
rmSync(partsDir, { recursive: true, force: true });
mkdirSync(partsDir, { recursive: true });
for (const outfit of outfitIds) {
  writeFileSync(join(partsDir, `${partName(outfit)}.ts`), `${head}import type { MascotFrame } from '../frames'
const frames: Record<string, MascotFrame[]> = ${JSON.stringify(frames[outfit])}
export default frames
`);
}

const body = `${head}${outfitIds.map((o, i) => `import f${i} from './frames/${partName(o)}'\n`).join('')}export const GW = ${GW}
export const GH = ${GH}
export type MascotFrame = { ms: number; p: [string, string][]; pal?: Record<string, string> }
export const COMBO_NAMES: string[] = ${JSON.stringify(COMBOS.map(c => c[0]))}
export const OUTFIT_NAMES: Record<string, string> = ${JSON.stringify({ '-': 'Kein Outfit', ...Object.fromEntries(OUTFITS.map(o => [o.id, o.title])) })}
export const PAL: Record<string, Record<string, Record<string, string>>> = ${JSON.stringify(pal)}
export const FRAMES: Record<string, Record<string, MascotFrame[]>> = { ${outfitIds.map((o, i) => `${JSON.stringify(o)}: f${i}`).join(', ')} }
`;
writeFileSync(out, body);
console.log(`${out} + ${partsDir}/: ${(JSON.stringify(frames).length / 1024).toFixed(0)} KB Frames · ${poseIds.length} Posen · ${COMBOS.length} Kombis · Outfits ${outfitIds.join(',')}`);
