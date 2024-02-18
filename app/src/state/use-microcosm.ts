import { defineStore } from 'pinia'
import { inject, ref, watch, customRef } from 'vue'
import type { IdentityWithStatus, NodeReference } from 'nodenoggin-core/sync'

import { useApp } from './use-app'
import { type ViewName } from 'nodenoggin-core'
import { useRoute } from 'vue-router'
import { paramToString } from '.'

const MICROCOSM_STORE_NAME = 'microcosm' as const

export const useMicrocosm = (microcosm_uri: string, view: ViewName) => {
  return defineStore([MICROCOSM_STORE_NAME, microcosm_uri].join('/'), () => {
    const app = useApp()
    const route = useRoute()

    const shared = ref(true)
    const active = ref(true)

    const microcosm = app.registerMicrocosm(microcosm_uri, view)

    let unsubscribe: () => void

    const subscribeToKeyCommands = () => {
      if (!unsubscribe) {
        unsubscribe = app.onKeyCommand({
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
      active.value = true
      subscribeToKeyCommands()
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
      } else {
        leave()
      }
    })

    const identities = ref<IdentityWithStatus[]>([])

    microcosm.on('identities', (ids) => {
      identities.value = ids
    })

    const getUser = (user_id: string): IdentityWithStatus | undefined => {
      return identities.value.find((i) => i.user_id === user_id)
    }

    watch(app.identity, () => {
      if (active.value) {
        join()
      }
    })

    watch(route, () => {
      if (route.params.microcosm_uri === microcosm_uri) {
        app.registerMicrocosm(microcosm_uri, paramToString<ViewName>(route.params.view))
      }
    })

    const collections = ref<string[]>([])

    microcosm.subscribeToCollections((data) => {
      collections.value = [...data]
    })

    const useCollection = (user_id: string) =>
      customRef<NodeReference[]>((track, trigger) => {
        let value: NodeReference[] = []

        microcosm.subscribeToCollection(user_id, (data) => {
          value = data
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

    return {
      create: microcosm.create,
      delete: microcosm.delete,
      update: microcosm.update,
      undo: microcosm.undo,
      redo: microcosm.redo,
      intersect: microcosm.intersect,
      nodes: microcosm.htmlNodes,
      useCollection,
      collections,
      join,
      leave,
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
