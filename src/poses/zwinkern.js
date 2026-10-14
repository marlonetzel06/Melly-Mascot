// Pose: Zwinkern
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'zwinkern',
  title: 'Zwinkern',
  category: 'Reaktion',
  desc: 'Linkes Auge zwinkert fröhlich.',
  still: 1,
  frames: ({ frame, n, wink }) => [frame(n,900), frame([wink],480), frame(n,1400)]
};
