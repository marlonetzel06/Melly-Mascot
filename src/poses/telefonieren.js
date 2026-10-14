// Pose: Telefonieren
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'telefonieren',
  title: 'Telefonieren',
  category: 'Arbeit',
  desc: 'Hält in 3/4-Ansicht das Handy ans Ohr, hört zu (Blick, Blinzeln), redet in Schüben: Schallwellen laufen nach außen, die freie Hand gestikuliert im Takt, lacht am Ende.',
  still: 6,
  frames: ({ frame, phoneEar, talk, qLook, qBlink, qHappy, arm }) => {
    const Q = { view: 'Q' }, hand = (a, b) => arm('R', a, b, Q);
    return [
      frame([phoneEar], 450, Q),                                       // zuhören
      frame([phoneEar, qLook(false, 1, 0)], 350, Q),
      frame([phoneEar, qBlink(false)], 110, Q),
      frame([phoneEar, qLook(false, 1, 0)], 300, Q),
      frame([phoneEar, talk(1), hand(0, 63.5)], 110, Q),               // redet: Wellen laufen raus, Hand gestikuliert
      frame([phoneEar, talk(2), hand(26.5, 90)], 120, Q),
      frame([phoneEar, talk(3), hand(26.5, 116.5)], 160, Q),
      frame([phoneEar, hand(26.5, 116.5)], 90, Q),
      frame([phoneEar, talk(1), hand(26.5, 90)], 110, Q),
      frame([phoneEar, talk(2), hand(26.5, 116.5)], 120, Q),
      frame([phoneEar, talk(3), hand(26.5, 90)], 140, Q),
      frame([phoneEar, hand(0, 63.5)], 260, Q),                        // kurze Pause
      frame([phoneEar, talk(1), qHappy(false), hand(0, 63.5)], 120, Q), // lacht
      frame([phoneEar, talk(2), qHappy(false)], 140, Q),
      frame([phoneEar, talk(3), qHappy(false)], 220, Q),
      frame([phoneEar, qLook(false, 0, 1)], 380, Q),                   // wieder zuhören
      frame([phoneEar], 300, Q)
    ];
  }
};
