import { inject } from 'vue'
import { defineStore } from 'pinia'
import { useDerived, useSubscribable, useState } from '@figureland/statekit/vue'
import { signal } from '@figureland/statekit'
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

  return defineStore(`${microcosmID}/${id}/spatial`, () => {
    const viewport = useSubscribable(canvas.interaction.viewport)
    const state = useSubscribable(canvas.interaction)
    const action = useSubscribable(canvas.action)
    const active = useDerived((get) => get(session).active === microcosmID)
    const collections = useSubscribable(microcosm.key('collections'))
    const styles = useSubscribable(canvas.canvasStyles)
    const transform = useSubscribable(canvas.interaction.transform)

    const selectionGroup = useSubscribable(canvas.action.selectionGroup)

    const useCollection = (identityID: IdentityID) => {
      const nodesState = microcosm.subscribeToCollection(identityID)

      const result = signal((get) => {
        const viewport = get(canvas.interaction.viewport)
        return get(nodesState)
        // .filter((n) => isNodeReferenceType(n, 'html'))
        // .filter((b) => intersectBoxWithBox((b as NodeReference<'html'>)[1], viewport.canvas))
      })

      microcosm.use(result.dispose)
      return useSubscribable(result)
    }

    const {
      // onPointerDown,
      // onPointerUp,
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
      interaction: canvas.interaction,
      actions: canvas.action,
      selectionGroup,
      onPointerDown: () => {},
      onPointerUp: () => {},
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
      useCollection,
      transform
    }
  })()
}
export type SpatialView = Awaited<ReturnType<typeof useSpatialView>>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () => inject(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
