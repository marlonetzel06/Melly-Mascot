// Pose: Jubel-Drehung
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'jubel-drehung',
  title: 'Jubel-Drehung',
  category: 'Bewegung',
  desc: 'Holt Schwung, springt mit Armen hoch, dreht sich in der Luft einmal um sich selbst (alle Ansichten), landet federnd und reißt die Arme hoch.',
  still: 2,
  frames: ({ frame, arm, happy, qHappy, spark }) => {
    const A = (a) => [arm('L', a), arm('R', a)];
    const sp = k => [spark(-5, 2, k), spark(26, 1, !k)];
    return [
      frame([], 200),
      frame([...A(26.5), happy], 140, { headDy: 1 }),             // ausholen
      frame([...A(116.5), happy], 60, { dy: -1 }),                 // Absprung
      frame([...A(135), happy], 70, { dy: -3 }),
      frame([qHappy(false)], 70, { view: 'Q', dy: -3 }),           // Drehung in der Luft
      frame([], 70, { view: 'S', dy: -3 }),
      frame([], 70, { view: 'QB', dy: -3 }),
      frame([], 70, { view: 'B', dy: -3 }),
      frame([], 70, { view: 'QBL', dy: -3 }),
      frame([], 70, { view: 'SL', dy: -3 }),
      frame([qHappy(true)], 70, { view: 'QL', dy: -2 }),
      frame([...A(116.5), happy], 60, { dy: -1 }),
      frame([...A(90), happy], 90, { headDy: 1 }),                 // Landung, federt
      frame([...A(135), happy, ...sp(0)], 260),                    // Arme hoch
      frame([...A(135), happy, ...sp(1)], 200),
      frame([...A(63.5), happy], 80),
      frame([...A(26.5), happy], 80),
      frame([happy], 400)
    ];
  }
};
