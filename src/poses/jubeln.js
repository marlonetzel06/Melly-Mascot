// Pose: Jubeln
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'jubeln',
  title: 'Jubeln',
  category: 'Bewegung',
  desc: 'Holt Schwung (Kopf sinkt ein), Arme schwingen im Bogen hoch, Sprung, Landung mit Nachfedern, Arme pumpen abwechselnd, Funken blinken, Arme schwingen zurück.',
  still: 6,
  frames: ({ frame, arm, happy, spark }) => {
    const A = (l, r = l) => [arm('L', l), arm('R', r)];
    const pump = left => [arm('L', left ? 135 : 116.5, undefined, { sh: left ? 1 : 0 }), arm('R', left ? 116.5 : 135, undefined, { sh: left ? 0 : 1 })];
    const sp = k => [spark(-5, 2, k), spark(26, 1, !k)];
    return [
      frame([], 300),
      frame([...A(26.5), happy], 160, { headDy: 1 }),             // Ausholen: Kopf sinkt ein, Arme leicht raus
      frame([...A(63.5), happy], 50),                             // Arme schwingen im Bogen hoch, Absprung
      frame([...A(100), happy], 50, { dy: -1 }),
      frame([...A(116.5), happy], 60, { dy: -2 }),
      frame([...A(135), happy, ...sp(0)], 220, { dy: -3 }),       // oben halten
      frame([...A(135), happy, ...sp(1)], 80, { dy: -2 }),
      frame([...A(116.5), happy], 70),                            // Landung, Arme sacken nach
      frame([...A(116.5), happy, ...sp(0)], 110, { headDy: 1 }), // Nachfedern
      frame([...A(135), happy, ...sp(1)], 90),
      frame([...pump(true), happy, ...sp(0)], 140),              // Pumpen links/rechts
      frame([...pump(false), happy, ...sp(1)], 140),
      frame([...pump(true), happy, ...sp(0)], 140),
      frame([...pump(false), happy, ...sp(1)], 140),
      frame([...A(116.5), happy], 80),                            // Arme schwingen zurück
      frame([...A(100), happy], 60),
      frame([...A(63.5), happy], 70),
      frame([...A(26.5), happy], 90),
      frame([happy], 140, { headDy: 1 }),
      frame([happy], 500)
    ];
  }
};
