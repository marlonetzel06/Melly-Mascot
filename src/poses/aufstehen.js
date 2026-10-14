// Pose: Aufstehen
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js. Umkehrung von „Hinlegen“, Bodenhöhe wie im Stehen.
export default {
  id: 'aufstehen',
  title: 'Aufstehen',
  category: 'Alltag',
  desc: 'Blinzelt aus dem Schlaf, richtet sich mit einem Puff in den Schneidersitz auf, schüttelt den Kopf und steht auf.',
  still: 9,
  frames: ({ frame, n, blink, look, puff, crossLegs, lying, zSlot }) => {
    const dust = [puff(-3, 17), puff(22, 17)];
    return [
      frame([lying(-1, 3, 'zu'), zSlot(0, -10, -3)], 240),
      frame([lying(-1, 3, 'zu')], 160),
      frame([lying(-1, 3, 'auf')], 260),                                   // Augen auf
      frame([lying(-1, 3, 'auf'), ...dust], 90),
      frame([crossLegs, blink, ...dust], 100, { dy: 1, headDy: 1 }),       // richtet sich auf
      frame([crossLegs, blink], 220, { dy: 1, headDy: 1 }),                // noch schlaftrunken
      frame([crossLegs, look(-1)], 180, { dy: 1 }),
      frame([crossLegs, look(1)], 180, { dy: 1 }),                         // schüttelt den Kopf
      frame([blink], 110, { headDy: 1 }),                                  // steht auf, Kopf sinkt ein
      frame(n, 300)
    ];
  }
};
