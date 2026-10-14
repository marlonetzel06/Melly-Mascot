// Melly – Kern: Frame-Builder + Bausteine für Augen, Mimik, Arme und Füße.
// Ein Baustein ist eine Funktion (p, S) => void.
//   p(x, y, c): setzt ein Pixel in Figur-Koordinaten (Körper, Arme, Objekte)
//   S(x, y, c): wie p, folgt aber dem Kopf, wenn er nickt (headDy) – für Augen/Gesicht
// '.' löscht ein Pixel. Koordinaten dürfen außerhalb 0..21 liegen (Objekte, Effekte).

import { GW, GH, OX, OY, HEAD, BODY, VIEWS } from './model.js';

/** Baut einen Frame. opt: { view:'F'|'Q'|'QL'|'S'|'SL'|'QB'|'QBL'|'B'|'-' (ohne Figur), dx, dy, headDy, pal, outfit, … }
 *  outfit (aus outfits.js) wird vor den Posen-Bausteinen gezeichnet; seine Farben liegen über der Kombi. */
export function frame(mods, ms, opt = {}) {
  const g = Array.from({ length: GH }, () => Array(GW).fill('.'));
  const dy = opt.dy || 0, dx = opt.dx || 0, hd = opt.headDy || 0;
  const put = (x, y, c) => { const X = x + OX + dx, Y = y + OY + dy; if (X >= 0 && Y >= 0 && X < GW && Y < GH) g[Y][X] = c; };
  const view = opt.view || 'F';
  if (view === 'F') {
    BODY.forEach((r, y) => [...r].forEach((c, x) => { if (c !== '.') put(x, y + 9, c); }));
    HEAD.forEach((r, y) => [...r].forEach((c, x) => { if (c !== '.') put(x, y + hd, c); }));
  } else if (view !== '-') {
    VIEWS[view].forEach((r, y) => [...r].forEach((c, x) => { if (c !== '.') put(x, y, c); }));
  }
  const S = (x, y, c) => put(x, y + hd, c);
  if (opt.outfit) (opt.outfit.layers[view] ? opt.outfit.layers[view](opt) : []).forEach(m => m(put, S));
  (mods || []).forEach(m => m(put, S));
  return { g, ms, view, pal: opt.pal, outfitPal: opt.outfit?.pal };
}

export const n = [];
export const L = list => p => list.forEach(([x, y, c]) => p(x, y, c));
export const sprite = (rows, x0, y0) => p => rows.forEach((r, j) => [...r].forEach((c, i) => { if (c !== '.') p(x0 + i, y0 + j, c); }));

