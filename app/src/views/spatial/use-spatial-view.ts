import { inject, readonly, watch } from 'vue'

import { EditableSpatialView, Tool } from 'nodenoggin/spatial'
import { useApp } from '@/state'
import { microcosms, ui } from '@/state/instance'
import { useState } from '@/hooks/use-state'
import { createUuid } from 'nodenoggin'

export const useSpatialView = (microcosm_uri: string) => {
  const app = useApp()
  const id = createUuid()

  const microcosm = microcosms.register({ microcosm_uri })
  const view = new EditableSpatialView(microcosm)

  const state = useState(view.canvas, 'canvas')
  const selection = useState(view.actions, 'selection')
  const action = useState(view.actions, 'action')

  ui.keyboard.onCommand({
    h: () => {
      if (app.isActive(microcosm_uri)) {
        view.actions.setTool(Tool.Move)
      }
    },
    v: () => {
      if (app.isActive(microcosm_uri)) {
        view.actions.setTool(Tool.Select)
      }
    },
    n: () => {
      if (app.isActive(microcosm_uri)) {
        view.actions.setTool(Tool.New)
      }
    },
    c: () => {
      if (app.isActive(microcosm_uri)) {
        view.actions.setTool(Tool.Connect)
      }
    },
    backspace: () => {
      if (app.isActive(microcosm_uri)) {
        console.log('backspace')
      }
    },
    space: () => {
      if (app.isActive(microcosm_uri)) {
        view.actions.setTool(Tool.Move)
      }
    }
  })

  watch(app.pointer, () => {
    if (app.isActive(microcosm_uri)) {
      view.actions.update(app.pointer)
    }
  })

  const onPointerDown = () => {
    view.actions.start(app.pointer)
  }

  const onPointerUp = () => {
    view.actions.finish(app.pointer)
  }
  return {
    id,
    canvas: view.canvas,
    actions: view.actions,
    state,
    microcosm_uri,
    onPointerDown,
    onPointerUp,
    selection: readonly(selection),
    action: readonly(action)
  }
}

export type SpatialView = ReturnType<typeof useSpatialView>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () => inject(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
