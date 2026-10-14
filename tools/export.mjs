// Export: GIF (animiert, transparent), Standbild-PNG, Sprite-Sheet (1×) + JSON, Ansichten, Mimik.
// node tools/export.mjs <pose-id|all> [--combo all|0..5|slug] [--outfit all|none|<id>] [--scale 8] [--version v1]
//   Kombis:  dist/<v>/<kombi>/…           (alle Posen ohne festes Outfit)
//   Outfits: dist/<v>/outfit-<id>/…       (alle passenden Posen im Outfit; Outfit-Posen nur hier)
import { writeFileSync, mkdirSync } from 'node:fs';
import { POSES, OUTFITS, getPose, getOutfit, buildFrames, fitsOutfit, LIB } from '../src/registry.js';
import { EXPRESSIONS } from '../src/expressions.js';
import { COMBOS, TURNAROUND, VIEW_LABELS, slug } from '../src/model.js';
import { frame } from '../src/core.js';
import { renderRGBA, GW, GH } from '../src/render.js';
import { image, blit, writePNG, writeGIF, parseArgs } from './lib.mjs';

const args = parseArgs(process.argv.slice(2));
const id = args._[0] || 'all';
const scale = Number(args.scale || 8), version = args.version || 'v1';
const combos = args.combo === undefined || args.combo === 'all' ? COMBOS.map((_, i) => i) : args.combo === 'none' ? [] : [resolveCombo(args.combo)];
const outfits = args.outfit === undefined || args.outfit === 'all' ? OUTFITS : args.outfit === 'none' ? [] : [getOutfit(args.outfit) || fail(`Unbekanntes Outfit '${args.outfit}'. Verfügbar: ${OUTFITS.map(o => o.id).join(', ')}`)];
const poses = id === 'all' ? POSES : [getPose(id) || fail(`Unbekannte Pose '${id}'`)];
let files = 0;

function writePose(dir, pose, frames, combo) {
  writeGIF(`${dir}/gif/${pose.id}.gif`, frames.map(f => ({ img: renderRGBA(f, { combo, scale }), ms: f.ms })));
  writePNG(`${dir}/png/${pose.id}.png`, renderRGBA(frames[pose.still] || frames[0], { combo, scale }));
  const sheet = image(frames.length * GW, GH);
  frames.forEach((f, i) => blit(sheet, renderRGBA(f, { combo, scale: 1 }), i * GW, 0));
  writePNG(`${dir}/sheet/${pose.id}.png`, sheet);
  mkdirSync(`${dir}/sheet`, { recursive: true });
  writeFileSync(`${dir}/sheet/${pose.id}.json`, JSON.stringify({ pose: pose.id, title: pose.title, frameWidth: GW, frameHeight: GH, frames: frames.map((f, i) => ({ x: i * GW, y: 0, ms: f.ms })) }, null, 1));
  files += 4;
}

for (const combo of combos) {
  const dir = `dist/${version}/${slug(COMBOS[combo][0])}`;
  for (const pose of poses.filter(p => !p.outfit)) writePose(dir, pose, buildFrames(pose), combo);
  if (id === 'all') {
    TURNAROUND.forEach(v => { writePNG(`${dir}/png/ansicht-${slug(VIEW_LABELS[v])}.png`, renderRGBA(LIB.frame([], 0, { view: v }), { combo, scale })); files++; });
    EXPRESSIONS.forEach(e => { writePNG(`${dir}/png/mimik-${e.id}.png`, renderRGBA(LIB.frame(e.mods(LIB), 0, e.opt ? e.opt(LIB) : {}), { combo, scale })); files++; });
  }
  console.log(`${dir}  ✓`);
}

for (const o of outfits) {
  const dir = `dist/${version}/outfit-${o.id}`;
  const list = poses.filter(p => (!p.outfit || p.outfit === o.id) && fitsOutfit(p, o.id));
  for (const pose of list) writePose(dir, pose, buildFrames(pose, o.id), 0);
  if (id === 'all') {
    TURNAROUND.filter(v => o.layers[v]).forEach(v => { writePNG(`${dir}/png/ansicht-${slug(VIEW_LABELS[v])}.png`, renderRGBA(frame([], 0, { view: v, outfit: o }), { scale })); files++; });
    EXPRESSIONS.forEach(e => { writePNG(`${dir}/png/mimik-${e.id}.png`, renderRGBA(frame(e.mods(LIB), 0, { ...(e.opt ? e.opt(LIB) : {}), outfit: o }), { scale })); files++; });
  }
  console.log(`${dir}  ✓ (${list.length} Posen)`);
}
console.log(`${files} Dateien exportiert (Skalierung ${scale}×, ${version}). MP4/WebM: nicht enthalten (ffmpeg nötig).`);

function resolveCombo(v) {
  if (/^\d+$/.test(String(v))) return Number(v);
  const i = COMBOS.findIndex(c => slug(c[0]) === slug(String(v)));
  return i >= 0 ? i : fail(`Unbekannte Kombi '${v}'. Verfügbar: ${COMBOS.map((c, k) => `${k}=${slug(c[0])}`).join(', ')}`);
}
function fail(msg) { console.error(msg); process.exit(1); }
