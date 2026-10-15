// Rendert video/linkedin-intro.html frameweise über Chrome-headless (CDP, ohne Zusatz-Abhängigkeit) und encodet mit ffmpeg zu MP4.
// node video/render.mjs [--out dist/video/melly-intro-4x5.mp4] [--port 8791] [--keep]
// Voraussetzungen: Chrome (CHROME-Env oder Standardpfad) und ffmpeg (FFMPEG-Env oder tools-Pfad).
import { spawn } from 'node:child_process';
import { mkdirSync, rmSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import os from 'node:os';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => a.startsWith('--') ? [a.slice(2), arr[i + 1]?.startsWith('--') || arr[i + 1] === undefined ? true : arr[i + 1]] : []).filter(Boolean));
const OUT = args.out && args.out !== true ? args.out : join(ROOT, 'dist/video/melly-intro-4x5.mp4');
const PORT = Number(args.port) || 8791;
const FRAMES_DIR = join(ROOT, 'out/video-frames');
const PAGE_URL = `http://localhost:${PORT}/video/linkedin-intro.html`;

const CHROME = process.env.CHROME || ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe'].find(p => existsSync(p));
const FFMPEG = process.env.FFMPEG || ['C:/Users/MEtzel/ffmpeg-tools/ffmpeg-9.0.1-essentials_build/bin/ffmpeg.exe'].find(p => existsSync(p)) || 'ffmpeg';
if (!CHROME) { console.error('Chrome nicht gefunden – CHROME-Env setzen.'); process.exit(1); }

const sleep = ms => new Promise(r => setTimeout(r, ms));
const procs = [];
const kill = () => procs.forEach(p => { try { p.kill(); } catch {} });
process.on('exit', kill); process.on('SIGINT', () => { kill(); process.exit(1); });

async function cdpGet(path) { const r = await fetch(`http://127.0.0.1:9333${path}`, { method: path.startsWith('/json/new') ? 'PUT' : 'GET' }); return r.json(); }

// --- Minimaler CDP-Client über einen WebSocket ---
function cdp(wsUrl) {
  const ws = new WebSocket(wsUrl);
  let id = 0; const pending = new Map();
  ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); } });
  const ready = new Promise((res, rej) => { ws.addEventListener('open', res); ws.addEventListener('error', rej); });
  const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
  return { ready, send, close: () => ws.close() };
}

async function main() {
  // 1) Static-Server
  procs.push(spawn(process.execPath, [join(ROOT, 'tools/serve.mjs'), String(PORT)], { cwd: ROOT, stdio: 'ignore' }));
  for (let i = 0; i < 40; i++) { try { if ((await fetch(PAGE_URL)).ok) break; } catch {} await sleep(150); }

  // 2) Chrome headless
  const userDir = join(os.tmpdir(), 'melly-cdp-' + Date.now());
  procs.push(spawn(CHROME, ['--headless=new', '--disable-gpu', '--hide-scrollbars', '--no-first-run', '--no-default-browser-check',
    '--remote-debugging-port=9333', `--user-data-dir=${userDir}`, '--window-size=1200,1500', 'about:blank'], { stdio: 'ignore' }));

  let page;
  for (let i = 0; i < 60; i++) { try { const list = await cdpGet('/json/list'); page = list.find(t => t.type === 'page' && t.webSocketDebuggerUrl); if (page) break; } catch {} await sleep(200); }
  if (!page) throw new Error('Kein Chrome-Page-Target gefunden.');

  const c = cdp(page.webSocketDebuggerUrl); await c.ready;
  await c.send('Page.enable'); await c.send('Runtime.enable');
  await c.send('Page.navigate', { url: PAGE_URL });

  // 3) Auf Compositor warten
  let meta;
  for (let i = 0; i < 100; i++) {
    const r = await c.send('Runtime.evaluate', { expression: 'window.__meta ? JSON.stringify(window.__meta) : ""', returnByValue: true });
    if (r.result.value) { meta = JSON.parse(r.result.value); break; }
    await sleep(100);
  }
  if (!meta) throw new Error('Compositor (window.__meta) nicht bereit.');
  console.log(`Compositor bereit: ${meta.total} Frames @ ${meta.fps} fps (${(meta.totalMs / 1000).toFixed(2)} s), ${meta.W}×${meta.H}`);

  // 4) Frames capturen
  rmSync(FRAMES_DIR, { recursive: true, force: true }); mkdirSync(FRAMES_DIR, { recursive: true });
  const t0 = Date.now();
  for (let f = 0; f < meta.total; f++) {
    const r = await c.send('Runtime.evaluate', { expression: `window.__seek(${f}); document.getElementById('c').toDataURL('image/png')`, returnByValue: true, awaitPromise: false });
    const data = r.result.value; if (typeof data !== 'string' || !data.startsWith('data:image/png;base64,')) throw new Error(`Frame ${f}: kein PNG (${String(data).slice(0, 40)})`);
    writeFileSync(join(FRAMES_DIR, `frame-${String(f).padStart(5, '0')}.png`), Buffer.from(data.slice(22), 'base64'));
    if (f % 60 === 0 || f === meta.total - 1) process.stdout.write(`\r  ${f + 1}/${meta.total} Frames (${((Date.now() - t0) / 1000).toFixed(0)}s)`);
  }
  console.log('');
  c.close();

  const n = readdirSync(FRAMES_DIR).filter(f => f.endsWith('.png')).length;
  if (n !== meta.total) throw new Error(`Nur ${n}/${meta.total} Frames geschrieben.`);

  // 5) Encode
  mkdirSync(dirname(OUT), { recursive: true });
  await new Promise((res, rej) => {
    const ff = spawn(FFMPEG, ['-y', '-framerate', String(meta.fps), '-i', join(FRAMES_DIR, 'frame-%05d.png'),
      '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', OUT], { stdio: ['ignore', 'ignore', 'inherit'] });
    ff.on('close', code => code === 0 ? res() : rej(new Error('ffmpeg Exit ' + code)));
  });
  if (!args.keep) rmSync(FRAMES_DIR, { recursive: true, force: true });
  console.log(`\nFertig: ${OUT}`);
}

main().then(() => { kill(); process.exit(0); }).catch(e => { console.error('\nFehler:', e.message); kill(); process.exit(1); });
