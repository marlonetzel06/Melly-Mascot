// Pose: Liegt auf dem Boden und schläft
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js. Wie „liegen-schlafen“, aber ohne Element, Bodenhöhe wie im Stehen.
export default {
  id: 'liegen-boden',
  title: 'Liegt auf dem Boden und schläft',
  category: 'Alltag',
  desc: 'Liegt frontal auf der Seite direkt auf dem Boden, Augen zu, Z steigen über dem Kopf auf.',
  still: 1,
  frames: ({ frame, lying, zSlot }) => [[[0], 520], [[0, 1], 700], [[1], 460], [[], 880]].map(([zs, ms]) => frame([lying(-1, 3, 'zu'), ...zs.map(s => zSlot(s, -10, -3))], ms))
};
