// Pose: Hinsetzen (Schneidersitz am Boden)
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js. Bodenhöhe wie im Stehen.
export default {
  id: 'hinsetzen',
  title: 'Hinsetzen',
  category: 'Alltag',
  desc: 'Holt kurz Schwung, faltet die Beine in der Luft, plumpst mit Staub in den Schneidersitz auf den Boden, federt nach und sitzt.',
  still: 5,
  frames: ({ frame, n, blink, crossLegs, cloud }) => {
    const dust = [cloud(-6, 16), cloud(25, 16, 'Z', true)]; // Frame hat dy 1 → Wolkenfuß auf y 17
    return [
      frame(n, 300),
      frame(n, 160, { headDy: 1 }),                                        // holt Schwung
      frame([crossLegs], 70),                                              // Beine falten sich in der Luft (Zwischenposition)
      frame([crossLegs, ...dust], 80, { dy: 1 }),                          // plumpst in den Schneidersitz
      frame([crossLegs], 120, { dy: 1, headDy: 1 }),                       // federt nach
      frame([crossLegs], 600, { dy: 1 }),
      frame([crossLegs, blink], 110, { dy: 1 }),
      frame([crossLegs], 900, { dy: 1 })
    ];
  }
};
