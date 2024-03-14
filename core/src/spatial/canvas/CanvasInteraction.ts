import { type Output, boolean, number, object } from 'valibot'
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
  defaultBox
} from '../../schema'
import {
  canvasToScreen,
  move,
  pan,
  pinch,
  scroll,
  zoom,
  centerViewAroundBox,
  center,
  screenToCanvas,
  getSelectionBox,
  relativeToContainer
} from './interaction'
import {
  BACKGROUND_GRID_UNIT,
  DEFAULT_BOUNDS,
  DEFAULT_CARD_OUTLINE,
  DEFAULT_PATTERN,
  DEFAULT_SNAP_TO_GRID,
  MAX_ZOOM,
  MIN_ZOOM,
  ZOOM_INCREMENT
} from '../constants'
import { State, deriveState } from '../../utils'
import { getCanvasPoint, getCanvasSelection } from './intersection'
import type { PointerState } from '../../app'
import type { CanvasActionsState } from './CanvasActions'

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

export class CanvasInteraction extends State<CanvasInteractionState> {
  public viewport: State<CanvasScreen<Box>>

  constructor(persist?: string[]) {
    super({
      initial: defaultCanvasInteractionState,
      persist:
        persist && persist.length > 0
          ? {
              name: persist,
              schema: canvasStateSchema,
              interval: 500
            }
          : undefined,
      throttle: 8
    })

    this.viewport = deriveState([this], ([state]) => ({
      screen: state.viewport,
      canvas: screenToCanvas(state, state.viewport)
    }))

    this.onDispose(() => {
      this.viewport.dispose()
    })
  }

  public getSelection = (
    { point, box }: CanvasActionsState['highlight'],
    boxes: BoxReference[] = [],
    padding: number = 0
  ): CanvasActionsState['selection'] => ({
    target: getCanvasPoint(boxes, point.canvas, padding),
    nodes: getCanvasSelection(boxes, box.canvas, padding)
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

  public relativeToContainer = <T extends Box | Vec2>(point: T) =>
    relativeToContainer<T>(this.get(), point)

  public screenToCanvas = <T extends Vec2>(data: T) => screenToCanvas<T>(this.get(), data)

  public canvasToScreen = <T extends Vec2>(data: T, scaled: boolean = true) =>
    canvasToScreen<T>(this.get(), data, scaled)

  public resize = (viewport: Box) =>
    this.set(() => ({
      viewport,
      loaded: true
    }))

  public zoom = (newScale: number) => this.setKey('transform', zoom(this.get(), newScale))

  public pinch = (newDistance: number) => this.setKey('transform', pinch(this.get(), newDistance))

  public move = (delta: Vec2) => this.setKey('transform', move(this.get(), delta))

  public scroll = (point: Vec2, delta: Vec2) =>
    this.setKey('transform', scroll(this.get(), point, delta))

  public pan = (point: Vec2) => this.setKey('transform', pan(this.get(), point))

  public center = () => this.setKey('transform', center(this.get()))

  public centerViewAroundBox = (box: Box) =>
    this.setKey('transform', centerViewAroundBox(this.get(), box))

  public storeState = (distance: number = 0) => {
    this.set((canvas) => ({ previous: { transform: canvas.transform, distance } }))
  }
}
