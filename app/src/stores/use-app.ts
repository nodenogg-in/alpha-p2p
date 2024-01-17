import { computed } from 'vue'
import { defineStore } from 'pinia'
import { map, string } from 'valibot'

import { createTimestamp, createUuid } from '@/utils'
import { localReactive } from '@/utils/local-storage'
import { microcosmSchema, type Microcosm, identitySchema } from '@/types/schema'
import { groupMicrocosmsByNamespace } from './utils'

const MAIN_STORE_NAME = 'app' as const

// An global store for managing microcosm state and connectivity.
export const useAppState = defineStore(MAIN_STORE_NAME, () => {
  // Retrieve existing list of microcosms from local storage
  // and instantiate a reactive store of microcosms
  const microcosms = localReactive([MAIN_STORE_NAME], map(string(), microcosmSchema), new Map())

  const identity = localReactive('identity', identitySchema, {
    user_id: createUuid()
  })

  // Method to load up a new microcosm and make it the active one

  const registerMicrocosm = (microcosm_uri: string) => {
    const microcosmEntry: Microcosm = {
      microcosm_uri,
      lastAccessed: createTimestamp()
    }

    microcosms.set(microcosm_uri, microcosmEntry)
  }

  return {
    identity,
    registerMicrocosm,
    microcosms,
    namespaces: computed(() => groupMicrocosmsByNamespace(microcosms))
  }
})

export type AppState = ReturnType<typeof useAppState>
