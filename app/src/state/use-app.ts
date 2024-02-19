import { computed, readonly, ref } from 'vue'
import { defineStore } from 'pinia'
import { boolean } from 'valibot'

import { localReactive, localRef } from '@/utils/hooks/use-local-storage'
import { createUserIdentity, isValidMicrocosmURI } from 'nodenoggin-core/utils'
import { DEFAULT_VIEW, type ViewName } from 'nodenoggin-core/views'
import { KeyCommands } from 'nodenoggin-core/ui'
import { useRoute, useRouter } from 'vue-router'
import {
  MicrocosmManager,
  createYMicrocosm,
  identitySchema,
  type MicrocosmReferenceMap,
  microcosmReferenceMap,
  sortMicrocosmsByName
} from 'nodenoggin-core'

const MAIN_STORE_NAME = 'app' as const

// An global store for managing microcosm state and connectivity.
export const useApp = defineStore(MAIN_STORE_NAME, () => {
  const router = useRouter()
  const route = useRoute()

  const identity = localReactive({
    name: [MAIN_STORE_NAME, 'identity'],
    schema: identitySchema,
    defaultValue: createUserIdentity()
  })

  const keys = readonly(new KeyCommands())
  const activeMicrocosm = ref<string>()
  const menuOpen = localRef({ name: 'menuOpen', schema: boolean(), defaultValue: true })
  const manager = new MicrocosmManager(identity.user_id, createYMicrocosm)

  // Retrieve existing list of microcosms from local storage
  // and instantiate a reactive store of microcosms
  const microcosms = localReactive<MicrocosmReferenceMap>({
    name: [MAIN_STORE_NAME, 'microcosms'],
    schema: microcosmReferenceMap,
    defaultValue: new Map()
  })

  keys.onKey({
    m: () => {
      menuOpen.value = !menuOpen.value
    }
  })

  const registerMicrocosm = (microcosm_uri: string, view: ViewName) => {
    try {
      if (!isValidMicrocosmURI(microcosm_uri)) {
        throw new Error(`Invalid microcosm URI: ${microcosm_uri}`)
      }
      activeMicrocosm.value = microcosm_uri
      return manager.register({
        microcosm_uri,
        view
      })
    } catch (e) {
      throw e || new Error(`Failed to register microcosm ${microcosm_uri}`)
    }
  }

  manager.on('microcosms', (m) => {
    for (const [uri, ref] of m) {
      microcosms.set(uri, ref)
    }
  })

  const isActiveMicrocosm = (microcosm_uri: string) => activeMicrocosm.value === microcosm_uri

  const gotoMicrocosm = ({
    microcosm_uri = route.params.microcosm_uri as string,
    view = DEFAULT_VIEW
  }: {
    microcosm_uri?: string
    view?: string
  }) => {
    const existing = microcosms.get(microcosm_uri)
    if (existing) {
      view = existing.view
    }
    router.push({
      name: 'microcosm',
      params: {
        view,
        microcosm_uri
      }
    })
  }

  return {
    menuOpen,
    identity,
    activeMicrocosm: readonly(activeMicrocosm),
    microcosms: computed(() => sortMicrocosmsByName(microcosms)),
    onKeyCommand: keys.onKey,
    isActiveMicrocosm,
    registerMicrocosm,
    gotoMicrocosm
  }
})

export type AppState = ReturnType<typeof useApp>
