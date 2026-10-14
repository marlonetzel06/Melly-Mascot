// Melly – Objekte & Effekte. Gleiche Baustein-Signatur wie in core.js: (p, S) => void.
import { L, sprite, clrL, clrR, caret } from './core.js';

// ---------- Effekte ----------
export const spark = (x, y, big) => p => { p(x, y, 'H'); if (big) { p(x - 1, y, 'H'); p(x + 1, y, 'H'); p(x, y - 1, 'H'); p(x, y + 1, 'H'); } };
export const star = (x, y) => spark(x, y, true);
export const dot = (x, y, s) => p => { for (let i = 0; i < s; i++) for (let j = 0; j < s; j++) p(x + i, y + j, 'C'); };
export const puff = (x, y, c = 'Z') => L([[x, y, c], [x + 1, y, c], [x, y - 1, c]]);
export const sweat = L([[19, 2, 'B'], [19, 3, 'B'], [18, 3, 'B']]);
export const sweatL = L([[2, 2, 'B'], [2, 3, 'B'], [3, 3, 'B']]);
export const bang = L([[22, -3, 'A'], [22, -2, 'A'], [22, -1, 'A'], [22, 1, 'A']]);
export const sBang = L([[15, -5, 'R'], [15, -4, 'R'], [15, -3, 'R'], [15, -1, 'R']]);
export const tick = (x, y) => L([[x, y + 1, 'V'], [x + 1, y + 2, 'V'], [x + 2, y + 1, 'V'], [x + 3, y, 'V']]);
const Z4 = ['####', '..#.', '.#..', '####'], Z5 = ['#####', '...#.', '..#..', '.#...', '#####'];
const zs = rows => rows.map(r => r.replace(/#/g, 'Z'));
const SLOTS = [[18, 1, Z4], [20, -3, Z4], [22, -7, Z5], [24, -12, Z5]];
export const zSlot = (i) => { const [x, y, m] = SLOTS[i]; return sprite(zs(m), x, y); };
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
export const bulb = (on) => p => {
  const g = on ? 'Y' : 'w';
  ['.###.', '#####', '#####', '.###.'].forEach((r, j) => [...r].forEach((c, i) => { if (c === '#') p(8 + i, -8 + j, g); }));
  p(9, -4, 'g'); p(10, -4, 'g'); p(11, -4, 'g'); p(10, -3, 'g');
  if (on) { p(9, -7, 'X'); [[6, -7], [14, -7], [10, -10], [7, -10], [13, -10]].forEach(([x, y]) => p(x, y, 'Y')); }
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
export const egg = (x, y, flip) => sprite(flip ? ['.WWW.', 'WWWWW', '.WWW.'] : ['.WWW.', 'WWYWW', '.WWW.'], x, y);
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
/** Schallwellen vor dem Gesicht (3/4 rechts): k = 1 klein, 2 klein + groß */
export const talk = (k) => p => {
  L([[22, 4, 'g'], [23, 5, 'g'], [23, 6, 'g'], [22, 7, 'g']])(p);
  if (k > 1) L([[26, 2, 'g'], [27, 3, 'g'], [27, 4, 'g'], [27, 5, 'g'], [27, 6, 'g'], [27, 7, 'g'], [26, 8, 'g']])(p);
};
