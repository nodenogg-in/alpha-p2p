import { type Output, boolean, number, object, is } from 'valibot'
import {
  type PersistenceName,
  type Signal,
  type Subscribable,
  State,
  signal,
  persist
} from '@figureland/statekit'
import { isFloat32Array } from '@figureland/typekit'
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
import { abs, max, min, round, sqrt } from '@figureland/mathkit'
import matrix2D, {
  type Matrix2D,
  copy,
  identity,
  invert,
  multiply,
  scale,
  translate,
  getScale
} from '@figureland/mathkit/matrix2D'
import vector2, {
  type Vector2,
  negate,
  scale as scaleVec2,
  transformMatrix2D,
  add
} from '@figureland/mathkit/vector2'
import { typedLocalStorage } from '@figureland/statekit/typed-local-storage'
import box, { type Box, isBox } from '@figureland/mathkit/box'
import type { PointerState } from './ui/pointer'

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

type SignalMatrix2D = Subscribable<Matrix2D> & {
  set: (v: (m: Matrix2D) => void) => void
}

const signalMatrix2D = (persistence?: PersistenceName): SignalMatrix2D => {
  const value = signal(() => matrix2D(1, 0, 0, 1, 0, 0))

  if (persistence) {
    persist(
      value,
      typedLocalStorage({
        name: [...persistence, 'transform'],
        validate: isFloat32Array,
        fallback: matrix2D,
        interval: 1000
      })
    )
  }

  return {
    ...value,
    set: value.mutate
  }
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
    const transform = this.transform.get()
    // Create an inverted matrix for screen-to-canvas transformation
    let invTransform = matrix2D()
    invert(invTransform, transform)

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
    const result: Vector2 & Partial<Box> = transformMatrix2D(vector2(), item, transform)

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

  public resetTransform = (): void => {
    this.transform.set((matrix) => {
      identity(matrix)
    })
  }

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

  // zoomAndTranslate = (direction = 1, increment = this.key('zoom').get().increment): Transform => {
  //   const scale = this.getZoom(direction, increment)
  //   const viewport = this.key('viewport').get()
  //   return {
  //     scale,
  //     translate: this.getTranslation(scale, {
  //       x: viewport.width / 2 + viewport.x,
  //       y: viewport.height / 2 + viewport.y
  //     })
  //   }
  // }
  public zoom = (scaleFactor: number, pivot: Vector2 = this.getViewCenter()): void => {
    this.transform.set((matrix) => {
      const zoomOrigin = transformMatrix2D(vector2(), pivot, invert(matrix2D(), matrix))

      const constrainedScale = max(
        this.key('zoom').get().min,
        min(this.key('zoom').get().max, scaleFactor)
      )
      const pivotMatrix = matrix2D()
      translate(pivotMatrix, pivotMatrix, zoomOrigin)
      scale(matrix, matrix2D(), vector2(constrainedScale, constrainedScale))
      translate(pivotMatrix, pivotMatrix, negate(vector2(), zoomOrigin))
      multiply(matrix, pivotMatrix, matrix)
    })
  }

  public zoomIn = (): void => {
    this.zoom(getScale(this.transform.get()) + this.key('zoom').get().increment)
  }

  public zoomOut = (): void => {
    this.zoom(getScale(this.transform.get()) - this.key('zoom').get().increment)
  }

  pinch = (newDistance: number): void => {
    const scaleFactor = newDistance / this.key('previous').get().distance

    this.transform.set((matrix) => {
      const pivot = this.getViewCenter()
      translate(matrix, matrix, pivot)
      scale(matrix, matrix, vector2(scaleFactor, scaleFactor))
      translate(matrix, matrix, pivot)
    })
  }

  move = (delta: Vector2): void => {
    this.transform.set((matrix) => {
      translate(matrix, matrix, delta)
    })
  }

  public pan = (delta: Vector2): void => {
    this.transform.set((matrix) => {
      const scale = getScale(matrix)
      translate(matrix, matrix, scaleVec2(vector2(), vector2(-delta.x, -delta.y), 1 / scale))
    })
  }

  scroll = (point: Vector2, delta: Vector2, multiplier: number = 1): void => {
    const matrix = this.transform.get()
    const zoom = this.key('zoom').get()

    // Calculate current scaling factors from the matrix
    const currentScale = sqrt(matrix[0] * matrix[0] + matrix[1] * matrix[1])

    // Determine the scroll direction for zooming in or out
    const zoomDirection = delta.y > 0 ? -1 : 1 // Assuming delta.y > 0 means zoom out and vice versa
    const scrollAdjustment = min(0.009 * multiplier * abs(delta.y), 0.08) * zoomDirection

    // Calculate new scale factor while ensuring it's within the allowed zoom range
    let newScale = currentScale + scrollAdjustment
    newScale = max(zoom.min, min(zoom.max, newScale))

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
    this.transform.set((existingMatrix) => {
      let newMatrix = matrix2D(1, 0, 0, 1, 0, 0)
      translate(newMatrix, newMatrix, p)
      scale(newMatrix, newMatrix, vector2(newScale / currentScale, newScale / currentScale))
      translate(newMatrix, newMatrix, negate(vector2(), p))
      multiply(newMatrix, existingMatrix, newMatrix)
      copy(existingMatrix, newMatrix)
    })
  }

  public storeState = (distance: number = 0) => {
    this.key('previous').set({ transform: this.transform.get(), distance })
  }

  getViewCenter = (): Vector2 => {
    const viewport = this.viewport.get()
    return {
      x: viewport.x + viewport.width / 2,
      y: viewport.y + viewport.height / 2
    }
  }
}
