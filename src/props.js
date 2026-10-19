// Melly – Objekte & Effekte. Gleiche Baustein-Signatur wie in core.js: (p, S) => void.
import { L, sprite, clrL, clrR, caret, limb, arm } from './core.js';

// ---------- Effekte ----------
/** Sitzt eine Kopfbedeckung (outfit.hat) auf dem Kopf? opt.hut = abgenommen (in der Hand oder abgestellt). */
const hatOn = opt => !!opt?.outfit?.hat && !opt.hut;
export const spark = (x, y, big) => p => { p(x, y, 'H'); if (big) { p(x - 1, y, 'H'); p(x + 1, y, 'H'); p(x, y - 1, 'H'); p(x, y + 1, 'H'); } };
export const star = (x, y) => spark(x, y, true);
export const dot = (x, y, s) => p => { for (let i = 0; i < s; i++) for (let j = 0; j < s; j++) p(x + i, y + j, 'C'); };
/** Dampfwölkchen; mit Kopfbedeckung (outfit.hat) 5 px nach außen und 1 höher, sonst verschmilzt die Kontur mit Krempe/Schirm. */
export const puff = (x, y, c = 'Z') => (p, S, opt) => { const h = hatOn(opt), o = h ? (x < 11 ? -5 : 5) : 0, v = h ? -1 : 0; L([[x + o, y + v, c], [x + o + 1, y + v, c], [x + o, y + v - 1, c]])(p); };
/** Staubwolke (3 breit, gewölbt): liest sich mit Kontur als Wolke statt als Strich. */
export const cloud = (x, y, c = 'Z', flip = false) => L(flip
  ? [[x, y, c], [x + 1, y, c], [x + 2, y, c], [x + 1, y - 1, c], [x + 2, y - 1, c], [x + 1, y - 2, c]] // gespiegelt (rechte Seite)
  : [[x, y, c], [x + 1, y, c], [x + 2, y, c], [x, y - 1, c], [x + 1, y - 1, c], [x + 1, y - 2, c]]);
/** Schweißtropfen an der Schläfe; mit Kopfbedeckung (outfit.hat) unter die Schirmspitze gerückt. */
const drop = (cells, dx) => (p, S, opt) => { const h = hatOn(opt); L(cells.map(([x, y, c]) => [x + (h ? dx : 0), y + (h ? 3 : 0), c]))(p); };
export const sweat = drop([[19, 2, 'B'], [19, 3, 'B'], [18, 3, 'B']], 1);
export const sweatL = drop([[2, 2, 'B'], [2, 3, 'B'], [3, 3, 'B']], -1);
export const bang = L([[22, -3, 'A'], [22, -2, 'A'], [22, -1, 'A'], [22, 1, 'A']]);
/** Ausrufezeichen über dem Kopf (Profil); mit Kopfbedeckung (outfit.hat) vor die Stirn gerückt. */
export const sBang = (p, S, opt) => { const x = hatOn(opt) ? 25 : 15; L([[x, -5, 'R'], [x, -4, 'R'], [x, -3, 'R'], [x, -1, 'R']])(p); };
/** Musiknoten (Breite × 5): Viertel, Achtel, zwei Achtel mit Balken. */
const NOTES = {
  viertel: ['.H', '.H', '.H', 'HH', 'HH'],
  achtel: ['.HH', '.H.', '.H.', 'HH.', 'HH.'],
  achtel2: ['.HHHH', '.H..H', '.H..H', 'HH.HH', 'HH.HH']
};
export const NOTE_W = Object.fromEntries(Object.entries(NOTES).map(([k, r]) => [k, r[0].length]));
/** Note an (x, y) = obere linke Ecke, Farbe c (Messing H, verblassend h). */
export const note = (type, x, y, c = 'H') => sprite(NOTES[type].map(r => r.replace(/H/g, c)), x, y);
/** Zauberstab in der rechten Hand, passend zur Armstellung: down (hängt), half (armHalfR), up (waveA), swing (waveB), point (point). */
const WAND = {
  down: [[20, 12], [21, 11], [22, 10]], half: [[23, 9], [24, 8], [25, 7]], up: [[24, 5], [25, 4], [26, 3]],
  swing: [[25, 6], [26, 5], [27, 4]], point: [[26, 10], [27, 10], [28, 11]]
};
export const wand = (pos) => p => WAND[pos].forEach(([x, y], i) => p(x, y, i === 2 ? 'h' : 'k'));
/** Herbeigezaubertes Mini-Dashboard, schwebt über Mellys rechter Hand (Bildseite links, arm('L', 135, 135), Hand x −3..−2, y 6–7):
 *  weiße Karte mit dunkler Kopfzeile, k = Anzahl sichtbarer Balken (dunkel, höchster Messing), bob hebt sie 1 px (Schweben). */