// ---------- Augen & Mimik (vorne: Augen bei x 7–8 und 13–14, y 5–6) ----------
const EY = [[7, 8], [13, 14]];
export const look = (dx, dy = 0) => (p, S) => EY.forEach(([a, b]) => {
  for (let y = 5; y <= 6; y++) { S(a, y, 'C'); S(b, y, 'C'); }
  [a, b].forEach(x => { S(x + dx, 5 + dy, 'E'); S(x + dx, 6 + dy, 'E'); });
});
export const blink = (p, S) => EY.forEach(([a, b]) => { S(a, 5, 'C'); S(b, 5, 'C'); });
export const sleepy = blink;
export const caret = (S, x0) => { for (let y = 5; y <= 6; y++) for (let x = x0 - 1; x <= x0 + 2; x++) S(x, y, 'C'); S(x0 - 1, 6, 'E'); S(x0, 5, 'E'); S(x0 + 1, 5, 'E'); S(x0 + 2, 6, 'E'); };
export const happy = (p, S) => { caret(S, 7); caret(S, 13); };
export const wink = (p, S) => caret(S, 7);
export const angry = (p, S) => { EY.forEach(([a, b]) => { S(a, 5, 'C'); S(b, 5, 'C'); }); [[6, 3], [7, 3], [8, 4], [9, 4], [12, 4], [13, 4], [14, 3], [15, 3]].forEach(([x, y]) => S(x, y, 'E')); };
export const effort = (p, S) => { [[6, 3], [7, 3], [8, 4], [9, 4], [12, 4], [13, 4], [14, 3], [15, 3]].forEach(([x, y]) => S(x, y, 'E')); };
export const surprised = (p, S) => EY.forEach(([a, b]) => { S(a, 4, 'E'); S(b, 4, 'E'); });
export const meh = (p, S) => { [7, 8, 13, 14].forEach(x => S(x, 5, 'C')); [6, 7, 8, 9, 12, 13, 14, 15].forEach(x => S(x, 3, 'E')); };
export const skep1 = (p, S) => { S(12, 3, 'E'); S(13, 3, 'E'); S(14, 3, 'E'); S(15, 3, 'E'); };
export const skep = (p, S) => { S(7, 5, 'C'); S(8, 5, 'C'); S(6, 4, 'E'); S(7, 4, 'E'); S(8, 4, 'E'); S(9, 4, 'E'); S(12, 3, 'E'); S(13, 2, 'E'); S(14, 2, 'E'); S(15, 3, 'E'); };
export const skepBlink = (p, S) => { S(13, 5, 'C'); S(14, 5, 'C'); };
export const focus = (p, S) => [7, 8, 13, 14].forEach(x => { S(x, 5, 'C'); S(x, 7, 'E'); });
export const almost = (p, S) => { [7, 8, 13, 14].forEach(x => { S(x, 5, 'C'); S(x, 7, 'E'); }); [[8, 3], [9, 3], [6, 4], [7, 4], [12, 3], [13, 3], [14, 4], [15, 4]].forEach(([x, y]) => S(x, y, 'E')); };
export const ohMouth = (p, S) => { [7, 8, 13, 14].forEach(x => S(x, 4, 'E')); [7, 8, 13, 14].forEach(x => S(x, 2, 'E')); S(10, 7, 'E'); S(11, 7, 'E'); };

// 3/4-Ansichten: rechts Augen bei 9–10/14–15, links bei 6–7/11–12
const QR = [9, 10, 14, 15], QLc = [6, 7, 11, 12];
export const qLook = (left, dx = 0, dy = 0) => (p, S) => { const cols = left ? QLc : QR; cols.forEach(x => { S(x, 5, 'C'); S(x, 6, 'C'); }); cols.forEach(x => { S(x + dx, 5 + dy, 'E'); S(x + dx, 6 + dy, 'E'); }); };
export const qBlink = (left) => (p, S) => (left ? QLc : QR).forEach(x => S(x, 5, 'C'));
export const qHappy = (left) => (p, S) => { (left ? [6, 11] : [9, 14]).forEach(x0 => caret(S, x0)); };
export const qEffort = (left) => (p, S) => (left ? [[5, 3], [6, 3], [7, 4], [10, 4], [11, 3], [12, 3]] : [[8, 3], [9, 3], [10, 4], [13, 4], [14, 3], [15, 3]]).forEach(([x, y]) => S(x, y, 'E'));
export const qSurprised = (left) => (p, S) => (left ? QLc : QR).forEach(x => S(x, 4, 'E'));
// Profil rechts: ein Auge bei 14–15
export const eyeDown = (p, S) => { S(14, 5, 'C'); S(15, 5, 'C'); S(14, 7, 'E'); S(15, 7, 'E'); };
export const sSurprised = (p, S) => { S(14, 4, 'E'); S(15, 4, 'E'); };

