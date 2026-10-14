// Pose: Schulterzucken
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'schulterzucken',
  title: 'Schulterzucken',
  category: 'Reaktion',
  desc: 'Ellbogen bleiben am Körper, Unterarme klappen seitlich hoch (Handflächen nach oben), Schultern ziehen hoch, Kopf sinkt ein, Brauen flach, lässt los und federt nach.',
  still: 4,
  frames: ({ frame, n, arm, meh }) => {
    const B = (a, b, o = {}) => [arm('L', a, b, o), arm('R', a, b, o)];
    return [
      frame(n, 500),
      frame([...B(0, 45)], 80),                                     // Unterarme klappen seitlich hoch
      frame([...B(0, 90)], 70),
      frame([...B(0, 116.5)], 60),
      frame([...B(0, 116.5), meh], 1500, { headDy: 1 }),            // Kopf sinkt zwischen die Schultern, Handflächen oben
      frame([...B(0, 116.5), meh], 70),                             // fallen lassen
      frame([...B(0, 90), meh], 70),
      frame([...B(0, 45)], 80),
      frame([], 120, { headDy: 1 }),                                // nachfedern
      frame(n, 700)
    ];
  }
};
