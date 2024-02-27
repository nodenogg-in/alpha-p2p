import { inject, readonly } from 'vue'
import { defineStore } from 'pinia'

import { Tool } from 'nodenoggin/spatial'
import { api, ui } from '@/state/instance'
import { useDerivedRef, useState } from '@/hooks/use-state'

export const useSpatialView = (microcosm_uri: string, id: string) =>
  defineStore(`${id}/spatial`, () => {
    const microcosm = api.register({ microcosm_uri })
    const canvas = microcosm.createSpatialView(id)

    const state = useState(canvas.interaction)
    const action = useState(canvas.action)
    const selection = useState(canvas.selection)
    const active = useDerivedRef(api, (data) => data.active === microcosm_uri)

    ui.window.onKey('pointer', (pointer) => {
      if (active.value) {
        canvas.update(pointer)
      }
    })
    // useState(ui.window, ({ pointer }) => {
    //   if (active.value) {
    //     canvas.update(pointer)
    //   }
    // })

    const onPointerUp = () => {
      canvas.start(ui.window.getKey('pointer'))
    }

    const onPointerDown = () => {
      if (active.value) {
        canvas.finish(ui.window.getKey('pointer'))
      }
    }

    const onPointerOver = () => {
      console.log('over')
    }
    const onPointerOut = () => {
      console.log('out')
    }

    const onWheel = (e: WheelEvent) => {
      canvas.onWheel(e)
    }

    ui.keyboard.onCommand({
      h: () => {
        if (api.isActive(microcosm_uri)) {
          canvas.setTool(Tool.Move)
        }
      },
      v: () => {
        if (api.isActive(microcosm_uri)) {
          canvas.setTool(Tool.Select)
        }
      },
      n: () => {
        if (api.isActive(microcosm_uri)) {
          canvas.setTool(Tool.New)
        }
      },
      c: () => {
        if (api.isActive(microcosm_uri)) {
          canvas.setTool(Tool.Connect)
        }
      },
      backspace: () => {
        if (api.isActive(microcosm_uri)) {
          console.log('backspace')
        }
      },
      space: () => {
        if (api.isActive(microcosm_uri)) {
          canvas.setTool(Tool.Move)
        }
      }
    })

    return {
      id,
      state,
      microcosm_uri,
      onPointerOver,
      onPointerUp,
      onPointerDown,
      onPointerOut,
      onWheel,
      canvas: () => canvas,
      interaction: () => canvas.interaction,
      selection: readonly(selection),
      action: readonly(action)
    }
  })()

export type SpatialView = ReturnType<typeof useSpatialView>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () => inject(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
