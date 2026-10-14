// Zustandsautomat für Melly: reine Funktion, ohne Zeit, Zufall oder Frame-Daten von außen (alles kommt über Tick).
export type Mode = 'idle' | 'busy' | 'sleep'
export type Done = 'answer' | 'aborted' | 'refusal' | 'error'

export type Machine = {
  mode: Mode
  pose: string
  frame: number
  msInFrame: number
  queue: string[]
  loop: string
  x: number
  flip: boolean
  target: number | null
  idleMs: number
  walkInMs: number
  workMs: number
  coffeeDay: string | null
}

export type Tick = {
  dt: number
  hour: number
  day: string
  busy: boolean // Entwurf im Prompt, Tippen oder Claude arbeitet
  working: boolean // Claude arbeitet gerade
  activity: boolean // Eingabe oder Zeiger seit dem letzten Tick
  done: Done | null // Turn ist in diesem Tick zu Ende gegangen
  rand: () => number
}

export type Options = {
  world: number // freie Wegstrecke in Pixel-Einheiten (Breite minus Figur)
  speed: number // Pixel-Einheiten pro 60 ms
  sleepAfterMs: number
  walkMinMs: number
  walkMaxMs: number
  coffeeHours: [number, number]
  tiredFrom: number // ab dieser Stunde müde, bis tiredUntil
  tiredUntil: number
}

export const DEFAULTS: Options = {
  world: 124,
  speed: 0.6,
  sleepAfterMs: 4 * 60_000,
  walkMinMs: 3 * 60_000,
  walkMaxMs: 10 * 60_000,
  coffeeHours: [5, 10],
  tiredFrom: 20,
  tiredUntil: 5,
}

export type Durations = (pose: string) => readonly number[]

const IDLE_LOOPS = ['idle', 'muede']

export const initial = (x = 60): Machine => ({
  mode: 'idle', pose: 'idle', frame: 0, msInFrame: 0, queue: [], loop: 'idle', x, flip: false,
  target: null, idleMs: 0, walkInMs: 90_000, workMs: 0, coffeeDay: null,
})

const isTired = (hour: number, o: Options) => hour >= o.tiredFrom || hour < o.tiredUntil
const reaction = (done: Done, workMs: number) =>
  done === 'answer' ? (workMs > 60_000 ? 'jubeln' : 'daumen-hoch')
    : done === 'aborted' ? 'schulterzucken'
      : 'sauer'

/** Springt sofort in die erste Pose der Warteschlange (unterbricht eine Schleife oder das Laufen). */
const interrupt = (m: Machine) => {
  const next = m.queue.shift()
  if (next) { m.pose = next; m.frame = 0; m.msInFrame = 0 }
}

export function step(prev: Machine, t: Tick, dur: Durations, opt: Options = DEFAULTS): Machine {
  const m: Machine = { ...prev, queue: [...prev.queue] }
  // true, solange eine Übergangs-Animation (Warteschlange) läuft: dann wird nichts unterbrochen
  const playing = () => m.queue.length > 0 || !(m.pose === m.loop || m.pose === 'laufen' || IDLE_LOOPS.includes(m.pose))
  const idleLoop = isTired(t.hour, opt) ? 'muede' : 'idle'

  m.workMs = t.working ? m.workMs + t.dt : m.workMs
  if (t.activity || t.busy) m.idleMs = 0
  else if (m.mode === 'idle') m.idleMs += t.dt
  if (m.mode === 'idle') m.walkInMs -= t.dt

  // 1) Aufwachen
  if (m.mode === 'sleep' && (t.busy || t.activity)) {
    m.mode = 'idle'
    m.loop = idleLoop
    m.target = null
    m.queue = t.busy ? ['aufstehen'] : ['aufstehen', 'gaehnen']
    interrupt(m)
    m.walkInMs = Math.max(m.walkInMs, 60_000)
  }

  // 2) Arbeiten beginnt / endet
  if (m.mode === 'idle' && t.busy) {
    const wasPlaying = playing()
    m.mode = 'busy'
    m.loop = 'laptop'
    m.target = null
    m.queue.push('laptop-raus')
    if (!wasPlaying) interrupt(m)
    m.walkInMs = Math.max(m.walkInMs, 60_000)
  } else if (m.mode === 'busy' && !t.busy) {
    m.mode = 'idle'
    m.loop = idleLoop
    m.queue.push('laptop-weg')
    if (t.done) m.queue.push(reaction(t.done, m.workMs))
    m.workMs = 0
    m.idleMs = 0
    if (m.pose === 'laptop') interrupt(m)
  } else if (t.done && !t.busy && m.mode === 'idle' && !playing()) {
    m.queue.push(reaction(t.done, m.workMs))
    m.workMs = 0
    interrupt(m)
  }

  // 3) Einschlafen
  if (m.mode === 'idle' && !playing() && m.idleMs >= opt.sleepAfterMs && !t.busy) {
    m.mode = 'sleep'
    m.loop = 'liegen-boden'
    m.target = null
    m.queue.push('gaehnen', 'hinlegen')
    interrupt(m)
  }

  // 4) Kaffee am Morgen, einmal pro Tag
  if (m.mode === 'idle' && !playing() && IDLE_LOOPS.includes(m.pose) && t.hour >= opt.coffeeHours[0] && t.hour < opt.coffeeHours[1]
    && m.coffeeDay !== t.day && m.idleMs >= 20_000 && m.target === null) {
    m.coffeeDay = t.day
    m.queue.push('kaffee')
    interrupt(m)
  }

  // 5) Selten und unregelmäßig ein Stück laufen
  if (m.mode === 'idle' && !playing() && IDLE_LOOPS.includes(m.pose) && m.target === null && m.walkInMs <= 0) {
    const goal = t.rand() * opt.world
    if (Math.abs(goal - m.x) > 20) {
      m.target = goal
      m.flip = goal < m.x
      m.pose = 'laufen'
      m.frame = 0
      m.msInFrame = 0
    } else {
      m.walkInMs = 30_000
    }
  }
  if (m.target !== null) {
    m.x += (m.flip ? -1 : 1) * opt.speed * (t.dt / 60)
    if ((m.flip && m.x <= m.target) || (!m.flip && m.x >= m.target)) {
      m.x = m.target
      m.target = null
      m.pose = m.loop
      m.frame = 0
      m.msInFrame = 0
      m.walkInMs = opt.walkMinMs + t.rand() * (opt.walkMaxMs - opt.walkMinMs)
    }
  }

  // 6) Frames weiterschalten
  m.msInFrame += t.dt
  for (let guard = 0; guard < 8; guard++) {
    const list = dur(m.pose)
    const ms = list[m.frame] ?? 100
    if (m.msInFrame < ms) break
    m.msInFrame -= ms
    m.frame += 1
    if (m.frame < list.length) continue
    m.frame = 0
    if (m.pose === 'laufen' && m.target !== null) continue
    const next = m.queue.shift()
    if (next) { m.pose = next; continue }
    if (m.mode === 'idle') { m.loop = idleLoop; m.pose = idleLoop } else m.pose = m.loop
  }
  return m
}
