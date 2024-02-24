import { defineStore } from 'pinia'
import { inject, customRef } from 'vue'

import type { IdentityWithStatus, NodeReference, ViewName } from 'nodenoggin/schema'
import { useState } from '@/hooks/use-state'
import { ui, microcosms } from '@/state/instance'

export const useMicrocosm = (microcosm_uri: string, view: ViewName) => {
  return defineStore(`microcosm/${microcosm_uri}`, () => {
    const microcosm = microcosms.register({
      microcosm_uri,
      view
    })

    ui.keyboard.onCommand({
      redo: () => {
        if (microcosms.isActive(microcosm_uri)) {
          microcosm.api.redo()
        }
      },
      undo: () => {
        if (microcosms.isActive(microcosm_uri)) {
          microcosm.api.undo()
        }
      }
    })

    const join = () => {
      microcosm.api.join(ui.user.get('identity').username)
    }

    const leave = () => {
      microcosm.api.leave()
    }

    const status = useState(microcosm.api, 'status', (status) => {
      if (status.connected) {
        join()
      } else {
        leave()
      }
    })

    const data = useState(microcosm.api, 'data')

    const getUser = (user_id: string): IdentityWithStatus | undefined =>
      data.identities.find((i) => i.user_id === user_id)

    useState(ui.user, 'identity', () => {
      if (status.ready) {
        join()
      }
    })

    // watch(route, () => {
    //   if (route.params.microcosm_uri === microcosm_uri) {
    //     app.getMicrocosm(microcosm_uri, paramToString<ViewName>(route.params.view))
    //   }
    // })

    const useCollection = (user_id: string) =>
      customRef<NodeReference[]>((track, trigger) => {
        let value: NodeReference[] = []

        microcosm.api.subscribeToCollection(user_id, (data) => {
          value = [...data]
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

    const handleDropFiles = (files: File[]) => {
      microcosm.actions.handleDropFiles(microcosm.canvas.get('canvas'), files)
    }

    return {
      microcosm,
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

export const useCurrentMicrocosm = () =>
  inject<MicrocosmStore>(MICROCOSM_DATA_INJECTION_KEY) as MicrocosmStore
