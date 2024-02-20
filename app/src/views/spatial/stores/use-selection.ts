import { reactive } from 'vue'
import { defineStore } from 'pinia'
import { type CanvasState, createSelection } from 'nodenoggin/spatial'
import type { MicrocosmAPI, PointerState, SelectionState } from 'nodenoggin'
import { assign } from 'nodenoggin/utils'

export const useSelection = (name: string, microcosm: MicrocosmAPI) => {
  return defineStore(name, () => {
    const selection = createSelection(microcosm)

    const state = reactive<SelectionState>(selection.initialState())

    const update = (canvas: CanvasState, pointer: PointerState) =>
      assign(state, selection.get(canvas, pointer))

    const reset = () => assign(state, selection.initialState())

    return {
      state,
      update,
      reset
    }
  })()
}
