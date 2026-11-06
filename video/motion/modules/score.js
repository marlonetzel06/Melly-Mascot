kit.score(function (S, T) {
  // Ein Raster für Karussell, Fußball und Laptop: Beat 0 = erster Anzugwechsel, Fußball auf Beat 6, Laptop auf Beat 13.
  const B = 0.82, sw = T.karussell + 1.08, at = n => sw + n * B;
  S.tempo(60 / B, { t0: sw });
  S.program('pad', 'pad', { rev: 0.6, gain: -4 });
  S.program('mallet', 'marimba', { pan: -0.2 });
  S.program('keys', 'ep', { pan: 0.15 });
  S.program('bass', 'bass', { gain: -5, bright: 0.45 });
  S.program('pluck', 'pluck', { pan: 0.25 });
  // Hallo
  S.chord('pad', ['F3', 'C4', 'A4'], { t: 0, dur: 5.0, vel: 30 });
  [1.95, 2.25, 2.55].forEach((t, i) => S.note('mallet', ['C5', 'F5', 'A5'][i], { t, dur: 0.4, vel: 50 }));
  // Anzug-Karussell (Beats 0-5): halbes Tempo im Kick, weiche Akkorde über zwei Schläge, Marimba-Melodie bleibt vorn
  S.chord('pad', ['D3', 'A3', 'F4'], { t: T.karussell - 0.3, dur: 1.6, vel: 26 });
  S.run('mallet', ['F4', 'A4', 'C5', 'F5'], { t: sw - 0.5, step: 0.12, vel: 42, cresc: 6 });
  [['F3', 'A3', 'C4'], ['A#2', 'D3', 'F3'], ['C3', 'E3', 'G3']].forEach((c, k) => S.chord('keys', c, { t: at(2 * k), dur: 2 * B * 0.95, vel: 40 }));
  for (let i = 0; i < 6; i++) {
    const t = at(i);
    if (i % 2 === 0) S.drum('kick', { t, vel: 70 });
    S.drum('hat', { t: t + B / 2, vel: 24 });
    if (i % 2 === 0) S.note('bass', ['F2', 'A#2', 'C3'][i / 2], { t, dur: 2 * B * 0.92, vel: 54 });
    if (i > 0) S.fx('pop', t, { vel: 30 });
    S.note('mallet', ['C5', 'A4', 'F4', 'G4', 'A4', 'E4'][i], { t: t + B / 2, dur: 0.35, vel: 44 });
  }
  // Fußball (Beats 6-12): keine Drums mehr, nur Fläche, Bass und ein Ton pro Ballberührung
  const F = T.fussball, LEAD = 0.41, L = 2 * B, SP = 1.64 / 1.62;
  S.chord('pad', ['F3', 'A3', 'C4', 'E4'], { t: F - 0.2, dur: 5.6, vel: 22 });
  S.fx('whoosh', F, { dur: 0.4, vel: 22, into: 1 });
  [['F3', 'A3', 'C4'], ['D3', 'F3', 'A3'], ['A#2', 'D3', 'F3']].forEach((c, k) => { S.chord('keys', c, { t: F + LEAD + k * L, dur: L * 0.95, vel: 30 }); S.note('bass', ['F2', 'D2', 'A#2'][k], { t: F + LEAD + k * L, dur: L * 0.9, vel: 46 }); });
  const touch = [0, 0.65 * SP, 1.15 * SP], mel = [['C5', 'E5', 'G5'], ['A4', 'C5', 'F5'], ['A#4', 'D5', 'F5']];
  for (let k = 0; k < 3; k++) touch.forEach((x, j) => { const t = F + LEAD + k * L + x; S.fx('thud', t, { vel: j === 2 ? 30 : 38 }); S.note('pluck', mel[k][j], { t, dur: 0.35, vel: 50 }); });
  for (let k = 0; k < 12; k++) S.drum('shaker', { t: F + LEAD + k * B / 2 + B / 4, vel: 14 });
  // Ball weggeschossen, C-Akkord führt zum Laptop
  const K = F + LEAD + 3 * L;
  S.fx('thud', K, { vel: 50 });
  S.fx('whoosh', K + 0.02, { dur: 0.45, vel: 34 });
  S.note('pluck', 'C6', { t: K, dur: 0.6, vel: 54 });
  S.chord('keys', ['C3', 'E3', 'G3', 'A#3'], { t: K, dur: 0.45, vel: 40 });
  S.note('bass', 'C2', { t: K, dur: 0.4, vel: 58 });
  // Laptop (ab Beat 13): Auflösung nach F, Tippen, Zuklappen
  S.chord('keys', ['F3', 'A3', 'C4'], { t: at(13), dur: 1.6, vel: 42 });
  S.note('bass', 'F2', { t: at(13), dur: 1.6, vel: 56 });
  S.chord('pad', ['F3', 'C4', 'A4'], { t: T.laptop - 0.3, dur: 3.5, vel: 26 });
  S.fx('click', T.laptop + 0.49, { vel: 30, pitch: -4 });
  const keys = [1.56, 1.6, 1.65, 1.71, 1.82, 1.86, 1.9, 1.95, 1.99, 2.1, 2.14, 2.19, 2.23, 2.27, 2.31, 2.42, 2.46, 2.5];
  keys.forEach((x, n) => S.fx('tick', T.laptop + x, { vel: 26 + ((n * 37) % 15), pitch: ((n * 53) % 5) - 2, pan: (((n * 29) % 7) - 3) * 0.05 }));
  S.fx('click', T.laptop + 2.58, { vel: 46 });
  S.fx('click', T.laptop + 3.04, { vel: 34, pitch: -6 });
  S.chord('pad', ['D3', 'A3', 'C4', 'F4'], { t: T.laptop + 2.9, dur: 3.9, vel: 30 });
  S.fx('ding', T.laptop + 3.95, { vel: 50 });
  // Tschüss unter Sternen
  S.chord('pad', ['A#2', 'F3', 'D4'], { t: T.tschuess - 0.2, dur: 1.4, vel: 26 });
  S.fx('revswell', T.tschuess + 1.0, { dur: 1.0, vel: 40 });
  S.chord('keys', ['F3', 'A3', 'C4', 'E4'], { t: T.tschuess + 1.0, dur: 4.6, vel: 60 });
  S.note('bass', 'F2', { t: T.tschuess + 1.0, dur: 2.6, vel: 56 });
  S.run('pluck', ['C5', 'F5', 'A5', 'C6'], { t: T.tschuess + 1.0, step: 0.14, vel: 54 });
  S.chord('pad', ['F3', 'C4', 'A4', 'E5'], { t: T.tschuess + 1.0, dur: 5, vel: 30 });
  S.master({ gain: -6, fadeOut: 1.4 });
});
