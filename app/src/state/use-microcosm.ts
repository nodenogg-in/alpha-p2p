import { defineStore } from 'pinia'
import { inject, watch, customRef } from 'vue'
import { useRoute } from 'vue-router'

import type { IdentityWithStatus, NodeReference, ViewName } from 'nodenoggin/schema'
import { assignNodePositions } from 'nodenoggin/spatial'
import { isString, parseFileToHTMLString } from 'nodenoggin/utils'

import { paramToString, useApp } from '.'
import { useSpatialView } from '@/views/spatial/stores/use-spatial-view'
import { useStateInstance } from '@/utils/hooks/use-state-instance'
import { appState } from '@/state/instance'

export const useMicrocosm = (microcosm_uri: string, view: ViewName) => {
  return defineStore(`microcosm/${microcosm_uri}`, () => {
    const app = useApp()
    const route = useRoute()

    const microcosm = app.registerMicrocosm(microcosm_uri, view)

    appState.keyboard.onCommand({
      redo: () => {
        if (app.isActiveMicrocosm(microcosm_uri)) {
          microcosm.api.redo()
        }
      },
      undo: () => {
        console.log('undo!!')
        if (app.isActiveMicrocosm(microcosm_uri)) {
          microcosm.api.undo()
        }
      }
    })

    const join = () => {
      microcosm.api.join(app.identity.username)
    }

    const leave = () => {
      microcosm.api.leave()
    }

    const status = useStateInstance(microcosm.api, 'status', (status) => {
      if (status.connected) {
        join()
      } else {
        leave()
      }
    })

    const data = useStateInstance(microcosm.api, 'data')

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

        microcosm.api.subscribeToCollection(user_id, (data) => {
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
      microcosm.api.create(positionedNodes)
    }

    return {
      spatial,
      create: microcosm.api.create,
      delete: microcosm.api.delete,
      update: microcosm.api.update,
      undo: microcosm.api.undo,
      redo: microcosm.api.redo,
      intersect: microcosm.api.intersect,
      nodes: microcosm.api.nodes,
      nodesByType: microcosm.api.nodesByType,
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
