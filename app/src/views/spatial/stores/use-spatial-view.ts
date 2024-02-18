import { inject, onUnmounted, readonly, ref, watch } from 'vue'
import { defineStore } from 'pinia'

import { DEFAULT_TOOL, interact, Tool, type Transform } from 'nodenoggin-core/views/canvas'
import { isString } from 'nodenoggin-core/utils'

import { useApp, usePointer, type MicrocosmStore } from '@/state'
import { useCanvas } from './use-canvas'
import { useSelection } from './use-selection'

export const useSpatialView = (microcosm_uri: string, microcosm: MicrocosmStore) => {
  const name = `view/spatial/${microcosm_uri}`
  return defineStore(name, () => {
    const pointer = usePointer()
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

    const selection = useSelection(`${name}/selection`, canvas.state, microcosm)

    // const selection = useSelection(name, canvas, microcosm)

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

      const distance = touch ? pointer.touchDistance : undefined

      if (isTool(Tool.Select, Tool.Edit)) {
        const isSelection = selection.nodes.length > 0
        if (!isSelection) {
          selectedNodes.value = []
          setEditing(null)
          action.value = true
        } else {
          if (selectedNodes.value.length === 1 && selection.target === selectedNodes.value[0]) {
            setEditing(selectedNodes.value[0])
          } else if (
            selectedNodes.value.length >= 1 &&
            !selectedNodes.value.includes(selection.target as string) &&
            shiftKey
          ) {
            selectedNodes.value = [...selectedNodes.value, selection.target as string]
          } else {
            selectedNodes.value = selection.target ? [selection.target] : []
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
      if (pointer.active) {
        // if (pointer.pinching) {
        //   pinch(pointer.touchDistance)
        // } else {
        if (isTool(Tool.Select)) {
          if (action.value) {
            selection.set(pointer)
          }
        }
        if (isTool(Tool.Move) && action.value) {
          canvas.move(pointer.delta)
        }
        if (isTool(Tool.New) && action.value) {
          selection.set(pointer)
        }
      }
    }

    const finishAction = (
      e: MouseEvent | TouchEvent,
      { touch, shiftKey }: { touch?: boolean; shiftKey?: boolean } = {}
    ) => {
      console.log(`startAction ${touch ? 'touch' : 'mouse'}`)
      if (isTool(Tool.Select)) {
        if (selection.nodes.length > 0) {
          selectedNodes.value = [...selection.nodes]
        }
      }
      action.value = false
      selection.reset()
      canvas.state.previous = interact.getCurrentState(canvas.state)
    }

    watch(pointer.point, updateAction)

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
      selection: readonly(selection),
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
