// Pose: Jubeln
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'jubeln',
  title: 'Jubeln',
  category: 'Bewegung',
  desc: 'Kurzes Ducken, Sprung mit beiden Armen hoch, Funken blinken, Landung.',
  still: 2,
  frames: ({ frame, armsUp, happy, spark }) => [frame([happy],260,{dy:1}), frame([armsUp,happy,spark(-3,3,false),spark(23,2,true)],120,{dy:-2}), frame([armsUp,happy,spark(-3,3,true),spark(23,2,false)],120,{dy:-3}), frame([armsUp,happy,spark(-3,3,false),spark(23,2,true)],120,{dy:-2}), frame([armsUp,happy,spark(-3,3,true),spark(23,2,false)],200), frame([happy],500)]
};
