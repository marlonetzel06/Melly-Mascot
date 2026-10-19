// Melly – Outfits: Kostüme, die über jede passende Pose gelegt werden.
// Ein Outfit = eigene Farben (überschreiben die Anzug-Kombi) + Accessoires je Ansicht.
//   pal:    Palette-Tokens, z. B. Anzug N/n/l, Akzent A/a, eigene Tokens (U/u …)
//   layers: { <Ansicht>: (opt) => [Bausteine] } – werden VOR den Posen-Bausteinen gezeichnet.
//           opt = Frame-Optionen der Pose (z. B. opt.wobble für wippenden Bommel).
//   after:  { <Ansicht>: (opt) => [Bausteine] } – NACH den Posen-Bausteinen, Bausteine bekommen zusätzlich get(x, y) zum Lesen
//           des Bildes (Korrekturen, die von der Pose abhängen, z. B. Saum weicht Schuhen aus).
//   figures: { <Figur-ID>: (opt) => [Bausteine] } – Accessoires für eigene Figuren in Ansicht '-' (Liegen, Neigung; props.js),
//           in Sprite-Koordinaten der Figur, gezeichnet direkt NACH der Figur (opt.tip z. B. für den Zustand des Mützenzipfels).
// Eine Pose passt zu einem Outfit, wenn alle ihre Frames Ansichten nutzen, für die das Outfit layers hat (bzw. figures für ihre Figuren).

import { sprite } from './core.js';
import { OX, OY } from './model.js';

// ---------- Weihnachtsmann ----------
/** Gürtel (y 14) mit Messing-Schnalle + weißer Pelzsaum (y 15). */
const santaSuit = p => {
  for (let x = 3; x <= 18; x++) { p(x, 14, 'k'); p(x, 15, 'W'); }
  p(18, 15, 'w'); for (let x = 9; x <= 12; x++) p(x, 14, 'H');
};
/** Pelzsaum weicht aus: Liegt direkt darunter Weiß (Schuhe in der Hocke, Kick), wird der Saum dort zur Kontur, statt mit ihm zu verschmelzen. */
const santaHemApart = (p, S, opt, get) => { for (let x = 3; x <= 18; x++) if ('Ww'.includes(get(x, 15)) && 'Wwx'.includes(get(x, 16))) p(x, 15, 'O'); };
/** Mütze: Pelzband y 0–1 mit eigener Kontur zum Kopf (y 2), Zipfel nach rechts, Bommel wippt (sw 0/1). */
const santaHat = (sw = 0) => (p, S) => {
  for (let x = 4; x <= 17; x++) { S(x, 0, 'W'); S(x, 1, 'W'); }
  S(17, 0, 'w'); S(17, 1, 'w'); S(16, 1, 'w');
  for (let x = 5; x <= 16; x++) S(x, 2, 'O');
  [[-1, 5, 14, 16], [-2, 6, 14, 16], [-3, 7, 15, 17], [-4, 9, 16, 18], [-5, 11, 17, 19], [-6, 14, 17, 19]]
    .forEach(([y, a, b, e]) => { for (let x = a; x <= e; x++) S(x, y, x <= b ? 'U' : 'u'); });
  S(20, -5, 'u'); if (sw) S(20, -4, 'u');
  const by = -4 + sw;
  S(20, by, 'W'); S(21, by, 'W'); S(20, by + 1, 'W'); S(21, by + 1, 'w');
};

/** Liegen und Neigung (Figuren aus props.js), je Stufe gezeichnet, [i0, j0, Zeilen] in Sprite-Koordinaten der Figur:
 *  parts = Mütze am gekippten Kopf (Pelzband, Kontur zum Kopf, Kegel) + Gürtel/Pelzsaum an der Jackenkante zu den Beinen,
 *  tips  = Zipfel mit Bommel je Zustand. Er hängt der Schwerkraft nach (nicht mitgedreht) und schwingt bei Bewegung nach:
 *          die Pose wählt ihn per Frame-Option tip (z. B. 'hoch' beim Umkippen), ohne Option gilt rest (Ruhelage). */
