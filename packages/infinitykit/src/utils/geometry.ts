import { abs } from '@figureland/mathkit/number'
import type { Vector2 } from '@figureland/mathkit/vector2'
import type { Box } from '@figureland/mathkit/box'

export const getBoxEdgeProximity = (
  pointer: Vector2,
  box: Box,
  proximity: number = 10
): BoxEdgeProximity => {
  const isNearTop = abs(pointer.y - box.y) < proximity
  const isNearLeft = abs(pointer.x - box.x) < proximity
  if (isNearTop && isNearLeft) return 'top-left'

  const isNearRight = abs(pointer.x - (box.x + box.width)) < proximity
  if (isNearTop && isNearRight) return 'top-right'

  const isNearBottom = abs(pointer.y - (box.y + box.height)) < proximity
  if (isNearBottom && isNearLeft) return 'bottom-left'
  if (isNearBottom && isNearRight) return 'bottom-right'

  if (isNearTop) return 'top'
  if (isNearLeft) return 'left'
  if (isNearRight) return 'right'
  if (isNearBottom) return 'bottom'

  return 'none'
}

export type BoxEdgeProximity =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-right'
  | 'bottom-left'
  | 'none'
