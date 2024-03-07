import { inject } from 'vue'
import { defineStore } from 'pinia'

import { api, session } from '@/state/instance'
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
    const active = useDerived([session], ([{ active }]) => active === microcosm_uri)
    const collections = useState(microcosm.api, 'collections')

    const {
      onPointerDown,
      onPointerUp,
      onPointerOut,
      onPointerOver,
      onWheel,
      onFocus,
      onDropFiles,
      setTool,
      toolbar
    } = canvas

    const { resize, zoom } = canvas.interaction
    const styles = useState(canvas.styles)

    const selectionGroup = useState(canvas.selectionGroup)

    const useCollection = (user_id: string) =>
      useState(microcosm.subscribeToCollection(canvas, user_id))

    return {
      viewport,
      id,
      state,
      microcosm_uri,
      toolbar,
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
      setTool,
      styles,
      collections,
      selection,
      highlight,
      action,
      useCollection
    }
  })()

export type SpatialView = ReturnType<typeof useSpatialView>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () => inject(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
