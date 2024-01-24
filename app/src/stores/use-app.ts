import { defineStore } from 'pinia'
import { map, string } from 'valibot'

import { createTimestamp, createUuid } from '@/utils'
import { localReactive } from '@/utils/local-storage'
import { microcosmSchema, type Microcosm, identitySchema } from '@/types/schema'
import { SyncedMicrocosmManager } from '@/utils/yjs/SyncedMicrocosmManager'
import { computed, readonly } from 'vue'

const MAIN_STORE_NAME = 'app' as const

const sortByName = (a: Microcosm, b: Microcosm) => {
  return a.microcosm_uri.localeCompare(b.microcosm_uri)
}

// An global store for managing microcosm state and connectivity.
export const useApp = defineStore(MAIN_STORE_NAME, () => {
  const identity = localReactive('identity', identitySchema, {
    user_id: createUuid()
  })

  const manager = readonly<SyncedMicrocosmManager>(new SyncedMicrocosmManager(identity.user_id))

  // Retrieve existing list of microcosms from local storage
  // and instantiate a reactive store of microcosms
  const microcosmStore = localReactive<Map<string, Microcosm>>(
    [MAIN_STORE_NAME],
    map(string(), microcosmSchema),
    new Map()
  )

  const registerMicrocosm = (microcosm_uri: string) => {
    microcosmStore.set(microcosm_uri, {
      microcosm_uri,
      lastAccessed: createTimestamp()
    })
    return manager.register(microcosm_uri)
  }

  // const m = computed(() => Array.from(microcosms.values()))

  const microcosms = computed(() => Array.from(microcosmStore.values()).sort(sortByName))

  return {
    identity,
    registerMicrocosm,
    microcosms
  }
})

export type AppState = ReturnType<typeof useApp>
