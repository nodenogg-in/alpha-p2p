import { Map as YMap } from 'yjs'
import { defineStore } from 'pinia'
import { inject, ref, watch, customRef } from 'vue'

import { useApp } from './use-app'
import type { Node } from '@/microcosm/types/schema'
import type { IdentityWithStatus, YNode, YNodeCollection } from '@/microcosm/yjs/SyncedMicrocosm'
import type { Box, Point } from '@/views/spatial/SpatialView.types'
import { CanvasInteraction } from '@/views/spatial/utils/CanvasInteraction'

const MICROCOSM_STORE_NAME = 'microcosm' as const

export const defaultNodeSize = {
  width: 400,
  height: 300
}

export const useMicrocosm = (microcosm_uri: string) => {
  return defineStore([MICROCOSM_STORE_NAME, microcosm_uri].join('/'), () => {
    const app = useApp()
    const shared = ref(true)
    const active = ref(true)

    const microcosm = app.registerMicrocosm(microcosm_uri)
    const interactionManager = new CanvasInteraction()

    const join = () => {
      active.value = true
      microcosm.join(app.identity.username)
    }

    const leave = () => {
      active.value = false
      microcosm.leave()
    }

    const ready = ref<boolean>(false)
    microcosm.on('ready', (r) => (ready.value = r))

    const connected = ref<boolean>(false)
    microcosm.on('connected', (c) => {
      connected.value = c
      if (c) {
        join()
        loadNodeData()
      } else {
        leave()
      }
    })

    const identities = ref<IdentityWithStatus[]>([])

    microcosm.on('identities', (ids) => {
      identities.value = ids
    })

    const getUser = (user_id: string) => {
      return identities.value.find((i) => i.user_id === user_id)
    }

    const nodeLists = ref<string[]>([])

    microcosm.doc.on('update', () => {
      loadNodeData()
    })

    microcosm.on('nodeLists', (n) => {
      nodeLists.value = n
    })

    watch(app.identity, () => {
      if (active.value) {
        join()
      }
    })

    const loadNodeData = async () => {
      const nodes = nodeLists.value
        .map((n) =>
          Array.from(microcosm.getNodes(n).entries()).map(
            ([id, v]: [string, YNode]) => [id, v.toJSON()] as [string, Node]
          )
        )
        .flat(1)

      await interactionManager.setBoxes(nodes)
    }

    const intersect = async (point: Point, b: Box) =>
      interactionManager.intersect([point, [b, 0.001]])

    return {
      create: microcosm.create,
      delete: microcosm.delete,
      update: microcosm.update,
      undo: microcosm.undo,
      redo: microcosm.redo,
      getNodes: microcosm.getNodes,
      join,
      leave,
      intersect,
      nodeLists,
      shared,
      microcosm_uri,
      getUser,
      ready,
      connected,
      identities
    }
  })()
}

export type MicrocosmStore = ReturnType<typeof useMicrocosm>

export const MICROCOSM_DATA_INJECTION_KEY = 'MICROCOSM_DATA'

export const MICROCOSM_URI_INJECTION_KEY = 'MICROCOSM_URI'

export const useCurrentMicrocosm = () =>
  inject<MicrocosmStore>(MICROCOSM_DATA_INJECTION_KEY) as MicrocosmStore

export const useCurrentMicrocosmURI = () => inject<string>(MICROCOSM_URI_INJECTION_KEY) as string

export const useYNode = <N extends Node>(node: YMap<N>) => {
  return customRef<N>((track, trigger) => {
    let value = node.toJSON() as N

    node.observe(() => {
      value = node.toJSON() as N
      trigger()
    })

    return {
      get() {
        track()
        return value
      },
      set() {
        trigger()
      }
    }
  })
}

export const useYNodeCollection = (map: YNodeCollection) => {
  return customRef<YNodeCollection>((track, trigger) => {
    let value = map

    map.observe(() => {
      value = map
      trigger()
    })

    return {
      get() {
        track()
        return value
      },
      set() {
        trigger()
      }
    }
  })
}
