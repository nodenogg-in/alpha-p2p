import type { CanvasInteractionState } from './CanvasInteraction'
import { transform } from './style'

const TRANSFORM_NAME = 'spatial-view-transform'
const OUTLINE_NAME = 'card-outline'
const ELEMENT_SCALE_NAME = 'card-element-scale'

const canvasStyle = `position: absolute; width: 100%; height: 100%; top: 0px; left: 0px; transformOrigin: 50% 50%; transform: var(--${TRANSFORM_NAME}); pointer-events: none;`

export const getCanvasStyles = (canvas: CanvasInteractionState) => ({
  container: `--${TRANSFORM_NAME}: ${transform(canvas.transform)}; --${OUTLINE_NAME}: ${canvas.cardOutline / canvas.transform.scale}px; --${ELEMENT_SCALE_NAME}: ${1.0 / canvas.transform.scale}`,
  canvas: canvasStyle
})

export type CanvasStyle = {
  container: string
  canvas: string
}