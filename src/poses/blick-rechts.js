// Pose: Blick rechts
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'blick-rechts',
  title: 'Blick rechts',
  category: 'Bewegung',
  desc: 'Standbild: schaut nach rechts (für Cursor-Verfolgung).',
  still: 0,
  frames: ({ frame, look }) => [frame([look(1)], 400)]
};
