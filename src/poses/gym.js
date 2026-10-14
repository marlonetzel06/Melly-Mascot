// Pose: Gym: Hantel
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'gym',
  title: 'Gym: Hantel',
  category: 'Alltag',
  desc: 'Bizeps-Curls in 3/4 mit Kampfblick, beim dritten Mal Schweißtropfen, zum Schluss Blick zur Kamera.',
  still: 1,
  frames: ({ frame, curl, qLook, qEffort, sweatL, happy }) => { const Q = {view:'Q'}; return [frame([curl(false), qLook(false)],350,Q), frame([curl(true), qEffort(false)],350,Q), frame([curl(false)],350,Q), frame([curl(true), qEffort(false)],350,Q), frame([curl(false)],350,Q), frame([curl(true), qEffort(false), sweatL],600,Q), frame([curl(false)],200,Q), frame([curl(false), happy],600)]; }
};
