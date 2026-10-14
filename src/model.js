// Melly – Modell: Raster je Ansicht, Palette, Anzug-Kombis.
// Raster-Zeichen = Palette-Tokens, '.' = leer. Kontur ('O') wird beim Rendern automatisch gesetzt.

export const BASE_PX = {
  O: '#0E1620', // Kontur
  C: '#F4F2EC', c: '#D9D4C7', // Creme-Körper + Schatten
  W: '#FFFFFF', w: '#CFCBC0', x: '#A9A59B', // Hemd/Sneaker, Schatten, hinterer Schuh
  E: '#0E1620', P: '#F2A7A0', // Augen, Bäckchen
  H: '#E3A33B', h: '#F6CC7A', // Messing (Logos/Funken)
  G: '#3A424C', g: '#8A93A0', k: '#262C33', // Grautöne für Objekte
  B: '#7FC8F8', R: '#D9534F', V: '#3FA34D', Y: '#FFD95A', Z: '#F4F2EC', X: '#FFFFFF'
};

// [Name, Anzug N, Anzug-Schatten n, Akzent A (Krawatte+Einstecktuch), Akzent dunkel a (Knoten)]
export const COMBOS = [
  ['Mittelblau · Messing', '#2E5A8A', '#1F4168', '#E3A33B', '#A86F18'],
  ['Anthrazit · Bordeaux', '#3D4654', '#2A313B', '#A3324A', '#6E1F2C'],
  ['Hellgrau · Navy', '#A7AFB8', '#858D97', '#1F3A57', '#0F2238'],
  ['Dunkelgrün · Messing', '#2F5D4E', '#1F4237', '#E3A33B', '#A86F18'],
  ['Sand · Navy', '#C9B48E', '#A8956F', '#1F3A57', '#0F2238'],
  ['Navy · Koralle', '#1F3A57', '#132840', '#E8735E', '#B04C3B']
];

export const slug = s => s.toLowerCase().replace(/ä/g, 'ae').replace(/ö/g, 'oe').replace(/ü/g, 'ue').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const lighten = (hex, f) => {
  const v = parseInt(hex.slice(1), 16);
  return '#' + [16, 8, 0].map(sh => Math.min(255, Math.round(((v >> sh) & 255) + (255 - ((v >> sh) & 255)) * f)).toString(16).padStart(2, '0')).join('');
};

export const palette = (combo = 0) => {
  const [, N, n, A, a] = COMBOS[combo];
  return { ...BASE_PX, N, n, A, a, l: lighten(N, .22) };
};

// Arbeitsfläche: Figur-Koordinaten (0..21, 0..18) liegen bei (OX, OY) im Raster.
export const GW = 36, GH = 32, OX = 7, OY = 10;

export const HEAD = [
  '......................', '.......CCCCCCCC.......', '.....CCCCCCCCCCcc.....', '....CCCCCCCCCCCCcc....', '....CCCCCCCCCCCCCc....',
  '...CCCCEECCCCEECCcc...', '...CCCCEECCCCEECCcc...', '...CCPCCCCCCCCCCPcc...', '...CCCCCCCCCCCCCCcc...'
];
export const BODY = [
  '...NNNNnWWaaWWnNNNn...', '..NnNNNNnWAAWnNNNNnN..', '..NnNNNNNnAAnNNAANnN..', '..NnNNNNNNAANNNNNNnN..',
  '..CnNNNNNNNNNNNNNNnC..', '...NNnnNNNNNNNNnnNn...', '...NNNNNNNnnNNNNNNn...', '......................',
  '....WWWw......WWWw....', '......................'
];
const HEADTOP = HEAD.slice(0, 5);
const mirror = rows => rows.map(r => [...r].reverse().join(''));

const Q = [...HEADTOP,
  '...CCCCCCEECCCEECcc...', '...CCCCCCEECCCEECcc...', '...CCCCPCCCCCCCCPcc...', '...CCCCCCCCCCCCCCcc...',
  '...NNNNNNnWWaaWnNNn...', '..NnNNNNNNnWAAWnNNnN..', '..NnNNNNNNNnAAnNANnN..', '..NnNNNNNNNNAANNNNnN..',
  '..CnNNNNNNNNNNNNNNnC..', '...NNNnnNNNNNNNNnNn...', '...NNNNNNNNNnnNNNNn...', '......................',
  '....WWWWw.....WWWw....', '......................'];
const S = [...HEADTOP,
  '...CCCCCCCCCCCEECcc...', '...CCCCCCCCCCCEECcc...', '...CCCCCCCCCCPCCCcc...', '...CCCCCCCCCCCCCCcc...',
  '...NNNNNllNNNNnWann...', '...NNNNOllONNNnWAnn...', '...NNNNOllONNNNnAnn...', '...NNNNOllONNNNNnNn...',
  '...NNNNOCCONNNNNNNn...', '...NNNNOCCONnnnNNNn...', '...NNNNNOONNNNNNNNn...', '......................',
  '.......WWWWWWWw.......', '......................'];
const QB = [...HEADTOP,
  '...CCCCCCCCCCCCCCcc...', '...CCCCCCCCCCCCCCcc...', '...CCCCCCCCCCCCCCPc...', '...CCCCCCCCCCCCCCcc...',
  '...NNNnnnnnnnnnNNWn...', '..NnNNNNNNnNNNNNNnnN..', '..NnNNNNNNnNNNNNNNnN..', '..NnNNNNNNnNNNNNNNnN..',
  '..CnNNNNNNnNNNNNNNnC..', '...NNNNNnNNNNNNNNNn...', '...NNNNNnnNNNNNNNNn...', '......................',
  '...WWWw.......WWWw....', '......................'];
const B = [...HEADTOP,
  '...CCCCCCCCCCCCCCcc...', '...CCCCCCCCCCCCCCcc...', '...CCCCCCCCCCCCCCcc...', '...CCCCCCCCCCCCCCcc...',
  '...NNNnnnnnnnnnnNNn...', '..NnNNNNNNNNNNNNNNnN..', '..NnNNNNNNnNNNNNNNnN..', '..NnNNNNNNnNNNNNNNnN..',
  '..CnNNNNNNnNNNNNNNnC..', '...NNNNNNNnNNNNNNNn...', '...NNNNNNNnnNNNNNNn...', '......................',
  '....WWWw......WWWw....', '......................'];

// Ansichten (vorne 'F' wird aus HEAD + BODY gebaut, damit der Kopf separat nicken kann).
export const VIEWS = { Q, QL: mirror(Q), S, SL: mirror(S), QB, QBL: mirror(QB), B };
export const VIEW_LABELS = {
  F: 'vorne', Q: '3/4 rechts', S: 'Profil rechts', QB: '3/4 hinten rechts', B: 'hinten',
  QBL: '3/4 hinten links', SL: 'Profil links', QL: '3/4 links'
};
export const TURNAROUND = ['F', 'Q', 'S', 'QB', 'B', 'QBL', 'SL', 'QL'];
