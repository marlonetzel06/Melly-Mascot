// Pose: Telefonieren
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'telefonieren',
  title: 'Telefonieren',
  category: 'Arbeit',
  desc: 'Hält in 3/4-Ansicht das Handy ans Ohr, hört zu, redet (Schallwellen), nickt mit den Augen und blinzelt.',
  still: 2,
  frames: ({ frame, phoneEar, talk, qLook, qBlink, qHappy }) => { const Q = { view: 'Q' }; return [
    frame([phoneEar], 500, Q),
    frame([phoneEar, talk(1)], 180, Q),
    frame([phoneEar, talk(2)], 220, Q),
    frame([phoneEar, talk(1), qLook(false, 1, 0)], 200, Q),
    frame([phoneEar, qLook(false, 1, 0)], 300, Q),
    frame([phoneEar, qLook(false, 0, 1)], 220, Q),
    frame([phoneEar], 220, Q),
    frame([phoneEar, qLook(false, 0, 1)], 220, Q),
    frame([phoneEar, qBlink(false)], 110, Q),
    frame([phoneEar, talk(2), qHappy(false)], 500, Q)
  ]; }
};
