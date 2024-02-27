import { type Output, boolean, number, object } from 'valibot'
import {
  pointSchema,
  type Box,
  type Vec2,
  boxSchema,
  backgroundPattern,
  transformSchema,
  defaultTransform,
  defaultBox
} from '../../schema'
import {
  canvasToScreen,
  getViewCenter,
  move,
  normalise,
  pan,
  pinch,
  scroll,
  zoom,
  centerViewAroundBox,
  center
} from './interaction'
import {
  BACKGROUND_GRID_UNIT,
  DEFAULT_BOUNDS,
  DEFAULT_PATTERN,
  DEFAULT_SNAP_TO_GRID
} from '../constants'
import { getPersistenceName } from '../../app'
import { MicroState } from '../../utils/emitter/MicroState'

export const canvasStateSchema = object({
  bounds: pointSchema,
  viewport: boxSchema,
  transform: transformSchema,
  background: backgroundPattern,
  previous: object({
    transform: transformSchema,
    distance: number()
  }),
  grid: number(),
  snapToGrid: boolean(),
  loaded: boolean()
})

export type CanvasState = Output<typeof canvasStateSchema>

export const defaultCanvasState = (): CanvasState => ({
  bounds: DEFAULT_BOUNDS,
  background: DEFAULT_PATTERN,
  transform: defaultTransform(),
  viewport: defaultBox(),
  snapToGrid: DEFAULT_SNAP_TO_GRID,
  grid: BACKGROUND_GRID_UNIT,
  previous: {
    transform: defaultTransform(),
    distance: 0
  },
  loaded: false
})

export class CanvasInteraction extends MicroState<CanvasState> {
  constructor(persist?: string[]) {
    super(
      defaultCanvasState,
      persist && persist.length > 0
        ? {
            name: getPersistenceName(persist),
            schema: canvasStateSchema,
            interval: 500
          }
        : undefined
    )
  }

  public normalise = <T extends Box | Vec2>(point: T) => normalise<T>(this.get(), point)

  public screenToCanvas = <T extends Vec2>(data: T) => canvasToScreen<T>(this.get(), data)

  public canvasToScreen = <T extends Vec2>(data: T, scaled: boolean = true) =>
    canvasToScreen<T>(this.get(), data, scaled)

  public resize = (box: Box) => this.set(() => ({ viewport: box, loaded: true }))

  public zoom = (newScale: number) => this.set((canvas) => ({ transform: zoom(canvas, newScale) }))

  public pinch = (newDistance: number) =>
    this.set((canvas) => ({ transform: pinch(canvas, newDistance) }))

  public move = (delta: Vec2) => this.set((canvas) => ({ transform: move(canvas, delta) }))

  public scroll = (point: Vec2, delta: Vec2) =>
    this.set((canvas) => ({ transform: scroll(canvas, point, delta) }))

  public pan = (point: Vec2) => this.set((canvas) => ({ transform: pan(canvas, point) }))

  public getViewCenter = () => getViewCenter(this.get())

  public center = () => this.set((canvas) => ({ transform: center(canvas) }))

  public centerViewAroundBox = (box: Box) =>
    this.set((canvas) => ({ transform: centerViewAroundBox(canvas, box) }))

  public storeState = (distance: number = 0) => {
    this.set((canvas) => ({ previous: { transform: canvas.transform, distance } }))
  }
}