const SANTA_FIG = {
  lean26: {
    parts: [
      [4, -6, [
        '.....UUUUuu...',
        '....UUUUUuu...',
        '...UUUUUuu....',
        '..UUUUUUuuWw..',
        '.UUUUUUUWWww..',
        '.UUUUUWWWWOO..',
        'UUUUWWWWOO....',
        'UUWWWWOO......',
        'WWWWOO........',
        'WWOO..........',
        'OO............']],
      [4, 11, [
        '...............kkw',
        '.............kkWW.',
        '.kkkkkkHHHHkkWO...',
        '.WWWWWWWWWWWW.....']]
    ],
    tips: {
      rechts: [10, -9, [
          '..Uuuu..',
          'UUUUuuu.',
          'UUUuu.WW',
          '......Ww']],
      hoch: [10, -11, [
          'WW..',
          'Ww..',
          '.U..',
          'UUu.',
          'UUUu']]
    },
    rest: 'rechts'
  },
  lean45: {
    parts: [
      [-1, -3, [
        '...UUUUuu..',
        '..UUUUUuuWw',
        '..UUUUUUWWw',
        '.UUUUUUWWWO',
        '.UUUUUWWWO.',
        '.UUUUWWWO..',
        '.UUUWWWO...',
        'UUUWWWO....',
        '.UWWWO.....',
        '.WWWO......',
        '.WWO.......']],
      [14, 10, [
        '......kW',
        '.....kW.',
        '....HW..',
        '...HW...',
        '..HW....',
        '.kW.....',
        'kw......']]
    ],
    tips: {
      hoch: [2, -9, [
          '.WW.',
          '.Ww.',
          '.Uu.',
          '.Uu.',
          'UUuu',
          'UUUu']],
      links: [-2, -6, [
          '..UUUu..',
          '.UUUUUu.',
          'WW..UUUu',
          'Ww......']]
    },
    rest: 'links'
  },
  lean63: {
    parts: [
      [-1, -2, [
        'UUUu....',
        'UUUuuww.',
        'UUUuuWw.',
        'UUUUWWWO',
        'UUUUWWO.',
        'UUUWWWO.',
        'UUUWWO..',
        'UUWWWO..',
        'UUWWO...',
        'UWWWO...',
        'UWWO....',
        'WWWO....',
        'WWO.....',
        'WWO.....']],
      [16, 8, [
        '...kW',
        '...kW',
        '...kW',
        '..HW.',
        '..HW.',
        '.HW..',
        '.kW..',
        'kW...',
        'kw...']]
    ],
    tips: {
      links: [-5, -3, [
          '..UUUUu',
          '.Uuu...',
          'WW.....',
          'Ww.....']],
      haengt: [-4, -3, [
          '..UUu',
          '.UU..',
          '.u...',
          '.u...',
          'WW...',
          'Ww...']]
    },
    rest: 'haengt'
  },
  lie: {
    parts: [
      [-1, 1, [
        '.WWO',
        'UWWO',
        'UWWO',
        'UWWO',
        'UWWO',
        'UWWO',
        'UWWO',
        'UWWO',
        'UWWO',
        'UWWO',
        'UWWO',
        'uWwO',
        '.wwO']],
      [19, 6, [
        'HW',
        'HW',
        'HW',
        'kW',
        'kW',
        'kW',
        'kw',
        'kw']]
    ],
    tips: {
      haengt: [-5, 3, [
          '...U',
          '..UU',
          '..UU',
          '.UUU',
          '.UUu',
          '.Uu.',
          '.u..',
          '.u..',
          '.u..',
          'WW..',
          'Ww..']],
      frei: [-5, 3, [
          '...U',
          '..UU',
          '..UU',
          '.UUU',
          '.UUu',
          '.Uu.',
          'WW..',
          'Ww..']],
      faellt: [-5, -2, [
          'WW...',
          'Wwu..',
          '..Uu.',
          '..UU.',
          '..UUU',
          '...UU',
          '...UU',
          '...UU',
          '...Uu',
          '....u']]
    },
    rest: 'haengt'
  }
};

