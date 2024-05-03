import { inject } from 'vue'
import { defineStore } from 'pinia'
import { useDerived, useSubscribable } from '@figureland/statekit/vue'
import { type MicrocosmID } from '@nodenogg.in/microcosm'
import { app } from '@/state'

export const useSpatialView = async (microcosmID: MicrocosmID, view_id: string) => {
  const microcosm = await app.microcosms.register({ microcosmID })
  const view = await app.views.register(microcosm, app, view_id)

  return defineStore(`${microcosmID}/${view_id}/spatial`, () => {
    const { canvas, interaction, actions, styles, options } = view
    const viewport = useSubscribable(canvas.viewport)
    const state = useSubscribable(canvas.state)
    const canvasOptions = useSubscribable(canvas.options)
    const action = useSubscribable(canvas.state)
    const active = useDerived((get) => get(app.session.active) === microcosmID)

    return {
      options: useSubscribable(options),
      viewport,
      view_id,
      state,
      microcosmID,
      toolbar,
      active,
      interaction,
      actions,
      styles: useSubscribable(styles),
      action,
      canvas,
      transform: useSubscribable(canvas.transform),
      canvasOptions
    }
  })()
}
export type SpatialView = Awaited<ReturnType<typeof useSpatialView>>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () => inject(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
