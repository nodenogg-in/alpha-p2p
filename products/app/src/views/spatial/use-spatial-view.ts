import { inject } from 'vue'
import { defineStore, type Store } from 'pinia'
import { useSubscribable } from '@figureland/statekit/vue'
import { app, useCurrentMicrocosm } from '@/state'
import type {
  CanvasInteractionHandler,
  CanvasOptions,
  CanvasState,
  IKState,
  InfinityKit,
  QueryAPI,
  QueryResult,
  Toolset
} from '@figureland/infinitykit'
import type { Ref } from 'vue'
import type { Matrix2D } from '@figureland/mathkit/matrix2D'
import type { Signal } from '@figureland/statekit'
import type { Entity } from '@nodenogg.in/microcosm'

export const useSpatialView = async (view_id: string) => {
  const microcosm = useCurrentMicrocosm()
  const view = await app.views.register(microcosm.api, app, view_id)

  return defineStore(`${microcosm.microcosmID}/${view_id}/spatial`, (): SpatialView => {
    const { interaction, cssVariables, infinitykit } = view
    const state = useSubscribable(infinitykit.canvas.state)
    const canvasOptions = useSubscribable(infinitykit.canvas.options)
    const actionState = useSubscribable(infinitykit.state)
    const transform = useSubscribable(infinitykit.canvas.transform)
    const visible = useSubscribable(infinitykit.visible)
    const tools = useSubscribable(view.infinitykit.tools) as Ref<Toolset>
    const activeTool = useSubscribable(view.infinitykit.tool)

    return {
      view_id,
      tools,
      activeTool,
      visible,
      state,
      interaction,
      cssVariables,
      transform,
      actionState,
      canvasOptions,
      infinitykit
    }
  })()
}

export type SpatialView = {
  view_id: string
  tools: Ref<Toolset>
  activeTool: Ref<keyof Toolset>
  infinitykit: InfinityKit<QueryAPI<Entity>>
  visible: Ref<QueryResult>
  state: Ref<CanvasState>
  interaction: CanvasInteractionHandler
  cssVariables: Signal<string>
  transform: Ref<Matrix2D>
  actionState: Ref<IKState>
  canvasOptions: Ref<CanvasOptions>
}

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export type SpatialViewStore = Store<string, SpatialView>

export const useCurrentSpatialView = () => inject(SPATIAL_VIEW_INJECTION_KEY) as SpatialViewStore
