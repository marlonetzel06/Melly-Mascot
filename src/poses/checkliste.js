// Pose: Checkliste (Profil)
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'checkliste',
  title: 'Checkliste (Profil)',
  category: 'Arbeit',
  desc: 'Dreht sich ins Profil, hält das Klemmbrett schräg vor sich, Blick nach unten, hakt ab: grüne Häkchen steigen auf.',
  still: 5,
  frames: ({ frame, n, happy, sArmFwd, board, penS, eyeDown, tick }) => { const S = {view:'S'}, b = [sArmFwd, board, eyeDown]; return [frame(n,400), frame([],140,S), frame([...b, penS(0)],300,S), frame([...b, penS(1), tick(21,2)],250,S), frame([...b, penS(0), tick(21,0)],250,S), frame([...b, penS(1), tick(21,-2), tick(21,2)],250,S), frame([...b, penS(0), tick(21,0)],250,S), frame([...b, penS(1), tick(21,-2), tick(21,2)],250,S), frame([...b, penS(0), tick(21,0)],250,S), frame([...b, penS(0), tick(21,-2)],250,S), frame([],140,S), frame([happy],900)]; }
};
