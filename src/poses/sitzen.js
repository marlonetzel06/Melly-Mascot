// Pose: Sitzen auf der Kante
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'sitzen',
  title: 'Sitzen auf der Kante',
  category: 'Kante',
  desc: 'Sitzt vorne auf einem Element, Hände auf den Knien, die Beine baumeln gegenläufig, blinzelt und schaut kurz zur Seite.',
  still: 0,
  frames: ({ frame, rect, sitLap, sitLegs, blink, look }) => {
    const swing = [[0, 2], [1, 1], [2, 0], [1, 1]];
    const face = [[], [], [], [], [blink], [], [], [], [look(-1)], [look(-1)], [], [], [look(1)], [look(1)], [], []];
    return face.map((f, i) => frame([rect(-5, 26, 16, 22), sitLap, sitLegs(...swing[i % 4]), ...f], i === 4 ? 110 : 200, { dy: -2 }));
  }
};
