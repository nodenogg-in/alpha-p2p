import { computed } from 'vue'
import { defineStore } from 'pinia'
import { map, string } from 'valibot'

import { createTimestamp } from '@/utils'
import { localReactive } from '@/utils/local-storage'
import { microcosmSchema, type Microcosm } from '@/types/schema'
import { groupMicrocosmsByNamespace } from './utils'
import { deepmerge } from 'deepmerge-ts'

const MAIN_STORE_NAME = 'app' as const

// An global store for managing microcosm state and connectivity.
export const useAppState = defineStore(MAIN_STORE_NAME, () => {
  // Retrieve existing list of microcosms from local storage
  // and instantiate a reactive store of microcosms
  const microcosms = localReactive([MAIN_STORE_NAME], map(string(), microcosmSchema), new Map())

  // Method to load up a new microcosm and make it the active one

  const registerMicrocosm = (uri: string) => {
    const microcosmEntry: Microcosm = deepmerge(
      { uri, microcosm_id: uri, namespace_id: uri },
      {
        lastAccessed: createTimestamp()
      }
    )

    microcosms.set(microcosmEntry.uri, microcosmEntry)
  }

  return {
    registerMicrocosm,
    microcosms,
    namespaces: computed(() => groupMicrocosmsByNamespace(microcosms))
  }
})

export type AppState = ReturnType<typeof useAppState>
