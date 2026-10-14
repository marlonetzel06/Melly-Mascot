// Pose: Aufstehen
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js. Umkehrung von „Hinlegen“, Bodenhöhe wie im Stehen.
export default {
  id: 'aufstehen',
  title: 'Aufstehen',
  category: 'Alltag',
  desc: 'Blinzelt aus dem Schlaf, richtet sich über zwei Zwischenstufen in den Schneidersitz auf, schüttelt den Kopf, hüpft auf die Füße und steht.',
  still: 12,
  frames: ({ frame, n, blink, look, cloud, crossLegs, lying, zSlot, rotateFrame }) => {
    const dust = [cloud(-5, 17), cloud(23, 17)];
    const sit = (extra = [], opt = {}) => frame([crossLegs, blink, ...extra], 80, { dy: 1, ...opt });
    return [
      frame([lying(-1, 3, 'zu'), zSlot(0, -10, -3)], 240),
      frame([lying(-1, 3, 'zu')], 160),
      frame([lying(-1, 3, 'auf')], 260),                                   // Augen auf
      frame([lying(-1, 3, 'auf'), ...dust], 90),
      rotateFrame(sit([], { headDy: 1 }), 62, 10, 28, 80),                 // richtet sich auf: Zwischenstufe 1
      rotateFrame(sit([], { headDy: 1 }), 28, 10, 28, 80),                 // Zwischenstufe 2
      sit(dust, { headDy: 1 }),                                            // sitzt
      frame([crossLegs, blink], 200, { dy: 1, headDy: 1 }),                // noch schlaftrunken
      frame([crossLegs, look(-1)], 200, { dy: 1 }),
      frame([crossLegs, look(1)], 200, { dy: 1 }),                         // schüttelt den Kopf
      frame([crossLegs], 70),                                              // hüpft hoch (Zwischenposition)
      frame([blink], 110, { headDy: 1 }),                                  // steht, Kopf sinkt ein
      frame(n, 300)
    ];
  }
};