export const magicCard = (k, bob = 0) => p => {
  const y0 = -1 - bob, x0 = -6;
  for (let x = 0; x < 7; x++) { p(x0 + x, y0, 'G'); for (let y = 1; y <= 5; y++) p(x0 + x, y0 + y, 'W'); }
  [[1, 1, 'G'], [3, 2, 'G'], [5, 3, 'H']].slice(0, k).forEach(([c, h, t]) => { for (let j = 0; j < h; j++) p(x0 + c, y0 + 4 - j, t); });
};
/** Zauberwolke über der Hand, bevor das Dashboard erscheint. */
export const magicPuff = p => { cloud(-6, 3)(p); cloud(-3, 3, 'Z', true)(p); };
// ---------- Angeln im Profil (rechts), sitzend auf einer Kante: Sitzfläche y 16 bis x 13, Beine hängen davor ----------
/** Beine in Wathose über die Kante: nahes Bein vorn (hell), fernes dahinter (dunkel); je Bein 0 = hängt, 1 = schwingt nach vorn. Stiefel t/k. */
export const dangle = (near = 0, far = 0) => p => {
  for (let x = 0; x < 22; x++) p(x, 17, '.');
  const leg = (x0, s, c, boot) => {
    const px = s ? [[x0 + 1, 16], [x0 + 2, 16], [x0 + 2, 17], [x0 + 3, 17]] : [[x0, 16], [x0 + 1, 16], [x0, 17], [x0 + 1, 17]];
    px.forEach(([x, y]) => p(x, y, c));
    const bx = s ? x0 + 3 : x0;
    for (let i = 0; i < 3; i++) p(bx + i, 18, boot); p(bx + 3, 18, 't');
  };
  leg(12, far, 't', 'k');
  leg(14, near, 'T', 't');
};
/** Angelrute in der vorgestreckten Hand (sArmFwd, Hand x 17, y 9–10). rest (45°, Spitze wippt mit bob), bend (Biss, Spitze tiefer), pull (steil). */
export const RODS = {
  rest: [[18, 8], [19, 7], [20, 6], [21, 5], [22, 4], [23, 3], [24, 2], [25, 1]],
  bend: [[18, 8], [19, 7], [20, 6], [21, 5], [22, 5], [23, 4], [24, 4], [25, 4]],
  pull: [[18, 8], [18, 7], [19, 6], [19, 5], [20, 4], [20, 3], [21, 2], [21, 1], [22, 0]],
  // Auswerfen: senkrecht ausholen → über den Kopf nach hinten (Rute biegt sich) → nach vorn schnellen (flach)
  up: [[18, 8], [19, 7], [19, 6], [19, 5], [19, 4], [19, 3], [19, 2], [19, 1], [19, 0], [19, -1], [19, -2], [18, -3]],
  back: [[18, 8], [19, 7], [19, 6], [19, 5], [19, 4], [19, 3], [19, 2], [18, 1], [18, 0], [17, -1], [16, -2], [15, -3], [14, -3], [13, -4], [12, -4]],
  cast: [[18, 8], [19, 8], [20, 7], [21, 7], [22, 7], [23, 6], [24, 6], [25, 6], [26, 5]]
};
export const fishRod = (mode, bob = 0) => p => {
  const pts = RODS[mode].map(([x, y], i, a) => [x, i >= a.length - 2 ? y + bob : y]);
  pts.forEach(([x, y], i) => p(x, y, i < 2 ? 'k' : 'j'));
  p(18, 9, 'G');
};
/** Schnur von der Rutenspitze senkrecht bis y1, darunter Schwimmer (rot/weiß) oder die gefangene Tabelle (catch) mit Oberkante bei y1. */
export const fishLine = (mode, y1, { bob = 0, catch: caught = false } = {}) => p => {
  const [tx, ty] = RODS[mode].at(-1), x = tx + 1, top = ty + (mode === 'rest' ? bob : 0) + 1;
  for (let y = top; y < y1; y++) p(x, y, 'G');
  if (caught) ['kkkk', 'WgWW', 'gggg', 'WgWW'].forEach((r, j) => [...r].forEach((c, i) => p(x - 1 + i, y1 + j, c)));
  else { p(x, y1, 'R'); p(x, y1 + 1, 'W'); }
};
/** Fliegende Schnur beim Auswerfen: Linienzug von der Rutenspitze (mode) über die Stützpunkte pts, Schwimmer am letzten Punkt
 *  (rot oben, weiß unten). So bleibt die Schnur beim Ausholen lang und hoch hinter ihm und rollt beim Werfen nach vorn ab. */
