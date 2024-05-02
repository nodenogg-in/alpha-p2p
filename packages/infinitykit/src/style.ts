import { mapRange } from '@figureland/mathkit/number'
import type { CanvasOptions } from '.'
import { getScale, type Matrix2D } from '@figureland/mathkit/matrix2D'
import { transform } from '@figureland/mathkit/style'
import type { Box } from '@figureland/mathkit/box'

export const boxStyle = (box: Box, inset: number = 0) =>
  `width: ${box.width - inset}px; height: ${box.height - inset}px; transform: ${transform([1, 0, 0, 1, box.x + inset / 2, box.y + inset / 2])}`

export const getGridSVGPattern = (matrix: Matrix2D, size: number) => {
  const patternTransform = transform(matrix)
  console.log(matrix, size)

  return {
    width: size,
    height: size,
    patternTransform: patternTransform,
    patternUnits: 'userSpaceOnUse',
    opacity: mapRange(getScale(matrix), 0.5, 1, 0.1, 0.5)
  }
}
