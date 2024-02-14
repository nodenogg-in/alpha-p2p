import { localReactive } from '@/utils/hooks/use-local-storage'
import {
  interact,
  type Box,
  type Point,
  defaultCanvasState,
  canvasStateSchema,
  type Transform,
  type CanvasState
} from 'nodenoggin-core'

export const useCanvas = (name: string) => {
  const state = localReactive<CanvasState>({
    name: `$${name}/canvas`,
    schema: canvasStateSchema,
    defaultValue: defaultCanvasState(),
    interval: 500
  })

  const normalise = <T extends Box | Point>(point: T) => interact.normalise<T>(state, point)

  const screenToCanvas = <T extends Point>(data: T) => interact.canvasToScreen<T>(state, data)

  const canvasToScreen = <T extends Point>(data: T, scaled: boolean = true) =>
    interact.canvasToScreen<T>(state, data, scaled)

  const setTransform = (newTransform: Transform) => {
    state.transform.translate.x = newTransform.translate.x
    state.transform.translate.y = newTransform.translate.y
    state.transform.scale = newTransform.scale
  }

  const setContainer = ({ x, y, width, height }: Box) => {
    state.container.x = x
    state.container.y = y
    state.container.width = width
    state.container.height = height

    if (!state.loaded) {
      state.loaded = true
    }
  }

  const zoom = (newScale: number) => setTransform(interact.zoom(state, newScale))

  const pinch = (newDistance: number) => setTransform(interact.pinch(state, newDistance))

  const move = (delta: Point) => setTransform(interact.move(state, delta))

  const scroll = (point: Point, delta: Point) => setTransform(interact.scroll(state, point, delta))

  const pan = (point: Point) => setTransform(interact.pan(state, point))

  const getViewCenter = () => interact.getViewCenter(state)

  return {
    state,
    normalise,
    screenToCanvas,
    canvasToScreen,
    setContainer,
    pan,
    zoom,
    pinch,
    move,
    scroll,
    getViewCenter
  }
}
