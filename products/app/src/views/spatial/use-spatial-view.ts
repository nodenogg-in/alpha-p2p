import { inject } from 'vue'
import { defineStore } from 'pinia'
import { useSubscribable } from '@figureland/statekit/vue'
import { app, useCurrentMicrocosm } from '@/state'

export const useSpatialView = async (view_id: string) => {
  const microcosm = useCurrentMicrocosm()
  const view = await app.views.register(microcosm.api(), app, view_id)

  return defineStore(`${microcosm.microcosmID}/${view_id}/spatial`, () => {
    const { canvas, interaction, actions, cssVariables } = view
    const state = useSubscribable(canvas.state)
    const canvasOptions = useSubscribable(canvas.options)
    const actionState = useSubscribable(actions.state)

    return {
      view_id,
      state,
      toolbar,
      interaction,
      actions,
      cssVariables,
      canvas,
      transform: useSubscribable(canvas.transform),
      actionState,
      canvasOptions
    }
  })()
}
export type SpatialView = Awaited<ReturnType<typeof useSpatialView>>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () => inject(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