// ---------- Beruf + Klassiker (Ansicht vorne; Koch zusätzlich 3/4 für die Pose kochen) ----------
/** Kopfschmuck als Sprite, der dem nickenden Kopf folgt. */
const hatS = (rows, x0, y0) => (p, S) => sprite(rows, x0, y0)(S);
/** Färbt die Sneaker zu Stiefeln: jedes Weiß/Schuh-Grau ab y 16 (wirkt auch bei Kick, Hocke, Sitzen). */
const boots = (top, shade) => (p, S, opt, get) => {
  for (let y = 16; y <= 21; y++) for (let x = -7; x <= 28; x++) { const c = get(x, y); if (c === 'W') p(x, y, top); else if (c === 'w' || c === 'x') p(x, y, shade); }
};
// Lagerist: offene Warnweste mit Reflexstreifen über dem Anzug (Anzug, Hemd und Krawatte bleiben in der Mitte sichtbar), Bauhelm.
const VEST = [
  '....TTTT......TTTt....',
  '....TTTTT....TTTTt....',
  '....TTTTT....TTAAt....',
  '....TTTTT....TTTTt....',
  '....TTTTT....TTTTt....',
  '....TTTTT....TTTTt....',
  '....TTTTT....TTTTt....'
];
const vest = sprite(VEST, 0, 9);
/** 3/4-Ansicht rechts: V-Ausschnitt sitzt weiter rechts (Hemd x 10–14), Einstecktuch x 16; links (QL) gespiegelt. */
const VEST_Q = [
  '....TTTTT.......Tt....',
  '....TTTTTT.....TTt....',
  '....TTTTTT.....TAt....',
  '....TTTTTT.....TTt....',
  '....TTTTTT.....TTt....',
  '....TTTTTT.....TTt....',
  '....TTTTTT.....TTt....'
];
const vestQ = sprite(VEST_Q, 0, 9), vestQL = sprite(VEST_Q.map(r => [...r].reverse().join('')), 0, 9);
const hiVisStripes = p => { [4, 5, 6, 7, 8, 13, 14, 15, 16, 17].forEach(x => p(x, 13, 'K')); for (let y = 9; y <= 12; y++) { p(5, y, 'K'); p(16, y, 'K'); } };
const hiVisStripesQ = (left) => p => {
  const m = x => left ? 21 - x : x;
  [4, 5, 6, 7, 8, 9, 15, 16, 17].forEach(x => p(m(x), 13, 'K')); for (let y = 9; y <= 12; y++) { p(m(5), y, 'K'); if (y !== 11) p(m(16), y, 'K'); }
};
const hardHat = hatS([
  '....IIIIii....',
  '...IIIIIIii...',
  '..IIIIIIIIii..',
  '..IIIIIIIIii..',
  'IIIIIIIIIIIIii',
  '.OOOOOOOOOOOO.'], 4, -3);

// Angler (Lakehouse): Fischerhut mit Fliege, Wathose mit Trägern über dem Anzug, Gummistiefel.
const bucketHat = hatS([
  '....UUUUUUuu....',
  '...UUUUUUUUuuR..',
  '...uuuuuuuuuuY..',
  '.UUUUUUUUUUUUUu.',
  'UU............uu'], 3, -2);
const waders = p => {
  for (let y = 9; y <= 11; y++) { p(7, y, 'T'); p(14, y, 'T'); }
  for (let y = 12; y <= 13; y++) for (let x = 6; x <= 15; x++) p(x, y, x === 15 ? 't' : 'T');
  p(7, 12, 'H'); p(14, 12, 'H');
  for (let y = 14; y <= 15; y++) for (let x = 3; x <= 18; x++) p(x, y, x >= 17 ? 't' : 'T');
  [4, 5, 6, 7, 14, 15, 16, 17].forEach(x => p(x, 16, x === 7 || x === 17 ? 't' : 'T'));
};
/** Wathose im Profil (für die Sitzpose angeln): Hose y 13–15, Latz vorn, Träger über die Schulter. Beine zeichnet die Pose. */
const wadersS = p => {
  for (let y = 13; y <= 15; y++) for (let x = 3; x <= 18; x++) p(x, y, x >= 17 ? 't' : 'T');
  for (let y = 11; y <= 12; y++) for (let x = 13; x <= 17; x++) p(x, y, x === 17 ? 't' : 'T');
  p(13, 10, 'T'); p(12, 9, 'T'); p(14, 11, 'H');
};
const CATCH = ['kkkk', 'WgWW', 'gggg', 'WgWW'];
const catchAt = (p, x0, y0) => CATCH.forEach((r, j) => [...r].forEach((c, i) => p(x0 + i, y0 + j, c)));
/** Hängt der rechte Arm in Ruhe (Hand x 19, y 13)? Dann hält Melly die Angel. */
const armRests = get => get(19, 13) === 'C' && 'Nn'.includes(get(19, 12));
/** Angel mit gefangener Tabelle: in der Hand, solange der rechte Arm hängt; braucht die Pose den Arm, liegt sie am Boden.
 *  opt.rod = 'lower' (Zwischenframe aus anglerSequence): Rute schräg zum Boden, Tabelle setzt auf. */
