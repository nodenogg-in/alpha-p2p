import { inject, readonly } from 'vue'
import { defineStore } from 'pinia'

import { Tool } from 'nodenoggin/spatial'
import { useApp } from '@/state'
import { microcosms, ui } from '@/state/instance'
import { useState } from '@/hooks/use-state'

export const useSpatialView = (microcosm_uri: string) => {
  const name = `view/spatial/${microcosm_uri}`
  return defineStore(name, () => {
    const app = useApp()
    const microcosm = microcosms.register({ microcosm_uri })

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

    const pointer = useState(ui.window, 'pointer', (pointer) => {
      if (app.isActive(microcosm_uri)) {
        microcosm.actions.update(pointer)
      }
    })

    const onPointerDown = () => {
      microcosm.actions.start(pointer)
    }

    const onPointerUp = () => {
      microcosm.actions.finish(pointer)
    }

    const onWheel = (e: WheelEvent) => {
      const point = {
        x: e.clientX,
        y: e.clientY
      }

      const delta = {
        x: e.deltaX,
        y: e.deltaY
      }

      if (action.tool !== Tool.Move && delta.y % 1 === 0) {
        microcosm.canvas.pan(delta)
      } else {
        microcosm.canvas.scroll(point, delta)
      }
    }

    const onFocus = (event: FocusEvent) => {
      const target = event.target as HTMLElement
      if (target && target.getAttribute('tabindex') === '0' && target.dataset.node_id) {
        event.preventDefault()
        target.focus({ preventScroll: true })
        const { node_id } = target.dataset
        console.log(node_id)
      }
    }

    return {
      canvas: microcosm.canvas,
      actions: microcosm.actions,
      pointer,
      state,
      microcosm_uri,
      onPointerDown,
      onPointerUp,
      onFocus,
      onWheel,
      selection: readonly(selection),
      action: readonly(action)
    }
  })()
}

export type SpatialView = ReturnType<typeof useSpatialView>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () => inject(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
