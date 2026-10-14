// Pose: Sauer
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'sauer',
  title: 'Sauer',
  category: 'Reaktion',
  desc: 'Brauen ziehen sich zusammen, Kopf läuft rot an, zittert, Dampf steigt auf, kühlt wieder ab.',
  still: 6,
  frames: ({ frame, n, angry, blink, puff, RED }) => [frame(n,500), frame([angry],350), frame([angry],200,{pal:RED[1]}), frame([angry],180,{pal:RED[2],dx:1}), frame([angry],180,{pal:RED[2],dx:-1}), frame([angry, puff(3,-1), puff(18,-1)],140,{pal:RED[3],dx:1}), frame([angry, puff(2,-3), puff(19,-3)],140,{pal:RED[3],dx:-1}), frame([angry, puff(3,-1), puff(18,-1)],140,{pal:RED[3],dx:1}), frame([angry, puff(2,-3), puff(19,-3)],140,{pal:RED[3],dx:-1}), frame([angry, puff(2,-5), puff(19,-5)],400,{pal:RED[3]}), frame([angry],250,{pal:RED[2]}), frame([angry],250,{pal:RED[1]}), frame([blink],200), frame(n,700)]
};
