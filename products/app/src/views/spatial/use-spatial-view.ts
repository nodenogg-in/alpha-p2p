import { inject } from 'vue'
import { defineStore } from 'pinia'
import { useDerived, useSubscribable } from '@figureland/statekit/vue'
import { signal } from '@figureland/statekit'
import { type IdentityID, type MicrocosmID } from '@nodenogg.in/microcosm'
import { app } from '@/state'

export const useSpatialView = async (microcosmID: MicrocosmID, view_id: string) => {
  const microcosm = await app.microcosms.register({ microcosmID })
  const canvas = await app.views.register(microcosm, app, view_id)
  return defineStore(`${microcosmID}/${view_id}/spatial`, () => {
    const viewport = useSubscribable(canvas.interaction.viewport)
    const state = useSubscribable(canvas.interaction.state)
    const canvasOptions = useSubscribable(canvas.interaction.options)
    const action = useSubscribable(canvas.action.state)
    const active = useDerived((get) => get(app.session.active) === microcosmID)
    const collections = useSubscribable(microcosm.collections())
    const styles = useSubscribable(canvas.canvasStyles)
    const transform = useSubscribable(canvas.interaction.transform)

    const selectionGroup = useSubscribable(canvas.action.selectionGroup)

    const useCollection = (identityID: IdentityID) => {
      const nodesState = microcosm.collection(identityID)

      const result = signal((get) => {
        const viewport = get(canvas.interaction.viewport)
        return get(nodesState)
        // .filter((n) => isNodeReferenceType(n, 'html'))
        // .filter((b) => intersectBoxWithBox((b as NodeReference<'html'>)[1], viewport.canvas))
      })

      microcosm.state.use(result.dispose)
      return useSubscribable(result)
    }

    const options = useSubscribable(canvas.options)

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
      options,
      viewport,
      view_id,
      state,
      microcosmID,
      toolbar,
      active,
      interaction: canvas.interaction,
      actions: canvas.action,
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
      useCollection,
      transform,
      canvasOptions
    }
  })()
}
export type SpatialView = Awaited<ReturnType<typeof useSpatialView>>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () => inject(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
