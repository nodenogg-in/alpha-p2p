import { computed, onBeforeUnmount, readonly, ref, type ComputedRef, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { boolean, map, string } from 'valibot'

import { localReactive, localRef } from '@/utils/hooks/use-local-storage'
import {
  microcosmSchema,
  type Microcosm,
  identitySchema,
  type Identity
} from 'nodenoggin-core/schema'
import { SyncedMicrocosmManager, type SyncedMicrocosm } from 'nodenoggin-core/sync'
import {
  KeyCommands,
  type OnKeyCommand,
  createUserIdentity,
  isValidMicrocosmURI,
  createTimestamp
} from 'nodenoggin-core/utils'

const MAIN_STORE_NAME = 'app' as const

const sortByName = (a: Microcosm, b: Microcosm) => a.microcosm_uri.localeCompare(b.microcosm_uri)

// An global store for managing microcosm state and connectivity.
export const useApp = defineStore(MAIN_STORE_NAME, (): AppState => {
  const identity = localReactive({
    name: [MAIN_STORE_NAME, 'identity'],
    schema: identitySchema,
    defaultValue: createUserIdentity()
  })

  const keys = readonly(new KeyCommands())
  const activeMicrocosm = ref<string>()
  const sidebarOpen = localRef({ name: 'sidebarOpen', schema: boolean(), defaultValue: true })
  const manager = readonly<SyncedMicrocosmManager>(new SyncedMicrocosmManager(identity.user_id))

  // Retrieve existing list of microcosms from local storage
  // and instantiate a reactive store of microcosms
  const microcosmStore = localReactive<Map<string, Microcosm>>({
    name: [MAIN_STORE_NAME, 'microcosms'],
    schema: map(string(), microcosmSchema),
    defaultValue: new Map()
  })

  const unsubscribe = keys.onKey({
    s: () => {
      sidebarOpen.value = !sidebarOpen.value
    }
  })

  onBeforeUnmount(() => {
    unsubscribe()
  })

  const registerMicrocosm = (microcosm_uri: string) => {
    try {
      if (!isValidMicrocosmURI(microcosm_uri)) {
        throw new Error(`Invalid microcosm URI: ${microcosm_uri}`)
      }
      microcosmStore.set(microcosm_uri, {
        microcosm_uri,
        lastAccessed: createTimestamp()
      })
      activeMicrocosm.value = microcosm_uri
      return manager.register({
        microcosm_uri
      })
    } catch (e) {
      throw e || new Error(`Failed to register microcosm ${microcosm_uri}`)
    }
  }

  const isActiveMicrocosm = (microcosm_uri: string) => activeMicrocosm.value === microcosm_uri

  const microcosms = computed(() =>
    Array.from(microcosmStore.values())
      .sort(sortByName)
      .filter((m) => isValidMicrocosmURI(m.microcosm_uri))
  )

  return {
    sidebarOpen,
    identity,
    activeMicrocosm: readonly(activeMicrocosm),
    microcosms,
    onKeyCommand: keys.onKey,
    isActiveMicrocosm,
    registerMicrocosm
  }
})

export type AppState = {
  sidebarOpen: Ref<boolean>
  identity: Identity
  activeMicrocosm: Ref<string | undefined>
  microcosms: ComputedRef<Microcosm[]>
  onKeyCommand: OnKeyCommand
  isActiveMicrocosm: (microcosm_uri: string) => boolean
  registerMicrocosm: (microcosm_uri: string) => SyncedMicrocosm
}
