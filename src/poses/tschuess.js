// Pose: Tschüss
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'tschuess',
  title: 'Tschüss',
  category: 'Bewegung',
  desc: 'Winkt, dreht sich über 3/4 ins Profil und läuft aus dem Bild.',
  still: 2,
  frames: ({ frame, n, walkFrames, waveA, waveB, happy }) => [frame(n,400), frame([waveA,happy],140), frame([waveB,happy],170), frame([waveA,happy],140), frame([waveB,happy],170), frame([waveA,happy],200), frame(n,200), frame([],160,{view:'Q'}), frame([],160,{view:'S'}), ...walkFrames(12, { x0: 2, step: 2 }), frame([],700,{dx:60})]
};
