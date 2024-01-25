import { computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import { map, string } from 'valibot'

import { createTimestamp, createUuid } from '@/utils'
import { localReactive } from '@/utils/hooks/use-local-storage'
import { microcosmSchema, type Microcosm, identitySchema } from '@/microcosm/types/schema'
import { SyncedMicrocosmManager } from '@/microcosm/yjs/SyncedMicrocosmManager'
import { isValidMicrocosmURI } from '../core/utils'

const MAIN_STORE_NAME = 'app' as const

const sortByName = (a: Microcosm, b: Microcosm) => a.microcosm_uri.localeCompare(b.microcosm_uri)

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
    try {
      if (!isValidMicrocosmURI(microcosm_uri)) {
        throw new Error(`Invalid microcosm URI: ${microcosm_uri}`)
      }
      microcosmStore.set(microcosm_uri, {
        microcosm_uri,
        lastAccessed: createTimestamp()
      })
      return manager.register(microcosm_uri)
    } catch (e) {
      throw e || new Error(`Failed to register microcosm ${microcosm_uri}`)
    }
  }

  const microcosms = computed(() => Array.from(microcosmStore.values()).sort(sortByName))

  return {
    manager,
    identity,
    registerMicrocosm,
    microcosms
  }
})

export type AppState = ReturnType<typeof useApp>
