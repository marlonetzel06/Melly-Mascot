// Pose: Weihnachtsmann – gehört zum Outfit „weihnachten“ (Anzug, Mütze kommen aus src/outfits.js).
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
export default {
  id: 'weihnachtsmann',
  title: 'Weihnachtsmann',
  category: 'Alltag',
  outfit: 'weihnachten',
  desc: 'Hält den Sack, winkt über Zwischenposition, Bommel wippt mit.',
  still: 3,
  frames: ({ frame, blink, happy, armHalfR, waveA, waveB, sack }) => {
    const w = { wobble: 1 };
    return [
      frame([sack], 600),
      frame([sack, blink], 120),
      frame([sack, armHalfR], 90),
      frame([sack, waveA, happy], 150, w),
      frame([sack, waveB, happy], 170),
      frame([sack, waveA, happy], 150, w),
      frame([sack, waveB, happy], 170),
      frame([sack, waveA, happy], 220, w),
      frame([sack, armHalfR], 90),
      frame([sack], 800)
    ];
  }
};
