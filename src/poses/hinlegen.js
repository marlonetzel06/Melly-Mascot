// Pose: Hinlegen
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js. Bodenhöhe wie im Stehen (Schuhe y 17 → Boden y 18).
export default {
  id: 'hinlegen',
  title: 'Hinlegen',
  category: 'Alltag',
  desc: 'Gähnt, wird müde, hüpft in den Schneidersitz auf den Boden, nickt zweimal ein, kippt in fünf kleinen Winkelstufen zur Seite und schläft. Endet im Schlaf („Liegt auf dem Boden“).',
  still: 16,
  frames: ({ frame, n, blink, yawn, cloud, crossLegs, lying, zSlot, rotateFrame }) => {
    const dust = [cloud(-5, 17), cloud(23, 17)];
    const sit = (extra = [], opt = {}) => frame([crossLegs, blink, ...extra], 80, { dy: 1, ...opt });
    const tilt = deg => rotateFrame(sit([], { headDy: 1 }), deg, 10, 28, 50);
    return [
      frame(n, 260),
      frame([yawn(1)], 180),
      frame([yawn(2)], 260),
      frame([blink], 200, { headDy: 1 }),                                  // müde, Kopf sinkt
      frame([crossLegs, blink], 70),                                       // Beine falten sich in der Luft (Zwischenposition)
      sit(dust),                                                           // plumpst in den Schneidersitz
      frame([crossLegs, blink], 240, { dy: 1 }),
      frame([crossLegs, blink], 200, { dy: 1, headDy: 1 }),                // nickt ein
      frame([crossLegs, blink], 140, { dy: 1 }),                           // Kopf hebt sich kurz
      frame([crossLegs, blink], 260, { dy: 1, headDy: 1 }),                // nickt wieder ein
      tilt(14), tilt(28), tilt(42), tilt(56), tilt(70),                    // kippt in fünf kleinen Stufen
      frame([lying(-1, 3, 'zu'), ...dust], 100),                           // liegt, Staub
      frame([lying(-1, 3, 'zu')], 420),
      frame([lying(-1, 3, 'zu'), zSlot(0, -10, -3)], 420)                  // erstes Z
    ];
  }
};
