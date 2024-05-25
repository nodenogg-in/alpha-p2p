import { inject } from 'vue'
import { defineStore } from 'pinia'
import { useSubscribable } from '@figureland/statekit/vue'
import { app, useCurrentMicrocosm } from '@/state'
import type {
  Actions,
  Canvas,
  CanvasInteractionHandler,
  CanvasOptions,
  CanvasState,
  ToolSet
} from '@figureland/infinitykit'
import type { Ref } from 'vue'
import type { Matrix2D } from '@figureland/mathkit/matrix2D'
import type { Signal } from '@figureland/statekit'

export const useSpatialView = async (view_id: string) => {
  const microcosm = useCurrentMicrocosm()
  const view = await app.views.register(microcosm.api(), app, view_id)

  return defineStore(`${microcosm.microcosmID}/${view_id}/spatial`, (): SpatialView => {
    const { interaction, actions, cssVariables } = view
    const { canvas } = actions
    const state = useSubscribable(canvas.state)
    const canvasOptions = useSubscribable(canvas.options)
    const actionState = useSubscribable(actions.state)
    const transform = useSubscribable(canvas.transform)
    const toolbar = useSubscribable(actions.tools)

    return {
      view_id,
      state,
      toolbar,
      interaction,
      actions,
      cssVariables,
      canvas,
      transform,
      actionState,
      canvasOptions
    }
  })()
}
export type SpatialView = {
  view_id: string
  state: Ref<CanvasState>
  toolbar: Ref<ToolSet>
  interaction: CanvasInteractionHandler
  actions: Actions<any>
  cssVariables: Signal<string>
  canvas: Canvas
  transform: Ref<Matrix2D>
  actionState: Ref<Record<string, any>>
  canvasOptions: Ref<CanvasOptions>
}

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () => inject(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
