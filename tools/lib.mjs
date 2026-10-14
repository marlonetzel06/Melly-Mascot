// Gemeinsame Helfer für preview/export: PNG/GIF schreiben, Bilder zusammensetzen, Mini-Font.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import pngjs from 'pngjs';
import gifenc from 'gifenc';

const { GIFEncoder } = gifenc;

const { PNG } = pngjs;

export const image = (width, height, bg = null) => {
  const data = new Uint8ClampedArray(width * height * 4);
  if (bg) { const c = hex(bg); for (let i = 0; i < width * height; i++) data.set([...c, 255], i * 4); }
  return { width, height, data };
};
export const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];

/** Kopiert src nach dst an (x, y); transparente Pixel werden übersprungen. */
export function blit(dst, src, x, y) {
  for (let j = 0; j < src.height; j++) for (let i = 0; i < src.width; i++) {
    const s = (j * src.width + i) * 4; if (src.data[s + 3] === 0) continue;
    const X = x + i, Y = y + j; if (X < 0 || Y < 0 || X >= dst.width || Y >= dst.height) continue;
    dst.data.set(src.data.subarray(s, s + 4), (Y * dst.width + X) * 4);
  }
}
export function fillRect(img, x, y, w, h, color) {
  const c = [...hex(color), 255];
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) if (i >= 0 && j >= 0 && i < img.width && j < img.height) img.data.set(c, (j * img.width + i) * 4);
}

const FONT = {
  '0': '111101101101111', '1': '010110010010111', '2': '111001111100111', '3': '111001111001111', '4': '101101111001001',
  '5': '111100111001111', '6': '111100111101111', '7': '111001001001001', '8': '111101111101111', '9': '111101111001111',
  '#': '101111101111101', ' ': '000000000000000', 'm': '000000111111101', 's': '000011010110000', '/': '001001010100100'
};
/** Zeichnet Text in einer 3×5-Pixelschrift. */
export function text(img, str, x, y, color = '#6B7280', s = 2) {
  [...str].forEach((ch, k) => {
    const g = FONT[ch] || FONT[' '];
    for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) if (g[j * 3 + i] === '1') fillRect(img, x + (k * 4 + i) * s, y + j * s, s, s, color);
  });
}

export function writePNG(path, img) {
  mkdirSync(dirname(path), { recursive: true });
  const png = new PNG({ width: img.width, height: img.height });
  png.data = Buffer.from(img.data.buffer);
  writeFileSync(path, PNG.sync.write(png));
}

/** Schreibt ein animiertes GIF mit Transparenz (Palette aus den tatsächlichen Farben). */
export function writeGIF(path, frames /* [{img, ms}] */) {
  mkdirSync(dirname(path), { recursive: true });
  const index = new Map(); const palette = [[0, 0, 0]];
  const toIdx = frames.map(({ img }) => {
    const out = new Uint8Array(img.width * img.height);
    for (let i = 0; i < out.length; i++) {
      const d = img.data; if (d[i * 4 + 3] === 0) { out[i] = 0; continue; }
      const key = (d[i * 4] << 16) | (d[i * 4 + 1] << 8) | d[i * 4 + 2];
      if (!index.has(key)) { if (palette.length >= 256) throw new Error('GIF: mehr als 255 Farben'); index.set(key, palette.length); palette.push([d[i * 4], d[i * 4 + 1], d[i * 4 + 2]]); }
      out[i] = index.get(key);
    }
    return out;
  });
  const gif = GIFEncoder();
  frames.forEach(({ img, ms }, k) => gif.writeFrame(toIdx[k], img.width, img.height, { palette, delay: ms, transparent: true, transparentIndex: 0, dispose: 2, repeat: 0 }));
  gif.finish();
  writeFileSync(path, gif.bytes());
}

export function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) { const k = a.slice(2); const v = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true; args[k] = v; }
    else args._.push(a);
  }
  return args;
}
