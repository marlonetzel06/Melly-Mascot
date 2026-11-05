// Motion-Film: schreibt video/motion/modules/melly.json (Frames + Paletten für den Claude-Motion-Film).
// Quelle sind src/ und video/melly-frames.js; Fußball wird ohne Ball gebaut, weil der Film den Ball selbst animiert.
// node video/motion/build-data.mjs   (vorher: node video/build-frames.mjs)
import { writeFileSync } from 'node:fs';
import { getPose, buildFrames } from '../../src/registry.js';
import { outline } from '../../src/render.js';
import * as vf from '../melly-frames.js';

// Posen, die im Film vorkommen (Szenenfolge: modules/scenes.json).
const USE = ['reinlaufen-hallo', 'jubeln', 'laptop-raus', 'laptop', 'laptop-weg', 'daumen-hoch', 'tschuess'];
const frames = Object.fromEntries(USE.map(id => [id, vf.FRAMES[id]]));

const pose = getPose('fussball');
const withBall = buildFrames(pose, null);
const without = buildFrames({ ...pose, frames: lib => pose.frames({ ...lib, ball: () => () => {} }) }, null);
frames.fussball = without.map(f => ({ ms: f.ms, g: outline(f.g).map(r => r.join('')), ...(f.pal ? { pal: f.pal } : {}) }));

// Ball-Position je Frame (linke obere Ecke des 7×7-Balls), aus der Differenz mit/ohne Ball.
const pos = withBall.map((f, i) => {
  let l = 99, t = 99;
  f.g.forEach((row, y) => row.forEach((c, x) => { if (c !== without[i].g[y][x]) { l = Math.min(l, x); t = Math.min(t, y); } }));
  return [l, t];
});

const data = { GW: vf.GW, GH: vf.GH, names: vf.COMBO_NAMES, pal: Object.values(vf.PAL), frames, ball: { pos } };
const out = new URL('./modules/melly.json', import.meta.url);
writeFileSync(out, JSON.stringify(data) + '\n');
console.log(`melly.json: ${(JSON.stringify(data).length / 1024).toFixed(0)} KB · ${Object.keys(frames).length} Posen`);