export const flyLine = (mode, pts) => p => {
  const [tx, ty] = RODS[mode].at(-1), all = [[tx, ty], ...pts];
  for (let k = 1; k < all.length; k++) {
    const [x0, y0] = all[k - 1], [x1, y1] = all[k], n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let i = 1; i <= n; i++) p(Math.round(x0 + (x1 - x0) * i / n), Math.round(y0 + (y1 - y0) * i / n), 'G');
  }
  const [bx, by] = all.at(-1); p(bx, by, 'R'); p(bx, by + 1, 'W');
};
/** Spritzer, wo der Schwimmer (x, y) aufs Wasser trifft. */
export const splash = (x, y) => L([[x - 2, y, 'B'], [x + 2, y, 'B'], [x - 1, y - 1, 'B'], [x + 1, y - 1, 'B']]);
// ---------- Lager (vorne): Regal rechts, Kisten 6×4 aus Pappe (Jute-Töne) mit Klebeband und Etikett ----------
const CRATE = ['JJhhJJ', 'JJJJJj', 'JWWWJj', 'JJJJjj'];
/** Kiste mit linker oberer Ecke (x, y). */
export const crate = (x, y) => sprite(CRATE, x, y);
/** Regal rechts neben Melly: Pfosten x 21 und 28, Böden y 6 und 12, unten steht schon eine Kiste; top = oberes Fach belegt. */
export const shelf = (top = false) => p => {
  for (let y = 1; y <= 17; y++) { p(21, y, 'G'); p(28, y, 'G'); }
  for (let x = 22; x <= 27; x++) { p(x, 6, 'g'); p(x, 12, 'g'); }
  crate(22, 13)(p);
  if (top) crate(22, 8)(p);
};
/** Beide Arme vor dem Bauch, Hände an den Seiten einer Kiste (x 8–13, y 11–14), die darüber gezeichnet wird. */
export const carry = (p, S) => {
  limb('L', [[2, 10, 'N'], [3, 10, 'N'], [3, 11, 'N'], [4, 11, 'N'], [5, 11, 'N'], [5, 12, 'N'], [6, 12, 'C'], [7, 12, 'C'], [6, 13, 'C'], [7, 13, 'C']])(p, S);
  limb('R', [[19, 10, 'N'], [18, 10, 'N'], [18, 11, 'N'], [17, 11, 'N'], [16, 11, 'N'], [16, 12, 'N'], [15, 12, 'C'], [14, 12, 'C'], [15, 13, 'C'], [14, 13, 'C']])(p, S);
};
export const tick = (x, y) => L([[x, y + 1, 'V'], [x + 1, y + 2, 'V'], [x + 2, y + 1, 'V'], [x + 3, y, 'V']]);
const Z4 = ['####', '..#.', '.#..', '####'], Z5 = ['#####', '...#.', '..#..', '.#...', '#####'];
const zs = rows => rows.map(r => r.replace(/#/g, 'Z'));
const SLOTS = [[18, 1, Z4], [20, -3, Z4], [22, -7, Z5], [24, -12, Z5]];
/** Z-Slot i (0 unten … 3 oben); mit Kopfbedeckung (outfit.hat) rücken die unteren Slots vom Schirm/Bommel weg nach rechts. */
export const zSlot = (i, ox = 0, oy = 0) => (p, S, opt) => { const [x, y, m] = SLOTS[i], h = hatOn(opt) ? [4, 3, 2, 0][i] : 0, v = hatOn(opt) && i === 0 ? 3 : 0; sprite(zs(m), x + ox + h, y + oy + v)(p); };
export const heart = L([[20, 2, 'R'], [22, 2, 'R'], [19, 3, 'R'], [20, 3, 'R'], [21, 3, 'R'], [22, 3, 'R'], [23, 3, 'R'], [20, 4, 'R'], [21, 4, 'R'], [22, 4, 'R'], [21, 5, 'R']]);

// Kopf-Rotfärbung für „Sauer“ (als frame-Option pal)
export const RED = [{ C: '#F4F2EC', c: '#D9D4C7' }, { C: '#F6D3C8', c: '#E0B4A6' }, { C: '#F0A898', c: '#D88A79' }, { C: '#E8766A', c: '#C95A4F', P: '#C24A40' }];

// ---------- Schild (rechte Hand, Stange mittig) ----------
export const sign = (lift, lines) => p => {
  const top = -8 - lift, x0 = 15, x1 = 28;
  for (let y = top; y <= top + 6; y++) for (let x = x0; x <= x1; x++) p(x, y, 'W');
  for (let x = x0 + 1; x <= x1; x++) p(x, top + 6, 'w'); for (let y = top + 1; y <= top + 6; y++) p(x1, y, 'w');
  if (lines) { for (let x = x0 + 3; x <= x1 - 3; x++) p(x, top + 2, 'g'); for (let x = x0 + 5; x <= x1 - 5; x++) p(x, top + 4, 'g'); }
  for (let y = top + 7; y <= 5 - lift; y++) { p(21, y, 'G'); p(22, y, 'G'); }
};

// ---------- Profil: Klemmbrett schräg vor sich, Lupe, Stift, Käfer ----------
const BOARD = [[18, 13], [19, 12], [20, 12], [21, 11], [22, 10], [23, 10], [24, 9]];
export const board = p => { BOARD.forEach(([x, y]) => { p(x, y, 'G'); p(x, y - 1, 'g'); }); p(24, 7, 'G'); p(25, 8, 'G'); p(22, 12, 'C'); p(23, 12, 'C'); };
export const lensS = (bug) => p => {
  [[20, 5], [21, 5], [22, 5], [19, 6], [23, 6], [19, 7], [23, 7], [20, 8], [21, 8], [22, 8]].forEach(([x, y]) => p(x, y, 'G'));
  [[20, 6], [21, 6], [22, 6], [20, 7], [21, 7], [22, 7]].forEach(([x, y]) => p(x, y, 'B'));
  if (bug) { p(21, 6, 'R'); p(22, 6, 'R'); p(21, 7, 'O'); p(22, 7, 'R'); }
  p(18, 8, 'G'); p(19, 8, 'G');
};
export const penS = (up) => L([[18, 8 - up, 'G'], [19, 7 - up, 'G'], [20, 8 - up, 'k']]);
export const bugS = (x, y) => L([[x, y, 'R'], [x + 1, y, 'R'], [x - 1, y, 'O'], [x + 2, y, 'O']]);

// ---------- Laptop (hochgehalten, Deckel zu uns, Augen schauen drüber) ----------
export const laptop = () => p => {
  clrL(p); clrR(p);
  for (let y = 7; y <= 14; y++) for (let x = 4; x <= 17; x++) p(x, y, 'G');
  for (let x = 4; x <= 17; x++) p(x, 7, 'g'); for (let y = 7; y <= 14; y++) p(4, y, 'g');
  for (let x = 5; x <= 17; x++) p(x, 14, 'k'); for (let y = 8; y <= 14; y++) p(17, y, 'k');
  for (let x = 4; x <= 17; x++) p(x, 15, 'w');
  p(10, 10, 'H'); p(11, 10, 'H'); p(10, 11, 'H'); p(11, 11, 'H');
  L([[2, 10, 'N'], [2, 11, 'N'], [3, 11, 'C'], [3, 12, 'C'], [19, 10, 'N'], [19, 11, 'N'], [18, 11, 'C'], [18, 12, 'C']])(p);
};

/** Laptop beim Aufklappen/Zuklappen (Deckel zu uns, Scharnier unten bei y 15): h = Deckelhöhe 0 (zu, Platte) … 8 (offen, wie laptop()).
 *  Hände greifen mit wachsendem Deckel höher. Kein Laptop bei h < 0 (nur die Platte als Strich, für das Herausholen/Verstauen). */
export const laptopOpen = (h) => p => {
  if (h === -1) { for (let x = 8; x <= 13; x++) p(x, 15, 'w'); return; }                       // erste Andeutung der Platte
  if (h === -2) { for (let x = 6; x <= 15; x++) { p(x, 14, 'g'); p(x, 15, 'w'); } return; }    // Platte wächst
  clrL(p); clrR(p);
  const top = h === 0 ? 14 : 15 - h;
  for (let y = top; y <= 14; y++) for (let x = 4; x <= 17; x++) p(x, y, 'G');
  for (let x = 4; x <= 17; x++) p(x, top, 'g'); for (let y = top; y <= 14; y++) p(4, y, 'g');
  if (top < 14) { for (let x = 5; x <= 17; x++) p(x, 14, 'k'); for (let y = top + 1; y <= 14; y++) p(17, y, 'k'); }
  for (let x = 4; x <= 17; x++) p(x, 15, 'w');
  if (top <= 9) { p(10, 10, 'H'); p(11, 10, 'H'); p(10, 11, 'H'); p(11, 11, 'H'); }
  const hy = h < 3 ? 13 : h < 6 ? 12 : 11;
  for (let y = 10; y <= hy; y++) { p(2, y, 'N'); p(19, y, 'N'); }
  p(3, hy, 'C'); p(3, hy + 1, 'C'); p(18, hy, 'C'); p(18, hy + 1, 'C');
};

// ---------- Kaffee ----------
const cupAt = (S, x0, y0, steam) => {
  for (let y = y0 - 1; y <= y0 + 3; y++) for (let x = x0 - 1; x <= x0 + 4; x++) S(x, y, 'O');
  for (let y = y0; y <= y0 + 2; y++) for (let x = x0; x <= x0 + 2; x++) S(x, y, 'W');
  S(x0, y0, 'A'); S(x0 + 1, y0, 'A'); S(x0 + 2, y0, 'A'); S(x0 + 3, y0 + 1, 'W');
  if (steam === 1) L([[x0 + 1, y0 - 3, 'g'], [x0, y0 - 4, 'g'], [x0 + 1, y0 - 5, 'g']])(S);
  if (steam === 2) L([[x0, y0 - 3, 'g'], [x0 + 1, y0 - 4, 'g'], [x0, y0 - 5, 'g']])(S);
};
/** pos 0 = Brust, 1 = Zwischenposition, 2 = am Mund */
export const mug = (pos, steam) => (p, S) => {
  clrR(p);
  if (pos === 0) {
    for (let y = 11; y <= 13; y++) for (let x = 14; x <= 16; x++) p(x, y, 'W'); p(14, 11, 'A'); p(15, 11, 'A'); p(16, 11, 'A');
    L([[17, 12, 'W'], [19, 10, 'N'], [19, 11, 'N'], [18, 12, 'C'], [18, 11, 'C']])(p);
    if (steam === 1) L([[15, 9, 'g'], [14, 8, 'g'], [15, 7, 'g']])(p);
    if (steam === 2) L([[14, 9, 'g'], [15, 8, 'g'], [14, 7, 'g']])(p);
  } else if (pos === 1) {
    cupAt(S, 11, 9, 0);
    L([[15, 10, 'C'], [15, 11, 'C'], [16, 11, 'l'], [17, 11, 'l'], [18, 10, 'l'], [19, 10, 'N'], [16, 12, 'O'], [17, 12, 'O']])(p);
  } else {
    cupAt(S, 10, 6, steam);
    L([[14, 7, 'C'], [14, 8, 'C'], [15, 8, 'l'], [16, 9, 'l'], [17, 9, 'l'], [18, 10, 'l'], [19, 10, 'N'], [15, 9, 'O'], [16, 10, 'O'], [17, 10, 'O']])(S);
    caret(S, 7); caret(S, 13);
  }
};

// ---------- Glühbirne ----------
/** Über dem Kopf; mit Kopfbedeckung (outfit.hat) links oben daneben, da über Mütze/Helm kein Platz bleibt (Oberkante y −10). */
export const bulb = (on) => (p, S, opt) => {
  const g = on ? 'Y' : 'w', o = hatOn(opt) ? -12 : 0, q = (x, y, c) => p(x + o, y, c);
  ['.###.', '#####', '#####', '.###.'].forEach((r, j) => [...r].forEach((c, i) => { if (c === '#') q(8 + i, -8 + j, g); }));
  q(9, -4, 'g'); q(10, -4, 'g'); q(11, -4, 'g'); q(10, -3, 'g');
  if (on) { q(9, -7, 'X'); [[6, -7], [14, -7], [10, -10], [7, -10], [13, -10]].forEach(([x, y]) => q(x, y, 'Y')); }
};

// ---------- Facepalm-Hand (Fäustling) & Gähn-Mund ----------
export const palm = (on) => (p, S) => {
  clrR(p);
  if (!on) { L([[19, 10, 'N'], [20, 9, 'N'], [20, 8, 'N'], [20, 7, 'C'], [21, 7, 'C'], [20, 6, 'C'], [21, 6, 'C']])(p); return; }
  ['.OOOOO.', 'OCCCCCO', 'OCCCCCO', 'OCCCCcO', '.OOcCO.', '...OO..'].forEach((r, j) => [...r].forEach((c, i) => { if (c !== '.') S(10 + i, 3 + j, c); }));
  S(9, 5, 'O'); S(9, 6, 'O'); S(10, 5, 'C'); S(10, 6, 'C');
  L([[15, 8, 'l'], [16, 8, 'l'], [16, 9, 'l'], [17, 9, 'l'], [17, 10, 'l'], [18, 10, 'l'], [15, 9, 'O'], [16, 10, 'O'], [17, 11, 'O']])(S); p(19, 10, 'N');
  S(7, 5, 'C'); S(8, 5, 'C');
};
/** Facepalm in Stufen (rechte Hand, Handgröße bleibt klein): 1 = Hand an der Wange, 2 = auf dem Weg zum Auge,
 *  3 = Handfläche über dem rechten Auge, 4 = 1 px heruntergerutscht. */
export const facepalm = (stage) => {
  const root = [[19, 10, 'N'], [20, 10, 'N'], [19, 9, 'N'], [20, 9, 'N']];
  if (stage === 1 || stage === 2) {
    const hx = stage === 1 ? 17 : 15, arm1 = stage === 1 ? [[19, 8], [20, 8], [18, 7], [19, 7]] : [[18, 8], [19, 8], [17, 7], [18, 7]];
    return (p, S) => {
      limb('R', root, arm1.map(([x, y]) => [x, y, 'N']))(p, S);
      const tone = stage === 1 ? 'C' : 'c'; // Kontrast zum Untergrund: Wange rechts ist schattiert (c), Gesichtsmitte hell (C)
      [[0, 5], [1, 5], [0, 6], [1, 6]].forEach(([i, y]) => S(hx + i, y, tone)); S(hx, 7, 'O'); S(hx + 1, 7, 'O');
      if (stage === 1) { S(hx - 1, 5, 'O'); S(hx - 1, 6, 'O'); } // Wange: Kontur links + unten, oben offen (kein geschlossener Ring)
    };
  }
  const d = stage === 4 ? 1 : 0, up = [[18, 8], [19, 8], [17, 7], [18, 7], [16, 6], [17, 6]].map(([x, y]) => [x, y + d, 'N']);
  // Flache Hand liegt auf dem Gesicht: Schattenton c, Kontur nur unten und an den Fingerspitzen (ein geschlossener Ring läse sich als Lupe)
  return (p, S) => {
    limb('R', root, up)(p, S);
    for (let x = 11; x <= 15; x++) { S(x, 5 + d, 'c'); S(x, 6 + d, 'c'); S(x, 7 + d, 'O'); }
    S(10, 5 + d, 'O'); S(10, 6 + d, 'O'); S(16, 7 + d, 'O');
    S(7, 5, 'C'); S(8, 5, 'C');
  };
};
/** Hand ans Kinn (rechts, vorne): 1 = Unterarm hebt sich vor der Brust, 2 = auf halbem Weg, 3 = Hand unterm Kinn auf dem Revers;
 *  tap = Hand löst sich 1 px vom Kinn (Tippen, nur 3). */
export const chin = (stage, tap = false) => {
  const upper = [[19, 10, 'N'], [19, 11, 'N'], [19, 12, 'N']];
  if (stage === 1) return limb('R', [...upper, [18, 12, 'N'], [17, 10, 'C'], [18, 10, 'C'], [17, 11, 'C'], [18, 11, 'C']]);
  if (stage === 2) return limb('R', [...upper, [17, 12, 'N'], [18, 12, 'N'], [17, 11, 'N'], [18, 11, 'N'], [15, 10, 'C'], [16, 10, 'C'], [15, 11, 'C'], [16, 11, 'C']]);
  const t = tap ? 1 : 0; // Tippen: Hand löst sich 1 px vom Kinn
  return limb('R', [...upper, [17, 12, 'N'], [18, 12, 'N'], [16, 11, 'N'], [17, 11, 'N'], [15, 10 + t, 'N'], [16, 10 + t, 'N'], [13, 9 + t, 'C'], [14, 9 + t, 'C'], [13, 10 + t, 'C'], [14, 10 + t, 'C']]);
};
/** Klatsch-Striche beim Facepalm (hellgrau, folgen dem Kopf): k = 1 nah, 2 weiter außen. */
export const slap = (k) => (p, S) => {
  const o = k - 1;
  L([[18 + o, -1 - o, 'w'], [19 + o, -2 - o, 'w'], [21 + o, 3, 'w'], [22 + o, 3, 'w'], [23 + o, 5 + o, 'w'], [24 + o, 6 + o, 'w']])(S); // drei Striche strahlenförmig
};
/** Blick auf die Uhr (linker Arm, vorne): Unterarm hebt sich über Zwischenstufen neben den Kopf, 3 = Uhr am Handgelenk
 *  frei vor dem Hintergrund (graues Band, Ziffernblatt Messing). Blick dazu: look(-1). */
export const watch = (stage) => {
  if (stage === 1) return arm('L', 0, 90);
  if (stage === 2) return arm('L', 26.5, 116.5);
  return (p, S) => { arm('L', 45, 180)(p, S); p(0, 10, 'H'); p(1, 10, 'G'); p(0, 11, 'G'); p(1, 11, 'G'); }; // Uhr 2×2: Messing-Ziffernblatt, graues Band
};
export const yawn = (size) => (p, S) => {
  [7, 8, 13, 14].forEach(x => { S(x, 5, 'C'); S(x, 6, 'E'); });
  S(6, 5, 'E'); S(9, 5, 'E'); S(12, 5, 'E'); S(15, 5, 'E');
  (size === 1 ? [7] : size === 2 ? [6, 7] : [6, 7, 8]).forEach(y => { S(10, y, 'E'); S(11, y, 'E'); });
  if (size === 3) { S(10, 8, 'P'); S(11, 8, 'P'); }
};

// ---------- Handy ----------
export const phone = (thumbUp, like) => p => {
  clrR(p);
  for (let y = 9; y <= 13; y++) for (let x = 12; x <= 15; x++) p(x, y, 'k');
  p(14, 10, 'H');
  L([[19, 10, 'N'], [18, 11, 'l'], [17, 12, 'l'], [16, 12, 'C'], [16, 11, 'C'], [18, 12, 'O'], [17, 13, 'O']])(p);
  p(15, thumbUp ? 8 : 9, 'C');
  if (like) heart(p);
};

// ---------- Hantel ----------
const bell = (x, y) => p => { for (let j = -1; j <= 1; j++) { p(x, y + j, 'G'); p(x + 1, y + j, 'G'); p(x + 5, y + j, 'G'); p(x + 6, y + j, 'G'); } p(x + 2, y, 'g'); p(x + 3, y, 'g'); p(x + 4, y, 'g'); };
export const curl = (up) => p => { clrR(p); if (!up) { L([[19, 10, 'N'], [19, 11, 'N'], [19, 12, 'N'], [19, 13, 'C'], [20, 13, 'C']])(p); bell(16, 15)(p); } else { L([[19, 10, 'N'], [20, 10, 'N'], [20, 9, 'N'], [20, 8, 'C'], [21, 8, 'C']])(p); bell(17, 6)(p); } };

// ---------- Fußball (2 Drehphasen) ----------
const BALLS = [
  ['..WkW..', '.WWWWW.', 'kWkkkWk', 'WWkkkWW', 'kWWkWWw', '.WWWww.', '..wkw..'],
  ['..kWW..', '.WWWkW.', 'WkkWWWk', 'WkkkWWw', 'WWkWWkw', '.kWWww.', '..wWk..']
];
export const ball = (x, y, spin = 0) => sprite(BALLS[spin % 2], x, y);

// ---------- Pfanne & Ei ----------
export const pan = (tilt, side) => p => {
  if (side === 'L') { clrL(p); L([[2, 10, 'N'], [1, 10, 'N'], [0, 10, 'C'], [0, 11, 'C']])(p); p(-1, 11 - tilt, 'k'); for (let x = -7; x <= -2; x++) { p(x, 11 - tilt, 'G'); p(x, 12 - tilt, 'G'); } return; }
  clrR(p); L([[19, 10, 'N'], [20, 10, 'N'], [21, 10, 'C'], [21, 11, 'C']])(p); p(22, 11 - tilt, 'k'); for (let x = 23; x <= 28; x++) { p(x, 11 - tilt, 'G'); p(x, 12 - tilt, 'G'); }
};
/** alt = [x, y] statt (x, y), wenn eine Kopfbedeckung (outfit.hat) die Flugbahn über dem Kopf belegt. */
export const egg = (x, y, flip, alt) => (p, S, opt) => { const [ex, ey] = alt && hatOn(opt) ? alt : [x, y]; sprite(flip ? ['.WWW.', 'WWWWW', '.WWW.'] : ['.WWW.', 'WWYWW', '.WWW.'], ex, ey)(p); };
export const splat = (x) => L([[x, 17, 'W'], [x + 1, 17, 'W'], [x + 2, 17, 'Y'], [x + 3, 17, 'W'], [x + 4, 17, 'W'], [x + 1, 16, 'W'], [x + 3, 16, 'W']]);
export const panSteam = (k, side) => { const o = side === 'L' ? -30 : 0; return L(k ? [[24 + o, 8, 'g'], [25 + o, 7, 'g'], [24 + o, 6, 'g']] : [[27 + o, 8, 'g'], [26 + o, 7, 'g'], [27 + o, 6, 'g']]); };

// ---------- Telefonieren (3/4 rechts): Handy am sichtbaren Ohr, rechte Hand von außen ----------
export const phoneEar = p => {
  clrL(p);
  for (let y = 2; y <= 8; y++) for (let x = 1; x <= 3; x++) p(x, y, 'G');
  for (let y = 2; y <= 8; y++) p(3, y, 'k');
  p(2, 3, 'g');
  L([[0, 8, 'N'], [1, 8, 'n'], [0, 9, 'N'], [1, 9, 'n'], [1, 10, 'N'], [2, 10, 'N'], [0, 6, 'C'], [1, 6, 'C'], [0, 7, 'C'], [1, 7, 'c']])(p);
};
/** Schallwellen vor dem Gesicht (3/4 rechts): k = 1 klein, 2 klein + groß, 3 nur groß (Welle läuft nach außen) */
export const talk = (k) => p => {
  if (k < 3) L([[22, 4, 'g'], [23, 5, 'g'], [23, 6, 'g'], [22, 7, 'g']])(p);
  if (k > 1) L([[26, 2, 'g'], [27, 3, 'g'], [27, 4, 'g'], [27, 5, 'g'], [27, 6, 'g'], [27, 7, 'g'], [26, 8, 'g']])(p);
};

// ---------- Sack (Jute J/j) ----------
/** Sack links am Boden, linke Hand hält den zugebundenen Hals. */
export const sack = p => {
  clrL(p);
  L([[2, 10, 'N'], [1, 10, 'N'], [0, 10, 'N'], [1, 11, 'n'], [0, 11, 'n'], [-1, 10, 'C'], [-2, 10, 'C'], [-1, 11, 'C'], [-2, 11, 'c']])(p);
  sprite(['..jJ..', '..JJ..', '..GG..', '.JJJJ.', 'JJJJJj', 'JJJJJj', 'JJJJjj', 'JJJJjj', '.JJjj.'], -6, 9)(p);
};

// ---------- Beispiel-Element zum Draufsitzen (Rechteck, Oberkante = Sitzlinie y 16) ----------
export const rect = (x0 = -5, x1 = 26, y0 = 16, y1 = 21) => p => {
  for (let x = x0; x <= x1; x++) p(x, y0, 'O');
  for (let y = y0 + 1; y <= y1; y++) for (let x = x0; x <= x1; x++) p(x, y, x === x1 || y === y1 ? 'w' : 'W');
};

// ---------- Eigene Figur in Ansicht '-' (Liegen, Neigung) ----------
/** Figuren-Baustein: draw(put) zeichnet die Figur in Sprite-Koordinaten, at(i, j) → [x, y] legt sie in die Szene.
 *  Danach zeichnet das Outfit seine Accessoires für diese Figur (outfit.figures[id]) mit derselben Lage darüber. */
const figure = (id, at, draw) => Object.assign((p, S, opt) => {
  const put = (i, j, c) => { const [x, y] = at(i, j); p(x, y, c); };
  draw(put);
  (opt?.outfit?.figures?.[id]?.(opt) || []).forEach(m => m(put, put));
}, { figure: id });

// ---------- Liegend auf der Seite (vorne, Kopf links, liegt auf y 15 auf) ----------
// Eigene Figur statt gedrehter Ansicht: flach aufliegend, oberer Arm über dem Körper, unterer verdeckt, Beine angewinkelt.
const LIE = [
  '...CCCCC................',
  '.CCCCCCCCc..............',
  '.CCCCCCCCcNNNNNNN.......',
  'CCCCCCPCCcNNNNNNNNn.....',
  'CCCCCCCCCWnllllllCCn....',
  'CCCCCECCCWWOOOOOOCCn....',
  'CCCCCECCCaAAANNAANNNn...',
  'CCCCCCCCCaAAANNNNNNNn..W',
  'CCCCCCCCCWWnNNNNNNNNnNNW',
  'CCCCCECCCWnNNNNNNNNNnnnW',
  'CCCCCECCCnNNNNNNNNNNn..w',
  'cCCCCCCCcNNNNNNNNNNNn.x.',
  '.cCCCCPCcNNNNNNNNNNnnnx.',
  '.ccCCCCccnnnnnnnnnnnnnx.',
  '..cccccc..nnnnnnnnnn..x.'
];
/** Liegende Melly (Augen zu = 1 px breite Striche). eyes: 'zu' (Standard) oder 'auf'. headLift hebt den Kopf an (legt sich zuletzt ab).
 *  Ansicht '-' verwenden, sonst ragt die Stehfigur heraus. Figur 'lie': Outfit-Accessoires in Sprite-Koordinaten, Spalte ≤ 8 hebt mit dem Kopf. */
export const lying = (x0 = 0, y0 = 1, eyes = 'zu', headLift = 0) => figure('lie', (i, j) => [x0 + i, y0 + j - (i <= 8 ? headLift : 0)], put => {
  LIE.forEach((r, j) => [...r].forEach((c, i) => { if (c !== '.') put(i, j, c); }));
  if (eyes === 'auf') [[4, 5], [4, 6], [4, 9], [4, 10]].forEach(([x, y]) => put(x, y, 'E'));
});

// ---------- Hinlegen / Aufstehen (vorne): Stand → Hocke → Knien → Neigung → Liegen ----------
const clrFeet = p => { for (let x = 0; x < 22; x++) p(x, 17, '.'); };
/** Hocke (mit dy 1): Körper sinkt auf die Schuhe, Knie gehen auseinander, Schuhe bleiben auf y 17. */
export const squat = p => { clrFeet(p); L([[3, 16, 'W'], [4, 16, 'W'], [5, 16, 'W'], [6, 16, 'w'], [15, 16, 'W'], [16, 16, 'W'], [17, 16, 'W'], [18, 16, 'w']])(p); };
/** Knien (mit dy 2): Füße unter dem Körper, linke Hand stützt am Boden (Figur −1..0 / 16..17, wie in lean). */
export const kneel = p => { clrFeet(p); limb('L', [[1, 10, 'N'], [2, 10, 'N'], [1, 11, 'N'], [2, 11, 'N'], [0, 12, 'N'], [1, 12, 'N'], [0, 13, 'N'], [1, 13, 'N'], [-1, 14, 'C'], [0, 14, 'C'], [-1, 15, 'C'], [0, 15, 'C']])(p); };
// Gezeichnete Neigungsstufen (keine freie Pixelrotation): Körper führt, Kopf zieht nach, Hand bleibt am Boden, Schuh rutscht nach rechts.
const LEAN = {
  26: [-1, 3, [
    '.........CCCCccc......',
    '.......CCCCCCCCcc.....',
    '.....CCCCCCCCCCCcc....',
    '.....CCCCCCCCCCCcc....',
    '....CCCCCCCCEECPCc....',
    '...CCCCCCCCCCCCCCNn...',
    '...CCCCCCCCCCCCNNNnN..',
    '...CCCEECCCCCWnNNNNnN.',
    '...CCCCCCCCaaWnNNAAnN.',
    '...CCPCCCWWAANnNNNNNC.',
    '....CCCNNnWnAANNNNNNn.',
    '.....NNNNNNnAANNNNnNNn',
    '.NNNNNNNNNNNNNNNNNNNN.',
    'CCnnnNNNNNNNNNNNNNN...',
    'CC..nnnNNNNNNNNnN.WWw.']],
  45: [-1, 1, [
    '.........CCC...........',
    '.......CCCCCCcc........',
    '......CCCCCCCCcc.......',
    '.....CCCCCCCCCcc.......',
    '....CCCCCCCCCPcn.......',
    '...CCCCCCEECCCNNnN.....',
    '...CCCCCCCCCCNNNNnN....',
    '..CCCCCCCCCCWnNNNNnN...',
    '..CCCCCCCCCWWnNAANNC...',
    '..CCCEECCCaaWnNNNNNNn..',
    '..CCCCCCCWWAAnNNNNNnNn.',
    '...CCCCCNnWnAANNNNnNN..',
    '...CCPCNNNNnnAANNNNN..w',
    '....CCNNNNNNNNNNNNN..WW',
    '.NNNNNNNNNNNNNNNNN..WW.',
    'CCnnnNNNNNNNNNNNn......',
    'CC..nnnnnNNNNNNN.......']],
  63: [-1, 1, [
    '.......CCCC.............',
    '.....CCCCCCcc...........',
    '....CCCCCCccc...........',
    '...CCCCCCCPCc...........',
    '...CCCCCCCCCNnnNN.......',
    '..CCCCCEECCCNNNnnN......',
    '..CCCCCCCCCnNNNNNnC.....',
    '.CCCCCCCCCCWnNAANNNnn...',
    '.CCCCCCCCCaWWNNNNNNNN...',
    '.CCCCCCCCCaAAnNNNNnnN..w',
    '.CCCCCCCCWWnAAANNNNNN.WW',
    '.CCCEECCCnnnnAANNNNN..W.',
    '..CCCCCCNNNNNNNNNNNN....',
    '...CCPCCNNNNNNNNNNn.....',
    '.NNCCCCNNNNNNNNNNNN.....',
    'CCnnnCNNNNNNNNNNNN......',
    'CC..nnnnnnnnNNNnNN......']]
};
const LEAN_OPEN = { 26: [[5, 9], [6, 9], [11, 6], [12, 6]], 45: [[4, 9], [5, 9], [8, 5], [9, 5]], 63: [[3, 11], [4, 11], [6, 5], [7, 5]] };
/** Seitliche Neigung zwischen Knien und Liegen: deg 26 | 45 | 63 (26,5° / 45° / 63,5°), eyes 'halb' (müde, Standard) oder 'auf'. Ansicht '-'.
 *  Figur 'lean<deg>': Outfit-Accessoires in Sprite-Koordinaten. */
export const lean = (deg, eyes = 'halb') => {
  const [x0, y0, rows] = LEAN[deg];
  return figure(`lean${deg}`, (i, j) => [x0 + i, y0 + j], put => {
    sprite(rows, 0, 0)(put);
    if (eyes === 'auf') LEAN_OPEN[deg].forEach(([x, y]) => put(x - x0, y - y0, 'E'));
  });
};

// ---------- Schneidersitz (vorne): gekreuzte Beine vor dem Sakko (Schienbeine kreuzen mittig, Schuhe unter den Knien), Hände auf den Knien, Sitzfläche y 17 ----------
const CROSS = [
  '.CCOOOOOOOOOOOOOOOOCC.',
  'OCCNNNNNNNNNNNNNNNNCCO',
  'ONNNNNNNNNnONNNNNNNNNO',
  '.OWWWwnnnnOnnnnnWWWwO.'
];
export const crossLegs = p => { for (let x = 0; x < 22; x++) p(x, 17, '.'); CROSS.forEach((r, j) => [...r].forEach((c, i) => { if (c !== '.') p(i, 13 + j, c); })); };
