// Pose: Daumen hoch
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'daumen-hoch',
  title: 'Daumen hoch',
  category: 'Reaktion',
  desc: 'Faust kommt hoch, Daumen schnappt nach oben, Zwinkern + Funkeln.',
  still: 2,
  frames: ({ frame, n, thumb, wink, star }) => [frame(n,500), frame([thumb(false)],120), frame([thumb(true), wink, star(25,4)],700), frame([thumb(true), wink],500), frame([thumb(true)],600), frame([thumb(false)],100), frame(n,600)]
};
