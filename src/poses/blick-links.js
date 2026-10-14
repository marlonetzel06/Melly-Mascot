// Pose: Blick links
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'blick-links',
  title: 'Blick links',
  category: 'Bewegung',
  desc: 'Standbild: schaut nach links (für Cursor-Verfolgung).',
  still: 0,
  frames: ({ frame, look }) => [frame([look(-1)], 400)]
};
