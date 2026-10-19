// Pose: Kochen: Pfanne
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'kochen',
  title: 'Kochen: Pfanne',
  category: 'Alltag',
  desc: 'Wendet das Ei rechts, gibt die Pfanne an die linke Hand, wendet links, dann verfehlt das Ei die Pfanne und landet auf dem Boden.',
  still: 3,
  frames: ({ frame, pan, egg, splat, panSteam, qLook, qHappy, look, surprised, meh, sweatL }) => { const Q = {view:'Q'}, QL = {view:'QL'}; return [frame([pan(0), egg(23,8,false), qLook(false,1,0), panSteam(0)],400,Q), frame([pan(1), egg(23,6,false)],120,Q), frame([pan(0), egg(23,1,true), qLook(false,1,-1)],200,Q), frame([pan(0), egg(23,8,false), qHappy(false), panSteam(1)],500,Q), frame([egg(9,-4,false,[18,-9]), look(0,-1)],220), frame([pan(0,'L'), egg(-6,8,false), qLook(true,-1,0)],400,QL), frame([pan(1,'L'), egg(-6,4,true), qLook(true,-1,-1)],180,QL), frame([pan(0,'L'), egg(-6,8,false), qHappy(true), panSteam(1,'L')],500,QL), frame([pan(1,'L'), egg(-5,-3,true), qLook(true,-1,-1)],200,QL), frame([pan(0,'L'), egg(-1,-8,false), look(0,-1)],220), frame([pan(0,'L'), egg(1,4,true), look(-1,1)],180), frame([pan(0,'L'), splat(-2), surprised],900), frame([pan(0,'L'), splat(-2), meh, sweatL],1100)]; }
};
