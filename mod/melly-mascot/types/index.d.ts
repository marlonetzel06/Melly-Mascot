export type MelView = {
  pose: string
  frame: number
  x: number
  flip: boolean
  look: number // -1 links, 0 geradeaus, 1 rechts (Cursor im Band)
}

export type MelConfig = {
  combo: number
  outfit: string
  scale: number
  stay: boolean
  menu: boolean
}

declare module 'claude-code' {
  interface PluginState {
    'melly-mascot': { view: MelView; config: MelConfig }
  }
}
