import { inject, type Ref } from 'vue'
import { defineStore, type Store } from 'pinia'
import { useSubscribable } from '@figureland/kit/state/vue'
import type { Matrix2D } from '@figureland/kit/math'
import type { Entity } from '@nodenogg.in/microcosm'
import type { CanvasToolset } from '@nodenogg.in/framework'
import type {
  InteractionAdapter,
  CanvasOptions,
  CanvasState,
  InfinityKitState,
  InfinityKit,
  InfinityKitStyles,
  QueryAPI,
  QueryResult
} from '@figureland/infinitykit'
import { app, useCurrentMicrocosm } from '@/state'

export const useSpatialView = async (view_id: string) => {
  const microcosm = useCurrentMicrocosm()
  const view = await app.views.register(microcosm.api, app, view_id)

  return defineStore(`${microcosm.microcosmID}/${view_id}/spatial`, (): SpatialView => {
    const { interaction, infinitykit } = view
    const canvasState = useSubscribable(infinitykit.canvas.state)
    const canvasOptions = useSubscribable(infinitykit.canvas.options)
    const state = useSubscribable(infinitykit.state)
    const transform = useSubscribable(infinitykit.canvas.transform)
    const visible = useSubscribable(infinitykit.visible)
    const tools = useSubscribable(infinitykit.tools)
    const tool = useSubscribable(infinitykit.tool)
    const styles = useSubscribable(infinitykit.styles)

    return {
      view_id,
      tools,
      tool,
      visible,
      canvasState,
      interaction,
      styles,
      transform,
      state,
      canvasOptions,
      infinitykit
    }
  })()
}

export type SpatialView = {
  view_id: string
  tools: Ref<CanvasToolset>
  tool: Ref<keyof CanvasToolset>
  infinitykit: InfinityKit<QueryAPI<Entity>, CanvasToolset>
  visible: Ref<QueryResult>
  canvasState: Ref<CanvasState>
  interaction: InteractionAdapter
  styles: Ref<InfinityKitStyles>
  transform: Ref<Matrix2D>
  state: Ref<InfinityKitState>
  canvasOptions: Ref<CanvasOptions>
}

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export type SpatialViewStore = Store<string, SpatialView>

export const useCurrentSpatialView = () => inject(SPATIAL_VIEW_INJECTION_KEY) as SpatialViewStore
