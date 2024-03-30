import { inject } from 'vue'
import { defineStore } from 'pinia'
import { intersectBoxWithBox } from '@nodenogg.in/spacekit'
import { useDerived, useSignal, useState } from '@nodenogg.in/statekit/vue'
import { signal } from '@nodenogg.in/statekit'
import {
  isNodeReferenceType,
  type IdentityID,
  type NodeReference,
  type MicrocosmID
} from '@nodenogg.in/microcosm'
import { microcosms, session, views } from '@/state'

export const useSpatialView = async (microcosmID: MicrocosmID, id: string) => {
  const microcosm = await microcosms.register({ microcosmID })
  const canvas = await views.register('spatial', microcosm, id)

  return defineStore(`${id}/spatial`, () => {
    const viewport = useSignal(canvas.interaction.viewport)
    const state = useState(canvas.interaction)
    const action = useState(canvas.action)
    const active = useDerived(() => session.get().active === microcosmID)
    const collections = useState(microcosm, 'collections')

    const styles = useSignal(canvas.styles)

    const selectionGroup = useSignal(canvas.action.selectionGroup)

    const useCollection = (identityID: IdentityID) => {
      const nodesState = microcosm.subscribeToCollection(identityID)

      const result = signal(() => {
        const viewport = canvas.interaction.viewport.get()
        return nodesState
          .get()
          .filter((n) => isNodeReferenceType(n, 'html'))
          .filter((b) => intersectBoxWithBox((b as NodeReference<'html'>)[1], viewport.canvas))
      })

      microcosm.use(result.dispose)
      return useSignal(result)
    }
    const {
      onPointerDown,
      onPointerUp,
      onPointerOut,
      onPointerOver,
      onWheel,
      onFocus,
      setTool,
      isTool,
      toolbar
    } = canvas

    const { zoom, resize } = canvas.interaction
    return {
      viewport,
      id,
      state,
      microcosmID,
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
      isTool,
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
