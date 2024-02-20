import {
  interact,
  defaultCanvasState,
  canvasStateSchema,
  type CanvasState
} from 'nodenoggin/spatial'
import type { Box, Vec2, Transform } from 'nodenoggin/schema'
import { assign } from 'nodenoggin/utils'
import { localReactive } from '@/utils/hooks/use-local-storage'

export const useCanvas = (name: string) => {
  const state = localReactive<CanvasState>({
    name: `${name}/state`,
    schema: canvasStateSchema,
    defaultValue: defaultCanvasState(),
    interval: 500
  })

  const normalise = <T extends Box | Vec2>(point: T) => interact.normalise<T>(state, point)

  const screenToCanvas = <T extends Vec2>(data: T) => interact.canvasToScreen<T>(state, data)

  const canvasToScreen = <T extends Vec2>(data: T, scaled: boolean = true) =>
    interact.canvasToScreen<T>(state, data, scaled)

  const setTransform = (newTransform: Transform) => assign(state.transform, newTransform)

  const setContainer = (box: Box) => {
    assign(state.container, box)
    if (!state.loaded) {
      state.loaded = true
    }
  }

  const zoom = (newScale: number) => setTransform(interact.zoom(state, newScale))

  const pinch = (newDistance: number) => setTransform(interact.pinch(state, newDistance))

  const move = (delta: Vec2) => setTransform(interact.move(state, delta))

  const scroll = (point: Vec2, delta: Vec2) => setTransform(interact.scroll(state, point, delta))

  const pan = (point: Vec2) => setTransform(interact.pan(state, point))

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

export type CanvasStore = ReturnType<typeof useCanvas>
