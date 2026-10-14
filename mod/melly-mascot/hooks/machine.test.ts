import { expect, test } from 'claude-code/testing'

import { DEFAULTS, initial, step } from './machine'
import type { Machine, Tick } from './machine'

const LENGTHS: Record<string, number> = { 'laptop-raus': 3, 'laptop-weg': 3, hinlegen: 3, aufstehen: 3 }
const dur = (pose: string) => Array.from({ length: LENGTHS[pose] ?? 2 }, () => 100)
const base: Tick = { dt: 60, hour: 14, day: 'd1', busy: false, working: false, activity: false, done: null, rand: () => 0.9 }

const run = (m: Machine, n: number, t: Partial<Tick> = {}) => {
  for (let i = 0; i < n; i++) m = step(m, { ...base, ...t }, dur, DEFAULTS)
  return m
}
/** Abfolge der gespielten Posen (ohne Wiederholungen), beginnend mit der aktuellen. */
const poses = (m: Machine, n: number, t: Partial<Tick> = {}) => {
  const seen: string[] = [m.pose]
  for (let i = 0; i < n; i++) {
    m = step(m, { ...base, ...t }, dur, DEFAULTS)
    if (seen.at(-1) !== m.pose) seen.push(m.pose)
  }
  return seen
}

test('Tippen holt den Laptop raus und bleibt im Laptop-Loop', () => {
  expect(poses(initial(), 40, { busy: true }).slice(0, 3)).toEqual(['idle', 'laptop-raus', 'laptop'])
})

test('Ende des Tippens packt den Laptop weg und kehrt zu Idle zurück', () => {
  const working = run(initial(), 40, { busy: true })
  expect(working.pose).toBe('laptop')
  expect(poses(working, 40).slice(0, 3)).toEqual(['laptop', 'laptop-weg', 'idle'])
})

test('Fertige Antwort: Laptop weg, dann Daumen hoch', () => {
  const working = run(initial(), 40, { busy: true, working: true })
  const seen = poses(working, 60, { done: 'answer' })
  expect(seen.slice(0, 4)).toEqual(['laptop', 'laptop-weg', 'daumen-hoch', 'idle'])
})

test('Fehler zeigt Sauer', () => {
  const working = run(initial(), 40, { busy: true, working: true })
  expect(poses(working, 60, { done: 'error' })).toContain('sauer')
})

test('Lange Ruhe: Gähnen, Hinlegen, Schlafen; Eingabe weckt auf', () => {
  const asleep = run(initial(), Math.ceil(DEFAULTS.sleepAfterMs / 60) + 80)
  expect(asleep.mode).toBe('sleep')
  expect(asleep.pose).toBe('liegen-boden')
  const seen = poses(asleep, 30, { activity: true })
  expect(seen.slice(0, 3)).toEqual(['liegen-boden', 'aufstehen', 'gaehnen'])
  expect(seen.at(-1)).toBe('idle')
})

test('Kaffee nur morgens und nur einmal pro Tag', () => {
  expect(poses(initial(), 400, { hour: 8 })).toContain('kaffee')
  expect(poses({ ...initial(), coffeeDay: 'd1' }, 400, { hour: 8 })).not.toContain('kaffee')
  expect(poses(initial(), 400, { hour: 15 })).not.toContain('kaffee')
})

test('Abends wechselt der Idle-Loop zu Müde', () => {
  expect(poses(initial(), 200, { hour: 22 })).toContain('muede')
})

test('Beim Arbeiten läuft Melly nie', () => {
  const m = { ...initial(), walkInMs: -1 }
  expect(poses(m, 200, { busy: true })).not.toContain('laufen')
})

test('Laufen kommt erst nach der Pause und endet am Ziel im Idle', () => {
  const early = poses(initial(60), 200, { rand: () => 0.05 })
  expect(early).not.toContain('laufen')
  const m = { ...initial(60), walkInMs: -1 }
  const seen = poses(m, 600, { rand: () => 0.05 })
  expect(seen).toContain('laufen')
  expect(seen.at(-1)).toBe('idle')
})
