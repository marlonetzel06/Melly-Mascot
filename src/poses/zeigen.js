// Pose: Zeigen
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'zeigen',
  title: 'Zeigen',
  category: 'Bewegung',
  desc: 'Arm über Zwischenposition nach rechts, Blick folgt, 2× Antippen, halten.',
  still: 2,
  frames: ({ frame, n, armHalfR, point, look, blink }) => [frame(n,400), frame([armHalfR,look(1)],90), frame([point(false),look(1)],600), frame([point(true),look(1)],120), frame([point(false),look(1)],140), frame([point(true),look(1)],120), frame([point(false),look(1)],900), frame([point(false),look(1),blink],110), frame([point(false),look(1)],700), frame([armHalfR,look(1)],90)]
};
