// Pose: Angeln auf der Kante – gehört zum Outfit „angler“.
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js.
// Ohne eigenes Element: Melly sitzt im Profil auf einer gedachten Kante (Sitzfläche y 16 bis x 13), die Beine hängen davor –
// so lässt er sich auf jede Fläche setzen (Buchstabe, Box, Rand). Bildausschnitt: 5 px nach links (Platz vorn für den Wurf),
// 4 px nach oben (Platz über dem Kopf fürs Ausholen, darunter für die Schnur). Wasserlinie (Schwimmer) bei y 22.
const D = { view: 'S', dx: -5, dy: -4 };
const WATER = 22;

export default {
  id: 'angeln',
  title: 'Angeln auf der Kante',
  category: 'Kante',
  outfit: 'angler',
  desc: 'Sitzt seitlich auf einer Kante, Beine baumeln, Schwimmer wippt. Biss – zieht eine Tabelle aus dem Data Lake, freut sich, holt weit nach hinten aus und wirft in hohem Bogen neu aus.',
  still: 3,
  frames: ({ frame, sArmFwd, dangle, fishRod, fishLine, flyLine, splash, caret, sSurprised, star }) => {
    const blink = (p, S) => { S(14, 5, 'C'); S(15, 5, 'C'); };
    const happy = (p, S) => caret(S, 14);
    const up = (p, S) => { S(14, 6, 'C'); S(15, 6, 'C'); S(14, 4, 'E'); S(15, 4, 'E'); }; // Blick nach oben zur Rute
    const at = (mode, line, eyes = [], ms = 260, legs = [0, 0], extra = []) => frame([dangle(...legs), sArmFwd, fishRod(mode, line.bob || 0), fishLine(mode, line.y, line), ...eyes, ...extra], ms, D);
    const fly = (mode, pts, eyes, ms, extra = []) => frame([dangle(0, 0), sArmFwd, fishRod(mode), flyLine(mode, pts), ...eyes, ...extra], ms, D);
    const idle = [0, 1, 2, 3, 4, 5, 6, 7].map(i => {
      const bob = i % 4 < 2 ? 0 : 1, swing = i % 4 < 2 ? 1 : 0;
      return at('rest', { y: WATER + bob, bob }, i === 5 ? [blink] : [], i === 5 ? 120 : 280, [swing, 1 - swing]);
    });
    return [
      ...idle,
      // Biss: Schwimmer taucht ab, Rute biegt sich, Tabelle wird herausgezogen
      at('rest', { y: WATER + 1 }, [sSurprised], 160),
      at('bend', { y: WATER + 1 }, [sSurprised], 110),
      at('pull', { y: 14, catch: true }, [happy], 90),
      at('pull', { y: 6, catch: true }, [happy], 110),
      at('pull', { y: 3, catch: true }, [happy], 900, [1, 0], [star(26, 1)]),
      // Fang verstaut, neu auswerfen. Ausholen: Rute hoch, Schnur steigt nach hinten und streckt sich lang und hoch hinter ihm.
      fly('up', [[17, -5], [12, -5]], [up], 110),
      fly('back', [[6, -5], [-1, -4]], [up], 240),
      // Vorwärts: Rute schnellt vor, die Schnur rollt als Schlaufe über ihn nach vorn ab …
      fly('up', [[14, -5], [5, -4]], [up], 70),
      fly('cast', [[29, 1], [31, -1]], [], 70),
      // … und fliegt im Bogen weit nach vorn, der Schwimmer landet draußen und wird dann etwas eingeholt.
      fly('rest', [[29, 1], [31, 6]], [], 90),
      fly('rest', [[29, 4], [30, WATER]], [], 110, [splash(30, WATER)]),
      fly('rest', [[28, 8], [29, WATER]], [], 220),
      at('rest', { y: WATER }, [], 300)
    ];
  }
};
