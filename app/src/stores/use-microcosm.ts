import { SyncedMicrocosm, type YNode, type YNodeCollection } from '@/utils/yjs/SyncedMicrocosm'
import { defineStore } from 'pinia'
import { inject, ref, watch, customRef, type InjectionKey } from 'vue'
import { useApp } from './use-app'
import { type Identity, type Node } from '@/types/schema'
import { getServerConfig } from '@/utils/yjs/server-config'

const MICROCOSM_STORE_NAME = 'microcosm' as const

export const useMicrocosm = (microcosm_uri: string) => {
  // Create a unique identifier for our microcosm's store
  const storeName = [MICROCOSM_STORE_NAME, microcosm_uri].join('/')

  return defineStore(storeName, () => {
    const app = useApp()
    const shared = ref(true)

    watch(app.identity, () => {
      microcosm.join(app.identity.username)
    })

    const microcosm = new SyncedMicrocosm({
      user_id: app.identity.user_id,
      microcosm_uri,
      server: getServerConfig()
    })

    const ready = ref<boolean>(false)
    microcosm.on('ready', (r) => (ready.value = r))

    app.registerMicrocosm(microcosm_uri)

    const connected = ref<boolean>(false)
    microcosm.on('connected', (c) => {
      connected.value = c
      if (c) {
        microcosm.join(app.identity.username)
      }
    })

    const identities = ref<Map<string, Identity>>(new Map())

    microcosm.on('identity', (identity) => {
      identities.value.set(identity.user_id, identity)
    })

    const getUser = (user_id: string) => {
      return identities.value.get(user_id)
    }

    const nodeLists = ref<string[]>([])

    microcosm.on('nodeLists', (n) => {
      nodeLists.value = n
    })

    const leave = () => {
      microcosm.leave()
    }
    return {
      create: microcosm.create,
      delete: microcosm.delete,
      update: microcosm.update,
      undo: microcosm.undo,
      redo: microcosm.redo,
      getNodes: microcosm.getNodes,
      nodeLists,
      shared,
      microcosm_uri,
      getUser,
      ready,
      connected,
      leave,
      identities
    }
  })()
}

export type MicrocosmStore = ReturnType<typeof useMicrocosm>

export const MICROCOSM_DATA_INJECTION_KEY: InjectionKey<MicrocosmStore> = Symbol('MICROCOSM_DATA')

export const useCurrentMicrocosm = () => inject(MICROCOSM_DATA_INJECTION_KEY) as MicrocosmStore

export const useYNode = (node: YNode) => {
  return customRef<Node>((track, trigger) => {
    let value = node.toJSON() as Node

    node.observe(() => {
      value = node.toJSON() as Node
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
