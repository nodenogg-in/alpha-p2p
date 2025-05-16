import { inject, type Ref } from 'vue'
import { defineStore, type Store } from 'pinia'
import { vue } from '@figureland/kit/state/vue'
import type { Matrix2D } from '@figureland/kit/math'
import type { Entity } from '@nodenogg.in/microcosm'
import type {
  InteractionAdapter,
  CanvasOptions,
  CanvasState,
  InfinityKitState,
  InfinityKit,
  InfinityKitStyles,
  QueryAPI,
  QueryResult
} from '@figureland/kit/infinity'
import { app, client, useCurrentMicrocosm } from '@/state'
// import { createView } from '@nodenogg.in/app'

const getPersistenceName = (...s: string[]) => s.join('/')

export const useSpatialView = async (view_id: string) => {
  const microcosm = useCurrentMicrocosm()
  // const view = await client.registerResource(microcosm.microcosmUUID, view_id, () =>
  //   createView(app, microcosm, getPersistenceName([microcosm.microcosmUUID, view_id]))
  // )

  return defineStore(`${microcosm.microcosmUUID}/${view_id}/spatial`, (): SpatialView => {
    // const { interaction, infinitykit } = view

    // const canvasState = vue(infinitykit.canvas.state)
    // const canvasOptions = vue(infinitykit.canvas.options)
    // const state = vue(infinitykit.state)
    // const transform = vue(infinitykit.canvas.transform)
    // const visible = vue(infinitykit.visible)
    // const tools = vue(infinitykit.tools)
    // const tool = vue(infinitykit.tool)
    // const styles = vue(infinitykit.styles)

    return {
      view_id
      // tools,
      // tool,
      // visible,
      // canvasState,
      // interaction,
      // styles,
      // transform,
      // state,
      // canvasOptions,
      // infinitykit
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
