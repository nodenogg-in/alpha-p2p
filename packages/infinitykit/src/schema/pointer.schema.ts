import vector2 from '@figureland/mathkit/vector2'
import type { Vector2 } from '@figureland/mathkit/matrix2D'

export type PointerType = 'mouse' | 'pen' | 'touch'

export type PointerState = {
  button: number | null
  touchDistance: number
  shiftKey: boolean
  ctrlKey: boolean
  metaKey: boolean
  origin: Vector2
  delta: Vector2
  point: Vector2
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
  point: vector2(),
  delta: vector2(),
  origin: vector2(),
  pinching: false,
  pointerType: null,
  active: false,
  hasDelta: false
})
