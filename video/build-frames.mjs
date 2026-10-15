// Video-Build: schreibt die vorberechneten Melly-Frames + Paletten für das LinkedIn-Intro nach video/melly-frames.js.
// Gleiches Prinzip wie tools/mod-build.mjs, aber als reines JS-Modul und mit vorgebackener Kontur (outline), damit der
// Browser-Compositor nur noch Pixel zeichnen muss. src/ bleibt Single Source of Truth.
// node video/build-frames.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPose, buildFrames } from '../src/registry.js';
import { COMBOS } from '../src/model.js';
import { outline, colorsFor, GW, GH } from '../src/render.js';

// Posen, die im Video vorkommen (Reihenfolge egal – die Szenenfolge steht in linkedin-intro.html).
const POSE_IDS = ['reinlaufen-hallo', 'drehung', 'jubeln', 'laptop-raus', 'laptop', 'laptop-weg', 'daumen-hoch', 'hinlegen', 'liegen-boden', 'aufstehen', 'tschuess'];

const frames = {};
for (const id of POSE_IDS) {
  const pose = getPose(id);
  if (!pose) throw new Error(`Unbekannte Pose '${id}'`);
  frames[id] = buildFrames(pose, null).map(f => {
    const o = outline(f.g);
    return { ms: f.ms, g: o.map(row => row.join('')), ...(f.pal ? { pal: f.pal } : {}) };
  });
}

// Palette je Kombi (ohne Outfit). Enthält O/N/n/A/a/l und alle Basis-Tokens.
const pal = {};
COMBOS.forEach((_, c) => { pal[c] = colorsFor({}, c); });

const out = fileURLToPath(new URL('./melly-frames.js', import.meta.url));
const body = `// Generiert von video/build-frames.mjs – nicht von Hand bearbeiten.
export const GW = ${GW};
export const GH = ${GH};
export const COMBO_NAMES = ${JSON.stringify(COMBOS.map(c => c[0]))};
export const PAL = ${JSON.stringify(pal)};
export const FRAMES = ${JSON.stringify(frames)};
`;
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, body);
const n = Object.values(frames).reduce((s, a) => s + a.length, 0);
console.log(`${out}: ${(body.length / 1024).toFixed(0)} KB · ${POSE_IDS.length} Posen · ${n} Frames · ${COMBOS.length} Kombis`);