const rod = (p, S, opt, get) => {
  if (opt.rod === 'lower') {
    [[20, 13], [21, 14], [22, 14], [23, 15], [24, 15], [25, 16], [26, 16]].forEach(([x, y]) => p(x, y, 'j'));
    catchAt(p, 24, 11);
  } else if (armRests(get)) {
    for (let i = 0; i < 7; i++) p(20 + i, 12 - i, 'j');
    for (let y = 7; y <= 10; y++) p(27, y, 'g');
    catchAt(p, 24, 11);
  } else {
    p(19, 17, 'k'); p(20, 17, 'k'); for (let x = 21; x <= 27; x++) p(x, 17, 'j');
    catchAt(p, 24, 13);
  }
};
/** Übergang statt Sprung: wechselt die Angel zwischen Hand und Boden, kommt davor ein Zwischenframe mit gesenkter Rute
 *  (beim Ablegen mit dem Arm des Vorframes, beim Aufheben mit dem Arm des Zielframes, der dann noch hängt). */
const anglerSequence = (frames, rebuild) => {
  const held = f => f.view === 'F' && armRests((x, y) => f.g[y + OY + (f.src[2].dy || 0)]?.[x + OX + (f.src[2].dx || 0)]);
  if (frames.every(f => f.view !== 'F')) return frames;
  return frames.flatMap((f, i) => {
    const prev = frames[(i - 1 + frames.length) % frames.length];
    if (f.view !== 'F' || prev.view !== 'F' || held(prev) === held(f)) return [f];
    return [rebuild(held(prev) ? prev : f, { rod: 'lower' }, 110), f];
  });
};

// Agent (AI-Agent): fast schwarzer Anzug (Navy-Kontrastgrenze), dunkle Krawatte, Knopf im Ohr mit Spiralkabel.
const earpiece = (p, S) => { S(18, 5, 'g'); S(19, 6, 'w'); S(20, 7, 'w'); S(19, 8, 'w'); p(18, 9, 'w'); };

// Zauberer: spitzer Hut mit umgeknickter Spitze und Sternen, Robe in Violett mit Messing-Sternen.
const wizardHat = hatS([
  '.........UUuu...',
  '.......UUUu.....',
  '......UUUUu.....',
  '.....UUhUUu.....',
  '....UUUUUUuu....',
  '...UhUUUUUUuu...',
  '...HHHHHHHHHH...',
  'UUUUUUUUUUUUUUuu'], 3, -6);
const robeStars = p => { p(5, 12, 'h'); p(15, 14, 'h'); p(7, 15, 'h'); };

// Koch: Kochmütze mit Falten, Schürze in hellem Graublau (nicht weiß, sonst verschwimmt sie mit Hemd und Schuhen).
const toque = hatS([
  '..WWW.WWWW.WWW..',
  '.WWWWWWWWWWWWWw.',
  'WWWWWWWWWWWWWWww',
  'WWWWWWWWWWWWWWww',
  '.wwwwwwwwwwwwww.',
  '..WWwWWwWWwWWw..',
  '..WWwWWwWWwWWw..',
  '..OOOOOOOOOOOO..'], 3, -5);
