import { SyncedMicrocosm, type YNode, type YNodeArray } from '@/utils/yjs/SyncedMicrocosm'
import { defineStore } from 'pinia'
import { inject, reactive, ref, watch, type InjectionKey, customRef } from 'vue'
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
      manager.join(app.identity.username)
    })

    const manager = new SyncedMicrocosm({
      user_id: app.identity.user_id,
      microcosm_uri,
      server: getServerConfig()
    })

    const ready = ref<boolean>(false)
    manager.on('ready', (r) => (ready.value = r))

    app.registerMicrocosm(microcosm_uri)

    const connected = ref<boolean>(false)
    manager.on('connected', (c) => {
      connected.value = c
      if (c) {
        manager.join(app.identity.username)
      }
    })

    const identities = reactive<Map<string, Identity>>(new Map())

    manager.on('identity', (u) => {
      identities.set(u.user_id, u)
    })

    const nodeLists = ref<string[]>([])

    manager.on('nodeLists', (n) => {
      nodeLists.value = n
    })

    const leave = () => {
      manager.leave()
    }
    return {
      nodeLists,
      shared,
      microcosm_uri,
      create: manager.create,
      getNodes: manager.getNodes,
      update: manager.update,
      delete: manager.delete,
      ready,
      connected,
      leave,
      undo: manager.undo,
      redo: manager.redo,
      identities
    }
  })()
}

// export type MicrocosmStore = {
//   shared: boolean
//   microcosm_uri: string
//   ready: boolean
//   connected: boolean
//   users: Map<string, Identity>
//   create: SyncedMicrocosm['create']
//   get: SyncedMicrocosm['get']
//   update: SyncedMicrocosm['update']
//   delete: SyncedMicrocosm['delete']
//   leave: () => void
//   undo: () => void
//   redo: () => void
// }

export type MicrocosmStore = ReturnType<typeof useMicrocosm>

export type MicrocosmStoreData = Pick<
  MicrocosmStore,
  'microcosm_uri' | 'ready' | 'connected' | 'identities' | 'shared' | 'nodeLists'
>

export type MicrocosmStoreActions = Pick<
  MicrocosmStore,
  'create' | 'getNodes' | 'update' | 'delete' | 'leave' | 'undo' | 'redo'
>

// export const MICROCOSM_DATA_INJECTION_KEY: InjectionKey<MicrocosmStoreData> = Symbol('MICROCOSM_DATA')
export const MICROCOSM_DATA_INJECTION_KEY = 'MICROCOSM_DATA'

// export const MICROCOSM_ACTIONS_INJECTION_KEY: InjectionKey<MicrocosmStoreActions> = Symbol('MICROCOSM_ACTIONS')
export const MICROCOSM_ACTIONS_INJECTION_KEY = 'MICROCOSM_ACTIONS'

export const useCurrentMicrocosm = () => ({
  data: inject(MICROCOSM_DATA_INJECTION_KEY) as MicrocosmStoreData,
  actions: inject(MICROCOSM_ACTIONS_INJECTION_KEY) as MicrocosmStoreActions
})

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
      set(newValue) {
        // value = newValue
        trigger()
      }
    }
  })
}

export const useYNodeArray = (arr: YNodeArray) => {
  return customRef<YNodeArray>((track, trigger) => {
    let value = arr

    arr.observe(() => {
      value = arr
      trigger()
    })

    return {
      get() {
        track()
        return value
      },
      set(newValue) {
        // value = newValue
        trigger()
      }
    }
  })
}
