import { inject, readonly } from 'vue'
import { defineStore } from 'pinia'

import { api, app } from '@/state/instance'
import { useDerived, useState } from '@/hooks/use-state'

export const useSpatialView = (microcosm_uri: string, id: string) =>
  defineStore(`${id}/spatial`, () => {
    const microcosm = api.register({ microcosm_uri })
    const canvas = microcosm.getCanvas(id)

    const viewport = useState(canvas.interaction.viewport)
    const state = useState(canvas.interaction)
    const action = useState(canvas.action)
    const selection = useState(canvas.selection)
    const highlight = useState(canvas.highlight)
    const active = useDerived(app, ({ active }) => active === microcosm_uri)
    const tools = canvas.toolbar()
    const {
      onPointerDown,
      onPointerUp,
      onPointerOut,
      onPointerOver,
      onWheel,
      onFocus,
      onDropFiles
    } = canvas
    const { resize, zoom } = canvas.interaction


    const cssVariables = useState(canvas.interaction.css)
    const selectionGroup = useState(canvas.selectionGroup)

    return {
      id,
      state,
      microcosm_uri,
      tools,
      active,
      selectionGroup,
      onPointerDown,
      onPointerUp,
      onPointerOut,
      onPointerOver,
      onWheel,
      onFocus,
      resize,
      onDropFiles,
      zoom,
      cssVariables,
      selection: readonly(selection),
      highlight: readonly(highlight),
      action: readonly(action)
    }
  })()

export type SpatialView = ReturnType<typeof useSpatialView>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () => inject(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
