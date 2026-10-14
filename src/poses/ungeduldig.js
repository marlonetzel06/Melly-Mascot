// Pose: Ungeduldig
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'ungeduldig',
  title: 'Ungeduldig',
  category: 'Reaktion',
  desc: 'Schaut hin und her, Schweißtropfen, Fußspitze tippt (Schuh bleibt am Boden).',
  still: 0,
  frames: ({ frame, look, sweat, toeUp, tapMark }) => [frame([look(-1),sweat],300), frame([look(-1),sweat,toeUp],170), frame([look(-1),sweat,tapMark],150), frame([look(1),sweat],300), frame([look(1),sweat,toeUp],170), frame([look(1),sweat,tapMark],150)]
};
