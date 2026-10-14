// Melly – Outfits: Kostüme, die über jede passende Pose gelegt werden.
// Ein Outfit = eigene Farben (überschreiben die Anzug-Kombi) + Accessoires je Ansicht.
//   pal:    Palette-Tokens, z. B. Anzug N/n/l, Akzent A/a, eigene Tokens (U/u …)
//   layers: { <Ansicht>: (opt) => [Bausteine] } – werden VOR den Posen-Bausteinen gezeichnet.
//           opt = Frame-Optionen der Pose (z. B. opt.wobble für wippenden Bommel).
// Eine Pose passt zu einem Outfit, wenn alle ihre Frames Ansichten nutzen, für die das Outfit layers hat.

// ---------- Weihnachtsmann ----------
/** Gürtel (y 14) mit Messing-Schnalle + weißer Pelzsaum (y 15). */
const santaSuit = p => {
  for (let x = 3; x <= 18; x++) { p(x, 14, 'k'); p(x, 15, 'W'); }
  p(18, 15, 'w'); for (let x = 9; x <= 12; x++) p(x, 14, 'H');
};
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

export const OUTFITS = [
  {
    id: 'weihnachten',
    title: 'Weihnachtsmann',
    desc: 'Roter Anzug mit Gürtel und Pelzsaum, Weihnachtsmütze mit Bommel. Krawatte/Einstecktuch bleiben Messing.',
    pal: { N: '#B8352E', n: '#8A2520', l: '#CC6A62', A: '#E3A33B', a: '#A86F18', U: '#B8352E', u: '#8A2520' },
    layers: { F: (opt) => [santaSuit, santaHat(opt.wobble || 0)] }
  }
];

export const getOutfit = id => OUTFITS.find(o => o.id === id);
