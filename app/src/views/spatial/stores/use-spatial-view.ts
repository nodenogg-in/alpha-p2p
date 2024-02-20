import { inject, onUnmounted, reactive, readonly, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { DEFAULT_TOOL, interact, Tool, Actions, defaultSelectionState } from 'nodenoggin/spatial'
import type { Transform } from 'nodenoggin/schema'
import { assign, isString } from 'nodenoggin/utils'
import type { MicrocosmAPI } from 'nodenoggin/sync'

import { useApp } from '@/state'
import { useCanvas } from './use-canvas'

// const useCanvasActions = (microcosm: MicrocosmAPI) => {
//   const selectionManager = createSelection(microcosm)

//   const selection = reactive<SelectionState>(selectionManager.initialState())

//   const update = (canvas: CanvasState, pointer: PointerState) =>
//     assign(selection, selectionManager.get(canvas, pointer))

//   const reset = () => assign(selection, selectionManager.initialState())

//   const set = (selection: Selection) => {
//     assign(selection, selection)
//   }

//   return {
//     selection,
//     update,
//     set,
//     reset
//   }
// }

const useActions = (microcosm: MicrocosmAPI) => {
  const actions = new Actions(microcosm)

  const selection = reactive(defaultSelectionState())

  console.log('new actions')
  actions.on('selection', (s) => {
    assign(selection.box, s.box)
    assign(selection.point, s.point)
    selection.target = s.target
    selection.target = s.target
    selection.nodes = s.nodes
  })

  const state = reactive(actions.state)

  actions.on('state', (s) => {
    assign(state, s)
  })

  return {
    update: actions.update,
    reset: actions.reset,
    state,
    selection
  }
}

export const useSpatialView = (microcosm_uri: string, microcosm: MicrocosmAPI) => {
  const name = `view/spatial/${microcosm_uri}`
  return defineStore(name, () => {
    const app = useApp()

    const canvas = useCanvas(`${name}/canvas`)

    const action = ref<boolean>(false)
    const selectedNodes = ref<string[]>([])
    const editingNode = ref<string | null>(null)
    const tool = ref<Tool>(DEFAULT_TOOL)

    const setTool = (newTool?: Tool) => {
      tool.value = newTool || Tool.Select
    }

    const isTool = (...tools: Tool[]): boolean => tools.includes(tool.value)

    // const actions = useCanvasActions(microcosm)

    const actions = useActions(microcosm)

    app.onKeyCommand({
      h: () => {
        if (app.isActiveMicrocosm(microcosm_uri)) {
          setTool(Tool.Move)
        }
      },
      v: () => {
        if (app.isActiveMicrocosm(microcosm_uri)) {
          setTool(Tool.Select)
        }
      },
      n: () => {
        if (app.isActiveMicrocosm(microcosm_uri)) {
          setTool(Tool.New)
        }
      },
      c: () => {
        if (app.isActiveMicrocosm(microcosm_uri)) {
          setTool(Tool.Connect)
        }
      },
      backspace: () => {
        if (app.isActiveMicrocosm(microcosm_uri)) {
          console.log('backspace')
        }
      }
    })

    const setEditing = (node_id?: string | null) => {
      if (isString(node_id)) {
        editingNode.value = node_id
      } else {
        editingNode.value = null
      }
      tool.value = editingNode.value ? Tool.Edit : Tool.Select
    }

    const startAction = (
      e: MouseEvent | TouchEvent,
      { shiftKey, touch = false }: { shiftKey?: boolean; touch?: boolean } = {}
    ) => {
      console.log(`startAction ${touch ? 'touch' : 'mouse'}`)

      const distance = touch ? app.pointer.touchDistance : undefined

      if (isTool(Tool.Select, Tool.Edit)) {
        const isSelection = actions.selection.nodes.length > 0
        if (!isSelection) {
          selectedNodes.value = []
          setEditing(null)
          action.value = true
        } else {
          if (
            selectedNodes.value.length === 1 &&
            actions.selection.target === selectedNodes.value[0]
          ) {
            setEditing(selectedNodes.value[0])
          } else if (
            actions.selection.target &&
            selectedNodes.value.length >= 1 &&
            !selectedNodes.value.includes(actions.selection.target) &&
            shiftKey
          ) {
            selectedNodes.value = [...selectedNodes.value, actions.selection.target as string]
          } else {
            selectedNodes.value = actions.selection.target ? [actions.selection.target] : []
            setEditing(null)
          }
        }
      } else {
        action.value = true
      }
      // pointer.startAction({ pinch: isNumber(distance) })
      canvas.state.previous = interact.getCurrentState(canvas.state)
    }
    // tool: select
    // type:
    const updateAction = () => {
      if (app.pointer.active) {
        // if (pointer.pinching) {
        //   pinch(pointer.touchDistance)
        // } else {
        if (isTool(Tool.Select)) {
          if (action.value) {
            actions.update(canvas.state, app.pointer)
          }
        }
        if (isTool(Tool.Move) && action.value) {
          canvas.move(app.pointer.delta)
        }
        if (isTool(Tool.New) && action.value) {
          actions.update(canvas.state, app.pointer)
        }
      }
    }

    const finishAction = (
      e: MouseEvent | TouchEvent,
      { touch, shiftKey }: { touch?: boolean; shiftKey?: boolean } = {}
    ) => {
      console.log(`startAction ${touch ? 'touch' : 'mouse'}`)
      if (isTool(Tool.Select)) {
        if (actions.selection.nodes.length > 0) {
          selectedNodes.value = [...actions.selection.nodes]
        }
      }
      action.value = false
      actions.reset()
      canvas.state.previous = interact.getCurrentState(canvas.state)
    }

    watch(app.pointer, updateAction)

    onUnmounted(() => {
      console.log('unmounting spatial view')
    })

    return {
      microcosm_uri,
      setTool,
      isTool,
      startAction,
      finishAction,
      selectedNodes,
      editingNode,
      tool,
      selection: readonly(actions.selection),
      active: readonly(action),
      canvas
    }
  })()
}

export type SpatialViewState = {
  transform: Transform
  distance: number
}

export type SpatialView = ReturnType<typeof useSpatialView>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () =>
  inject<SpatialView>(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
