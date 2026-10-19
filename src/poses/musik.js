// Pose: Musik hören – gehört zum Accessoire „kopfhoerer“.
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
// 16 Frames = 8 Schläge à 500 ms (120 BPM), je Schlag „runter“ (200 ms) und „hoch“ (300 ms):
// Kopf nickt auf den Schlag, Füße tippen abwechselnd, auf 2 und 4 schnipst er abwechselnd rechts und links.
// Pro Schlag steigt eine Note auf (abwechselnd rechts/links: Achtel, Viertel, zwei Achtel), schwankt nach außen und verblasst oben.
const TYPES = ['achtel', 'viertel', 'achtel2', 'viertel'];
const LIFE = 6;

export default {
  id: 'musik',
  title: 'Musik hören',
  category: 'Alltag',
  accessories: ['kopfhoerer'],
  desc: 'Nickt im Takt, tippt abwechselnd mit den Füßen und schnipst auf 2 und 4. Verschiedene Noten steigen aus den Kopfhörern auf.',
  still: 2,
  frames: ({ frame, happy, look, arm, spark, toeUp, tapMark, note, NOTE_W }) => {
    const toeUpL = p => { p(4, 17, '.'); p(5, 17, '.'); };
    const tapMarkL = p => { p(2, 17, 'w'); p(1, 16, 'w'); };
    return Array.from({ length: 16 }, (_, i) => {
      const b = i >> 1, down = i % 2 === 0;
      // Noten: Start auf jedem Schlag, Lebensdauer LIFE Frames
      const notes = [];
      for (let s = 0; s < 8; s++) {
        const age = (i - 2 * s + 16) % 16;
        if (age >= LIFE) continue;
        const type = TYPES[s % 4], right = s % 2 === 0, out = age >> 1, y = 3 - 2 * age; // 2 px pro Frame: Noten derselben Seite überlappen nicht
        const x = right ? Math.min(22 + out, 27 - NOTE_W[type]) : -1 - NOTE_W[type] - out; // mit Kontur im Bild
        notes.push(note(type, x, y, age >= LIFE - 2 ? 'h' : 'H'));
      }
      // Schnipsen auf 2 und 4 (Schlag 1, 3, 5, 7): rechts, links im Wechsel; Hand bleibt den ganzen Schlag oben
      const snap = b % 2 === 1 ? (b % 4 === 1 ? 'R' : 'L') : null;
      const arms = snap ? [arm(snap, 63, 135)] : [];
      const sparkle = snap && down ? [spark(snap === 'R' ? 25 : -4, 9)] : [];
      // Füße: rechts auf geraden, links auf ungeraden Schlägen
      const feet = b % 2 === 0 ? (down ? tapMark : toeUp) : (down ? tapMarkL : toeUpL);
      const eyes = b === 5 ? look(1) : happy;
      return frame([eyes, feet, ...arms, ...sparkle, ...notes], down ? 200 : 300, down ? { headDy: 1 } : {});
    });
  }
};
