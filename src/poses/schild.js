// Pose: Schild hochhalten
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'schild',
  title: 'Schild hochhalten',
  category: 'Arbeit',
  desc: 'Hebt das Schild, es wippt leicht. Feld bleibt leer für den Post-Titel.',
  still: 2,
  frames: ({ frame, happy, blink, signArm, sign }) => [frame([happy],400), frame([signArm(-2), sign(-2,false)],100), frame([signArm(0), sign(0,false), happy],500), frame([signArm(1), sign(1,false), happy],260), frame([signArm(0), sign(0,false), happy],260), frame([signArm(1), sign(1,false), happy],260), frame([signArm(0), sign(0,false)],900), frame([signArm(0), sign(0,false), blink],110), frame([signArm(0), sign(0,false)],700)]
};
