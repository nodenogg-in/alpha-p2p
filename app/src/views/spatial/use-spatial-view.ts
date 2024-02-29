import { inject, readonly } from 'vue'
import { defineStore } from 'pinia'

import { api, ui } from '@/state/instance'
import { useDerived, useState } from '@/hooks/use-state'

export const useSpatialView = (microcosm_uri: string, id: string) =>
  defineStore(`${id}/spatial`, () => {
    const microcosm = api.register({ microcosm_uri })
    const canvas = microcosm.getEditableView(id)

    const state = useState(canvas.interaction)
    const action = useState(canvas.action)
    const selection = useState(canvas.selection)
    const active = useDerived(api, ({ active }) => active === microcosm_uri)
    const tools = canvas.toolbar()

    ui.keyboard.onCommand({
      h: () => {
        if (api.isActive(microcosm_uri)) {
          canvas.setTool('move')
        }
      },
      v: () => {
        if (api.isActive(microcosm_uri)) {
          canvas.setTool('select')
        }
      },
      n: () => {
        if (api.isActive(microcosm_uri)) {
          canvas.setTool('new')
        }
      },
      c: () => {
        if (api.isActive(microcosm_uri)) {
          canvas.setTool('connect')
        }
      },
      backspace: () => {
        if (api.isActive(microcosm_uri)) {
          console.log('backspace')
        }
      },
      space: () => {
        if (api.isActive(microcosm_uri)) {
          canvas.setTool('move')
        }
      }
    })

    return {
      id,
      state,
      microcosm_uri,
      tools,
      active,
      canvas: () => canvas,
      interaction: () => canvas.interaction,
      selection: readonly(selection),
      action: readonly(action)
    }
  })()

export type SpatialView = ReturnType<typeof useSpatialView>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () => inject(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
