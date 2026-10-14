// Pose: Fußball: Jonglieren
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'fussball',
  title: 'Fußball: Jonglieren',
  category: 'Alltag',
  desc: 'Jongliert rechts – Mitte – links – Kopfball – zurück. Körper dreht sich zum Ball (3/4), Augen folgen, Ball dreht sich.',
  still: 0,
  frames: ({ frame, ball, kickR, kickL, qLook, look, happy }) => [frame([ball(19,9,0), kickR, qLook(false,1,1)],170,{view:'Q'}), frame([ball(16,1,1), qLook(false,0,-1)],150,{view:'Q'}), frame([ball(8,-5,0), look(0,-1)],180), frame([ball(1,1,1), qLook(true,-1,-1)],150,{view:'QL'}), frame([ball(-3,9,0), kickL, qLook(true,-1,1)],170,{view:'QL',dx:-1}), frame([ball(-1,1,1), qLook(true,0,-1)],150,{view:'QL'}), frame([ball(7,-8,0), look(0,-1)],180), frame([ball(7,-6,1), happy],140,{dy:-1}), frame([ball(7,-9,0), look(0,-1)],180), frame([ball(14,0,1), qLook(false,1,-1)],150,{view:'Q'})]
};
