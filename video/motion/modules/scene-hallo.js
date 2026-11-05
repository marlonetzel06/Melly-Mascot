const { seg, eo, ei, eio, lerp, TextFx } = kit;
// Laufzyklus (Frames 10-13, Figur vollständig sichtbar) wird von außerhalb des Bilds hereingeschoben,
// danach übernehmen die Original-Frames ab 14 (Ankommen, Winken).
const CYCLE = [10, 11, 12, 13], STEPS = 14, X0 = -24, X1 = 9;
kit.scene('hallo', {
  init(kit) {
    const g = MELLY.stage(kit);
    g.append(kit.h('<div class="words title day"><h1 class="line hallo-name">Melly</h1><div class="mark hallo-mark"></div></div>'));
    kit.stage.append(g);
    this.m = MELLY.mount(kit, g);
    const walk = [];
    for (let k = 0; k < STEPS; k++) walk.push(CYCLE[k % 4]);
    this.q = MELLY.seq([
      { pose: 'reinlaufen-hallo', combo: 0, idx: walk, glide: false },
      { pose: 'reinlaufen-hallo', combo: 0, idx: [14, 15, 16, 17, 18, 19, 20, 21, 22] },
    ]);
    this.tWalk = this.q.steps[STEPS].t0;
    this.name = g.querySelector('.hallo-name').style;
    this.mark = g.querySelector('.hallo-mark').style;
    this.words = g.querySelector('.title').style;
    this.shadow = g.querySelector('.shadow').style;
  },
  render(t) {
    const a = MELLY.at(this.q, t);
    let ox = 0;
    const X = lerp(X0, X1, seg(t, 0, this.tWalk));
    if (t < this.tWalk) ox = (X - (1 + 2 * (a.i - 10))) * 26;
    MELLY.draw(this.m, a, null, ox);
    this.shadow.transform = 'translateX(' + ((X - X1) * 26).toFixed(1) + 'px)';
    this.m.el.style.transform = 'scale(' + lerp(1, 1.025, eio(seg(t, 0, 4.6))) + ')';
    const inn = eo(seg(t, -0.6, 0.4));
    const out = ei(seg(t, 4.05, 4.5));
    this.name.opacity = inn * (1 - out);
    this.name.transform = 'translateY(' + (lerp(30, 0, inn) - 26 * out - t * 2) + 'px)';
    this.mark.transform = 'scaleX(' + eo(seg(t, 0.3, 0.9)) * (1 - out) + ')';
    this.words.opacity = 1 - out;
  },
});
