import { inject } from 'vue'
import { defineStore } from 'pinia'

import { api, session } from '@/state'
import { useDerivedSignal, useSignal, useState } from '@/hooks/use-state'
import { intersectBoxWithBox } from '@nodenogg.in/spatial-view'
import { deriveSignal } from '@nodenogg.in/state'
import { isNodeReferenceType, type NodeReference } from '@nodenogg.in/schema'

export const useSpatialView = (microcosm_uri: string, id: string) =>
  defineStore(`${id}/spatial`, () => {
    const microcosm = api.registerMicrocosm({ microcosm_uri })
    const canvas = microcosm.getCanvas(id)

    const viewport = useState(canvas.interaction.viewport)
    const state = useState(canvas.interaction)
    const action = useState(canvas.action)
    const active = useDerivedSignal([session], ([s]) => s.active === microcosm_uri)
    const collections = useState(microcosm, 'collections')

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

    const selectionGroup = useState(canvas.action.selectionGroup)

    const useCollection = (user_id: string) => {
      const nodesState = microcosm.subscribeToCollection(user_id)

      const signal = deriveSignal(
        [canvas.interaction.viewport, nodesState],
        ([viewport, { nodes }]) =>
          nodes
            .filter((n) => isNodeReferenceType(n, 'html'))
            .filter((b) => intersectBoxWithBox((b as NodeReference<'html'>)[1], viewport.canvas))
      )

      microcosm.onDispose(signal.dispose)
      return useSignal(signal)
    }

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
      action,
      useCollection
    }
  })()

export type SpatialView = ReturnType<typeof useSpatialView>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () => inject(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
