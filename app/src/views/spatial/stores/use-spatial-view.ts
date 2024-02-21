import { inject, onMounted, onUnmounted, readonly, watch } from 'vue'
import { defineStore } from 'pinia'

import {
  Tool,
  CanvasActions,
  CanvasInteraction,
  defaultCanvasState,
  MINIMUM_NODE_SIZE
} from 'nodenoggin/spatial'
import type { Transform } from 'nodenoggin/schema'
import type { EditableMicrocosmAPI } from 'nodenoggin/sync'
import { App } from 'nodenoggin/ui'

import { useApp } from '@/state'
import { useState } from '@/utils/hooks/use-state'

export const useSpatialView = (microcosm_uri: string, microcosm: EditableMicrocosmAPI) => {
  const name = `view/spatial/${microcosm_uri}`
  return defineStore(name, () => {
    const app = useApp()

    const canvas = new CanvasInteraction(() => ({ canvas: defaultCanvasState() }))
    const state = useState(canvas, 'canvas')

    const actions = new CanvasActions(microcosm)
    const selection = useState(actions, 'selection')
    const action = useState(actions, 'action')

    App.onKeyCommand({
      h: () => {
        if (app.isActiveMicrocosm(microcosm_uri)) {
          actions.setTool(Tool.Move)
        }
      },
      v: () => {
        if (app.isActiveMicrocosm(microcosm_uri)) {
          actions.setTool(Tool.Select)
        }
      },
      n: () => {
        if (app.isActiveMicrocosm(microcosm_uri)) {
          actions.setTool(Tool.New)
        }
      },
      c: () => {
        if (app.isActiveMicrocosm(microcosm_uri)) {
          actions.setTool(Tool.Connect)
        }
      },
      backspace: () => {
        if (app.isActiveMicrocosm(microcosm_uri)) {
          console.log('backspace')
        }
      },
      space: () => {
        if (app.isActiveMicrocosm(microcosm_uri)) {
          actions.setTool(Tool.Move)
        }
      }
    })

    const startAction = () => {
      actions.start(canvas, app.pointer)
      canvas.storeState()
    }
    // tool: select
    // type:
    const updateAction = () => {
      actions.update(canvas, app.pointer)
    }

    const finishAction = () => {
      if (action.tool === Tool.New) {
        const node = canvas.screenToCanvas(selection.box)
        if (node.width > MINIMUM_NODE_SIZE.width && node.height > MINIMUM_NODE_SIZE.height) {
          microcosm.create({
            type: 'html',
            content: '',
            ...node
          })
        }
      }

      actions.finish(canvas, app.pointer)
      canvas.storeState()
    }

    watch(app.pointer, updateAction)

    onMounted(() => {
      console.log('mounted spatial view')
    })

    onUnmounted(() => {
      console.log('unmounting spatial view')
    })

    return {
      actions,
      canvas,
      state,
      microcosm_uri,
      startAction,
      finishAction,
      selection: readonly(selection),
      action: readonly(action)
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
