import { inject } from 'vue'
import { defineStore } from 'pinia'

import { api, session, ui } from '@/state'
import { useDerived, useSignal, useState } from '@nodenogg.in/state/vue'
import { intersectBoxWithBox } from '@nodenogg.in/spatial-view'
import { isNodeReferenceType, type NodeReference } from '@nodenogg.in/schema'
import { derive } from '@nodenogg.in/state'

export const useSpatialView = (microcosm_uri: string, id: string) =>
  defineStore(`${id}/spatial`, () => {
    const microcosm = api.registerMicrocosm({ microcosm_uri })
    const canvas = microcosm.canvas(id)

    const viewport = useSignal(canvas.interaction.viewport)
    const state = useState(canvas.interaction)
    const action = useState(canvas.action)
    const active = useDerived([session], ([s]) => s.active === microcosm_uri)
    const collections = useState(microcosm, 'collections')

    const onPointerDown = (e: PointerEvent) => {
      canvas.onPointerDown(ui.screen.key('pointer').get(), e)
    }
    const onPointerUp = () => canvas.onPointerUp(ui.screen.key('pointer').get())
    const onPointerOut = () => canvas.onPointerOut()
    const onPointerOver = () => canvas.onPointerOver()

    const { onWheel, onFocus, setTool, toolbar, onDropFiles } = canvas
    const { resize, zoom } = canvas.interaction

    const styles = useSignal(canvas.styles)

    const selectionGroup = useSignal(canvas.action.selectionGroup)

    const useCollection = (user_id: string) => {
      const nodesState = microcosm.subscribeToCollection(user_id)

      const signal = derive([canvas.interaction.viewport, nodesState], ([viewport, nodes]) =>
        nodes
          .filter((n) => isNodeReferenceType(n, 'html'))
          .filter((b) => intersectBoxWithBox((b as NodeReference<'html'>)[1], viewport.canvas))
      )

      microcosm.onDispose(signal.dispose)
      return useSignal(signal)
    }

    return {
      viewport,
      id,
      state,
      microcosm_uri,
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
      onDropFiles,
      zoom,
      setTool,
      styles,
      collections,
      action,
      useCollection
    }
  })()

export type SpatialView = ReturnType<typeof useSpatialView>

export const SPATIAL_VIEW_INJECTION_KEY = 'SPATIAL_VIEW'

export const useCurrentSpatialView = () => inject(SPATIAL_VIEW_INJECTION_KEY) as SpatialView
