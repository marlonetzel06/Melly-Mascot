// Pose: Schlafen
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'schlafen',
  title: 'Schlafen',
  category: 'Alltag',
  desc: 'Augen zu, Kopf nickt sanft, drei Z steigen versetzt auf und werden größer.',
  still: 0,
  frames: ({ frame, blink, zRise }) => [0,1,2,3].map(k => frame([blink, ...[0,1,2,3].filter(s => ((s - k) % 4 + 4) % 4 !== 3).map(s => zRise(s))], 500, k % 2 ? { headDy: 1 } : {}))
};
