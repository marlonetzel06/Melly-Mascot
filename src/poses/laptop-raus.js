// Pose: Laptop rausholen
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'laptop-raus',
  title: 'Laptop rausholen',
  category: 'Arbeit',
  desc: 'Holt den Laptop mit einem Puff hervor, hält ihn zugeklappt, klappt ihn über Zwischenstufen auf und schaut hinein. Geht nahtlos in „Am Laptop“ über.',
  still: 6,
  frames: ({ frame, n, focus, look, blink, puff, laptopOpen }) => [
    frame(n, 260),
    frame([], 90, { headDy: 1 }),                                   // Ausholen: Kopf sinkt ein
    frame([laptopOpen(-1), puff(19, 14), puff(1, 14)], 80),         // Platte erscheint, Puff an den Seiten
    frame([focus, laptopOpen(0)], 140),                             // zugeklappt in beiden Händen
    frame([focus, laptopOpen(2)], 70),
    frame([focus, laptopOpen(4)], 70),
    frame([look(0), laptopOpen(6)], 80),
    frame([look(0), laptopOpen(8)], 160),                           // offen, Blick geradeaus
    frame([look(-1), laptopOpen(8)], 320)                           // Anschluss an „laptop“
  ]
};
