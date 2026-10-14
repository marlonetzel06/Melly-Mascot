// Pose: Laufen (Profil)
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'laufen',
  title: 'Laufen (Profil)',
  category: 'Bewegung',
  desc: 'Lauf-Zyklus auf der Stelle: Beine wechseln, Arm schwingt gegenläufig, Körper wippt.',
  still: 0,
  frames: ({ walkFrames }) => walkFrames(8, { step: 0, ms: 140 })
};
