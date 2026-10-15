// Pose: Aufstehen
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js. Umkehrung von „Hinlegen“, Bodenhöhe wie im Stehen.
export default {
  id: 'aufstehen',
  title: 'Aufstehen',
  category: 'Alltag',
  desc: 'Blinzelt aus dem Schlaf, hebt zuerst den Kopf, drückt sich über drei Neigungsstufen auf die Hand hoch, kniet, kommt über die Hocke in den Stand und federt nach.',
  still: 7,
  frames: ({ frame, n, squat, kneel, lean, lying, zSlot }) => {
    const V = { view: '-' };
    return [
      frame([lying(-1, 3, 'zu'), zSlot(0, -10, -3)], 240, V),
      frame([lying(-1, 3, 'zu')], 160, V),
      frame([lying(-1, 3, 'auf')], 260, V),                                // Augen auf
      frame([lying(-1, 3, 'zu')], 90, V),                                  // blinzelt
      frame([lying(-1, 3, 'auf')], 200, V),
      frame([lying(-1, 3, 'auf', 2)], 140, V),                             // Kopf hebt sich zuerst
      frame([lean(63, 'auf')], 140, V), frame([lean(45, 'auf')], 160, V), frame([lean(26, 'auf')], 130, V), // drückt sich hoch
      frame([kneel], 120, { dy: 2 }),                                      // kniet
      frame([squat], 110, { dy: 1 }),                                      // Hocke
      frame(n, 80),                                                        // steht
      frame(n, 110, { headDy: 1 }),                                        // federt nach
      frame(n, 700)
    ];
  }
};
