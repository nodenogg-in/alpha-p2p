import { Map as YMap } from 'yjs'
import { defineStore } from 'pinia'
import { inject, ref, watch, customRef } from 'vue'

import { useApp } from './use-app'
import type { Node } from 'nodenoggin-core/schema'
import type { IdentityWithStatus, YNodeCollection } from 'nodenoggin-core/sync'

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

    let unsubscribe: () => void

    const subscribeToKeyCommands = () => {
      if (unsubscribe) unsubscribe()

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

    const join = () => {
      active.value = true
      subscribeToKeyCommands()
      microcosm.join(app.identity.username)
    }

    const leave = () => {
      active.value = false
      if (unsubscribe) unsubscribe()
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

    const nodeLists = ref<string[]>([])

    microcosm.on('nodeLists', (n) => {
      nodeLists.value = n
    })

    const notify = () => {
      console.log('hello!!!')
    }

    watch(app.identity, () => {
      if (active.value) {
        join()
      }
    })

    return {
      notify,
      create: microcosm.create,
      delete: microcosm.delete,
      update: microcosm.update,
      undo: microcosm.undo,
      redo: microcosm.redo,
      getNodes: microcosm.getNodes,
      getNode: microcosm.getNode,
      subscribe: microcosm.subscribe,
      intersect: microcosm.intersect,
      join,
      leave,
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
