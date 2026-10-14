// Pose: Handy (LinkedIn)
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'handy',
  title: 'Handy (LinkedIn)',
  category: 'Arbeit',
  desc: 'Scrollt mit dem Daumen, Blick nach unten, ab und zu ploppt ein Herz (Like) auf.',
  still: 5,
  frames: ({ frame, phone, look, happy }) => [frame([phone(false), look(0,1)],350), frame([phone(true), look(0,1)],200), frame([phone(false), look(0,1)],350), frame([phone(true), look(0,1)],200), frame([phone(false), look(0,1)],350), frame([phone(false, true), happy],700), frame([phone(true), look(0,1)],200), frame([phone(false), look(0,1)],400)]
};
