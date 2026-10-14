import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

import type { MelConfig, MelView } from '../types'
import { COMBO_NAMES, FRAMES, GW, OUTFIT_NAMES, PAL } from './frames'
import type { MascotFrame } from './frames'
import { DEFAULTS, initial, step } from './machine'
import type { Done, Machine } from './machine'

const WORLD = 160 // Breite der Spielwelt in Pixel-Einheiten
const TOP = 8 // sichtbarer Ausschnitt: y 8..30, eng um die Figur (flaches Band)
const ROWS = 22
const TICK = 60
const TYPING_MS = 5000
const SCALES = [1, 2, 3, 4]

const view = atom({ plugin: 'melly-mascot', key: 'view' } as const, {
  pose: 'idle', frame: 0, x: 60, flip: false, look: 0,
} as MelView)
const config = atom({ plugin: 'melly-mascot', key: 'config' } as const, {
  combo: 0, outfit: '-', scale: 2, stay: false, menu: false,
} as MelConfig)

const frameList = (outfit: string, pose: string): MascotFrame[] =>
  FRAMES[outfit]?.[pose] ?? FRAMES['-']?.[pose] ?? FRAMES['-']?.idle ?? []

const svgFor = (v: MelView, cfg: MelConfig) => {
  const showsLook = (v.pose === 'idle' || v.pose === 'muede') && v.look !== 0
  const pose = showsLook ? (v.look < 0 ? 'blick-links' : 'blick-rechts') : v.pose
  const list = frameList(cfg.outfit, pose)
  const f = list[v.frame % Math.max(1, list.length)]
  const colors = PAL[String(cfg.combo)]?.[cfg.outfit] ?? PAL['0']?.['-'] ?? {}
  if (!f) return ''
  const paths = f.p.map(([tok, d]) => `<path fill="${f.pal?.[tok] ?? colors[tok] ?? '#000'}" d="${d}"/>`).join('')
  const g = v.flip
    ? `<g transform="translate(${v.x + GW} 0) scale(-1 1)">${paths}</g>`
    : `<g transform="translate(${v.x} 0)">${paths}</g>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 ${TOP} ${WORLD} ${ROWS}" shape-rendering="crispEdges">${g}</svg>`
}

let cfg: MelConfig = { combo: 0, outfit: '-', scale: 2, stay: false, menu: false }

function save($: EngineInterface, next: Partial<MelConfig>) {
  cfg = { ...cfg, ...next }
  void update($, config, () => cfg)
  void $.store.set('melly-config-v2', { ...cfg, menu: false })
}

type Pointer = { t: string; x: number; y: number; b: string | null; cols: number; rows: number }

