import { computed, readonly, ref } from 'vue'
import { defineStore } from 'pinia'
import { boolean } from 'valibot'
import { useRoute, useRouter } from 'vue-router'

import { sortMapToArray } from 'nodenoggin/utils'
import { DEFAULT_VIEW, type ViewName } from 'nodenoggin/schema'
import { microcosms, appState } from '@/state/instance'

import { localRef } from '@/utils/hooks/use-local-storage'
import { useStateInstance } from '@/utils/hooks/use-state-instance'
import { getPersistenceName } from 'nodenoggin'

const MAIN_STORE_NAME = 'app' as const

// An global store for managing microcosm state and connectivity.
export const useApp = defineStore(MAIN_STORE_NAME, () => {
  const router = useRouter()
  const route = useRoute()

  const identity = useStateInstance(appState.user, 'identity')

  const pointer = useStateInstance(appState.window, 'pointer')

  const activeMicrocosm = ref<string>()
  const menuOpen = localRef({
    name: getPersistenceName('menu-open'),
    schema: boolean(),
    defaultValue: () => true
  })

  // Retrieve existing list of microcosms from local storage
  // and instantiate a reactive store of microcosms

  appState.keyboard.onCommand({
    m: () => {
      menuOpen.value = !menuOpen.value
    }
  })

  const registerMicrocosm = (microcosm_uri: string, view: ViewName) => {
    try {
      activeMicrocosm.value = microcosm_uri
      return microcosms.register({
        user_id: identity.user_id,
        microcosm_uri,
        view
      })
    } catch (e) {
      throw e || new Error(`Failed to register microcosm ${microcosm_uri}`)
    }
  }

  const data = useStateInstance(microcosms, 'data')

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

  return {
    menuOpen,
    identity,
    pointer: readonly(pointer),
    activeMicrocosm: readonly(activeMicrocosm),
    microcosms: computed(() => sortMapToArray(data.microcosms, 'microcosm_uri')),
    isActiveMicrocosm,
    registerMicrocosm,
    gotoMicrocosm
  }
})

export type appState = ReturnType<typeof useApp>
