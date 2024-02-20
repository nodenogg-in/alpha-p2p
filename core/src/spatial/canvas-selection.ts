import { type MicrocosmAPI } from '../sync'
import { SelectionState, defaultSelectionState } from './actions'
import { getSelectionBox, interact } from './interaction'
import { PointerState } from '../ui/Pointer'
import type { CanvasState } from './state'

type CreateSelection = {
  intersect: MicrocosmAPI['intersect']
}

export const createSelection = ({ intersect }: CreateSelection) => {
  const initialState = (): SelectionState => defaultSelectionState()

  const get = (canvas: CanvasState, { point, origin, delta }: PointerState): SelectionState => {
    const box = getSelectionBox(origin, delta)

    const selection = intersect(
      interact.screenToCanvas(canvas, point),
      interact.screenToCanvas(canvas, box)
    )

    return {
      box,
      point,
      ...selection
    }
  }
  return {
    get,
    initialState
  }
}
