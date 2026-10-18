// Pose: Hinlegen
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js. Bodenhöhe wie im Stehen (Schuhe y 17 → Boden y 18).
// wobble/tip: Bommel und Mützenzipfel im Outfit schwingen nach (Zipfel bleibt rechts, kippt über die Spitze, fällt nach links, landet).
// outfit.doff (Bauhelm): nimmt den Helm erst ab, stellt ihn links neben sich (hut, halb hinter dem Kopf) und rutscht zum Hinlegen 3 px nach rechts.
export default {
  id: 'hinlegen',
  title: 'Hinlegen',
  category: 'Alltag',
  desc: 'Steht müde da, geht in die Hocke, kniet sich hin und stützt sich mit der Hand ab, sinkt in drei Neigungsstufen zur Seite, der Kopf legt sich zuletzt ab, Staub, schläft. Endet im Schlaf („Liegt auf dem Boden“).',
  still: 5,
  frames: ({ frame, blink, look, arm, squat, kneel, lean, lying, cloud, zSlot, outfit }) => {
    const V = { view: '-' }, dust = [cloud(-6, 17), cloud(25, 17, 'Z', true)];
    if (outfit?.doff) {
      const grip = sh => [arm('L', 160, 180, { sh }), arm('R', 160, 180, { sh })], hold = [arm('L', 0, 0, { fore: 0 }), arm('R', 0, 0, { fore: 0 })], side = arm('L', 26, 26, { fore: 1 }), F = [-8, 14, 'hinten'], L = { ...V, hut: F };
      return [
        frame([blink], 300),                                               // steht müde, Helm auf
        frame([blink, ...grip(2)], 180, { headDy: 1 }),                    // Kopf sinkt, Hände greifen den Schirm
        frame([look(0, -1), ...grip(3)], 140, { hut: [0, -1] }),           // hebt ihn ab
        frame([blink, ...hold], 240, { hut: [0, 12] }),                    // hält ihn mit beiden Händen am Schirm vor dem Bauch
        frame([squat, blink, side], 140, { dy: 1, hut: [-5, 13] }),        // Hocke, führt ihn nach links unten
        frame([kneel, blink], 160, { dy: 2, hut: F }),                     // stellt ihn ab, kniet
        frame([lean(26)], 110, { ...L, dx: 1 }), frame([lean(45)], 100, { ...L, dx: 2 }), frame([lean(63)], 100, { ...L, dx: 3 }), // sinkt zur Seite, rutscht vom Helm weg
        frame([lying(2, 3, 'zu', 2)], 90, L),                              // liegt, Kopf noch angehoben
        frame([lying(2, 3, 'zu')], 560, L),                                // Kopf ab
        frame([lying(2, 3, 'zu'), zSlot(0, -7, -3)], 420, L)               // erstes Z
      ];
    }
    return [
      frame([blink], 300),                                                 // steht müde
      frame([blink], 180, { headDy: 1, wobble: 1 }),                       // Kopf sinkt (Ausholen)
      frame([squat, blink], 120, { dy: 1 }),                               // Hocke
      frame([kneel, blink], 120, { dy: 2, wobble: 1 }),                    // kniet, Hand stützt am Boden
      frame([lean(26)], 110, { ...V, tip: 'rechts' }), frame([lean(45)], 100, { ...V, tip: 'hoch' }), frame([lean(63)], 100, { ...V, tip: 'links' }), // sinkt zur Seite
      frame([lying(-1, 3, 'zu', 2)], 90, { ...V, tip: 'faellt' }),         // liegt, Kopf noch angehoben
      frame([lying(-1, 3, 'zu'), ...dust], 140, { ...V, tip: 'frei' }),    // Kopf ab, Staub
      frame([lying(-1, 3, 'zu')], 420, V),
      frame([lying(-1, 3, 'zu'), zSlot(0, -10, -3)], 420, V)               // erstes Z (= Anfang „Liegt auf dem Boden“)
    ];
  }
};
