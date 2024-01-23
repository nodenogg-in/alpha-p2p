import { defineStore } from 'pinia'
import { map, string } from 'valibot'

import { createTimestamp, createUuid } from '@/utils'
import { localReactive } from '@/utils/local-storage'
import { microcosmSchema, type Microcosm, identitySchema, type Identity } from '@/types/schema'
import { SyncedMicrocosmManager } from '@/utils/yjs/SyncedMicrocosmManager'
import { SyncedMicrocosm } from '@/utils/yjs/SyncedMicrocosm'
import { readonly } from 'vue'

const MAIN_STORE_NAME = 'app' as const

// An global store for managing microcosm state and connectivity.
export const useApp = defineStore(MAIN_STORE_NAME, (): AppState => {
  const identity = localReactive('identity', identitySchema, {
    user_id: createUuid()
  })

  const manager = readonly<SyncedMicrocosmManager>(new SyncedMicrocosmManager(identity.user_id))

  // Retrieve existing list of microcosms from local storage
  // and instantiate a reactive store of microcosms
  const microcosms = localReactive([MAIN_STORE_NAME], map(string(), microcosmSchema), new Map())

  const registerMicrocosm = (microcosm_uri: string) => {
    microcosms.set(microcosm_uri, {
      microcosm_uri,
      lastAccessed: createTimestamp()
    })
    return manager.register(microcosm_uri)
  }

  return {
    identity,
    registerMicrocosm,
    microcosms
  }
})

export type AppState = {
  identity: Identity
  registerMicrocosm: (uri: string) => SyncedMicrocosm
  microcosms: Map<string, Microcosm>
}
