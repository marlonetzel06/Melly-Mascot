// Pose: Kamelle werfen
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'kamelle-werfen',
  title: 'Kamelle werfen',
  category: 'Bewegung',
  desc: 'Holt ein Bonbon hoch, holt über dem Kopf aus (Kopf sinkt ein), wirft es nach rechts ins Publikum, Arm schwingt nach und sinkt.',
  still: 6,
  frames: ({ frame, arm, handAt, bonbon, happy, effort, n }) => {
    // Arm rechts mit Bonbon auf der Hand (sitzt direkt über der 2×2-Hand)
    const held = (a1, a2 = a1) => { const [x, y] = handAt('R', a1, a2); return [arm('R', a1, a2), bonbon(x - 1, y - 2)]; };
    return [
      frame(n, 300),
      frame([...held(26.5)], 110),
      frame([...held(63.5)], 60),
      frame([...held(116.5)], 60),
      frame([...held(135, 160), effort], 260, { headDy: 1 }),     // ausholen hinter dem Kopf
      frame([...held(135), effort], 60),
      frame([arm('R', 116.5), bonbon(24, 1), happy], 60),          // Abwurf: Bonbon löst sich
      frame([arm('R', 90), bonbon(25, -3), happy], 60),
      frame([arm('R', 63.5), happy], 120),                         // Nachschwingen
      frame([arm('R', 45), happy], 90),
      frame([arm('R', 26.5), happy], 90),
      frame([happy], 400)
    ];
  }
};
