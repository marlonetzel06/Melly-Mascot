// Melly – Renderer ohne DOM-Abhängigkeit (Browser + Node).
import { GW, GH, palette } from './model.js';

const cache = new WeakMap();

/** Setzt die dunkle Kontur 'O' um alle gefüllten Pixel (4er-Nachbarschaft). */
export function outline(g) {
  if (cache.has(g)) return cache.get(g);
  const H = g.length, W = g[0].length, o = g.map(r => r.slice());
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
    if (g[y][x] !== '.') continue;
    if ([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => { const c = g[y + dy]?.[x + dx]; return c && c !== '.'; })) o[y][x] = 'O';
  }
  cache.set(g, o);
  return o;
}

export const colorsFor = (frame, combo = 0) => ({ ...palette(combo), ...(frame.pal || {}) });

const rgb = hex => [parseInt(hex.slice(1, 3), 16), parseInt(hex.slice(3, 5), 16), parseInt(hex.slice(5, 7), 16)];

/** Frame → RGBA-Puffer. bg = '#rrggbb' oder null (transparent). */
export function renderRGBA(frame, { combo = 0, scale = 1, bg = null } = {}) {
  const o = outline(frame.g), P = colorsFor(frame, combo);
  const width = GW * scale, height = GH * scale, data = new Uint8ClampedArray(width * height * 4);
  const back = bg ? [...rgb(bg), 255] : [0, 0, 0, 0];
  for (let i = 0; i < width * height; i++) data.set(back, i * 4);
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
    const c = o[y][x]; if (c === '.') continue;
    const hex = P[c]; if (!hex) throw new Error(`Unbekanntes Palette-Token '${c}' bei ${x},${y}`);
    const px = [...rgb(hex), 255];
    for (let j = 0; j < scale; j++) for (let i = 0; i < scale; i++) data.set(px, ((y * scale + j) * width + x * scale + i) * 4);
  }
  return { width, height, data };
}

/** Browser: zeichnet einen Frame auf einen 2D-Context. */
export function drawFrame(ctx, frame, scale, combo = 0) {
  const o = outline(frame.g), P = colorsFor(frame, combo);
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  for (let y = 0; y < GH; y++) for (let x = 0; x < GW; x++) {
    const c = o[y][x]; if (c === '.') continue;
    ctx.fillStyle = P[c]; ctx.fillRect(x * scale, y * scale, scale, scale);
  }
}

export { GW, GH };
