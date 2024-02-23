import { object } from 'valibot'
import type { Box, Vec2 } from '../schema'
import { defaultCanvasState, type CanvasState, canvasStateSchema } from './state'
import { State } from '../utils'
import {
  canvasToScreen,
  getViewCenter,
  move,
  normalise,
  pan,
  pinch,
  scroll,
  zoom,
  centerViewAroundBox
} from './interaction'
import { getPersistenceName } from '../app/UI'

export class CanvasInteraction extends State<{
  canvas: CanvasState
}> {
  constructor() {
    super({
      initial: () => ({
        canvas: defaultCanvasState()
      }),
      persist: {
        name: getPersistenceName('app', 'canvas'),
        schema: object({
          canvas: canvasStateSchema
        }),
        interval: 500
      }
    })
  }
  public normalise = <T extends Box | Vec2>(point: T) => normalise<T>(this.get('canvas'), point)

  public screenToCanvas = <T extends Vec2>(data: T) => canvasToScreen<T>(this.get('canvas'), data)

  public canvasToScreen = <T extends Vec2>(data: T, scaled: boolean = true) =>
    canvasToScreen<T>(this.get('canvas'), data, scaled)

  public setContainer = (box: Box) => this.set('canvas', { container: box, loaded: true })

  public zoom = (newScale: number) =>
    this.set('canvas', { transform: zoom(this.get('canvas'), newScale) })

  public pinch = (newDistance: number) =>
    this.set('canvas', { transform: pinch(this.get('canvas'), newDistance) })

  public move = (delta: Vec2) => this.set('canvas', { transform: move(this.get('canvas'), delta) })

  public scroll = (point: Vec2, delta: Vec2) =>
    this.set('canvas', { transform: scroll(this.get('canvas'), point, delta) })

  public pan = (point: Vec2) => this.set('canvas', { transform: pan(this.state.canvas, point) })

  public getViewCenter = () => getViewCenter(this.get('canvas'))

  public centerViewAroundBox = (box: Box) =>
    this.set('canvas', { transform: centerViewAroundBox(this.get('canvas'), box) })

  public storeState = (distance: number = 0) => {
    this.set('canvas', { previous: { transform: this.get('canvas').transform, distance } })
  }
}
