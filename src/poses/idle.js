// Pose: Idle
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'idle',
  title: 'Idle',
  category: 'Bewegung',
  desc: 'Blinzelt unregelmäßig, schaut sich kurz um. Körper bleibt ruhig.',
  still: 0,
  frames: ({ frame, n, blink, look }) => [frame(n,1800), frame([blink],110), frame(n,1300), frame([look(-1)],650), frame(n,250), frame([look(1)],650), frame(n,1100), frame([blink],100), frame(n,110), frame([blink],100), frame(n,2000)]
};
