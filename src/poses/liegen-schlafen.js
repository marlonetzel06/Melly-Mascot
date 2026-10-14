// Pose: Liegt auf der Seite und schläft
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'liegen-schlafen',
  title: 'Liegt auf der Seite und schläft',
  category: 'Kante',
  desc: 'Liegt frontal auf der Seite auf einem Element, Augen zu, Z steigen über dem Kopf auf.',
  still: 1,
  frames: ({ frame, lying, rect, zSlot }) => [[0], [0, 1], [1], []].map(zs => frame([rect(-5, 26, 16, 20), lying(-1, 1), ...zs.map(s => zSlot(s, -10, -5))], 600, { view: '-' }))
};
