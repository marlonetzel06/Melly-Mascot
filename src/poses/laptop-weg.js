// Pose: Laptop wegpacken
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'laptop-weg',
  title: 'Laptop wegpacken',
  category: 'Arbeit',
  desc: 'Klappt den Laptop über Zwischenstufen zu, hält ihn kurz, lässt ihn in einer Wolke schrumpfen und verschwinden und entspannt sich.',
  still: 0,
  frames: ({ frame, n, focus, look, cloud, laptopOpen }) => [
    frame([look(0), laptopOpen(8)], 200),                                 // Anschluss an „laptop“
    frame([look(0), laptopOpen(6)], 70),
    frame([focus, laptopOpen(4)], 70),
    frame([focus, laptopOpen(2)], 70),
    frame([focus, laptopOpen(0)], 320),                                   // zu
    frame([laptopOpen(-2), cloud(-5, 13), cloud(24, 13, 'Z', true)], 70), // Platte schrumpft in der Wolke
    frame([laptopOpen(-1), cloud(-4, 14), cloud(23, 14, 'Z', true)], 70),
    frame([], 110, { headDy: 1 }),                                        // erleichtert ausatmen
    frame(n, 300)
  ]
};
