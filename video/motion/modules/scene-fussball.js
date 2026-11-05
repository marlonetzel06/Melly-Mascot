const { seg, eo, eio, lerp } = kit;
// Melly-Frames ohne Ball. Der Ball fliegt zwischen den Berührungen (rechter Fuß, linker Fuß, Kopf) auf echten
// Wurfparabeln mit Schwerkraft: harter Richtungswechsel am Fuß, kurzes Stauchen beim Kontakt, Drall.
const LOOPS = 3, S = 26, SP = 1.64 / 1.62, G = 265;
// Ball 7×7: runde Form, Mittelfleck + 5 Randflecken, Schatten unten rechts; 4 Drehstufen.
const ROWS = [3, 5, 7, 7, 7, 5, 3];
const inBall = (x, y) => y >= 0 && y < 7 && Math.abs(x - 3) <= (ROWS[y] - 1) / 2;
const PATCH = [[3, 3], [2, 3], [4, 3], [3, 4], [3, 0], [0, 2], [6, 2], [1, 5], [5, 5]];
function ballSprite(r) {
  const rot = ([x, y]) => { let dx = x - 3, dy = y - 3; for (let k = 0; k < r; k++) [dx, dy] = [-dy, dx]; return [dx + 3, dy + 3]; };
  const k = new Set(PATCH.map(rot).map(([x, y]) => x + ',' + y));
  const rows = [];
  for (let y = -1; y < 8; y++) { let s = '';
    for (let x = -1; x < 8; x++) {
      if (inBall(x, y)) s += k.has(x + ',' + y) ? 'k' : (x + y >= 8 ? 'w' : 'W');
      else s += [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([a, b]) => inBall(x + a, y + b)) ? 'O' : '.';
    }
    rows.push(s); }
  return rows;
}
const SPR = [0, 1, 2, 3].map(ballSprite);
kit.scene('fussball', {
  init(kit) {
    const g = MELLY.stage(kit);
    kit.stage.append(g);
    this.m = MELLY.mount(kit, g);
    const list = [];
    for (let k = 0; k < LOOPS; k++) list.push({ pose: 'fussball', combo: 5, speed: SP });
    list.push({ pose: 'fussball', combo: 5, idx: [0], speed: 4 });
    this.q = MELLY.seq(list);
    this.L = 1.62 * SP;
    // Berührungen je Runde: Zeit (s) und Ball-Position (linke obere Ecke, Raster)
    this.C = [[0, [26, 19]], [0.65 * SP, [3, 19]], [1.15 * SP, [14, 3]], [this.L, [26, 19]]];
    this.pal = MELLY.D.pal[5];
    const cv = kit.h('<canvas class="fussball-ball" width="1200" height="1456" style="position:absolute;left:0;top:-624px"></canvas>');
    this.m.el.append(cv);
    this.ctx = cv.getContext('2d');
  },
  ballAt(t) {
    const L = this.L;
    if (t >= LOOPS * L) {
      const u = Math.min(1, (t - LOOPS * L) / 0.6);
      return { x: 26 + 24 * u, y: 19 - 36 * eo(u), vx: 1, since: t - LOOPS * L };
    }
    const tl = Math.max(0, t) % L, C = this.C;
    let i = 0; while (i < C.length - 2 && tl >= C[i + 1][0]) i++;
    const [t0, p0] = C[i], [t1, p1] = C[i + 1], dt = t1 - t0, tau = tl - t0;
    const vx = (p1[0] - p0[0]) / dt, vy = (p1[1] - p0[1]) / dt - 0.5 * G * dt;
    return { x: p0[0] + vx * tau, y: p0[1] + vy * tau + 0.5 * G * tau * tau, vx, since: tau };
  },
  render(t) {
    MELLY.draw(this.m, MELLY.at(this.q, t));
    this.m.el.style.transform = 'scale(' + lerp(1.05, 1.03, eio(seg(t, 0, 5.74))) + ')';
    const b = this.ballAt(t);
    const spin = Math.floor(Math.max(0, t) * 10) % 4;
    const spr = SPR[b.vx < 0 ? (4 - spin) % 4 : spin];
    const sq = b.since < 0.08 ? 0.18 * (1 - b.since / 0.08) : 0;
    const sy = 1 - sq, sx = 1 + sq * 0.7;
    const ctx = this.ctx, pal = this.pal;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, 1200, 1456);
    const cx = (b.x + 3.5) * S, cy = (b.y + 3.5) * S + 624;
    ctx.setTransform(sx, 0, 0, sy, cx, cy);
    for (let y = 0; y < 9; y++) for (let x = 0; x < 9; x++) { const tok = spr[y][x]; if (tok === '.') continue; ctx.fillStyle = pal[tok]; ctx.fillRect((x - 4.5) * S, (y - 4.5) * S, S + 0.5, S + 0.5); }
  },
});
