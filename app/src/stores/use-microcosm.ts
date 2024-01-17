import { SyncedMicrocosm } from '@/utils/yjs/SyncedMicrocosm'
import { defineStore } from 'pinia'
import { inject, reactive, ref, watch, type InjectionKey } from 'vue'
import { useAppState } from './use-app'
import type { Identity } from '@/types/schema'
import { getServerConfig } from '@/utils/yjs/server-config'

const MICROCOSM_STORE_NAME = 'microcosm' as const

export const useMicrocosm = (microcosm_uri: string): Store => {
  // Create a unique identifier for our microcosm's store
  const storeName = [MICROCOSM_STORE_NAME, microcosm_uri].join('/')

  return defineStore(storeName, () => {
    const app = useAppState()

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

    const users = reactive<Map<string, Identity>>(new Map())
    manager.on('identity', (u) => {
      users.set(u.user_id, u)
    })

    const leave = () => {
      manager.leave()
    }
    return {
      microcosm_uri,
      createNode: manager.addNode,
      ready,
      connected,
      leave,
      undo: manager.undo,
      redo: manager.redo,
      users
    }
  })()
}

type Store = {
  microcosm_uri: string
  createNode: SyncedMicrocosm['addNode']
  ready: boolean
  connected: boolean
  leave: () => void
  undo: () => void
  redo: () => void
  users: Map<string, Identity>
}

export const MICROCOSM_DATA_INJECTION_KEY: InjectionKey<Store> = Symbol('STORE')

export const MICROCOSM_API_INJECTION_KEY: InjectionKey<Store> = Symbol('API')

export const useCurrentMicrocosm = () => ({
  data: inject(MICROCOSM_DATA_INJECTION_KEY) as Store,
  actions: inject(MICROCOSM_API_INJECTION_KEY) as Store
})
