// Pose: Schulterzucken
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'schulterzucken',
  title: 'Schulterzucken',
  category: 'Reaktion',
  desc: 'Arme raus, Handflächen hoch, Kopf zieht in die Schultern, Brauen hoch: „Keine Ahnung.“',
  still: 2,
  frames: ({ frame, n, shrugArms, meh, blink }) => [frame(n,500), frame([shrugArms, meh],120,{headDy:1}), frame([shrugArms, meh],1100,{headDy:1}), frame([shrugArms, meh, blink],110,{headDy:1}), frame([shrugArms, meh],500,{headDy:1}), frame(n,700)]
};
