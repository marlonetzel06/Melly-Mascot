// Pose: Müde
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'muede',
  title: 'Müde',
  category: 'Alltag',
  desc: 'Steht schläfrig da: Lider halb zu, Kopf sackt leicht ab, blinzelt langsam und gähnt klein.',
  still: 0,
  frames: ({ frame, n, blink, yawn }) => [
    frame([blink], 1400, { headDy: 1 }),
    frame([], 420),                                                      // reißt die Augen kurz auf
    frame([blink], 1100, { headDy: 1 }),
    frame([yawn(1)], 260),
    frame([yawn(2)], 520),
    frame([yawn(1)], 200),
    frame([blink], 800, { headDy: 1 }),
    frame(n, 300),
    frame([blink], 1200, { headDy: 1 })
  ]
};
