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

export const OUTFITS = [
  {
    id: 'weihnachten',
    title: 'Weihnachtsmann',
    desc: 'Roter Anzug mit Gürtel und Pelzsaum, Weihnachtsmütze mit Bommel. Krawatte/Einstecktuch bleiben Messing.',
    pal: { N: '#B8352E', n: '#8A2520', l: '#CC6A62', A: '#E3A33B', a: '#A86F18', U: '#B8352E', u: '#8A2520' },
    layers: { F: (opt) => [santaSuit, santaHat(opt.wobble || 0)] },
    after: { F: () => [santaHemApart] },
    figures: Object.fromEntries(Object.entries(SANTA_FIG).map(([id, f]) => [id, (opt) => [...f.parts, f.tips[opt.tip] || f.tips[f.rest]].map(([i0, j0, rows]) => sprite(rows, i0, j0))]))
  }
];

export const getOutfit = id => OUTFITS.find(o => o.id === id);
