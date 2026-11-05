const { seg, eio, lerp } = kit;
kit.scene('laptop', {
  init(kit) {
    const g = MELLY.stage(kit);
    kit.stage.append(g);
    this.m = MELLY.mount(kit, g);
    this.q = MELLY.seq([
      { pose: 'laptop-raus', combo: 5 },
      { pose: 'laptop', combo: 5, idx: [0, 2, 6] },
      { pose: 'laptop-weg', combo: 5 },
      { pose: 'daumen-hoch', combo: 5, idx: [2, 3] },
    ]);
    this.spot = g.querySelector('.spot').style;
  },
  render(t) {
    MELLY.draw(this.m, MELLY.at(this.q, t));
    this.m.el.style.transform = 'scale(' + lerp(1.07, 1.03, eio(seg(t, 0, 5.6))) + ')';
    this.spot.transform = 'scale(' + lerp(1.06, 1.0, eio(seg(t, 0, 5.6))) + ')';
  },
});
