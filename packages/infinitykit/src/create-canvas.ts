import { abs, clamp, min, round } from '@figureland/mathkit'
import {
  type PersistenceName,
  signal,
  signalObject,
  createSubscriptions,
  SignalObject,
  Signal
} from '@figureland/statekit'
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
import { SignalCanvasMatrix, signalCanvasMatrix } from './canvas-matrix'

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

export const createCanvas = ({ persist: name, ...s }: CanvasOptions): Canvas => {
  const subs = createSubscriptions()
  const viewport = signal(() => box())
  const state = signalObject({
    ...defaultCanvasState(),
    ...s
  })

  const transform = signalCanvasMatrix()
  subs.add(viewport.dispose, transform.dispose)

  const snapToGrid = (canvas: CanvasState, value: number) => {
    const grid = state.key('snapToGrid').get() ? canvas.grid : 1
    return round(value / grid) * grid
  }

  const relativeToContainer = <T extends Box | Vector2>(point: T): T => {
    const v = viewport.get()
    return {
      ...point,
      x: point.x - v.x,
      y: point.y - v.y
    }
  }
  const getSelection = (
    { point, box }: CanvasActionsState['highlight'],
    boxes: BoxReference[] = [],
    padding: number = 0
  ): CanvasActionsState['selection'] => ({
    target: getCanvasPoint(boxes, point.canvas, padding),
    boxes: getCanvasSelection(boxes, box.canvas, padding)
  })

  const getHighlight = (pointer: PointerState): CanvasActionsState['highlight'] => {
    const box = getSelectionBox(pointer.origin, pointer.point)

    return {
      box: {
        screen: relativeToContainer(box),
        canvas: transform.screenToCanvas(box)
      },
      point: {
        screen: relativeToContainer(pointer.point),
        canvas: transform.screenToCanvas(pointer.point)
      }
    }
  }

  const resize = (v: Box) => {
    viewport.set(v)
    state.set({
      loaded: true
    })
  }

  const getScale = (scale: number) => {
    const zoom = state.key('zoom').get()
    const n = clamp(scale, zoom.min, zoom.max)
    return vector2(n, n)
  }

  const zoom = (newScale: number, pivot: Vector2 = getViewCenter()): void =>
    transform.update(transform.screenToCanvas(pivot), getScale(newScale / transform.scale.get()))

  const zoomIn = (): void => {
    zoom(transform.scale.get() + state.key('zoom').get().increment)
  }

  const zoomOut = (): void => {
    zoom(transform.scale.get() - state.key('zoom').get().increment)
  }

  const pinch = (newDistance: number): void => {
    const scaleFactor = newDistance / transform.previous.get().distance

    transform.mutate((matrix) => {
      const pivot = getViewCenter()
      translate(matrix, matrix, pivot)
      scale(matrix, matrix, vector2(scaleFactor, scaleFactor))
      translate(matrix, matrix, pivot)
    })
  }

  const move = (delta: Vector2): void => {
    transform.mutate((matrix) => {
      translate(matrix, matrix, delta)
    })
  }

  const pan = (delta: Vector2): void => {
    transform.mutate((matrix) => {
      const scale = transform.scale.get()
      translate(matrix, matrix, scaleVec2(vector2(), vector2(-delta.x, -delta.y), 1 / scale))
    })
  }

  const scroll = (point: Vector2, delta: Vector2, multiplier: number = 1): void => {
    const zoom = state.key('zoom').get()

    // Calculate current scaling factors from the matrix
    const currentScale = transform.scale.get()

    // Determine the scroll direction for zooming in or out
    const zoomDirection = delta.y > 0 ? -1 : 1 // Assuming delta.y > 0 means zoom out and vice versa
    const scrollAdjustment = min(0.009 * multiplier * abs(delta.y), 0.08) * zoomDirection

    const newScale = getScale((currentScale + scrollAdjustment) / currentScale)

    // Early exit if the new scale would exceed zoom limits
    if (
      (currentScale >= zoom.max && zoomDirection > 0) ||
      (currentScale <= zoom.min && zoomDirection < 0)
    ) {
      return
    }

    // Convert the point to the canvas coordinate system
    const p: Vector2 = transform.screenToCanvas(point)

    // Apply transformation centered around the canvas point
    transform.update(p, newScale)
  }

  const getViewCenter = (): Vector2 => boxCenter(viewport.get())

  return {
    state,
    transform,
    viewport,
    snapToGrid,
    relativeToContainer,
    getSelection,
    getHighlight,
    resize,
    zoom,
    zoomIn,
    zoomOut,
    pinch,
    move,
    pan,
    scroll,
    getViewCenter,
    dispose: subs.dispose
  }
}

export type Canvas = {
  state: SignalObject<CanvasState>
  transform: SignalCanvasMatrix
  viewport: Signal<Box>
  snapToGrid: (canvas: CanvasState, value: number) => number
  relativeToContainer: <T extends Box | Vector2>(point: T) => T
  getSelection: (
    { point, box }: CanvasActionsState['highlight'],
    boxes?: BoxReference[],
    padding?: number
  ) => CanvasActionsState['selection']
  getHighlight: (pointer: PointerState) => CanvasActionsState['highlight']
  resize: (v: Box) => void
  zoom: (newScale: number, pivot?: Vector2) => void
  zoomIn: () => void
  zoomOut: () => void
  pinch: (newDistance: number) => void
  move: (delta: Vector2) => void
  pan: (delta: Vector2) => void
  scroll: (point: Vector2, delta: Vector2, multiplier?: number) => void
  getViewCenter: () => Vector2
  dispose: () => void
}
