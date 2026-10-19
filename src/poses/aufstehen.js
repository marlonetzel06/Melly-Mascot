// Pose: Aufstehen
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js. Umkehrung von „Hinlegen“, Bodenhöhe wie im Stehen.
// wobble/tip: Bommel und Mützenzipfel im Outfit schwingen nach (Zipfel hebt ab, zieht nach links nach, fliegt hoch, fällt nach rechts).
// outfit.doff (Bauhelm): Helm steht hinter ihm; nach dem Aufrichten dreht er sich in 3/4 von hinten, nimmt ihn auf, dreht zurück und setzt ihn auf.
export default {
  id: 'aufstehen',
  title: 'Aufstehen',
  category: 'Alltag',
  desc: 'Blinzelt aus dem Schlaf, hebt zuerst den Kopf, drückt sich über drei Neigungsstufen auf die Hand hoch, kniet, kommt über die Hocke in den Stand und federt nach.',
  still: 7,
  frames: ({ frame, n, blink, look, qBlink, arm, squat, kneel, lean, lying, zSlot, outfit }) => {
    const V = { view: '-' };
    if (outfit?.doff) {
      const grip = sh => [arm('L', 160, 180, { sh }), arm('R', 160, 180, { sh })], hold = [arm('L', 0, 0, { fore: 0 }), arm('R', 0, 0, { fore: 0 })], holdQ = [arm('L', 0, 0, { fore: 0, view: 'QL' }), arm('R', 0, 0, { fore: 0, view: 'QL' })], F = [-8, 14, 'hinten'], L = { ...V, hut: F };
      return [
        frame([lying(2, 3, 'zu'), zSlot(0, -7, -3)], 240, L),
        frame([lying(2, 3, 'zu')], 160, L),
        frame([lying(2, 3, 'auf')], 260, L),                               // Augen auf
        frame([lying(2, 3, 'zu')], 90, L),                                 // blinzelt
        frame([lying(2, 3, 'auf')], 200, L),
        frame([lying(2, 3, 'auf', 2)], 140, L),                            // Kopf hebt sich zuerst
        frame([lean(63, 'auf')], 140, { ...L, dx: 3 }), frame([lean(45, 'auf')], 160, { ...L, dx: 2, still: true }), frame([lean(26, 'auf')], 130, { ...L, dx: 1 }), // drückt sich hoch
        frame([kneel], 140, { dy: 2, hut: F }),                            // kniet
        frame([squat], 110, { dy: 1, hut: F }),                            // Hocke
        frame([blink], 120, { hut: F }),                                   // steht, Helm hinter ihm
        frame([qBlink(true)], 120, { view: 'QL', hut: F }),                // dreht sich nach links …
        frame([], 140, { view: 'QBL', hut: F }),                           // … zum Helm (3/4 von hinten)
        frame([squat], 160, { view: 'QBL', dy: 1, hut: F }),               // nimmt ihn auf
        frame([], 140, { view: 'QBL', hut: [-4, 11, 'hinten'] }),          // richtet sich mit dem Helm auf
        frame(holdQ, 140, { view: 'QL', hut: [0, 12] }),                   // dreht sich zurück …
        frame(hold, 220, { hut: [0, 12] }),                                // … steht, Helm mit beiden Händen vor dem Bauch
        frame([look(0, -1), ...grip(3)], 140, { hut: [0, -1] }),           // hebt ihn über den Kopf
        frame([blink, ...grip(2)], 160, { headDy: 1 }),                    // setzt ihn auf, Kopf sinkt mit
        frame(n, 110, { headDy: 1 }),                                      // federt nach
        frame(n, 700)
      ];
    }
    return [
      frame([lying(-1, 3, 'zu'), zSlot(0, -10, -3)], 240, V),
      frame([lying(-1, 3, 'zu')], 160, V),
      frame([lying(-1, 3, 'auf')], 260, V),                                // Augen auf
      frame([lying(-1, 3, 'zu')], 90, V),                                  // blinzelt
      frame([lying(-1, 3, 'auf')], 200, V),
      frame([lying(-1, 3, 'auf', 2)], 140, { ...V, tip: 'frei' }),         // Kopf hebt sich zuerst
      frame([lean(63, 'auf')], 140, { ...V, tip: 'haengt' }), frame([lean(45, 'auf')], 160, { ...V, tip: 'links' }), frame([lean(26, 'auf')], 130, { ...V, tip: 'hoch' }), // drückt sich hoch
      frame([kneel], 120, { dy: 2, wobble: 1 }),                           // kniet
      frame([squat], 110, { dy: 1 }),                                      // Hocke
      frame(n, 80),                                                        // steht
      frame(n, 110, { headDy: 1, wobble: 1 }),                             // federt nach
      frame(n, 700)
    ];
  }
};
