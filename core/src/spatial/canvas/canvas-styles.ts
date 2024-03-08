import type { CanvasInteraction } from './CanvasInteraction'
import { State, deriveState } from '../../utils'
import { transform } from '../css'

const canvasStyle =
  'position: absolute; width: 100%; height: 100%; top: 0px; left: 0px; transformOrigin: 50% 50%; transform: var(--spatial-view-transform); pointer-events: none;'

export const canvasStyles = (interaction: CanvasInteraction): CanvasStyleState =>
  deriveState([interaction], (canvas) => ({
    container: `--spatial-view-transform: ${transform(canvas.transform)}; --card-outline: ${canvas.cardOutline / canvas.transform.scale}px; --card-element-scale: ${1.0 / canvas.transform.scale}`,
    canvas: canvasStyle
  }))

export type CanvasStyleState = State<{
  container: string
  canvas: string
}>
