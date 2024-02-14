import { reactive, ref } from 'vue'
import { defineStore } from 'pinia'
import {
  defaultBox,
  defaultPoint,
  getSelectionBox,
  interact,
  type Box,
  type Point,
  type CanvasState
} from 'nodenoggin-core/canvas'
import type { MicrocosmStore, PointerState } from '@/state'

export const useSelection = (name: string, canvas: CanvasState, microcosm: MicrocosmStore) => {
  return defineStore(name, () => {
    const box = reactive(defaultBox())
    const point = reactive<Point>(defaultPoint())
    const nodes = ref<string[]>([])
    const group = ref<Box>(defaultBox())
    const target = ref<string | null>(null)

    const reset = () => {
      point.x = 0
      point.y = 0
      box.x = 0
      box.y = 0
      box.height = 0
      box.width = 0
    }

    const set = ({ point: pt, origin, delta }: PointerState) => {
      point.x = pt.x
      point.y = pt.y
      const newBox = getSelectionBox(origin, delta)
      box.x = newBox.x
      box.y = newBox.y
      box.width = newBox.width
      box.height = newBox.height

      const selected = microcosm.select(
        interact.screenToCanvas(canvas, point),
        interact.screenToCanvas(canvas, box)
      )

      nodes.value = selected.nodes
      group.value = selected.group
      target.value = selected.target
    }

    return {
      box,
      point,
      nodes,
      group,
      target,
      reset,
      set
    }
  })()
}