// ---------- Arme (vorne: Arm-Spalte links x=2, rechts x=19, Hand bei y=13) ----------
export const clrR = p => { for (let y = 10; y <= 13; y++) p(19, y, '.'); };
export const clrL = p => { for (let y = 10; y <= 13; y++) p(2, y, '.'); };
export const armHalfR = p => { clrR(p); L([[19, 10, 'N'], [20, 10, 'N'], [21, 10, 'N'], [20, 11, 'n'], [21, 11, 'n'], [22, 10, 'C'], [22, 11, 'C']])(p); };
export const waveA = p => { clrR(p); L([[19, 10, 'N'], [20, 10, 'N'], [20, 9, 'N'], [21, 9, 'N'], [21, 8, 'N'], [22, 8, 'N'], [22, 7, 'C'], [23, 7, 'C'], [22, 6, 'C'], [23, 6, 'C']])(p); };
export const waveB = p => { clrR(p); L([[19, 10, 'N'], [20, 10, 'N'], [21, 10, 'N'], [21, 9, 'N'], [22, 9, 'N'], [23, 9, 'N'], [23, 8, 'N'], [24, 8, 'C'], [25, 8, 'C'], [24, 7, 'C'], [25, 7, 'C']])(p); };
export const armUpL = p => { clrL(p); L([[2, 10, 'N'], [1, 10, 'N'], [1, 9, 'N'], [0, 9, 'N'], [0, 8, 'N'], [-1, 8, 'N'], [-1, 7, 'C'], [-2, 7, 'C'], [-1, 6, 'C'], [-2, 6, 'C']])(p); };
export const armsUp = p => { waveA(p); armUpL(p); };
export const point = (tap) => p => { clrR(p); const t = tap ? 1 : 0; L([[19, 10, 'N'], [20, 10, 'N'], [21, 10, 'N'], [21, 9, 'N'], [22, 9, 'N'], [23, 9, 'N'], [22, 10, 'n'], [23, 10, 'n']])(p); if (t) { p(24, 9, 'N'); p(24, 10, 'n'); } L([[24 + t, 9, 'C'], [24 + t, 10, 'C'], [25 + t, 9, 'C']])(p); };
export const thumb = (up) => p => { clrR(p); L([[19, 10, 'N'], [20, 10, 'N'], [20, 9, 'N'], [21, 9, 'N'], [21, 7, 'C'], [22, 7, 'C'], [21, 8, 'C'], [22, 8, 'C']])(p); if (up) { p(21, 6, 'C'); p(21, 5, 'C'); } };
export const fingerUp = p => { clrR(p); L([[19, 10, 'N'], [20, 10, 'N'], [20, 9, 'N'], [21, 9, 'N'], [21, 8, 'N'], [21, 7, 'C'], [22, 7, 'C'], [21, 6, 'C'], [21, 5, 'C']])(p); };
export const shrugArms = p => { clrL(p); clrR(p); L([[2, 10, 'N'], [1, 10, 'N'], [0, 10, 'N'], [-1, 9, 'C'], [-2, 9, 'C'], [-1, 10, 'C'], [-2, 10, 'C'], [19, 10, 'N'], [20, 10, 'N'], [21, 10, 'N'], [22, 9, 'C'], [23, 9, 'C'], [22, 10, 'C'], [23, 10, 'C']])(p); };
export const signArm = (lift) => p => { clrR(p); L([[19, 10, 'N'], [20, 10, 'N'], [20, 9, 'N'], [21, 9, 'N'], [20, 8 - lift, 'N'], [21, 8 - lift, 'N'], [21, 7 - lift, 'C'], [22, 7 - lift, 'C'], [21, 6 - lift, 'C'], [22, 6 - lift, 'C']])(p); };

// Profil rechts: Arm nach vorn (hält etwas vor sich) bzw. schwingender Arm beim Laufen
export const sArmFwd = p => {
  for (let y = 9; y <= 15; y++) for (let x = 6; x <= 11; x++) p(x, y, 'N');
  for (let x = 8; x <= 16; x++) { const y = x < 13 ? 10 : 9; p(x, y, 'l'); p(x, y + 1, 'l'); p(x, y + 2, 'O'); }
  p(17, 9, 'C'); p(17, 10, 'C');
};
export const sideArm = (o) => p => {
  for (let y = 9; y <= 15; y++) for (let x = 6; x <= 11; x++) p(x, y, 'N');
  p(8 + o, 9, 'l'); p(9 + o, 9, 'l');
  for (let y = 10; y <= 12; y++) { p(7 + o, y, 'O'); p(8 + o, y, 'l'); p(9 + o, y, 'l'); p(10 + o, y, 'O'); }
  for (let y = 13; y <= 14; y++) { p(7 + o, y, 'O'); p(8 + o, y, 'C'); p(9 + o, y, 'C'); p(10 + o, y, 'O'); }
  p(8 + o, 15, 'O'); p(9 + o, 15, 'O');
};

