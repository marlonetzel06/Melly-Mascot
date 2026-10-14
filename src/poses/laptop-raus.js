// Pose: Laptop rausholen
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'laptop-raus',
  title: 'Laptop rausholen',
  category: 'Arbeit',
  desc: 'Holt den Laptop mit einem Puff hervor (die Platte wächst aus der Wolke), hält ihn zugeklappt, klappt ihn über Zwischenstufen auf und schaut hinein. Geht nahtlos in „Am Laptop“ über.',
  still: 8,
  frames: ({ frame, n, focus, look, cloud, laptopOpen }) => [
    frame(n, 260),
    frame([], 90, { headDy: 1 }),                                    // Ausholen: Kopf sinkt ein
    frame([laptopOpen(-1), cloud(-4, 14), cloud(22, 14)], 70),       // Puff, erste Andeutung der Platte
    frame([laptopOpen(-2), cloud(-5, 13), cloud(23, 13)], 70),       // Platte wächst
    frame([focus, laptopOpen(0)], 300),                              // zugeklappt in beiden Händen
    frame([focus, laptopOpen(2)], 70),
    frame([focus, laptopOpen(4)], 70),
    frame([look(0), laptopOpen(6)], 80),
    frame([look(-1), laptopOpen(8)], 480)                            // offen, Anschluss an „laptop“
  ]
};
