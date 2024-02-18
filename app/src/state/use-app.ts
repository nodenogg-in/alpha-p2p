import { computed, readonly, ref } from 'vue'
import { defineStore } from 'pinia'
import { boolean, map, string } from 'valibot'

import { localReactive, localRef } from '@/utils/hooks/use-local-storage'
import {
  MicrocosmManager,
  microcosmReferenceSchema,
  identitySchema,
  type MicrocosmReference,
  createYMicrocosm
} from 'nodenoggin-core/sync'
import { createUserIdentity, isValidMicrocosmURI } from 'nodenoggin-core/utils'
import { KeyCommands } from 'nodenoggin-core/ui'

const MAIN_STORE_NAME = 'app' as const

const sortByName = (a: MicrocosmReference, b: MicrocosmReference) =>
  a.microcosm_uri.localeCompare(b.microcosm_uri)

// An global store for managing microcosm state and connectivity.
export const useApp = defineStore(MAIN_STORE_NAME, () => {
  const identity = localReactive({
    name: [MAIN_STORE_NAME, 'identity'],
    schema: identitySchema,
    defaultValue: createUserIdentity()
  })

  const keys = readonly(new KeyCommands())
  const activeMicrocosm = ref<string>()
  const menuOpen = localRef({ name: 'menuOpen', schema: boolean(), defaultValue: true })
  const manager = readonly(new MicrocosmManager(identity.user_id, createYMicrocosm))

  // Retrieve existing list of microcosms from local storage
  // and instantiate a reactive store of microcosms
  const microcosmStore = localReactive<Map<string, MicrocosmReference>>({
    name: [MAIN_STORE_NAME, 'microcosms'],
    schema: map(string(), microcosmReferenceSchema),
    defaultValue: new Map()
  })

  keys.onKey({
    m: () => {
      menuOpen.value = !menuOpen.value
    }
  })

  const registerMicrocosm = (microcosm_uri: string) => {
    try {
      if (!isValidMicrocosmURI(microcosm_uri)) {
        throw new Error(`Invalid microcosm URI: ${microcosm_uri}`)
      }
      activeMicrocosm.value = microcosm_uri
      const microcosm = manager.register({
        microcosm_uri
      })
      return microcosm
    } catch (e) {
      throw e || new Error(`Failed to register microcosm ${microcosm_uri}`)
    }
  }

  manager.on('microcosms', (refs) => {
    for (const [microcosm_uri, reference] of refs.entries()) {
      microcosmStore.set(microcosm_uri, reference)
    }
  })

  const isActiveMicrocosm = (microcosm_uri: string) => activeMicrocosm.value === microcosm_uri

  const microcosms = computed(() =>
    Array.from(microcosmStore.values())
      .sort(sortByName)
      .filter((m) => isValidMicrocosmURI(m.microcosm_uri))
  )

  return {
    menuOpen,
    identity,
    activeMicrocosm: readonly(activeMicrocosm),
    microcosms,
    onKeyCommand: keys.onKey,
    isActiveMicrocosm,
    registerMicrocosm
  }
})

export type AppState = ReturnType<typeof useApp>
