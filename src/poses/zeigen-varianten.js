// Posen: Zeigen in 4 Winkeln × Ansicht (vorne, hinten, schräg hinten wie an der Tafel) × Seite (Bildseite).
// Der Arm schwingt im Bogen über die sauberen Pixelwinkel zum Ziel, hält, und schwingt zurück. Standbild = Zielpose.
// Eine Datei statt 24 fast gleicher Posen-Dateien; registry.js nimmt das Array auf.
const STEPS = [26.5, 45, 63.5, 90, 116.5, 135];
const ANGLES = [['hoch', 135, -1], ['schraeg-hoch', 116.5, -1], ['waagerecht', 90, 0], ['schraeg-runter', 63.5, 1]];
const VIEWS = [
  ['vorne', 'vorne', { R: 'F', L: 'F' }],
  ['hinten', 'von hinten', { R: 'B', L: 'B' }],
  ['tafel', 'schräg von hinten (Tafel)', { R: 'QB', L: 'QBL' }]
];
const LABEL = { 'hoch': 'hoch', 'schraeg-hoch': 'schräg hoch', 'waagerecht': 'waagerecht', 'schraeg-runter': 'schräg runter' };

const variant = (vKey, vText, views, side, aKey, target, eyeDy) => {
  const view = views[side], sideText = side === 'R' ? 'rechts' : 'links';
  const id = vKey === 'vorne' && side === 'R' && aKey === 'waagerecht' ? 'zeigen' : `zeigen-${vKey}-${sideText}-${aKey}`;
  const path = STEPS.filter(a => a < target).map(a => (a === 90 ? 100 : a)); // auf dem Weg nach oben 100° statt 90° (sonst Handsprung > 3 px)
  return {
    id,
    title: `Zeigen · ${vText} · ${sideText} · ${LABEL[aKey]}`,
    category: 'Zeigen',
    desc: `Arm schwingt im Bogen nach ${sideText} ${LABEL[aKey]} und hält – zum Zeigen auf ein Objekt${view === 'F' ? ', Blick folgt' : ''}.`,
    still: path.length + 1,
    frames: ({ frame, arm, look, blink }) => {
      const o = { view }, eyes = view === 'F' ? [look(side === 'R' ? 1 : -1, eyeDy)] : [];
      const A = (a, finger) => arm(side, a, a, { view, finger });
      return [
        frame([], 400, o),
        ...path.map((a, i) => frame([A(a), ...(i ? eyes : [])], 55, o)),
        ...(view === 'F'                                          // vorne: halten, blinzeln, halten; ohne Gesicht ein Halte-Frame
          ? [frame([A(target, true), ...eyes], 1400, o), frame([A(target, true), blink], 110, o), frame([A(target, true), ...eyes], 700, o)]
          : [frame([A(target, true)], 2100, o)]),
        ...[...path].reverse().map(a => frame([A(a)], 60, o))
      ];
    }
  };
};

export default VIEWS.flatMap(([vKey, vText, views]) => ['R', 'L'].flatMap(side => ANGLES.map(([aKey, target, eyeDy]) => variant(vKey, vText, views, side, aKey, target, eyeDy))));
