import type { On } from 'claude-code'
import { expect, mock, test } from 'claude-code/testing'

const BAND = { hasSurvey: false, isWorking: false, maxRows: 10, bodyColumns: 80 } as never
const NOON = Date.UTC(2026, 9, 14, 12, 0, 0)
const LAPTOP_GREY = '#3A424C' // Token G: kommt nur mit Laptop (oder Hantel) im Bild vor

/** Bodenschicht: was der Host für Sitzungsstart, Slash-Command und Statuszeile beisteuert. */
const world = (on: On) => {
  const clock = mock.clock(on, { now: NOON })
  mock.store(on)
  on('session.start', (_$, e) => ({ cwd: e.cwd }))
  on('command.register', () => ({ value: { command: 'melly' } }) as never)
  on('ui.status', () => ({ value: undefined }) as never)
  on('turn.start', (_$, e) => ({ turnId: e.turnId }))
  on('turn.complete', (_$, e) => ({ text: e.answer }))
  return clock
}
const draw = async (ui: { drawn: () => Promise<unknown> }) => JSON.stringify(await ui.drawn())

test('Tick läuft nach session.start; Turn holt den Laptop raus, Ende packt ihn weg', async ($, on) => {
  const clock = world(on)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  const ui = await $.ui.mount({ plugin: 'melly-mascot', surface: 'desktop', component: 'AbovePrompt', props: BAND })
  await clock.advance(2000)
  expect(await draw(ui)).not.toContain(LAPTOP_GREY)

  await $.turn.start({ text: 'los', turnId: 't1' })
  await clock.advance(4000)
  expect(await draw(ui)).toContain(LAPTOP_GREY)

  await $.turn.complete({ answer: 'ok', durationMs: 5000, isAborted: false, turnId: 't1', reason: 'answer' } as never)
  await clock.advance(8000)
  expect(await draw(ui)).not.toContain(LAPTOP_GREY)
})

test('Befehlsname belegt: Tick läuft trotzdem', async ($, on) => {
  const clock = mock.clock(on, { now: NOON })
  mock.store(on)
  on('session.start', (_$, e) => ({ cwd: e.cwd }))
  on('command.register', () => { throw new Error('refused: it is the users own command') })
  on('ui.status', () => ({ value: undefined }) as never)
  on('turn.start', (_$, e) => ({ turnId: e.turnId }))
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  const ui = await $.ui.mount({ plugin: 'melly-mascot', surface: 'desktop', component: 'AbovePrompt', props: BAND })
  await $.turn.start({ text: 'los', turnId: 't1' })
  await clock.advance(4000)
  expect(await draw(ui)).toContain(LAPTOP_GREY)
})

test('Entwurf im Prompt (auch Diktat) holt den Laptop raus', async ($, on) => {
  const clock = world(on)
  let draft = ''
  on('prompt.read', () => ({ value: { text: draft, cursor: draft.length } }) as never)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  const ui = await $.ui.mount({ plugin: 'melly-mascot', surface: 'desktop', component: 'AbovePrompt', props: BAND })
  await clock.advance(2000)
  expect(await draw(ui)).not.toContain(LAPTOP_GREY)
  draft = 'hallo welt'
  await clock.advance(4000)
  expect(await draw(ui)).toContain(LAPTOP_GREY)
  draft = ''
  await clock.advance(15000)
  expect(await draw(ui)).not.toContain(LAPTOP_GREY)
})

test('Band zeichnet Melly als Svg samt Zeigerfläche', async ($, on) => {
  const clock = world(on)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  await clock.advance(500)
  const ui = await $.ui.mount({ plugin: 'melly-mascot', surface: 'desktop', component: 'AbovePrompt', props: BAND })
  expect(await ui.find({ type: 'Svg' })).toBeDefined()
  expect(await ui.find({ type: 'Client' })).toBeDefined()
})

test('Zeiger über Melly: Ziehen verschiebt, Rechtsklick öffnet das Menü', async ($, on) => {
  const clock = world(on)
  await $.session.start({ cwd: '/', surface: 'desktop', isInteractive: true })
  await clock.advance(500)
  const ui = await $.ui.mount({ plugin: 'melly-mascot', surface: 'desktop', component: 'AbovePrompt', props: BAND })
  await ui.resize({ columns: 71, rows: 4 })
  const before = await draw(ui)
  await ui.pointer({ type: 'down', x: 30, y: 1, button: 'left' })
  await ui.pointer({ type: 'move', x: 50, y: 1, button: 'left' })
  await clock.advance(300)
  await ui.pointer({ type: 'up', x: 50, y: 1, button: 'left' })
  expect(await draw(ui)).not.toBe(before)

  expect(await ui.find({ type: 'Button', key: 'combo' })).toBeUndefined()
  await ui.pointer({ type: 'down', x: 50, y: 1, button: 'right' })
  await clock.advance(300)
  expect(await ui.find({ type: 'Button', key: 'combo' })).toBeDefined()
})
