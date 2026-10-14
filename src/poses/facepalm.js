// Pose: Facepalm
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'facepalm',
  title: 'Facepalm',
  category: 'Reaktion',
  desc: 'Hebt die Hand im Bogen zum Gesicht, legt sie über das Auge, Kopf sinkt, Klatsch-Striche fliegen raus, Hand rutscht etwas herunter und geht über eine Zwischenposition zurück.',
  still: 8,
  frames: ({ frame, n, arm, facepalm, slap, blink }) => [
    frame(n, 500),
    frame([arm('R', 0, 45)], 60),                         // Unterarm hebt sich, dann Arm im Bogen zum Gesicht
    frame([arm('R', 0, 90)], 60),
    frame([arm('R', 26.5, 116.5)], 60),
    frame([arm('R', 45, 180)], 50),
    frame([arm('R', 116.5, -153.5)], 50),
    frame([facepalm(1)], 60),                             // Hand an der Wange
    frame([facepalm(2)], 50),
    frame([facepalm(3), slap(1)], 90, { headDy: 1 }),    // Klatsch: Hand übers Auge, Kopf sinkt, Striche fliegen raus
    frame([facepalm(3), slap(2)], 90, { headDy: 1 }),
    frame([facepalm(3)], 1100, { headDy: 1 }),
    frame([facepalm(4)], 500, { headDy: 1 }),             // Hand rutscht herunter
    frame([blink, facepalm(3)], 100),                     // Kopf hebt sich, Hand löst sich
    frame([facepalm(2)], 80),
    frame([facepalm(1), blink], 80),
    frame([arm('R', 116.5, -153.5), blink], 80),          // zurück über Zwischenpositionen
    frame([arm('R', 45, 180)], 70),
    frame([arm('R', 26.5, 116.5)], 70),
    frame([arm('R', 0, 90)], 70),
    frame([arm('R', 0, 45)], 80),
    frame(n, 600)
  ]
};
