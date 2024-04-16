import type { CanvasState } from './Canvas'
import { type Matrix2D, getScale } from '@figureland/mathkit/matrix2D'
import { transform } from '@figureland/mathkit/style'

const TRANSFORM_NAME = 'spatial-view-transform'
const OUTLINE_NAME = 'card-outline'
const ELEMENT_SCALE_NAME = 'card-element-scale'

const canvasStyle = `position: absolute; width: 100%; height: 100%; top: 0px; left: 0px; transform-origin: 0% 0%; transform: var(--${TRANSFORM_NAME}); pointer-events: none;`

export const getCanvasStyles = (matrix: Matrix2D, state: CanvasState) => {
  const scale = getScale(matrix)
  return {
    container: `--${TRANSFORM_NAME}: ${transform(matrix)}; --${OUTLINE_NAME}: ${state.cardOutline / scale}px; --${ELEMENT_SCALE_NAME}: ${1.0 / scale}`,
    canvas: canvasStyle
  }
}

export type CanvasStyle = {
  container: string
  canvas: string
}
