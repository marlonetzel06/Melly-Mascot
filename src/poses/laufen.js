// Pose: Laufen (Profil)
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'laufen',
  title: 'Laufen (Profil)',
  category: 'Bewegung',
  desc: 'Lauf-Zyklus auf der Stelle in 8 Phasen: Füße mit halbem Schritt dazwischen, Arm pendelt gegenläufig im Bogen, Körper wippt beim Passieren.',
  still: 0,
  frames: ({ walkFrames }) => walkFrames(16, { step: 0, ms: 105 })
};
