import { type Output, boolean, number, object } from 'valibot'
import {
  pointSchema,
  type Box,
  type Vec2,
  boxSchema,
  backgroundPattern,
  transformSchema,
  defaultTransform,
  defaultBox,
  Transform
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
  center,
  screenToCanvas,
  getViewport
} from './interaction'
import {
  BACKGROUND_GRID_UNIT,
  DEFAULT_BOUNDS,
  DEFAULT_PATTERN,
  DEFAULT_SNAP_TO_GRID
} from '../constants'
import { getPersistenceName } from '../../app'
import { State, derivedState } from '../../utils'
import { getSpatialCSSVariables } from '../css'

export const canvasStateSchema = object({
  bounds: pointSchema,
  viewport: object({
    screen: boxSchema,
    canvas: boxSchema
  }),
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
  viewport: {
    screen: defaultBox(),
    canvas: defaultBox()
  },
  snapToGrid: DEFAULT_SNAP_TO_GRID,
  grid: BACKGROUND_GRID_UNIT,
  previous: {
    transform: defaultTransform(),
    distance: 0
  },
  loaded: false
})

export class CanvasInteraction extends State<CanvasState> {
  public css = derivedState(this, getSpatialCSSVariables)
  constructor(persist?: string[]) {
    super({
      initial: defaultCanvasState,
      persist:
        persist && persist.length > 0
          ? {
              name: getPersistenceName(persist),
              schema: canvasStateSchema,
              interval: 500
            }
          : undefined
    })
  }

  public setTransform = (transform: Transform) =>
    this.set(({ viewport }) => ({
      transform,
      viewport: {
        screen: viewport.screen,
        canvas: screenToCanvas(this.get(), viewport.screen)
      }
    }))

  public normalise = <T extends Box | Vec2>(point: T) => normalise<T>(this.get(), point)

  public screenToCanvas = <T extends Vec2>(data: T) => canvasToScreen<T>(this.get(), data)

  public canvasToScreen = <T extends Vec2>(data: T, scaled: boolean = true) =>
    canvasToScreen<T>(this.get(), data, scaled)

  public resize = (screen: Box) =>
    this.set(() => ({
      viewport: getViewport(this.get(), screen),
      loaded: true
    }))

  public zoom = (newScale: number) => this.setTransform(zoom(this.get(), newScale))

  public pinch = (newDistance: number) => this.setTransform(pinch(this.get(), newDistance))

  public move = (delta: Vec2) => this.setTransform(move(this.get(), delta))

  public scroll = (point: Vec2, delta: Vec2) => this.setTransform(scroll(this.get(), point, delta))

  public pan = (point: Vec2) => this.setTransform(pan(this.get(), point))

  public getViewCenter = () => getViewCenter(this.get())

  public center = () => this.setTransform(center(this.get()))

  public centerViewAroundBox = (box: Box) => this.setTransform(centerViewAroundBox(this.get(), box))

  public storeState = (distance: number = 0) => {
    this.set((canvas) => ({ previous: { transform: canvas.transform, distance } }))
  }
}
