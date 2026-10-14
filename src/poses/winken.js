// Pose: Winken
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'winken',
  title: 'Winken',
  category: 'Bewegung',
  desc: 'Anheben über Zwischenposition, 3× Pendeln zwischen 45° und 30°, zurück.',
  still: 2,
  frames: ({ frame, n, armHalfR, waveA, waveB, happy }) => [frame(n,500), frame([armHalfR],90), frame([waveA,happy],140), frame([waveB,happy],170), frame([waveA,happy],140), frame([waveB,happy],170), frame([waveA,happy],140), frame([waveB,happy],170), frame([waveA,happy],220), frame([armHalfR],90), frame(n,700)]
};
