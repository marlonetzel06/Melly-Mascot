(function(){
const D = kit.json('melly.json');
const S = 26, W = D.GW, H = D.GH;
const clamp01 = x => x < 0 ? 0 : x > 1 ? 1 : x;
const eo = x => 1 - Math.pow(1 - x, 3);
const ei = x => x * x * x;
const eio = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const sst = (a, b, x) => { const p = clamp01((x - a) / (b - a)); return p * p * (3 - 2 * p); };

// ---------- Dachterrasse: Pixel-Himmel mit Tag-Nacht-Verlauf (läuft in Film-Zeit, daher nahtlos über Schnitte) ----------
const LW = 180, LH = 225, DECK = 176;
const hx = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mix = (a, b, p) => [a[0] + (b[0] - a[0]) * p, a[1] + (b[1] - a[1]) * p, a[2] + (b[2] - a[2]) * p];
const css = (c, al) => 'rgba(' + (c[0] | 0) + ',' + (c[1] | 0) + ',' + (c[2] | 0) + ',' + (al == null ? 1 : al) + ')';
// Tag bis zum Fußball, Nachmittag am Laptop, Sonnenuntergang beim Zuklappen, danach Nacht.
const KEYS = [[0, '#5FB4E0', '#C4EAF4'], [10.85, '#5FB4E0', '#C4EAF4'], [16.59, '#5FA6D6', '#F3DDB0'], [19.2, '#5B5C9E', '#F6A27A'], [20.4, '#3B3573', '#E57F6C'], [21.7, '#1E1B3E', '#3D3163'], [999, '#1E1B3E', '#3D3163']].map(k => [k[0], hx(k[1]), hx(k[2])]);
function rng(seed) { let a = seed >>> 0; return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
const SPAN = 380;
function city(seed, wMin, wMax, hMin, hMax) {
  const r = rng(seed), out = []; let x = 0;
  while (x < SPAN) { const w = wMin + Math.floor(r() * (wMax - wMin)); const h = hMin + Math.floor(r() * (hMax - hMin)); const win = []; 
    for (let wy = 4; wy < h - 3; wy += 4) for (let wx = 2; wx < w - 2; wx += 3) win.push([wx, wy, r() < 0.42, r()]);
    out.push({ x, w, h, win, ant: r() < 0.25 }); x += w + (r() < 0.3 ? 2 : 0); }
  return out;
}
const FAR = city(7, 9, 20, 28, 74), NEAR = city(21, 12, 26, 14, 44);
const STARS = (() => { const r = rng(3), s = []; for (let i = 0; i < 70; i++) s.push([Math.floor(r() * LW), Math.floor(r() * 120), r() * 6.28, r() < 0.2]); return s; })();
const CLOUDS = [[20, 46, 1.0], [110, 30, 0.8], [190, 70, 1.2], [290, 52, 0.9]];
const C = {
  farD: hx('#8FA2C8'), farN: hx('#2D2A55'), nearD: hx('#5A6890'), nearN: hx('#1A1835'),
  winD: hx('#B8D2EE'), lit: hx('#FFD27A'), sunD: hx('#FFE9A3'), sunS: hx('#FF9E5E'), moon: hx('#F3EBD2'),
  railD: hx('#4A4458'), railN: hx('#2A2440'), deckD: hx('#B3A194'), deckN: hx('#4A3F52'), edgeD: hx('#D2C2B4'), edgeN: hx('#64566E'), plank: hx('#000000'),
};
function skyAt(T) { let i = 0; while (T >= KEYS[i + 1][0]) i++; const a = KEYS[i], b = KEYS[i + 1]; const p = sst(0, 1, (T - a[0]) / (b[0] - a[0])); return [mix(a[1], b[1], p), mix(a[2], b[2], p)]; }
function disc(ctx, cx, cy, r) { for (let y = -r; y <= r; y++) { const w = Math.floor(Math.sqrt(r * r - y * y)); ctx.fillRect(Math.round(cx - w), Math.round(cy + y), 2 * w + 1, 1); } }
window.SKY = {
  draw(ctx, T) {
    const [top, bot] = skyAt(T), n = sst(19.3, 21.7, T), dusk = sst(15.9, 19.8, T) * (1 - sst(20.6, 22.0, T));
    for (let y = 0; y < DECK; y++) { ctx.fillStyle = css(mix(top, bot, y / DECK)); ctx.fillRect(0, y, LW, 1); }
    // Sterne
    if (n > 0) for (const s of STARS) { const tw = 0.55 + 0.45 * Math.sin(T * 1.6 + s[2]); ctx.fillStyle = css([255, 248, 230], n * tw * (s[3] ? 1 : 0.7)); ctx.fillRect(s[0], s[1], s[3] ? 2 : 1, s[3] ? 2 : 1); }
    // Sonne sinkt hinter die Skyline, Mond kommt
    const sp = clamp01(T / 20.2);
    if (sp < 1) { const sc = mix(C.sunD, C.sunS, sst(14.4, 19.4, T)); ctx.fillStyle = css(sc, 0.25); disc(ctx, 150 - 30 * sp, 34 + 150 * ei(sp), 14); ctx.fillStyle = css(sc); disc(ctx, 150 - 30 * sp, 34 + 150 * ei(sp), 9); }
    if (n > 0) { const mx = 34 + 4 * sst(19.9, 28.2, T), my = 70 - 22 * sst(19.9, 28.2, T); ctx.fillStyle = css(C.moon, n); disc(ctx, mx, my, 7); ctx.fillStyle = css(mix(top, bot, my / DECK), n); disc(ctx, mx + 4, my - 2, 6); }
    // Wolken ziehen
    const cl = 1 - n * 0.75; const cc = mix([255, 255, 255], [255, 190, 170], dusk);
    for (const c of CLOUDS) { const x = ((c[0] + T * 2.4 * c[2]) % 420) - 60, y = c[1]; ctx.fillStyle = css(cc, 0.85 * cl); ctx.fillRect(x, y + 2, 22, 4); ctx.fillRect(x + 4, y, 10, 2); ctx.fillRect(x + 12, y + 1, 6, 1); ctx.fillRect(x + 2, y + 6, 16, 1); }
    // Skyline: zwei Ebenen mit Parallax
    const layer = (bs, off, base, dC, nC, winBig) => {
      const bc = mix(mix(dC, [120, 90, 120], dusk * 0.35), nC, n);
      for (const b of bs) { const x = (((b.x - off) % SPAN) + SPAN) % SPAN - 24; if (x > LW || x + b.w < 0) continue;
        const y0 = base - b.h; ctx.fillStyle = css(bc); ctx.fillRect(x, y0, b.w, b.h);
        if (b.ant) { ctx.fillRect(x + (b.w >> 1), y0 - 6, 1, 6); ctx.fillStyle = css([255, 90, 80], 0.35 + 0.65 * n * (0.5 + 0.5 * Math.sin(T * 3))); ctx.fillRect(x + (b.w >> 1), y0 - 7, 1, 1); }
        for (const w of b.win) { const lit = w[2] && w[3] < n * 1.15; const col = lit ? C.lit : mix(mix(dC, C.winD, 0.55), mix(nC, [60, 55, 95], 0.6), n); ctx.fillStyle = css(col, lit ? 1 : 0.9); ctx.fillRect(x + w[0], y0 + w[1], 1, winBig ? 2 : 1); } }
    };
    layer(FAR, 0, DECK - 6, C.farD, C.farN, false);
    layer(NEAR, 0, DECK, C.nearD, C.nearN, true);
    // Terrasse: Geländer (immer gegen den Himmel lesbar), Ziegel-Brüstung, Pflanzkübel, Laternen, Fliesenboden
    const P = 162, RAIL = 146;
    const rail = mix(hx('#3E3A4C'), hx('#8A7CA8'), n), railHi = mix(hx('#6A6478'), hx('#B8A8D0'), n);
    ctx.fillStyle = css(rail); ctx.fillRect(0, RAIL, LW, 2); ctx.fillStyle = css(railHi); ctx.fillRect(0, RAIL, LW, 1);
    ctx.fillStyle = css(rail); ctx.fillRect(0, RAIL + 8, LW, 1);
    for (let x = 6; x < LW; x += 20) { ctx.fillStyle = css(rail); ctx.fillRect(x, RAIL, 2, P - RAIL); ctx.fillStyle = css(railHi); ctx.fillRect(x, RAIL, 1, P - RAIL); }
    // Laternen an jedem zweiten Pfosten: Glas leuchtet nachts, Lichtkegel auf Brüstung und Boden
    for (let x = 6; x < LW; x += 40) {
      if (n > 0) { ctx.fillStyle = css(C.lit, 0.10 * n); ctx.fillRect(x - 9, RAIL - 12, 20, 34); ctx.fillStyle = css(C.lit, 0.12 * n); ctx.fillRect(x - 5, RAIL - 8, 12, 20); }
      ctx.fillStyle = css(mix(hx('#2E2A38'), hx('#4A3E52'), n)); ctx.fillRect(x - 1, RAIL - 7, 4, 1); ctx.fillRect(x - 1, RAIL - 1, 4, 1);
      ctx.fillStyle = css(mix(hx('#E9E2D0'), C.lit, n)); ctx.fillRect(x - 1, RAIL - 6, 4, 5);
      ctx.fillStyle = css([255, 255, 255], 0.5 * (1 - n)); ctx.fillRect(x - 1, RAIL - 6, 1, 2);
    }
    // Ziegel-Brüstung mit Abdeckung
    const brick = mix(mix(hx('#C0705A'), hx('#D07A5A'), dusk), hx('#55304A'), n), cap = mix(hx('#E8C3A8'), hx('#7A5872'), n);
    ctx.fillStyle = css(brick); ctx.fillRect(0, P, LW, DECK - P);
    ctx.fillStyle = css(cap); ctx.fillRect(0, P - 2, LW, 2);
    ctx.fillStyle = css([0, 0, 0], 0.16); ctx.fillRect(0, P, LW, 1);
    for (let y = P + 3, r = 0; y < DECK; y += 4, r++) { ctx.fillStyle = css([0, 0, 0], 0.14); ctx.fillRect(0, y, LW, 1); for (let x = (r % 2) * 5; x < LW; x += 10) ctx.fillRect(x, y - 3, 1, 3); }
    for (let x = 6; x < LW; x += 40) if (n > 0) { ctx.fillStyle = css(C.lit, 0.14 * n); ctx.fillRect(x - 8, P, 18, DECK - P); }
    // Pflanzkübel links und rechts
    const leaf = mix(mix(hx('#5FA35A'), hx('#7A9A50'), dusk), hx('#2C4A48'), n), leafHi = mix(hx('#8CCB6E'), hx('#4A6E5E'), n), box = mix(hx('#7A5A48'), hx('#3A2C3E'), n);
    const planter = (x0, w) => {
      ctx.fillStyle = css(leaf); ctx.fillRect(x0 + 2, P - 10, w - 4, 10); ctx.fillRect(x0 + 5, P - 14, w - 12, 4); ctx.fillRect(x0 + 9, P - 17, 6, 3);
      ctx.fillStyle = css(leafHi); for (let x = x0 + 4; x < x0 + w - 4; x += 5) ctx.fillRect(x, P - 12 + ((x * 7) % 5), 2, 2);
      ctx.fillStyle = css(box); ctx.fillRect(x0, P, w, DECK - P + 3); ctx.fillStyle = css([0, 0, 0], 0.2); ctx.fillRect(x0, P + 3, w, 1);
    };
    planter(-4, 30); planter(156, 30);
    // Fliesenboden mit leichter Tiefe
    ctx.fillStyle = css(mix(hx('#CDBBA8'), hx('#4B4057'), n)); ctx.fillRect(0, DECK, LW, LH - DECK);
    ctx.fillStyle = css(mix(hx('#E4D5C4'), hx('#62546E'), n)); ctx.fillRect(0, DECK, LW, 2);
    ctx.fillStyle = css([0, 0, 0], 0.1);
    for (let y = DECK + 6, h = 7, r = 0; y < LH; y += h, h += 2, r++) { ctx.fillRect(0, y, LW, 1); for (let x = (r % 2) * 9; x < LW; x += 18) ctx.fillRect(x, y - h + 2, 1, h - 2); }
    for (let x = 6; x < LW; x += 40) if (n > 0) { ctx.fillStyle = css(C.lit, 0.10 * n); ctx.fillRect(x - 12, DECK, 26, 8); }
  },
};

// ---------- Melly ----------
const mask = {}, bot = {}, shifts = {};
function getMask(pose, i) {
  const k = pose + '#' + i; if (mask[k]) return mask[k];
  const g = D.frames[pose][i].g, m = new Uint8Array(W * H); let b = -1;
  for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (g[y][x] !== '.') { m[y * W + x] = 1; if (y > b) b = y; }
  bot[k] = b; return mask[k] = m;
}
function bottom(s) { getMask(s.pose, s.i); return bot[s.pose + '#' + s.i]; }
// Erkennt, ob Frame B ein verschobener Frame A ist (Laufen, Springen, Kopfnicken).
function shiftOf(a, b) {
  const k = a.pose + '#' + a.i + '>' + b.pose + '#' + b.i; if (shifts[k]) return shifts[k];
  const A = getMask(a.pose, a.i), B = getMask(b.pose, b.i);
  let nB = 0; for (let j = 0; j < B.length; j++) nB += B[j];
  let best = [0, 0], bestScore = -1, zero = 0;
  for (let dy = -3; dy <= 3; dy++) for (let dx = -3; dx <= 3; dx++) {
    let hit = 0;
    for (let y = 0; y < H; y++) { const sy = y - dy; if (sy < 0 || sy >= H) continue;
      for (let x = 0; x < W; x++) { const sx = x - dx; if (sx < 0 || sx >= W) continue; if (B[y * W + x] && A[sy * W + sx]) hit++; } }
    const sc = hit - 0.5 * (Math.abs(dx) + Math.abs(dy));
    if (dx === 0 && dy === 0) zero = hit;
    if (sc > bestScore) { bestScore = sc; best = [dx, dy]; }
  }
  if (nB === 0 || bestScore < 0.8 * nB || bestScore <= zero + 3) best = [0, 0];
  return shifts[k] = best;
}
const GLIDE = 0.16;
window.MELLY = {
  D,
  seq(list) {
    const steps = []; let acc = 0;
    for (const s of list) {
      const fr = D.frames[s.pose];
      const idx = s.idx || fr.map((_, i) => i);
      for (const i of idx) { const ms = (fr[i].ms * (s.speed || 1)) / 1000; steps.push({ pose: s.pose, i, combo: s.combo, glide: s.glide !== false, t0: acc, t1: acc + ms }); acc += ms; }
    }
    for (let k = 0; k < steps.length; k++) { const s = steps[k], n = steps[k + 1], p = steps[k - 1];
      s.d = n && s.glide && n.glide ? shiftOf(s, n) : [0, 0];
      const lb = p ? bottom(s) - bottom(p) : 0;
      s.land = p && bottom(p) >= 0 && lb > 0 && lb <= 4 ? lb : 0; }
    return { steps, total: acc };
  },
  at(q, t) {
    const st = q.steps; let k = 0;
    if (t > 0) { k = st.length - 1; for (let j = 0; j < st.length; j++) if (t < st[j].t1) { k = j; break; } }
    const s = st[k], dur = s.t1 - s.t0;
    let p = 0;
    if (k < st.length - 1 && (s.d[0] || s.d[1])) p = dur <= GLIDE ? clamp01((t - s.t0) / dur) : eio(clamp01((t - (s.t1 - GLIDE)) / GLIDE));
    return { s, p, t, dt: Math.max(0, t - s.t0), pose: s.pose, i: s.i, combo: s.combo };
  },
  mount(k, root) {
    const wrap = k.h('<div class="melly"><canvas width="936" height="832" style="display:block;image-rendering:pixelated;transform-origin:468px 754px"></canvas></div>');
    root.append(wrap);
    const cv = wrap.querySelector('canvas');
    const sky = root.querySelector('.sky');
    return { el: wrap, cv, ctx: cv.getContext('2d'), last: '', k, sky: sky ? sky.getContext('2d') : null };
  },
  draw(m, a, combo, ox) {
    if (m.sky && a.t != null) SKY.draw(m.sky, (m.k.start || 0) + a.t);
    const s = a.s || a, c = combo == null ? s.combo : combo;
    const key = s.pose + s.i + ':' + c;
    if (m.last !== key) { m.last = key;
      const f = D.frames[s.pose][s.i];
      const pal = f.pal ? Object.assign({}, D.pal[c], f.pal) : D.pal[c];
      const ctx = m.ctx; ctx.clearRect(0, 0, 936, 832);
      for (let y = 0; y < H; y++) { const row = f.g[y];
        for (let x = 0; x < W; x++) { const tok = row[x]; if (tok === '.') continue; const col = pal[tok]; if (!col) continue; ctx.fillStyle = col; ctx.fillRect(x * S, y * S, S, S); } } }
    const p = a.p || 0, d = s.d || [0, 0];
    const sq = s.land ? Math.min(0.09, 0.03 * s.land) * (1 - eo(clamp01((a.dt || 0) / 0.22))) : 0;
    m.cv.style.transform = 'translate(' + (d[0] * S * p + (ox || 0)).toFixed(2) + 'px,' + (d[1] * S * p).toFixed(2) + 'px) scale(' + (1 + sq * 0.6).toFixed(4) + ',' + (1 - sq).toFixed(4) + ')';
  },
  stage(k) {
    return k.h('<div class="ground"><canvas class="sky" width="180" height="225"></canvas><div class="spot"></div><div class="shadow"></div></div>');
  },
};
})();
