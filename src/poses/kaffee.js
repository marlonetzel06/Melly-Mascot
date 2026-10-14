// Pose: Kaffee
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'kaffee',
  title: 'Kaffee',
  category: 'Alltag',
  desc: 'Hält die Tasse, Dampf steigt, hebt sie über eine Zwischenposition vor den Mund und nimmt einen Schluck.',
  still: 5,
  frames: ({ frame, mug, happy }) => [frame([mug(0,1)],350), frame([mug(0,2)],350), frame([mug(0,1)],350), frame([mug(0,2)],350), frame([mug(1)],140), frame([mug(2,0)],900), frame([mug(2,1)],500), frame([mug(1), happy],140), frame([mug(0,0), happy],500), frame([mug(0,1)],350), frame([mug(0,2)],400)]
};
