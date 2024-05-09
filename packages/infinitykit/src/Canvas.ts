import { abs, clamp, min, round } from '@figureland/mathkit/number'
import {
  copy,
  getScale,
  identity,
  invert,
  matrix2D,
  multiply,
  scale,
  translate
} from '@figureland/mathkit/matrix2D'
import {
  type Vector2,
  vector2,
  scale as scaleVec2,
  negate,
  isVector2,
  transformMatrix2D,
  add
} from '@figureland/mathkit/vector2'
import { box, type Box, boxCenter, isBox } from '@figureland/mathkit/box'
import { signal, system, readonly } from '@figureland/statekit'
import {
  DEFAULT_BACKGROUND_GRID_UNIT,
  DEFAULT_BOUNDS,
  DEFAULT_MAX_ZOOM,
  DEFAULT_MIN_ZOOM,
  DEFAULT_SNAP_TO_GRID,
  DEFAULT_ZOOM_INCREMENT
} from './constants'

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

export class Canvas {
  private system = system()
  public readonly options = this.system.use(
    signal<CanvasOptions>(() => ({
      bounds: DEFAULT_BOUNDS,
      zoom: {
        min: DEFAULT_MIN_ZOOM,
        max: DEFAULT_MAX_ZOOM,
        increment: DEFAULT_ZOOM_INCREMENT
      },
      snapToGrid: DEFAULT_SNAP_TO_GRID,
      grid: DEFAULT_BACKGROUND_GRID_UNIT
    }))
  )
  public readonly state = this.system.use(signal<CanvasState>(() => ({ loaded: false })))
  public readonly transform = this.system.use(signal(() => matrix2D()))
  public readonly scale = this.system.use(readonly(signal((get) => getScale(get(this.transform)))))
  public readonly previous = this.system.use(
    signal(() => ({
      transform: matrix2D(),
      distance: 0
    }))
  )

  public readonly viewport = this.system.use(signal(() => box()))

  constructor(options: Partial<CanvasOptions> = {}) {
    this.options.set(options)
  }

  private updateTransform = (point: Vector2, newScale: Vector2 = vector2(1.0, 1.0)) =>
    this.transform.mutate((existingMatrix) => {
      const newMatrix = translate(matrix2D(), matrix2D(), point)
      scale(newMatrix, newMatrix, newScale)
      translate(newMatrix, newMatrix, negate(vector2(), point))
      multiply(newMatrix, existingMatrix, newMatrix)
      copy(existingMatrix, newMatrix)
    })

  private resetTransform = () => this.transform.mutate(identity)

  private storePrevious = (distance: number = 0) => {
    this.previous.set({
      transform: this.transform.get(),
      distance
    })
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
    this.updateTransform(this.screenToCanvas(pivot), this.getScale(newScale / this.scale.get()))

  public zoomIn = (): void => {
    this.zoom(this.scale.get() + this.options.get().zoom.increment)
  }

  public zoomOut = (): void => {
    this.zoom(this.scale.get() - this.options.get().zoom.increment)
  }

  public pinch = (newDistance: number): void => {
    const scaleFactor = newDistance / this.previous.get().distance

    this.transform.mutate((matrix) => {
      const pivot = this.getViewCenter()
      translate(matrix, matrix, pivot)
      scale(matrix, matrix, vector2(scaleFactor, scaleFactor))
      translate(matrix, matrix, pivot)
    })
  }

  public wheel = (point: Vector2, delta: Vector2) => {
    if (delta.y % 1 === 0) {
      this.pan(delta)
    } else {
      this.scroll(point, delta)
    }
  }

  public move = (delta: Vector2): void => {
    this.transform.mutate((matrix) => {
      translate(matrix, matrix, scaleVec2(vector2(), delta, 1 / this.scale.get()))
    })
  }

  public pan = (delta: Vector2): void =>
    this.transform.mutate((matrix) => {
      translate(matrix, matrix, scaleVec2(vector2(), negate(delta, delta), 1 / this.scale.get()))
    })

  public scroll = (point: Vector2, delta: Vector2, multiplier: number = 1): void => {
    const { zoom } = this.options.get()

    const currentScale = this.scale.get()

    const zoomDirection = delta.y > 0 ? -1 : 1
    const scrollAdjustment = min(0.009 * multiplier * abs(delta.y), 0.08) * zoomDirection

    const newScale = this.getScale((currentScale + scrollAdjustment) / currentScale)

    if (
      (currentScale >= zoom.max && zoomDirection > 0) ||
      (currentScale <= zoom.min && zoomDirection < 0)
    ) {
      return
    }

    this.updateTransform(this.screenToCanvas(point), newScale)
  }

  public screenToCanvas = <T extends Vector2 | Box>(item: T): T => {
    const invTransform = matrix2D()
    invert(invTransform, this.transform.get())

    const result: Vector2 & Partial<Box> = transformMatrix2D(vector2(), item, invTransform)

    if (isBox(item)) {
      const v = vector2()
      const transformedDim = transformMatrix2D(
        v,
        add(v, v, vector2(item.x + item.width, item.y + item.height)),
        invTransform
      )
      result.width = transformedDim.x - result.x
      result.height = transformedDim.y - result.y
    }

    return result as T
  }

  public canvasToScreen = <T extends Vector2 | Box>(item: T): T => {
    const transform = this.transform.get()

    const result: Vector2 & Partial<Box> = transformMatrix2D(vector2(), item, this.transform.get())

    if (isBox(item)) {
      const transformedDim = transformMatrix2D(
        vector2(),
        vector2(item.x + item.width, item.y + item.height),
        transform
      )
      result.width = transformedDim.x - result.x
      result.height = transformedDim.y - result.y
    }

    return result as T
  }

  public getViewCenter = (): Vector2 => boxCenter(this.viewport.get())

  public dispose = () => this.system.dispose()
}
