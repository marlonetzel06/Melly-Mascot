const { seg, eo, eio, lerp } = kit;
kit.scene('karussell', {
  init(kit) {
    const g = MELLY.stage(kit);
    g.append(kit.h('<div class="ring karussell-ring"></div>'));
    kit.stage.append(g);
    this.m = MELLY.mount(kit, g);
    const list = [{ pose: 'jubeln', combo: 0, idx: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10] }];
    for (let c = 1; c < 6; c++) list.push({ pose: 'jubeln', combo: c, idx: [3, 4, 5, 6, 7, 8, 9, 10] });
    list.push({ pose: 'jubeln', combo: 5, idx: [14, 16, 18] });
    this.q = MELLY.seq(list);
    this.sw = [];
    let prev = 0;
    for (const s of this.q.steps) if (s.combo !== prev) { this.sw.push(s.t0); prev = s.combo; }
    this.ring = g.querySelector('.karussell-ring').style;
  },
  render(t) {
    MELLY.draw(this.m, MELLY.at(this.q, t));
    this.m.el.style.transform = 'scale(' + lerp(1.025, 1.05, eio(seg(t, 0, 6))) + ')';
    let r = 0;
    for (const w of this.sw) { const d = t - w; if (d >= 0 && d < 0.55) r = Math.max(r, 1 - d / 0.55); }
    const size = lerp(80, 760, eo(1 - r));
    this.ring.width = this.ring.height = size + 'px';
    this.ring.margin = (-size / 2) + 'px';
    this.ring.opacity = r > 0 ? 0.7 * r : 0;
  },
});
