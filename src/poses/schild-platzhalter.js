// Pose: Schild mit Platzhalter
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'schild-platzhalter',
  title: 'Schild mit Platzhalter',
  category: 'Arbeit',
  desc: 'Standbild: Schild mit Platzhalter-Zeilen (für Entwürfe).',
  still: 0,
  frames: ({ frame, happy, signArm, sign }) => [frame([signArm(0), sign(0,true), happy],2000)]
};