// ---------- Füße ----------
export const sideFeet = (mode) => p => {
  for (let x = 0; x < 22; x++) p(x, 17, '.');
  if (mode === 'pass') { for (let x = 7; x <= 13; x++) p(x, 17, 'W'); p(14, 17, 'w'); }
  else { const back = mode === 'a' ? 'x' : 'W', front = mode === 'a' ? 'W' : 'x'; for (let x = 4; x <= 7; x++) p(x, 17, back); p(8, 17, 'w'); for (let x = 12; x <= 15; x++) p(x, 17, front); p(16, 17, 'w'); }
};
export const kickR = p => { for (let x = 12; x <= 19; x++) p(x, 17, '.'); for (let x = 15; x <= 18; x++) p(x, 16, 'W'); p(19, 16, 'w'); };
export const kickL = p => { for (let x = 2; x <= 9; x++) p(x, 17, '.'); for (let x = 3; x <= 6; x++) p(x, 16, 'W'); p(2, 16, 'w'); };
export const toeUp = p => { p(16, 17, '.'); p(17, 17, '.'); };
export const tapMark = p => { p(19, 17, 'w'); p(20, 16, 'w'); };

/** Lauf-Zyklus im Profil (rechts). Liefert n Frames, dx wächst pro Frame um step. */
export function walkFrames(count, { x0 = 0, step = 2, ms = 130 } = {}) {
  const seq = [['a', 1, 0], ['pass', 0, -1], ['b', -1, 0], ['pass', 0, -1]];
  return Array.from({ length: count }, (_, i) => { const [m, arm, dy] = seq[i % 4]; return frame([sideFeet(m), sideArm(arm)], ms, { view: 'S', dx: x0 + step * i, dy }); });
}

// ---------- Sitzen auf einer Kante (vorne): Schoß auf der Sitzfläche y 16, Unterschenkel hängen vor dem Element ----------
// Reihenfolge: Element (rect ab y 16), sitLap, sitLegs. lift je Bein: 0 = hängt, 1 = halb nach vorn, 2 = ganz nach vorn (Sohle sichtbar).
const LAP = [
  '.CCOOOOOOOOOOOOOOOOCC.',
  'OCCNNNNNNnOONNNNNNnCCO',
  'OnnnnnnnnnOOnnnnnnnnnO'
];
export const sitLap = p => { for (let x = 0; x < 22; x++) p(x, 17, '.'); LAP.forEach((r, j) => [...r].forEach((c, i) => { if (c !== '.') p(i, 13 + j, c); })); };
// Unterschenkel liegen über dem Element → eigene Kontur, da die Auto-Kontur nur leere Pixel umrandet.
export const sitLegs = (liftL = 0, liftR = 0) => p => {
  const px = [];
  // Fuß von vorn (Spitze zur Kamera): 3 × 2, leicht nach außen versetzt; ganz vorn geschwungen zeigt die untere Reihe die Sohle.
  [[5, liftL, -1], [15, liftR, 0]].forEach(([x0, lift, out]) => {
    const sy = 19 - lift, fx = x0 + out;
    for (let y = 16; y < sy; y++) px.push([x0, y, 'N'], [x0 + 1, y, 'n']);
    px.push([fx, sy, 'W'], [fx + 1, sy, 'W'], [fx + 2, sy, 'w']);
    px.push(...(lift === 2 ? [[fx, sy + 1, 'x'], [fx + 1, sy + 1, 'x'], [fx + 2, sy + 1, 'x']] : [[fx, sy + 1, 'W'], [fx + 1, sy + 1, 'w'], [fx + 2, sy + 1, 'w']]));
  });
  const key = new Set(px.map(([x, y]) => `${x},${y}`));
  px.forEach(([x, y]) => [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { const X = x + a, Y = y + b; if (Y >= 16 && !key.has(`${X},${Y}`)) p(X, Y, 'O'); }));
  px.forEach(([x, y, c]) => p(x, y, c));
};
