import type { ClientModule } from 'claude-code'

// Unsichtbare Zeigerfläche über Melly: meldet Zeigerbewegungen an den Hook.
// Die Region ist so hoch wie das, was das Modul zeichnet, deshalb zeichnet es selbst eine mehrzeilige Box.
const Pointer: ClientModule = (props, surface) => {
  if (surface.state === undefined) {
    surface.setState(true)
    surface.onPointer(e => {
      surface.post({ t: e.type, x: e.x, y: e.y, b: e.button ?? null, cols: surface.columns, rows: surface.rows })
    })
  }
  const rows = Number((props as { rows?: number } | null)?.rows ?? 3)
  return surface.elements.Box({ width: '100%', height: Math.max(1, rows) })
}

export default Pointer
