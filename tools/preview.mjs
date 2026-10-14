// Kontaktbogen zur Selbstprüfung: alle Frames einer Pose, oben auf Weiß, unten auf M&M-Navy, mit Index + Dauer.
// node tools/preview.mjs <pose-id|all> [--combo 0] [--outfit <id>|none] [--scale 6] [--out out/preview]
import { POSES, getPose, buildFrames } from '../src/registry.js';
import { COMBOS, slug } from '../src/model.js';
import { renderRGBA, GW, GH } from '../src/render.js';
import { image, blit, fillRect, text, writePNG, parseArgs } from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const id = args._[0];
if (!id) { console.error('Aufruf: node tools/preview.mjs <pose-id|all> [--combo 0] [--scale 6]\nPosen: ' + POSES.map(p => p.id).join(', ')); process.exit(1); }
const combo = resolveCombo(args.combo ?? 0);
const scale = Number(args.scale || 6), out = args.out || 'out/preview';
const poses = id === 'all' ? POSES : [getPose(id) || fail(`Unbekannte Pose '${id}'`)];

for (const pose of poses) {
  const frames = buildFrames(pose, args.outfit === undefined ? undefined : args.outfit === 'none' ? null : args.outfit);
  const tw = GW * scale, th = GH * scale, gap = 6, label = 16;
  const sheet = image(frames.length * (tw + gap) + gap, 2 * th + label + 3 * gap, '#F5F3EE');
  frames.forEach((f, i) => {
    const x = gap + i * (tw + gap);
    fillRect(sheet, x, gap, tw, th, '#FFFFFF');
    fillRect(sheet, x, gap * 2 + th + label, tw, th, '#041C2C');
    const img = renderRGBA(f, { combo, scale });
    blit(sheet, img, x, gap);
    blit(sheet, img, x, gap * 2 + th + label);
    if (i === pose.still) fillRect(sheet, x, gap + th + 1, tw, 2, '#E3A33B');
    text(sheet, `${i} ${f.ms}`, x + 2, gap + th + 5);
  });
  const file = `${out}/${pose.id}${args.outfit && args.outfit !== 'none' ? '--' + args.outfit : ''}.png`;
  writePNG(file, sheet);
  console.log(`${file}  (${frames.length} Frames, ${frames.reduce((s, f) => s + f.ms, 0)} ms, Kombi ${COMBOS[combo][0]})`);
}

function resolveCombo(v) {
  if (/^\d+$/.test(String(v))) return Number(v);
  const i = COMBOS.findIndex(c => slug(c[0]) === slug(String(v)));
  return i >= 0 ? i : fail(`Unbekannte Kombi '${v}'. Verfügbar: ${COMBOS.map((c, k) => `${k}=${slug(c[0])}`).join(', ')}`);
}
function fail(msg) { console.error(msg); process.exit(1); }