export const register: Register = on => {
  let m: Machine = initial(60)
  let nowMs = 0
  let typingUntil = 0
  let isDraft = false
  let isWorking = false
  let activity = false
  let done: Done | null = null
  let look = 0
  let drag: { moved: boolean } | null = null
  let dragX = 0
  let gesture: string | null = null
  let last = ''
  let ticks = 0
  let edits = 0
  let draftLen = 0
  let pointers = 0
  let lastPointer = '-'

  const cycle = <T,>(list: T[], now: T): T => list[(list.indexOf(now) + 1) % list.length] ?? now

  on('session.start', async ($, e, next) => {
    $.ui.status(undefined)
    try { nowMs = await $.clock.now() } catch { nowMs = 0 }
    try {
      const saved = (await $.store.get('melly-config-v2')) as Partial<MelConfig> | undefined
      if (saved) cfg = { ...cfg, ...saved, menu: false }
    } catch { /* ohne gespeicherte Einstellungen weiter */ }
    void update($, config, () => cfg)

    // Entwurf im Prompt (Tippen, Einfügen, Diktat): auf Desktop kommen weder prompt.edit noch PromptHint zuverlässig, daher lesen wir die Box.
    $.clock.every(400, async () => {
      try {
        const box = await $.prompt.read()
        if (box.text.length !== draftLen) {
          activity = true
          typingUntil = nowMs + TYPING_MS
          edits += 1
        }
        draftLen = box.text.length
        isDraft = draftLen > 0
      } catch { /* keine Box gebunden */ }
    })

    $.clock.every(TICK, () => {
      nowMs += TICK
      ticks += 1
      const d = new Date(nowMs)
      const busy = isDraft || isWorking || nowMs < typingUntil
      let n = step(m, {
        dt: TICK, hour: d.getHours(), day: `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`,
        busy, working: isWorking, activity, done, rand: Math.random,
      }, pose => frameList(cfg.outfit, pose).map(f => f.ms), { ...DEFAULTS, world: WORLD - GW })
      activity = false
      done = null
      if (cfg.stay) n = { ...n, walkInMs: Math.max(n.walkInMs, 60_000) }
      if (gesture && n.mode === 'idle' && n.queue.length === 0 && (n.pose === 'idle' || n.pose === 'muede')) {
        n = { ...n, pose: gesture, frame: 0, msInFrame: 0, target: null }
        gesture = null
      }
      if (drag) n = { ...n, x: dragX, target: null, pose: n.mode === 'idle' ? 'idle' : n.pose }
      m = n
      if (ticks % 17 === 0) $.ui.status(`melly t=${ticks} ${m.mode}/${m.pose}#${m.frame} busy=${busy} work=${isWorking} draft=${draftLen} edits=${edits} ptr=${pointers} ${lastPointer} h=${d.getHours()}`)
      const key = `${m.pose}|${m.frame}|${m.x.toFixed(1)}|${m.flip}|${look}`
      if (key !== last) {
        last = key
        void update($, view, () => ({ pose: m.pose, frame: m.frame, x: m.x, flip: m.flip, look }))
      }
    })

    // Der Befehl darf scheitern (Name belegt): der Rest läuft trotzdem.
    try {
      await $.command.register({ name: 'melly-menu', description: 'Melly-Menü ein- oder ausblenden' })
    } catch { /* Menü bleibt per Rechtsklick erreichbar */ }
    return next(e)
  })

  on('prompt.edit', ($, e, next) => {
    activity = true
    edits += 1
    typingUntil = nowMs + TYPING_MS
    return next(e)
  })

  on('turn.start', ($, e, next) => {
    isWorking = true
    activity = true
    return next(e)
  })

  on('turn.complete', ($, e, next) => {
    isWorking = false
    activity = true
    done = e.reason as Done
    return next(e)
  })

  // Entwurf im Prompt (Tippen, Einfügen, Diktat): die Hint-Zeile kennt isDraft.
  on('ui.render', { component: 'PromptHint' }, ($, e, next) => {
    isDraft = e.props.isDraft
    return next(e)
  })

  on('command.run', { command: 'melly-menu' }, $ => {
    save($, { menu: !cfg.menu })
    return { text: cfg.menu ? 'Melly-Menü offen.' : 'Melly-Menü zu.' }
  })

  // Zeiger im Band: Blickrichtung, Klick = Winken, Ziehen = verschieben, Rechtsklick = Menü.
  on('ui.message', ($, e, next) => {
    const p = e.data as Pointer
    if (!p || !p.cols) return next(e)
    pointers += 1
    lastPointer = `${p.t}:${p.b ?? '-'}@${p.x},${p.y}/${p.cols}x${p.rows}`
    const wx = ((p.x + 0.5) / p.cols) * WORLD
    const onMelly = wx >= m.x - 2 && wx <= m.x + GW + 2
    const clamp = (v: number) => Math.max(0, Math.min(WORLD - GW, v))
    if (p.t === 'leave') look = 0
    else if (p.t === 'move' && !drag) look = wx < m.x - 8 ? -1 : wx > m.x + GW + 8 ? 1 : 0
    if (p.t === 'down' && onMelly) {
      activity = true
      if (p.b === 'right') save($, { menu: !cfg.menu })
      else { drag = { moved: false }; dragX = clamp(wx - GW / 2) }
    } else if (p.t === 'move' && drag) {
      drag.moved = true
      dragX = clamp(wx - GW / 2)
    } else if (p.t === 'up' && drag) {
      if (!drag.moved) gesture = 'winken'
      drag = null
    }
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.surface !== 'desktop' || e.props.hasSurvey) return next(e)
    isWorking = isWorking || e.props.isWorking
    const { Box, Svg, Client, Button, Text } = $.ui.resolve(e)
    const v = await read($, view)
    const c = await read($, config)
    return (
      <Box flexDirection="column" flexShrink={0} marginY={-1}>
        <Box>
          <Svg source={svgFor(v, c)} alt="Melly" width={WORLD * c.scale} height={ROWS * c.scale} />
          <Box position="absolute" top={0} left={0} width="100%" height="100%">
            <Client key="pointer" module="./pointer.tsx" width="100%" props={{ rows: Math.max(1, Math.floor((ROWS * c.scale) / 14)) }} />
          </Box>
        </Box>
        {c.menu && (
          <Box gap={2}>
            <Button key="combo" label={`Anzug: ${COMBO_NAMES[c.combo]}`} onPress={() => save($, { combo: (c.combo + 1) % COMBO_NAMES.length })} />
            <Button key="outfit" label={`Outfit: ${OUTFIT_NAMES[c.outfit]}`} onPress={() => save($, { outfit: cycle(Object.keys(OUTFIT_NAMES), c.outfit) })} />
            <Button key="scale" label={`Größe: ${c.scale}x`} onPress={() => save($, { scale: cycle(SCALES, c.scale) })} />
            <Button key="stay" label={c.stay ? 'Läuft nicht' : 'Läuft selten'} onPress={() => save($, { stay: !c.stay })} />
            <Button key="sleep" label="Schlafen" onPress={() => { m = { ...m, idleMs: DEFAULTS.sleepAfterMs } }} />
            <Button key="close" label="Schließen" onPress={() => save($, { menu: false })} />
          </Box>
        )}
      </Box>
    )
  })
}
