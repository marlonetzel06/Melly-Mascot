// Pose: Schlafen auf der Kante
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'sitzen-schlafen',
  title: 'Schlafen auf der Kante',
  category: 'Kante',
  desc: 'Sitzt vorne auf einem Element, Augen zu, Kopf nickt sanft, Beine hängen ruhig, Z steigen auf.',
  still: 1,
  frames: ({ frame, rect, sitLap, sitLegs, blink, zSlot }) => [[0], [0, 1], [1], []].map((zs, k) => frame([rect(-5, 26, 16, 22), sitLap, sitLegs(0, 0), blink, ...zs.map(s => zSlot(s, 2, -1))], 600, { dy: -2, ...(k % 2 ? { headDy: 1 } : {}) }))
};
