// Pose: Umschauen
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'umschauen',
  title: 'Umschauen',
  category: 'Bewegung',
  desc: 'Dreht sich in die 3/4-Ansicht nach links und rechts, blinzelt dabei.',
  still: 1,
  frames: ({ frame, n, blink, qBlink }) => [frame(n,900), frame([],900,{view:'QL'}), frame([qBlink(true)],110,{view:'QL'}), frame([],400,{view:'QL'}), frame(n,500), frame([],1000,{view:'Q'}), frame(n,400), frame([blink],110), frame(n,900)]
};
