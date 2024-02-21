import { computed, readonly, ref } from 'vue'
import { defineStore } from 'pinia'
import { boolean } from 'valibot'

import { localReactive, localRef } from '@/utils/hooks/use-local-storage'
import { createUserIdentity, isValidMicrocosmURI } from 'nodenoggin/utils'
import { DEFAULT_VIEW, type ViewName } from 'nodenoggin/schema'
import { useRoute, useRouter } from 'vue-router'
import {
  App,
  createYMicrocosm,
  identitySchema,
  microcosmReferenceMap,
  sortMicrocosmsByName,
  Sync
} from 'nodenoggin'
import { useState } from '@/utils/hooks/use-state'

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

  const pointer = useState(App.pointer, 'pointerState')

  const activeMicrocosm = ref<string>()
  const menuOpen = localRef({ name: 'menuOpen', schema: boolean(), defaultValue: true })

  // Retrieve existing list of microcosms from local storage
  // and instantiate a reactive store of microcosms

  App.onKeyCommand({
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
      return Sync.register(createYMicrocosm, identity.user_id, {
        microcosm_uri,
        view
      })
    } catch (e) {
      throw e || new Error(`Failed to register microcosm ${microcosm_uri}`)
    }
  }

  const data = useState(Sync.state, 'data', {
    localStorage: {
      name: [MAIN_STORE_NAME, 'microcosms'],
      schema: microcosmReferenceMap
    }
  })

  const isActiveMicrocosm = (microcosm_uri: string) => activeMicrocosm.value === microcosm_uri

  const gotoMicrocosm = ({
    microcosm_uri = route.params.microcosm_uri as string,
    view
  }: {
    microcosm_uri?: string
    view?: string
  }) => {
    const existing = data.microcosms.get(microcosm_uri)
    if (existing && !view) {
      view = existing.view
    } else if (!existing && !view) {
      view = DEFAULT_VIEW
    }

    router.push({
      name: 'microcosm',
      params: {
        view,
        microcosm_uri
      }
    })
  }

  console.log('app store')
  return {
    menuOpen,
    identity,
    pointer: readonly(pointer),
    activeMicrocosm: readonly(activeMicrocosm),
    microcosms: computed(() => sortMicrocosmsByName(data.microcosms)),
    isActiveMicrocosm,
    registerMicrocosm,
    gotoMicrocosm
  }
})

export type AppState = ReturnType<typeof useApp>
