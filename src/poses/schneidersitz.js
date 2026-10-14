// Pose: Schneidersitz
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'schneidersitz',
  title: 'Schneidersitz',
  category: 'Kante',
  desc: 'Sitzt im Schneidersitz auf einem Element, Hände auf den Knien, blinzelt und schaut sich kurz um.',
  still: 0,
  frames: ({ frame, rect, crossLegs, blink, look }) => [[], [blink], [], [look(-1)], [], [look(1)], [], [blink], [], [blink], []].map((f, i) => frame([rect(-5, 26, 17, 22), crossLegs, ...f], [1600, 110, 1200, 650, 250, 650, 1000, 100, 110, 100, 1800][i], { dy: -2 }))
};
