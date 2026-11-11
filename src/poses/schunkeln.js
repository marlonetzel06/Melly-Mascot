// Pose: Schunkeln
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'schunkeln',
  title: 'Schunkeln',
  category: 'Bewegung',
  desc: 'Arme seitlich eingehakt, neigt sich im Dreivierteltakt über die Arme nach rechts und links (die eigentliche Schaukelbewegung kommt im Film als weiche Drehung um die Füße), singt mit (Noten), hängt die Arme wieder aus.',
  still: 4,
  frames: ({ frame, arm, happy, note }) => {
    // Eingehakt: Oberarm schräg hoch, Unterarm waagerecht nach außen. Neigung: die Seite, zu der Melly kippt, sinkt.
    const hook = (l, r) => [arm('L', l, 90), arm('R', r, 90)];
    const mid = hook(63.5, 63.5), toR = hook(90, 45), toL = hook(45, 90);
    const sing = (k, right) => note(k ? 'achtel' : 'viertel', right ? 23 : -5, k ? -3 : -2, k ? 'H' : 'h');
    const side = (lean, right, k) => [
      frame([...lean, happy], 90),                                 // kippt an
      frame([...lean, happy, sing(k, !right)], 520) // ganz drüben (Neigung über die Arme), Note auf der Gegenseite
    ];
    return [
      frame([happy], 250),
      frame([arm('L', 26.5), arm('R', 26.5), happy], 70),          // Arme heben
      frame([...mid, happy], 140),                                 // eingehakt
      ...side(toR, true, 0), frame([...mid, happy], 90),
      ...side(toL, false, 1), frame([...mid, happy], 90),
      ...side(toR, true, 1), frame([...mid, happy], 90),
      ...side(toL, false, 0), frame([...mid, happy], 140),
      frame([arm('L', 26.5), arm('R', 26.5), happy], 70),          // aushaken
      frame([happy], 400)
    ];
  }
};
