import { mapRange, sqrt } from '@nodenogg.in/toolkit'
import type { Box, CanvasState, Transform, Vec2 } from '.'
import { Matrix2D } from './Matrix2D'

export const getMatrix2DScale = (matrix: Matrix2D): number => {
  const scaleX = sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1])
  const scaleY = sqrt(matrix[2] * matrix[2] + matrix[3] * matrix[3])
  return sqrt(scaleX * scaleY) // Geometric mean of scaleX and scaleY
}

export const getMatrix2DTranslation = (matrix: Matrix2D): { x: number; y: number } => {
  const tx = matrix[4]
  const ty = matrix[5]

  return { x: tx, y: ty }
}

export const transform = (matrix: Matrix2D): string => {
  // mat2d is [a, b, c, d, tx, ty]
  // CSS matrix is matrix(a, c, b, d, tx, ty)
  const a = matrix[0]
  const b = matrix[1]
  const c = matrix[2]
  const d = matrix[3]
  const tx = matrix[4]
  const ty = matrix[5]

  return `matrix(${a}, ${b}, ${c}, ${d}, ${tx}, ${ty})`
}

export const boxStyle = (box: Box, inset: number = 0) =>
  `width: ${box.width - inset}px; height: ${box.height - inset}px; transform: ${translate({ x: box.x + inset / 2, y: box.y + inset / 2 })}`

export const scale = (scale: number) => `matrix(${scale}, 0, 0, ${scale}, 0, 0)`

export const translate = (translate: Vec2) => `matrix(1, 0, 0, 1, ${translate.x}, ${translate.y})`

export const getGridSVGPattern = (matrix: Matrix2D, { grid }: CanvasState) => {
  // Since SVG uses a similar transformation model to CSS, we can directly apply
  // the matrix transformation to the pattern. This approach ensures that the pattern
  // transformation exactly matches the canvas transformation, achieving a unified appearance.
  const patternTransform = transform(matrix)

  // The grid size is determined by the canvas grid property. This value does not need to
  // be scaled because the matrix transformation will inherently scale the pattern.
  const gridSize = grid

  // Mapping the opacity directly might not be necessary if the transformation
  // accounts for the visibility across zoom levels. However, if needed, you can adjust
  // the opacity based on the zoom level or scale factor within the matrix.
  const opacity = 1.0 // Adjust based on your needs.

  return {
    width: gridSize,
    height: gridSize,
    patternTransform: patternTransform,
    patternUnits: 'userSpaceOnUse',
    opacity: opacity
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
