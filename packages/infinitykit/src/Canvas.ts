import { abs, clamp, min, round } from '@figureland/mathkit/number'
import { scale, translate } from '@figureland/mathkit/matrix2D'
import {
  vector2,
  type Vector2,
  scale as scaleVec2,
  negate,
  isVector2
} from '@figureland/mathkit/vector2'
import { box, type Box, boxCenter } from '@figureland/mathkit/box'
import { type PersistenceName, signal, manager } from '@figureland/statekit'
import {
  BACKGROUND_GRID_UNIT,
  DEFAULT_BOUNDS,
  DEFAULT_SNAP_TO_GRID,
  MAX_ZOOM,
  MIN_ZOOM,
  ZOOM_INCREMENT
} from './constants'
import { signalCanvasMatrix } from './canvas-matrix'

export type CanvasState = {
  loaded: boolean
}

export type CanvasOptions = {
  bounds: Vector2
  zoom: {
    min: number
    max: number
    increment: number
  }
  snapToGrid: boolean
  grid: number
}

export type CanvasInit = {
  canvas?: Partial<CanvasOptions>
  persist?: PersistenceName
}

export class Canvas {
  manager = manager()
  options = this.manager.use(
    signal<CanvasOptions>(() => ({
      bounds: DEFAULT_BOUNDS,
      zoom: {
        min: MIN_ZOOM,
        max: MAX_ZOOM,
        increment: ZOOM_INCREMENT
      },

      snapToGrid: DEFAULT_SNAP_TO_GRID,
      grid: BACKGROUND_GRID_UNIT
    }))
  )
  state = this.manager.use(signal<CanvasState>(() => ({ loaded: false })))
  transform = this.manager.use(signalCanvasMatrix())
  viewport = this.manager.use(signal(() => box()))

  constructor({ canvas }: CanvasInit) {
    if (canvas) {
      this.options.set(canvas)
    }
  }

  public snapToGrid = <V extends number | Vector2>(value: V) => {
    const { grid, snapToGrid } = this.options.get()
    const amount = snapToGrid ? grid : 1
    if (isVector2(value)) {
      return vector2(
        round(value.x / amount) * amount,
        round(value.y / amount) * amount
      ) as V extends Vector2 ? Vector2 : never
    } else {
      return (round((value as number) / amount) * amount) as V extends number ? number : never
    }
  }

  public relativeToContainer = <T extends Box | Vector2>(point: T): T => {
    const v = this.viewport.get()
    return {
      ...point,
      x: point.x - v.x,
      y: point.y - v.y
    }
  }
  public resize = (v: Box) => {
    this.viewport.set(v)
    this.state.set({
      loaded: true
    })
  }

  public getScale = (scale: number) => {
    const { min, max } = this.options.get().zoom
    const n = clamp(scale, min, max)
    return vector2(n, n)
  }

  public zoom = (newScale: number, pivot: Vector2 = this.getViewCenter()): void =>
    this.transform.update(
      this.transform.screenToCanvas(pivot),
      this.getScale(newScale / this.transform.scale.get())
    )

  public zoomIn = (): void => {
    this.zoom(this.transform.scale.get() + this.options.get().zoom.increment)
  }

  public zoomOut = (): void => {
    this.zoom(this.transform.scale.get() - this.options.get().zoom.increment)
  }

  public pinch = (newDistance: number): void => {
    const scaleFactor = newDistance / this.transform.previous.get().distance

    this.transform.mutate((matrix) => {
      const pivot = this.getViewCenter()
      translate(matrix, matrix, pivot)
      scale(matrix, matrix, vector2(scaleFactor, scaleFactor))
      translate(matrix, matrix, pivot)
    })
  }

  public move = (delta: Vector2): void => {
    this.transform.mutate((matrix) => {
      translate(matrix, matrix, scaleVec2(vector2(), delta, 1 / this.transform.scale.get()))
    })
  }

  public pan = (delta: Vector2): void =>
    this.transform.mutate((matrix) => {
      translate(
        matrix,
        matrix,
        scaleVec2(vector2(), negate(delta, delta), 1 / this.transform.scale.get())
      )
    })

  public scroll = (point: Vector2, delta: Vector2, multiplier: number = 1): void => {
    const { zoom } = this.options.get()

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

  public getViewCenter = (): Vector2 => boxCenter(this.viewport.get())

  public dispose = () => {
    this.manager.dispose()
  }
}
