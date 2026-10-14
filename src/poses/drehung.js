// Pose: Drehung 360°
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'drehung',
  title: 'Drehung 360°',
  category: 'Bewegung',
  desc: 'vorne → 3/4 → Profil → hinten → zurück, kurzer Halt vorne.',
  still: 0,
  frames: ({ frame, blink, TURNAROUND }) => [...TURNAROUND.map(v => frame([], v === 'F' ? 900 : 140, { view: v })), frame([blink],110), frame([],500)]
};
