// Pose: Hinlegen
// frames(lib) bekommt alle Bausteine aus core.js, props.js und model.js. Bodenhöhe wie im Stehen (Schuhe y 17 → Boden y 18).
// wobble/tip: Bommel und Mützenzipfel im Outfit schwingen nach (Zipfel bleibt rechts, kippt über die Spitze, fällt nach links, landet).
export default {
  id: 'hinlegen',
  title: 'Hinlegen',
  category: 'Alltag',
  desc: 'Steht müde da, geht in die Hocke, kniet sich hin und stützt sich mit der Hand ab, sinkt in drei Neigungsstufen zur Seite, der Kopf legt sich zuletzt ab, Staub, schläft. Endet im Schlaf („Liegt auf dem Boden“).',
  still: 5,
  frames: ({ frame, blink, squat, kneel, lean, lying, cloud, zSlot }) => {
    const V = { view: '-' }, dust = [cloud(-6, 17), cloud(25, 17, 'Z', true)];
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
