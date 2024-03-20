import { inject } from 'vue'
import { defineStore } from 'pinia'
import { intersectBoxWithBox } from '@nodenogg.in/spatialkit'
import { useDerived, useSignal, useState } from '@nodenogg.in/state/vue'
import { derive } from '@nodenogg.in/state'
import { isNodeReferenceType, type NodeReference } from '@nodenogg.in/schema'

import { microcosms, session, views } from '@/state'

export const useSpatialView = async (microcosm_uri: string, id: string) => {
  const microcosm = await microcosms.register({ microcosm_uri })
  const canvas = await views.register('spatial', microcosm, id)

  return defineStore(`${id}/spatial`, () => {
    const viewport = useSignal(canvas.interaction.viewport)
    const state = useState(canvas.interaction)
    const action = useState(canvas.action)
    const active = useDerived([session], ([s]) => s.active === microcosm_uri)
    const collections = useState(microcosm, 'collections')

    const styles = useSignal(canvas.styles)

    const selectionGroup = useSignal(canvas.action.selectionGroup)

    const useCollection = (user_id: string) => {
      const nodesState = microcosm.subscribeToCollection(user_id)

      const signal = derive([canvas.interaction.viewport, nodesState], ([viewport, nodes]) =>
        nodes
          .filter((n) => isNodeReferenceType(n, 'html'))
          .filter((b) => intersectBoxWithBox((b as NodeReference<'html'>)[1], viewport.canvas))
      )

      microcosm.use(signal.dispose)
      return useSignal(signal)
    }
    const {
      onPointerDown,
      onPointerUp,
      onPointerOut,
      onPointerOver,
      onWheel,
      onFocus,
      setTool,
      toolbar
    } = canvas

    const { zoom, resize } = canvas.interaction
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
      zoom,
      setTool,
      styles,
      collections,
      action,
      useCollection
    }
  })()
}
export type SpatialView = Awaited<ReturnType<typeof useSpatialView>>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () => inject(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
