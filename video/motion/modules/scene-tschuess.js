const { seg, eo, eob, eio, lerp, TextFx } = kit;
// Winken, umdrehen, dann Laufzyklus (Frames 9-12, Figur vollständig) ganz aus dem Bild heraus.
const CYCLE = [9, 10, 11, 12], STEPS = 15, SPEED = 2 / 0.13;
kit.scene('tschuess', {
  init(kit) {
    const g = MELLY.stage(kit);
    g.append(kit.h('<div class="words title"><h1 class="line tschuess-name">Melly</h1><div class="mark tschuess-mark"></div><p class="sub tschuess-sub">Bis bald</p></div>'));
    kit.stage.append(g);
    this.m = MELLY.mount(kit, g);
    const walk = []; for (let k = 0; k < STEPS; k++) walk.push(CYCLE[k % 4]);
    this.q = MELLY.seq([
      { pose: 'tschuess', combo: 5, idx: [0, 1, 2, 5, 6, 7, 8] },
      { pose: 'tschuess', combo: 5, idx: walk, glide: false },
    ]);
    this.tw = this.q.steps[7].t0;
    this.tEnd = this.q.steps[7 + STEPS - 1].t1;
    this.name = g.querySelector('.tschuess-name').style;
    this.mark = g.querySelector('.tschuess-mark').style;
    this.sub = g.querySelector('.tschuess-sub');
    this.shadow = g.querySelector('.shadow').style;
  },
  render(t) {
    const a = MELLY.at(this.q, t);
    let ox = 0, X = 8;
    if (t >= this.tw) { X = 11 + (Math.min(t, this.tEnd) - this.tw) * SPEED; ox = (X - (11 + 2 * (a.i - 9))) * 26; }
    MELLY.draw(this.m, a, null, ox);
    this.shadow.transform = 'translateX(' + ((X - 8) * 26).toFixed(1) + 'px)';
    this.m.el.style.transform = 'scale(' + lerp(1.03, 1.0, eio(seg(t, 0, 3))) + ')';
    const p = seg(t, 0.6, 1.2);
    this.name.opacity = eo(p);
    this.name.transform = 'translateY(' + (lerp(34, 0, eo(p)) - Math.max(0, t - 1.2) * 2) + 'px) scale(' + lerp(0.94, 1, eob(p, 1.6)) + ')';
    this.mark.transform = 'scaleX(' + eob(seg(t, 1.0, 1.5), 1.6) + ')';
    TextFx.fadeFromRight(this.sub, t, 1.4);
  },
});
