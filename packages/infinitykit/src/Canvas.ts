import { abs, clamp, min, round } from '@figureland/mathkit'
import { type PersistenceName, type Signal, State, signal } from '@figureland/statekit'
import { scale, translate } from '@figureland/mathkit/matrix2D'
import vector2, { type Vector2, scale as scaleVec2 } from '@figureland/mathkit/vector2'
import box, { type Box, boxCenter } from '@figureland/mathkit/box'

import { BackgroundPatternType, BoxReference } from './schema/spatial.schema'
import { getSelectionBox } from './utils/interaction'
import {
  BACKGROUND_GRID_UNIT,
  DEFAULT_BOUNDS,
  DEFAULT_CARD_OUTLINE,
  DEFAULT_PATTERN,
  DEFAULT_SNAP_TO_GRID,
  MAX_ZOOM,
  MIN_ZOOM,
  ZOOM_INCREMENT
} from './constants'
import { getCanvasPoint, getCanvasSelection } from './utils/intersection'
import type { CanvasActionsState } from './CanvasActions'
import type { PointerState } from './ui/pointer'
import { type SignalCanvasMatrix, signalCanvasMatrix } from './canvas-matrix'

// export const canvasStateSchema = object({
//   bounds: object({
//     x: number(),
//     y: number()
//   }),
//   zoom: object({
//     min: number(),
//     max: number(),
//     increment: number()
//   }),
//   background: backgroundPattern,
//   previous: object({
//     transform: array(number()),
//     distance: number()
//   }),
//   cardOutline: number(),
//   grid: number(),
//   snapToGrid: boolean(),
//   loaded: boolean()
// })

export type CanvasState = {
  bounds: Vector2
  zoom: {
    min: number
    max: number
    increment: number
  }
  background: BackgroundPatternType
  cardOutline: number
  snapToGrid: boolean
  grid: number
  loaded: boolean
}

export const defaultCanvasState = (): CanvasState => ({
  bounds: DEFAULT_BOUNDS,
  zoom: {
    min: MIN_ZOOM,
    max: MAX_ZOOM,
    increment: ZOOM_INCREMENT
  },
  background: DEFAULT_PATTERN,
  cardOutline: DEFAULT_CARD_OUTLINE,
  snapToGrid: DEFAULT_SNAP_TO_GRID,
  grid: BACKGROUND_GRID_UNIT,
  loaded: false
})

type PresetTypes = 'bounds' | 'zoom' | 'cardOutline' | 'snapToGrid' | 'grid' | 'background'
export type PresetState = Partial<Pick<CanvasState, PresetTypes>>

export type CanvasOptions = PresetState & {
  persist?: PersistenceName
}

export class Canvas extends State<CanvasState> {
  public viewport: Signal<Box> = signal(() => box())
  public transform: SignalCanvasMatrix

  constructor({ persist: name, ...state }: CanvasOptions) {
    super({
      initial: () => ({
        ...defaultCanvasState(),
        ...state
      }),
      throttle: 8
    })

    this.transform = signalCanvasMatrix()
    this.use(this.viewport.dispose, this.transform.dispose)
  }

  snapToGrid = (canvas: CanvasState, value: number) => {
    const grid = this.key('snapToGrid').get() ? canvas.grid : 1
    return round(value / grid) * grid
  }

  relativeToContainer = <T extends Box | Vector2>(point: T): T => {
    const viewport = this.viewport.get()
    return {
      ...point,
      x: point.x - viewport.x,
      y: point.y - viewport.y
    }
  }
  public getSelection = (
    { point, box }: CanvasActionsState['highlight'],
    boxes: BoxReference[] = [],
    padding: number = 0
  ): CanvasActionsState['selection'] => ({
    target: getCanvasPoint(boxes, point.canvas, padding),
    boxes: getCanvasSelection(boxes, box.canvas, padding)
  })

  public getHighlight = (pointer: PointerState): CanvasActionsState['highlight'] => {
    const box = getSelectionBox(pointer.origin, pointer.point)

    return {
      box: {
        screen: this.relativeToContainer(box),
        canvas: this.transform.screenToCanvas(box)
      },
      point: {
        screen: this.relativeToContainer(pointer.point),
        canvas: this.transform.screenToCanvas(pointer.point)
      }
    }
  }

  public resize = (viewport: Box) => {
    this.viewport.set(viewport)
    this.set({
      loaded: true
    })
  }

  public zoom = (newScale: number, pivot: Vector2 = this.getViewCenter()): void =>
    this.transform.update(
      this.transform.screenToCanvas(pivot),
      this.getScale(newScale / this.transform.scale.get())
    )

  public zoomIn = (): void => {
    this.zoom(this.transform.scale.get() + this.key('zoom').get().increment)
  }

  public zoomOut = (): void => {
    this.zoom(this.transform.scale.get() - this.key('zoom').get().increment)
  }

  private getScale = (scale: number) => {
    const zoom = this.key('zoom').get()
    const n = clamp(scale, zoom.min, zoom.max)
    return vector2(n, n)
  }

  pinch = (newDistance: number): void => {
    const scaleFactor = newDistance / this.transform.previous.get().distance

    this.transform.mutate((matrix) => {
      const pivot = this.getViewCenter()
      translate(matrix, matrix, pivot)
      scale(matrix, matrix, vector2(scaleFactor, scaleFactor))
      translate(matrix, matrix, pivot)
    })
  }

  move = (delta: Vector2): void => {
    this.transform.mutate((matrix) => {
      translate(matrix, matrix, delta)
    })
  }

  public pan = (delta: Vector2): void => {
    this.transform.mutate((matrix) => {
      const scale = this.transform.scale.get()
      translate(matrix, matrix, scaleVec2(vector2(), vector2(-delta.x, -delta.y), 1 / scale))
    })
  }

  scroll = (point: Vector2, delta: Vector2, multiplier: number = 1): void => {
    const zoom = this.key('zoom').get()

    // Calculate current scaling factors from the matrix
    const currentScale = this.transform.scale.get()

    // Determine the scroll direction for zooming in or out
    const zoomDirection = delta.y > 0 ? -1 : 1 // Assuming delta.y > 0 means zoom out and vice versa
    const scrollAdjustment = min(0.009 * multiplier * abs(delta.y), 0.08) * zoomDirection

    const newScale = this.getScale((currentScale + scrollAdjustment) / currentScale)

    // Early exit if the new scale would exceed zoom limits
    if (
      (currentScale >= zoom.max && zoomDirection > 0) ||
      (currentScale <= zoom.min && zoomDirection < 0)
    ) {
      return
    }

    // Convert the point to the canvas coordinate system
    const p: Vector2 = this.transform.screenToCanvas(point)

    // Apply transformation centered around the canvas point
    this.transform.update(p, newScale)
  }

  getViewCenter = (): Vector2 => boxCenter(this.viewport.get())
}
