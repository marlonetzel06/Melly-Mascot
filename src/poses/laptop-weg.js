// Pose: Laptop wegpacken
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'laptop-weg',
  title: 'Laptop wegpacken',
  category: 'Arbeit',
  desc: 'Klappt den Laptop über Zwischenstufen zu, hält ihn kurz, lässt ihn mit einem Puff verschwinden und entspannt sich.',
  still: 0,
  frames: ({ frame, n, focus, look, blink, puff, laptopOpen }) => [
    frame([look(0), laptopOpen(8)], 200),                           // Anschluss an „laptop“
    frame([look(0), laptopOpen(6)], 70),
    frame([focus, laptopOpen(4)], 70),
    frame([focus, laptopOpen(2)], 70),
    frame([focus, laptopOpen(0)], 320),                             // zu
    frame([laptopOpen(-1), puff(19, 14), puff(1, 14)], 80),         // Platte verschwindet im Puff
    frame([], 110, { headDy: 1 }),                                  // erleichtert ausatmen
    frame(n, 300)
  ]
};
