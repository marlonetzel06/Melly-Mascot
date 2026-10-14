// Pose: Hinlegen
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js. Bodenhöhe wie im Stehen (Schuhe y 17 → Boden y 18).
export default {
  id: 'hinlegen',
  title: 'Hinlegen',
  category: 'Alltag',
  desc: 'Gähnt, wird müde, hüpft in den Schneidersitz auf den Boden, nickt weg, lehnt sich zur Seite und kippt mit einem Puff auf die Seite. Endet im Schlaf („Liegt auf dem Boden“).',
  still: 11,
  frames: ({ frame, n, blink, yawn, puff, crossLegs, lying, zSlot }) => {
    const dust = [puff(-3, 17), puff(22, 17)];
    return [
      frame(n, 260),
      frame([yawn(1)], 180),
      frame([yawn(2)], 260),
      frame([blink], 200, { headDy: 1 }),                                  // müde, Kopf sinkt
      frame([crossLegs, blink], 70),                                       // Beine falten sich in der Luft (Zwischenposition)
      frame([crossLegs, blink, ...dust], 90, { dy: 1 }),                   // plumpst in den Schneidersitz
      frame([crossLegs, blink], 260, { dy: 1 }),
      frame([crossLegs, blink], 300, { dy: 1, headDy: 1 }),                // nickt weg
      frame([crossLegs, blink], 90, { dy: 1, headDy: 1, dx: 1 }),          // lehnt sich zur Seite (Zwischenposition)
      frame([lying(-1, 3, 'zu'), ...dust], 100),                           // kippt auf die Seite
      frame([lying(-1, 3, 'zu')], 420),
      frame([lying(-1, 3, 'zu'), zSlot(0, -10, -3)], 420)                  // erstes Z
    ];
  }
};
