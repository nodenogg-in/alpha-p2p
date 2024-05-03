import { type Matrix2D, getScale } from '@figureland/mathkit/matrix2D'
import { transform } from '@figureland/mathkit/style'

const TRANSFORM_NAME = 'infinitykit-transform'
const SCALE_NAME = 'infinitykit-scale'
const INVERTED_SCALE_NAME = 'infinitykit-inverted-scale'

const canvasStyle = `position: absolute; width: 100%; height: 100%; top: 0px; left: 0px; transform-origin: 0% 0%; transform: var(--${TRANSFORM_NAME}); pointer-events: none;`

export const getCanvasStyles = (matrix: Matrix2D) => {
  const scale = getScale(matrix)
  return {
    container: `--${TRANSFORM_NAME}: ${transform(matrix)}; --${SCALE_NAME}: ${scale}px; --${INVERTED_SCALE_NAME}: ${1.0 / scale}`,
    canvas: canvasStyle
  }
}

export type CanvasStyle = {
  container: string
  canvas: string
}
