// Pose: Reinlaufen & Hallo
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'reinlaufen-hallo',
  title: 'Reinlaufen & Hallo',
  category: 'Bewegung',
  desc: 'Läuft von links ins Bild, dreht sich über 3/4 zur Kamera und winkt.',
  still: 20,
  frames: ({ frame, walkFrames, waveA, waveB, happy }) => [...walkFrames(14, { x0: -28, step: 2 }), frame([],200,{view:'S'}), frame([],140,{view:'Q'}), frame([],300), frame([waveA,happy],140), frame([waveB,happy],170), frame([waveA,happy],140), frame([waveB,happy],170), frame([waveA,happy],220), frame([],900)]
};
