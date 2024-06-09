import { inject } from 'vue'
import { defineStore } from 'pinia'
import { useSubscribable } from '@figureland/statekit/vue'
import { app, useCurrentMicrocosm } from '@/state'
import type {
  Canvas,
  CanvasInteractionHandler,
  CanvasOptions,
  CanvasState
} from '@figureland/infinitykit'
import type { Ref } from 'vue'
import type { Matrix2D } from '@figureland/mathkit/matrix2D'
import type { Signal } from '@figureland/statekit'
import type { EntityLocation } from '@nodenogg.in/microcosm'

export const useSpatialView = async (view_id: string) => {
  const microcosm = useCurrentMicrocosm()
  const view = await app.views.register(microcosm.api(), app, view_id)

  return defineStore(`${microcosm.microcosmID}/${view_id}/spatial`, () => {
    const { interaction, cssVariables, infinitykit } = view
    const { canvas } = infinitykit
    const state = useSubscribable(infinitykit.canvas.state)
    const canvasOptions = useSubscribable(infinitykit.canvas.options)
    const actionState = useSubscribable(infinitykit.state)
    const transform = useSubscribable(infinitykit.canvas.transform)
    const visible = useSubscribable<EntityLocation[]>(infinitykit.visible)

    return {
      visible,
      view_id,
      state,
      interaction,
      cssVariables,
      canvas,
      transform,
      actionState,
      canvasOptions,
      infinitykit
    }
  })()
}
export type SpatialView = Awaited<ReturnType<typeof useSpatialView>>

// export type SpatialView =
//   | {
//       view_id: string
//       visible: Ref<EntityLocation[]>
//       state: Ref<CanvasState>
//       interaction: CanvasInteractionHandler
//       cssVariables: Signal<string>
//       canvas: Canvas
//       transform: Ref<Matrix2D>
//       actionState: Ref<Record<string, any>>
//       canvasOptions: Ref<CanvasOptions>
//     }
//   | any

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = (): SpatialView =>
  inject(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
