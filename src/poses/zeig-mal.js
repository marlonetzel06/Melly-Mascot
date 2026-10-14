// Pose: „Zeig mal.“
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'zeig-mal',
  title: '„Zeig mal.“',
  category: 'Reaktion',
  desc: 'Rechte Braue geht in zwei Stufen hoch, linkes Auge kneift zusammen, halten.',
  still: 2,
  frames: ({ frame, n, skep1, skep, skepBlink }) => [frame(n,600), frame([skep1],140), frame([skep],1700), frame([skep, skepBlink],110), frame([skep],900), frame([skep1],120), frame(n,500)]
};
