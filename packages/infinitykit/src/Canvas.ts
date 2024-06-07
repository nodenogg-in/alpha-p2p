import { abs, clamp, min, round } from '@figureland/mathkit/number'
import {
  copy,
  getScale,
  identity,
  invert,
  isMatrix2D,
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
import { signal, readonly, type PersistenceName, persist, Manager } from '@figureland/statekit'
import { typedLocalStorage } from '@figureland/statekit/typed-local-storage'
import { DEFAULT_CANVAS_OPTIONS } from './constants'
import type { BackgroundPatternType } from './schema/background.schema'

export type CanvasState = {
  loaded: boolean
}

export type CanvasOptions = {
  background: BackgroundPatternType
  bounds: Vector2
  zoom: {
    min: number
    max: number
    increment: number
  }
  snapToGrid: boolean
  grid: number
}

export class Canvas extends Manager {
  public readonly options = this.use(signal<CanvasOptions>(() => DEFAULT_CANVAS_OPTIONS))
  public readonly state = this.use(
    signal<CanvasState>(() => ({
      loaded: false
    }))
  )
  public readonly viewport = this.use(signal(() => box()))
  public readonly transform = this.use(signal(() => matrix2D()))

  public readonly scale = this.use(readonly(signal((get) => getScale(get(this.transform)))))
  public readonly previous = this.use(
    signal(() => ({
      transform: matrix2D(),
      distance: 0
    }))
  )

  constructor(
    config: {
      options?: Partial<CanvasOptions>
      viewport?: Box
      persistence?: PersistenceName
    } = {}
  ) {
    super()
    if (config.options) {
      this.options.set(config.options)
    }

    if (config.persistence) {
      persist(
        this.transform,
        typedLocalStorage({
          name: config.persistence,
          validate: isMatrix2D,
          interval: 1000,
          fallback: matrix2D
        })
      )
    }

    if (config.viewport) {
      this.resize(config.viewport)
    }
  }

  private updateTransform = (point: Vector2, newScale: Vector2 = vector2(1.0, 1.0)) => {
    this.transform.mutate((existingMatrix) => {
      const newMatrix = translate(matrix2D(), matrix2D(), point)
      scale(newMatrix, newMatrix, newScale)
      translate(newMatrix, newMatrix, negate(vector2(), point))
      multiply(newMatrix, existingMatrix, newMatrix)
      copy(existingMatrix, newMatrix)
    })
  }

  public resetTransform = () => this.transform.mutate(identity)

  public storePrevious = (distance: number = 0) => {
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

  public screenToCanvas = <T extends Vector2 | Box>(i: T): T => {
    const invTransform = matrix2D()
    const viewport = this.viewport.get()
    invert(invTransform, this.transform.get())

    const item = { ...i }
    item.x -= viewport.x
    item.y -= viewport.y

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

  public canvasViewport = this.use(
    readonly(
      signal((get) => {
        get(this.transform)
        return this.screenToCanvas(get(this.viewport))
      })
    )
  )

  public getViewCenter = (): Vector2 => boxCenter(this.viewport.get())
}
