import { sqrt } from '@figureland/mathkit/number'
import type { Vector2 } from '@figureland/mathkit/matrix2D'

export const getTouchDistance = (touch1: Touch, touch2: Touch) => {
  const dx = touch1.clientX - touch2.clientX
  const dy = touch1.clientY - touch2.clientY
  return sqrt(dx * dx + dy * dy)
}

export const getSelectionBox = (origin: Vector2, point: Vector2) => {
  const x = point.x > origin.x ? origin.x : point.x
  const y = point.y > origin.y ? origin.y : point.y

  const width = point.x > origin.x ? point.x - origin.x : origin.x - point.x
  const height = point.y > origin.y ? point.y - origin.y : origin.y - point.y

  return {
    x,
    y,
    width,
    height
  }
}
