// Pose: Kisten ins Regal einsortieren – gehört zum Outfit „lagerist“ („Daten ins Warehouse laden“).
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
// Dreht sich zum Aufheben nach links (3/4 links), trägt frontal, dreht sich zum Einräumen nach rechts (3/4 rechts).
// Ganze Szene 1 px nach links: Regal rechts und Kiste links behalten ihre Kontur im Bild.
const F = { dx: -1 }, QL = { view: 'QL', dx: -1 }, Q = { view: 'Q', dx: -1 };

export default {
  id: 'einsortieren',
  title: 'Kiste ins Regal',
  category: 'Arbeit',
  outfit: 'lagerist',
  desc: 'Dreht sich zur Kiste, hebt sie auf, trägt sie vor dem Bauch, dreht sich zum Regal und wuchtet sie ins obere Fach. Haken dran.',
  still: 5,
  frames: ({ frame, look, happy, blink, qLook, arm, armHalfR, carry, crate, shelf, tick }) => [
    frame([shelf(), crate(-5, 13), look(-1)], 450, F),
    frame([shelf(), crate(-5, 13), qLook(true)], 220, QL),
    frame([shelf(), crate(-5, 13), arm('L', 45, 45, { view: 'QL' }), qLook(true, 0, 1)], 170, QL),
    frame([shelf(), arm('L', 90, 90, { view: 'QL' }), crate(-5, 6), qLook(true, 0, -1)], 140, QL),
    frame([shelf(), carry, crate(8, 11), look(1)], 120, { ...F, headDy: 1 }),
    frame([shelf(), carry, crate(8, 11), look(1)], 300, F),
    frame([shelf(), armHalfR, crate(19, 6), qLook(false, 0, -1)], 160, Q),
    frame([shelf(true), armHalfR, qLook(false)], 200, Q),
    frame([shelf(true), happy, tick(23, 2)], 700, F),
    frame([shelf(true), blink, tick(23, 2)], 110, F),
    frame([shelf(true), tick(23, 2)], 500, F)
  ]
};
