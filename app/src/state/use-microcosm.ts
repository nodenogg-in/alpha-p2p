import { defineStore } from 'pinia'
import { inject, watch, customRef } from 'vue'
import { useRoute } from 'vue-router'
import type { IdentityWithStatus, NodeReference, ViewName } from 'nodenoggin/schema'
import { assignNodePositions } from 'nodenoggin/spatial'
import { isString, parseFileToHTMLString } from 'nodenoggin/utils'
import { App } from 'nodenoggin/ui'

import { useApp } from './use-app'
import { paramToString } from '.'
import { useSpatialView } from '@/views/spatial/stores/use-spatial-view'
import { useState } from '@/utils/hooks/use-state'

export const useMicrocosm = (microcosm_uri: string, view: ViewName) => {
  return defineStore(`microcosm/${microcosm_uri}`, () => {
    const app = useApp()
    const route = useRoute()

    const microcosm = app.registerMicrocosm(microcosm_uri, view)

    let unsubscribe: () => void

    const subscribeToKeyCommands = () => {
      if (!unsubscribe) {
        unsubscribe = App.onKeyCommand({
          redo: () => {
            if (app.isActiveMicrocosm(microcosm_uri)) {
              microcosm.redo()
            }
          },
          undo: () => {
            if (app.isActiveMicrocosm(microcosm_uri)) {
              microcosm.undo()
            }
          }
        })
      }
    }

    const join = () => {
      subscribeToKeyCommands()
      microcosm.join(app.identity.username)
    }

    const leave = () => {
      microcosm.leave()
    }

    const status = useState(microcosm, 'status', {
      onChange: (status) => {
        if (status.connected) {
          join()
        } else {
          leave()
        }
      }
    })

    const data = useState(microcosm, 'data')

    const getUser = (user_id: string): IdentityWithStatus | undefined => {
      return data.identities.find((i) => i.user_id === user_id)
    }

    const spatial = useSpatialView(microcosm_uri, microcosm)

    watch(app.identity, () => {
      if (status.ready) {
        join()
      }
    })

    watch(route, () => {
      if (route.params.microcosm_uri === microcosm_uri) {
        app.registerMicrocosm(microcosm_uri, paramToString<ViewName>(route.params.view))
      }
    })

    const useCollection = (user_id: string) =>
      customRef<NodeReference[]>((track, trigger) => {
        let value: NodeReference[] = []

        microcosm.subscribeToCollection(user_id, (data) => {
          value = Array.from(data).sort(([, a], [, b]) => a.lastEdited - b.lastEdited)
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

    const handleDropFiles = async (files: File[]) => {
      const results = await Promise.all(files.map(parseFileToHTMLString))

      const filesHTML = results.filter(isString)

      const nodes = filesHTML.map((content) => ({
        type: 'html',
        content
      }))

      const positionedNodes = assignNodePositions(spatial.state, nodes)
      microcosm.create(positionedNodes)
    }

    return {
      spatial,
      create: microcosm.create,
      delete: microcosm.delete,
      update: microcosm.update,
      undo: microcosm.undo,
      redo: microcosm.redo,
      intersect: microcosm.intersect,
      nodes: microcosm.nodes,
      nodesByType: microcosm.nodesByType,
      handleDropFiles,
      useCollection,
      join,
      leave,
      microcosm_uri,
      getUser,
      status,
      data
    }
  })()
}

export type MicrocosmStore = ReturnType<typeof useMicrocosm>

export const MICROCOSM_DATA_INJECTION_KEY = 'MICROCOSM_DATA'

export const MICROCOSM_URI_INJECTION_KEY = 'MICROCOSM_URI'

export const useCurrentMicrocosm = () =>
  inject<MicrocosmStore>(MICROCOSM_DATA_INJECTION_KEY) as MicrocosmStore

export const useCurrentMicrocosmURI = () => inject<string>(MICROCOSM_URI_INJECTION_KEY) as string