const apron = p => {
  p(4, 13, 'w'); p(17, 13, 'w');
  for (let y = 13; y <= 16; y++) for (let x = y === 16 ? 8 : 5; x <= (y === 16 ? 13 : 16); x++) p(x, y, x === 16 ? 't' : 'T');
};

// Cowboy: nur der Hut (Delle oben, hochgebogene Krempe).
const cowboyHat = hatS([
  '.....UUU..Uuu.....',
  '....UUUUUUUUuu....',
  '....UUUUUUUUuu....',
  'UU..kkkkkkkkkk..uu',
  'UUUUUUUUUUUUUUUUuu'], 2, -3);

const MORE_OUTFITS = [
  {
    id: 'angler', title: 'Angler', desc: 'Fischerhut mit Fliege, Wathose über dem Anzug, Gummistiefel, Angel mit Tabelle (liegt am Boden, wenn er den Arm braucht). Lakehouse-Bezug.',
    pal: { U: '#A39A63', u: '#7A7246', T: '#55633A', t: '#3D4829' },
    layers: { F: () => [bucketHat, waders], S: () => [bucketHat, wadersS] }, after: { F: () => [boots('t', 't'), rod], S: () => [boots('t', 't')] },
    sequence: anglerSequence
  },
  {
    id: 'agent', title: 'Agent', desc: 'Fast schwarzer Anzug, dunkle Krawatte, Knopf im Ohr mit Spiralkabel. Wortspiel AI-Agent.',
    pal: { N: '#34373E', n: '#25282D', l: '#616369', A: '#1B1D21', a: '#0B0C0E' },
    layers: { F: () => [earpiece] }
  },
  {
    id: 'lagerist', title: 'Lagerist', desc: 'Offene orange Warnweste mit Reflexstreifen über dem Anzug, gelber Bauhelm. Warehouse-Bezug.',
    pal: { T: '#F07C1E', t: '#C45F12', K: '#DCE1E5', I: '#F2C230', i: '#C99A1E' },
    layers: { F: () => [vest, hiVisStripes, hardHat], Q: () => [vestQ, hiVisStripesQ(false), hardHat], QL: () => [vestQL, hiVisStripesQ(true), hardHat] }
  },
  {
    id: 'zauberer', title: 'Zauberer', desc: 'Spitzer Hut mit Sternen, violette Robe mit Messing-Sternen.',
    pal: { N: '#4A3A78', n: '#33285A', l: '#726596', A: '#E3A33B', a: '#A86F18', U: '#4A3A78', u: '#33285A' },
    layers: { F: () => [wizardHat, robeStars] }
  },
  {
    id: 'koch', title: 'Koch', desc: 'Kochmütze mit Falten, graublaue Schürze.',
    pal: { T: '#A9BCCF', t: '#8399AF' },
    layers: { F: () => [toque, apron], Q: () => [toque, apron], QL: () => [toque, apron] }
  },
  {
    id: 'cowboy', title: 'Cowboy', desc: 'Cowboyhut mit Delle und hochgebogener Krempe.',
    pal: { U: '#B07A3E', u: '#83582A' },
    layers: { F: () => [cowboyHat] }
  }
];

export const OUTFITS = [
  {
    id: 'weihnachten',
    title: 'Weihnachtsmann',
    desc: 'Roter Anzug mit Gürtel und Pelzsaum, Weihnachtsmütze mit Bommel. Krawatte/Einstecktuch bleiben Messing.',
    pal: { N: '#B8352E', n: '#8A2520', l: '#CC6A62', A: '#E3A33B', a: '#A86F18', U: '#B8352E', u: '#8A2520' },
    layers: { F: (opt) => [santaSuit, santaHat(opt.wobble || 0)] },
    after: { F: () => [santaHemApart] },
    figures: Object.fromEntries(Object.entries(SANTA_FIG).map(([id, f]) => [id, (opt) => [...f.parts, f.tips[opt.tip] || f.tips[f.rest]].map(([i0, j0, rows]) => sprite(rows, i0, j0))]))
  },
  ...MORE_OUTFITS
];

export const getOutfit = id => OUTFITS.find(o => o.id === id);
