// Pose: Ungeduldig
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'ungeduldig',
  title: 'Ungeduldig',
  category: 'Reaktion',
  desc: 'Hebt den Arm und schaut auf die Uhr, schaut genervt weg, tippt mit dem Fuß (Kopf wippt mit), Schweißtropfen, schaut nochmal auf die Uhr und seufzt.',
  still: 3,
  frames: ({ frame, n, watch, look, blink, sweat, toeUp, tapMark }) => {
    const tap = (eyes, extra = []) => [
      frame([eyes, toeUp, ...extra], 150),
      frame([eyes, tapMark, ...extra], 130, { headDy: 1 })   // Fuß tippt, Kopf wippt mit
    ];
    const atWatch = look(-1);                                   // Blick zur Seite auf das Handgelenk
    return [
      frame(n, 300),
      frame([watch(1)], 70), frame([watch(2)], 60),             // Arm hebt sich über Zwischenstufen
      frame([watch(3), atWatch], 650),                          // Blick auf die Uhr
      frame([watch(3), look(1)], 250),                          // schaut genervt weg
      frame([watch(2), look(1)], 80), frame([watch(1), look(1)], 70),
      ...tap(look(1)), ...tap(look(1)),
      frame([look(0)], 200),
      frame([watch(1), sweat], 60), frame([watch(2), sweat], 60),
      frame([watch(3), atWatch, sweat], 500),                   // nochmal auf die Uhr
      frame([watch(3), blink, sweat], 450, { headDy: 1 }),      // Seufzen
      frame([watch(2)], 70), frame([watch(1)], 70),
      frame(n, 250)
    ];
  }
};
