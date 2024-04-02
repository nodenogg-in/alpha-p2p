import { type Output, boolean, number, object, is } from 'valibot'
import { type PersistenceName, type Signal, State, signal } from '@nodenogg.in/statekit'
import { abs, clamp, dp, max, min, round, sign } from '@nodenogg.in/toolkit'
import {
  type BoxReference,
  type CanvasScreen,
  type Box,
  type Vec2,
  pointSchema,
  boxSchema,
  backgroundPattern,
  transformSchema,
  defaultTransform,
  defaultBox,
  isBox,
  Transform
} from './schema/spatial.schema'
import { type PointerState } from './schema/pointer.schema'
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
import { centerBox } from './utils/geometry'

export const canvasStateSchema = object({
  bounds: pointSchema,
  zoom: object({
    min: number(),
    max: number(),
    increment: number()
  }),
  viewport: boxSchema,
  transform: transformSchema,
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

export type CanvasInteractionState = Output<typeof canvasStateSchema>

export const defaultCanvasInteractionState = (): CanvasInteractionState => ({
  bounds: DEFAULT_BOUNDS,
  zoom: {
    min: MIN_ZOOM,
    max: MAX_ZOOM,
    increment: ZOOM_INCREMENT
  },
  background: DEFAULT_PATTERN,
  transform: defaultTransform(),
  viewport: defaultBox(),
  cardOutline: DEFAULT_CARD_OUTLINE,
  snapToGrid: DEFAULT_SNAP_TO_GRID,
  grid: BACKGROUND_GRID_UNIT,
  previous: {
    transform: defaultTransform(),
    distance: 0
  },
  loaded: false
})

type PresetTypes = 'bounds' | 'zoom' | 'cardOutline' | 'snapToGrid' | 'grid' | 'background'
export type PresetState = Partial<Pick<CanvasInteractionState, PresetTypes>>

export type CanvasInteractionOptions = PresetState & {
  persist?: PersistenceName
}

export class CanvasInteraction extends State<CanvasInteractionState> {
  public viewport: Signal<CanvasScreen<Box>>

  constructor({ persist, ...state }: CanvasInteractionOptions) {
    super({
      initial: () => ({
        ...defaultCanvasInteractionState(),
        ...state
      }),
      persist:
        persist && persist.length > 0
          ? {
              name: persist,
              validate: (v) => is(canvasStateSchema, v),
              interval: 500
            }
          : undefined,
      throttle: 8
    })

    this.viewport = signal(() => {
      const state = this.get()
      return {
        screen: state.viewport,
        canvas: this.screenToCanvas(state.viewport)
      }
    })

    this.use(this.viewport.dispose)
  }

  private getTranslation = (newScale: number, point: Vec2) => {
    const viewport = this.key('viewport').get()
    const transform = this.key('transform').get()

    const containerX = point.x - viewport.x - viewport.width / 2
    const containerY = point.y - viewport.y - viewport.height / 2

    const contentX = (containerX - transform.translate.x) / transform.scale
    const contentY = (containerY - transform.translate.y) / transform.scale

    return {
      x: containerX - contentX * newScale,
      y: containerY - contentY * newScale
    }
  }

  snapToGrid = (canvas: CanvasInteractionState, value: number) => {
    const grid = this.key('snapToGrid').get() ? canvas.grid : 1
    return round(value / grid) * grid
  }

  getZoom = (delta: number, zoomIncrement: number, decimal: number = 4) => {
    const transform = this.key('transform').get()
    const zoom = this.key('zoom').get()
    const newScale = transform.scale - delta * zoomIncrement
    return dp(clamp(newScale, zoom.min, zoom.max), decimal)
  }

  relativeToContainer = <T extends Box | Vec2>(point: T): T => {
    const viewport = this.key('viewport').get()
    return {
      ...point,
      x: point.x - viewport.x,
      y: point.y - viewport.y
    }
  }

  screenToCanvas = <T extends Vec2>(box: T): T extends Box ? Box : Vec2 => {
    const viewport = this.key('viewport').get()
    const transform = this.key('transform').get()

    const originX = -viewport.width / 2
    const originY = -viewport.height / 2

    const p = this.relativeToContainer(box)

    const px = originX + p.x - transform.translate.x
    const py = originY + p.y - transform.translate.y

    let x = px / transform.scale
    let y = py / transform.scale

    x += viewport.width / 2
    y += viewport.height / 2

    if (isBox(box)) {
      const width = box.width / transform.scale
      const height = box.height / transform.scale
      return {
        x,
        y,
        width,
        height
      } as T extends Box ? Box : Vec2
    } else {
      return {
        x,
        y
      } as T extends Box ? Box : Vec2
    }
  }

  canvasToScreen = <T extends Vec2>(box: T, scaled: boolean = true): T extends Box ? Box : Vec2 => {
    const viewport = this.key('viewport').get()
    const transform = this.key('transform').get()

    // Move origin to center of canvas
    let x = box.x - viewport.width / 2
    let y = box.y - viewport.height / 2

    // Apply scale
    x *= transform.scale
    y *= transform.scale

    // Apply translation
    x += transform.translate.x
    y += transform.translate.y

    // Adjust origin back to the top-left corner of the container
    x = x + viewport.width / 2
    y = y + viewport.height / 2

    if (isBox(box)) {
      // Apply scale to container
      const width = box.width * (scaled ? transform.scale : 1.0)
      const height = box.height * (scaled ? transform.scale : 1.0)
      return {
        x,
        y,
        width,
        height
      } as T extends Box ? Box : Vec2
    } else {
      return {
        x,
        y
      } as T extends Box ? Box : Vec2
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

  getTransform = (newTransform: Partial<Transform>): Transform => {
    const transform = this.key('transform').get()
    const viewport = this.key('viewport').get()
    const bounds = this.key('bounds').get()

    const { translate = transform.translate, scale = transform.scale } = newTransform

    const x = translate.x
    const y = translate.y
    const sc = clamp(scale, this.key('zoom').get().min, this.key('zoom').get().max)

    const maxX = max(0, (bounds.x * sc - viewport.width) / 2)
    const maxY = max(0, (bounds.y * sc - viewport.height) / 2)

    return {
      translate: {
        x: clamp(x, -maxX, maxX),
        y: clamp(y, -maxY, maxY)
      },
      scale: sc
    }
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

  public resize = (viewport: Box) =>
    this.set({
      viewport,
      loaded: true
    })

  zoomAndTranslate = (direction = 1, increment = this.key('zoom').get().increment): Transform => {
    const scale = this.getZoom(direction, increment)
    const viewport = this.key('viewport').get()
    return {
      scale,
      translate: this.getTranslation(scale, {
        x: viewport.width / 2 + viewport.x,
        y: viewport.height / 2 + viewport.y
      })
    }
  }

  zoom = (newScale: number) => {
    const viewport = this.key('viewport').get()
    this.key('transform').set(
      this.getTransform({
        scale: newScale,
        translate: this.getTranslation(newScale, {
          x: viewport.width / 2,
          y: viewport.height / 2
        })
      })
    )
  }

  public zoomIn = () => {
    const increment = this.key('zoom').get().increment
    const scale = this.key('transform').get().scale
    this.zoom(dp(scale + increment, 1))
  }

  public zoomOut = () => {
    const increment = this.key('zoom').get().increment
    const scale = this.key('transform').get().scale
    this.zoom(dp(scale - increment, 1))
  }

  pinch = (newDistance: number) => {
    const previous = this.key('previous').get()
    this.key('transform').set(
      this.getTransform({
        scale: previous.transform.scale * (newDistance / previous.distance)
      })
    )
  }

  move = (delta: Vec2) => {
    const transform = this.key('transform').get()
    this.key('transform').set(
      this.getTransform({
        translate: {
          x: transform.translate.x + delta.x,
          y: transform.translate.y + delta.y
        }
      })
    )
  }

  pan = (delta: Vec2) => {
    const transform = this.key('transform').get()
    this.key('transform').set(
      this.getTransform({
        translate: {
          x: transform.translate.x - delta.x,
          y: transform.translate.y - delta.y
        }
      })
    )
  }

  scroll = (point: Vec2, delta: Vec2, multiplier: number = 1) => {
    const transform = this.key('transform').get()
    const zoom = this.key('zoom').get()
    if (
      (transform.scale >= zoom.max && delta.y < 0) ||
      (transform.scale <= zoom.min && delta.y > 0)
    ) {
      return
    }
    const scrollAdjustment = min(0.009 * multiplier * abs(delta.y), 0.08)
    const scale = this.getZoom(sign(delta.y), scrollAdjustment)

    this.key('transform').set(
      this.getTransform({
        scale,
        translate: this.getTranslation(scale, point)
      })
    )
  }

  // public zoom = (newScale: number) => this.key('transform').set(zoom(this.get(), newScale))

  // public pinch = (newDistance: number) => this.key('transform').set(pinch(this.get(), newDistance))

  // public move = (delta: Vec2) => this.key('transform').set(move(this.get(), delta))

  // public scroll = (point: Vec2, delta: Vec2) =>
  //   this.key('transform').set(scroll(this.get(), point, delta))

  // public pan = (point: Vec2) => this.key('transform').set(pan(this.get(), point))

  public storeState = (distance: number = 0) => {
    this.key('previous').set({ transform: this.key('transform').get(), distance })
  }
  public centerAndZoomOnBox(targetBox: Box) {
    // Calculate the necessary scale to fit the target Box within the viewport
    const viewportSize = this.key('viewport')
    const scale = this.key('transform').get().scale

    // Calculate the center of the target Box and the viewport
    const targetCenter = centerBox(targetBox)

    this.key('transform').set(
      this.getTransform({
        scale,
        translate: {
          x: 0,
          y: 0
        }
      })
    )
  }

  getViewCenter = () => {
    const viewport = this.key('viewport').get()
    return this.screenToCanvas({
      x: viewport.x + viewport.width / 2,
      y: viewport.y + viewport.height / 2
    })
  }
  centerViewAroundBox = (box: Box) => {
    return this.getTransform({
      translate: {
        x: box.x,
        y: box.y
      }
    })
  }

  center = () => {
    const transform = this.key('transform').get()
    const viewport = this.key('viewport').get()
    this.getTransform({
      translate: this.getTranslation(transform.scale, {
        x: viewport.width / 2,
        y: viewport.height / 2
      })
    })
  }
}
