// Pose: Gähnen & Strecken
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'gaehnen',
  title: 'Gähnen & Strecken',
  category: 'Alltag',
  desc: 'Streckt sich, Augen kneifen zu, Mund öffnet sich langsam, schließt wieder, blinzelt müde.',
  still: 3,
  frames: ({ frame, n, armsUp, yawn, blink }) => [frame(n,500), frame([armsUp, yawn(1)],180,{dy:-1}), frame([armsUp, yawn(2)],220,{dy:-2}), frame([armsUp, yawn(3)],900,{dy:-2}), frame([armsUp, yawn(2)],200,{dy:-1}), frame([yawn(1)],200), frame([blink],400,{headDy:1}), frame(n,200), frame([blink],120), frame(n,700)]
};
