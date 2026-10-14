// Pose: Am Laptop
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'laptop',
  title: 'Am Laptop',
  category: 'Arbeit',
  desc: 'Hält den aufgeklappten Laptop, die Augen lesen Zeile für Zeile von links nach rechts.',
  still: 1,
  frames: ({ frame, laptop, look, blink }) => [frame([laptop(),look(-1)],380), frame([laptop()],380), frame([laptop(),look(1)],380), frame([laptop(),look(-1)],120), frame([laptop(),look(-1)],380), frame([laptop()],380), frame([laptop(),look(1)],380), frame([laptop(),look(1),blink],110), frame([laptop(),look(-1)],120)]
};
