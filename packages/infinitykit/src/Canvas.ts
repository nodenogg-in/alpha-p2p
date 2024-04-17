import { type Output, boolean, number, object, is } from 'valibot'
import { type PersistenceName, type Signal, State, signal } from '@figureland/statekit'
import {
  pointSchema,
  backgroundPattern,
  transformSchema,
  type BoxReference
} from './schema/spatial.schema'
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
import { abs, clamp, max, min, round, sqrt } from '@figureland/mathkit'
import matrix2D, {
  copy,
  identity,
  invert,
  multiply,
  scale,
  translate,
  getScale,
  Matrix2D
} from '@figureland/mathkit/matrix2D'
import vector2, {
  type Vector2,
  negate,
  scale as scaleVec2,
  transformMatrix2D,
  add
} from '@figureland/mathkit/vector2'
import { typedLocalStorage } from '@figureland/statekit/typed-local-storage'
import box, { type Box, isBox, boxCenter } from '@figureland/mathkit/box'
import type { PointerState } from './ui/pointer'
import { SignalMatrix2D, signalMatrix2D } from './canvas-transform'

export const canvasStateSchema = object({
  bounds: pointSchema,
  zoom: object({
    min: number(),
    max: number(),
    increment: number()
  }),
  background: backgroundPattern,
  previous: object({
    transform: transformSchema,
    distance: number()
  }),
  cardOutline: number(),
  grid: number(),
  snapToGrid: boolean(),
  loaded: boolean()
})

export type CanvasState = Output<typeof canvasStateSchema>

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
  previous: {
    transform: matrix2D(),
    distance: 0
  },
  loaded: false
})

type PresetTypes = 'bounds' | 'zoom' | 'cardOutline' | 'snapToGrid' | 'grid' | 'background'
export type PresetState = Partial<Pick<CanvasState, PresetTypes>>

export type CanvasOptions = PresetState & {
  persist?: PersistenceName
}

export class Canvas extends State<CanvasState> {
  public viewport: Signal<Box> = signal(() => box())
  public transform: SignalMatrix2D

  constructor({ persist: name, ...state }: CanvasOptions) {
    super({
      initial: () => ({
        ...defaultCanvasState(),
        ...state
      }),
      persistence:
        name && name.length > 0
          ? typedLocalStorage({
              name,
              validate: (v) => is(canvasStateSchema, v),
              interval: 500,
              fallback: defaultCanvasState
            })
          : undefined,
      throttle: 8
    })

    this.transform = signalMatrix2D(name)
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

  screenToCanvas<T extends Vector2 | Box>(item: T): T {
    // Create an inverted matrix for screen-to-canvas transformation
    let invTransform = matrix2D()
    invert(invTransform, this.transform.get())

    // Initialize a result object that will either be Vector2 or Box

    // Transform the position
    const result: Vector2 & Partial<Box> = transformMatrix2D(vector2(), item, invTransform)

    // Transform dimensions if the item is a Box
    if (isBox(item)) {
      // Assuming a function isBox to check if the item has width and height properties
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

  canvasToScreen<T extends Vector2 | Box>(item: T): T {
    const transform = this.transform.get()
    // Initialize a result object that will either be Vector2 or Box

    // Transform the position
    const result: Vector2 & Partial<Box> = transformMatrix2D(vector2(), item, this.transform.get())

    // Transform dimensions if the item is a Box
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
        canvas: this.screenToCanvas(box)
      },
      point: {
        screen: this.relativeToContainer(pointer.point),
        canvas: this.screenToCanvas(pointer.point)
      }
    }
  }

  public resize = (viewport: Box) => {
    this.viewport.set(viewport)
    this.set({
      loaded: true
    })
  }

  public zoom = (newScale: number, pivot: Vector2 = this.getViewCenter()): void => {
    // Convert the point to the canvas coordinate system
    const p: Vector2 = this.screenToCanvas(pivot)
    const currentScale = getScale(this.transform.get())

    // Apply transformation centered around the canvas point
    this.transform.update(p, vector2(newScale / currentScale, newScale / currentScale))

    // const p = this.screenToCanvas(pivot)
    // this.transform.mutate((matrix) => {
    //   const newScale = this.getZoomLevel(scaleFactor)
    //   let scaleMat2d = matrix2D(1, 0, 0, 1, 0, 0)
    //   translate(scaleMat2d, scaleMat2d, p)
    //   scale(scaleMat2d, scaleMat2d, vector2(newScale, newScale))
    //   translate(scaleMat2d, scaleMat2d, negate(vector2(), p))
    //   multiply(scaleMat2d, matrix, scaleMat2d)
    //   copy(matrix, scaleMat2d)
    // })
  }

  public zoomIn = (): void => {
    this.zoom(getScale(this.transform.get()) + this.key('zoom').get().increment)
  }

  public zoomOut = (): void => {
    this.zoom(getScale(this.transform.get()) - this.key('zoom').get().increment)
  }

  private getZoomLevel = (scale: number) => {
    const zoom = this.key('zoom').get()
    return clamp(scale, zoom.min, zoom.max)
  }

  pinch = (newDistance: number): void => {
    const scaleFactor = newDistance / this.key('previous').get().distance

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
      const scale = getScale(matrix)
      translate(matrix, matrix, scaleVec2(vector2(), vector2(-delta.x, -delta.y), 1 / scale))
    })
  }

  scroll = (point: Vector2, delta: Vector2, multiplier: number = 1): void => {
    const matrix = this.transform.get()
    const zoom = this.key('zoom').get()

    // Calculate current scaling factors from the matrix
    const currentScale = getScale(matrix)

    // Determine the scroll direction for zooming in or out
    const zoomDirection = delta.y > 0 ? -1 : 1 // Assuming delta.y > 0 means zoom out and vice versa
    const scrollAdjustment = min(0.009 * multiplier * abs(delta.y), 0.08) * zoomDirection

    const newScale = this.getZoomLevel(currentScale + scrollAdjustment)

    // Early exit if the new scale would exceed zoom limits
    if (
      (currentScale >= zoom.max && zoomDirection > 0) ||
      (currentScale <= zoom.min && zoomDirection < 0)
    ) {
      return
    }

    // Convert the point to the canvas coordinate system
    const p: Vector2 = this.screenToCanvas(point)

    // Apply transformation centered around the canvas point
    this.transform.update(p, vector2(newScale / currentScale, newScale / currentScale))
  }

  public storeState = (distance: number = 0) => {
    this.key('previous').set({ transform: this.transform.get(), distance })
  }

  getViewCenter = (): Vector2 => boxCenter(this.viewport.get())
}
