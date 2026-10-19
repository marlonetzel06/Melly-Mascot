// Pose: Dashboard herbeizaubern – gehört zum Outfit „zauberer“.
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
// Zauberstab in der Hand auf der Bildseite rechts; das Dashboard erscheint über Mellys rechter Hand (Bildseite links).
export default {
  id: 'zaubern',
  title: 'Dashboard herbeizaubern',
  category: 'Arbeit',
  outfit: 'zauberer',
  desc: 'Holt mit dem Zauberstab aus, schwingt ihn im Bogen, hebt die andere Hand – Wolke, ein Mini-Dashboard baut sich auf und schwebt über der Hand. Zwinkert, Dashboard verpufft.',
  still: 10,
  frames: ({ frame, blink, look, happy, wink, armHalfR, waveA, waveB, arm, wand, magicCard, magicPuff, spark, star }) => {
    const palm = arm('L', 135, 135), lift = arm('L', 63, 90), hold = [armHalfR, wand('half')];
    return [
      frame([wand('down')], 700),
      frame([wand('down'), blink], 110),
      frame([armHalfR, wand('half')], 90, { headDy: 1 }),
      frame([waveA, wand('up'), look(1, -1), spark(27, 1)], 140),
      frame([waveB, wand('swing'), look(1, -1), star(26, 1), spark(27, 7)], 80),
      frame([waveA, wand('up'), lift, look(-1, -1), spark(21, -2), spark(2, -2)], 110),
      frame([...hold, palm, look(-1, -1), magicPuff, spark(1, 1)], 130),
      frame([...hold, palm, look(-1, -1), magicCard(1)], 90),
      frame([...hold, palm, look(-1, -1), magicCard(2)], 90),
      frame([...hold, palm, happy, magicCard(3), star(1, -2)], 160),
      frame([...hold, palm, wink, magicCard(3, 1), spark(2, -3)], 450),
      frame([...hold, palm, wink, magicCard(3, 0), spark(1, 3)], 450),
      frame([...hold, palm, happy, magicCard(3, 1)], 400),
      frame([wand('down'), magicPuff], 130),
      frame([wand('down')], 400)
    ];
  }
};
