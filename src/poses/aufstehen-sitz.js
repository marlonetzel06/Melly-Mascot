// Pose: Aufstehen aus dem Schneidersitz
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js. Umkehrung von „Hinsetzen“, Bodenhöhe wie im Stehen.
export default {
  id: 'aufstehen-sitz',
  title: 'Aufstehen aus dem Schneidersitz',
  category: 'Alltag',
  desc: 'Sitzt im Schneidersitz am Boden, schaut nach links und rechts, holt Schwung, hüpft auf die Füße und federt nach.',
  still: 0,
  frames: ({ frame, n, blink, look, crossLegs }) => [
    frame([crossLegs], 500, { dy: 1 }),
    frame([crossLegs, look(-1)], 200, { dy: 1 }),
    frame([crossLegs, look(1)], 200, { dy: 1 }),
    frame([crossLegs], 160, { dy: 1, headDy: 1 }),                         // holt Schwung
    frame([crossLegs], 70),                                                // hüpft hoch (Zwischenposition)
    frame(n, 110, { headDy: 1 }),                                          // steht, Kopf federt nach
    frame(n, 300),
    frame([blink], 100),
    frame(n, 300)
  ]
};
