import { mapRange } from '@figureland/mathkit'
import type { Box, CanvasState, Vec2 } from '.'
import { getScale, type Matrix2D } from '@figureland/mathkit/Matrix2D'

export const transform = (matrix: Matrix2D) =>
  `matrix(${matrix[0]}, ${matrix[1]}, ${matrix[2]}, ${matrix[3]}, ${matrix[4]}, ${matrix[5]})`

export const boxStyle = (box: Box, inset: number = 0) =>
  `width: ${box.width - inset}px; height: ${box.height - inset}px; transform: ${transform([1, 0, 0, 1, box.x + inset / 2, box.y + inset / 2])}`

export const scale = (s: number) => transform([s, 0, 0, s, 0, 0])

export const translate = (t: Vec2) => transform([1, 0, 0, 1, t.x, t.y])

export const getGridSVGPattern = (matrix: Matrix2D, canvas: CanvasState) => {
  const patternTransform = transform(matrix)

  return {
    width: canvas.grid,
    height: canvas.grid,
    patternTransform: patternTransform,
    patternUnits: 'userSpaceOnUse',
    opacity: mapRange(getScale(matrix), 0.5, 1, 0.1, 0.5)
  }
}

export const getElementBox = (element: HTMLElement): Box => {
  const { top: y, left: x, width, height } = element.getBoundingClientRect()
  return {
    x,
    y,
    width,
    height
  }
}
