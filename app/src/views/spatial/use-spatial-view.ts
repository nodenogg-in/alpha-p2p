import { inject, readonly, watch } from 'vue'
import { defineStore } from 'pinia'

import { Tool } from 'nodenoggin/spatial'
import { useApp } from '@/state'
import { ui } from '@/state/instance'
import { useState } from '@/hooks/use-state'

export const useSpatialView = (microcosm_uri: string) => {
  const name = `view/spatial/${microcosm_uri}`
  return defineStore(name, () => {
    const app = useApp()
    const microcosm = app.getMicrocosm(microcosm_uri)

    const state = useState(microcosm.canvas, 'canvas')
    const selection = useState(microcosm.actions, 'selection')
    const action = useState(microcosm.actions, 'action')

    ui.keyboard.onCommand({
      h: () => {
        if (app.isActive(microcosm_uri)) {
          microcosm.actions.setTool(Tool.Move)
        }
      },
      v: () => {
        if (app.isActive(microcosm_uri)) {
          microcosm.actions.setTool(Tool.Select)
        }
      },
      n: () => {
        if (app.isActive(microcosm_uri)) {
          microcosm.actions.setTool(Tool.New)
        }
      },
      c: () => {
        if (app.isActive(microcosm_uri)) {
          microcosm.actions.setTool(Tool.Connect)
        }
      },
      backspace: () => {
        if (app.isActive(microcosm_uri)) {
          console.log('backspace')
        }
      },
      space: () => {
        if (app.isActive(microcosm_uri)) {
          microcosm.actions.setTool(Tool.Move)
        }
      }
    })

    const startAction = () => {
      microcosm.actions.start(app.pointer)
    }

    const updateAction = () => {
      microcosm.actions.update(app.pointer)
    }

    const finishAction = () => {
      microcosm.actions.finish(app.pointer)
    }

    watch(app.pointer, updateAction)

    return {
      actions: microcosm.actions,
      canvas: microcosm.canvas,
      state,
      microcosm_uri,
      startAction,
      finishAction,
      selection: readonly(selection),
      action: readonly(action)
    }
  })()
}

export type SpatialView = ReturnType<typeof useSpatialView>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () => inject(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
