// Pose: Facepalm
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'facepalm',
  title: 'Facepalm',
  category: 'Reaktion',
  desc: 'Hand (Fäustling mit Daumen) klatscht vor die Stirn, Kopf sinkt, kurzes Kopfschütteln.',
  still: 2,
  frames: ({ frame, n, palm, blink }) => [frame(n,500), frame([palm(false)],120), frame([palm(true)],700,{headDy:1}), frame([palm(true)],160,{headDy:1,dx:1}), frame([palm(true)],160,{headDy:1,dx:-1}), frame([palm(true)],600,{headDy:1}), frame([palm(false), blink],140), frame(n,600)]
};
