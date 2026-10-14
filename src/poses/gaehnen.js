// Pose: Gähnen & Strecken
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'gaehnen',
  title: 'Gähnen & Strecken',
  category: 'Alltag',
  desc: 'Streckt die Arme langsam seitlich im Bogen nach oben, Mund öffnet sich, oben Schultern hoch und kurzes Zittern, Arme sinken zurück, blinzelt müde.',
  still: 6,
  frames: ({ frame, n, arm, yawn, blink }) => {
    const A = (a, o) => [arm('L', a, a, o), arm('R', a, a, o)];
    return [
      frame(n, 500),
      frame([...A(26.5), yawn(1)], 180),                   // langsam anlaufen
      frame([...A(63.5), yawn(1)], 150),
      frame([...A(100), yawn(2)], 130),
      frame([...A(116.5), yawn(2)], 120),
      frame([...A(135), yawn(3)], 130),
      frame([...A(135, { sh: 1 }), yawn(3)], 650),         // ganz lang machen: Schultern hoch
      frame([...A(135), yawn(3)], 90),                     // Zittern
      frame([...A(135, { sh: 1 }), yawn(3)], 90),
      frame([...A(135), yawn(3)], 90),
      frame([...A(116.5), yawn(2)], 110),                  // Arme sinken seitlich zurück
      frame([...A(100), yawn(1)], 80),
      frame([...A(63.5), yawn(1)], 70),
      frame([...A(26.5)], 90),
      frame([blink], 400, { headDy: 1 }),                  // sackt müde zusammen
      frame(n, 200),
      frame([blink], 120),
      frame(n, 700)
    ];
  }
};
