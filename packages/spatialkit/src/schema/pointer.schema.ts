import { Vec2, defaultVec2 } from './spatial.schema'

export type PointerType = 'mouse' | 'pen' | 'touch'

export type PointerState = {
  button: number | null
  touchDistance: number
  shiftKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  origin: Vec2
  delta: Vec2
  point: Vec2
  pinching: boolean
  pointerType: PointerType | null
  active: boolean
  hasDelta: boolean
}

export const defaultPointerState = (): PointerState => ({
  touchDistance: 0,
  shiftKey: false,
  metaKey: false,
  ctrlKey: false,
  button: 0,
  point: defaultVec2(),
  delta: defaultVec2(),
  origin: defaultVec2(),
  pinching: false,
  pointerType: null,
  active: false,
  hasDelta: false
})
