// Pose: Bug gefunden (Profil)
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'bug-gefunden',
  title: 'Bug gefunden (Profil)',
  category: 'Arbeit',
  desc: 'Prüft das Klemmbrett mit der Lupe, ein Käfer krabbelt unter die Lupe (Glas wird rot), Schreck, rotes Ausrufezeichen.',
  still: 6,
  frames: ({ frame, n, sArmFwd, board, lensS, eyeDown, bugS, sSurprised, sBang }) => { const S = {view:'S'}, J = {view:'S', dx:-1}, b = [sArmFwd, board]; return [frame(n,400), frame([],140,S), frame([...b, lensS(), eyeDown],700,S), frame([...b, lensS(), eyeDown, bugS(24,7)],300,S), frame([...b, lensS(), eyeDown, bugS(23,8)],300,S), frame([...b, lensS(true), eyeDown],400,S), frame([...b, lensS(true), sSurprised, sBang],900,J), frame([...b, lensS(true), sSurprised],200,J), frame([...b, lensS(true), sSurprised, sBang],700,J)]; }
};
