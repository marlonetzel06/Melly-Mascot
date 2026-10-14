// Pose: Idee
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'idee',
  title: 'Idee',
  category: 'Arbeit',
  desc: 'Grübelt in 3/4 zur Seite gedreht, Glühbirne erscheint, dreht sich zur Kamera, Birne geht an, Zeigefinger hoch.',
  still: 3,
  frames: ({ frame, n, qLook, bulb, look, fingerUp, happy }) => [frame([qLook(true,0,-1)],700,{view:'QL'}), frame([qLook(true,0,-1), bulb(false)],400,{view:'QL'}), frame([bulb(false), look(0,-1)],140), frame([fingerUp, happy, bulb(true)],900), frame([fingerUp, happy, bulb(true)],300,{dy:-1}), frame([fingerUp, bulb(true)],700), frame(n,500)]
};
