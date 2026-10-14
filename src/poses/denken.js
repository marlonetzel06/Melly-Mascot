// Pose: Denken
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'denken',
  title: 'Denken',
  category: 'Arbeit',
  desc: 'Blick nach oben, Gedankenblasen wachsen nacheinander.',
  still: 3,
  frames: ({ frame, look, blink, dot }) => [frame([look(0,-1)],500), frame([look(0,-1),dot(19,1,1)],380), frame([look(0,-1),dot(19,1,1),dot(20,-2,2)],380), frame([look(0,-1),dot(19,1,1),dot(20,-2,2),dot(22,-6,3)],1500), frame([look(0,-1),blink],110), frame([look(0,-1),dot(19,1,1),dot(20,-2,2),dot(22,-6,3)],700)]
};
