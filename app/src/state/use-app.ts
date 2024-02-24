import { computed, readonly } from 'vue'
import { defineStore } from 'pinia'
import { useRoute, useRouter } from 'vue-router'

import { sortMapToArray } from 'nodenoggin/utils'
import { DEFAULT_VIEW } from 'nodenoggin/schema'
import { microcosms, ui } from '@/state/instance'

import { useState } from '@/hooks/use-state'

// An global store for managing microcosm state and connectivity.
export const useApp = defineStore('app', () => {
  const router = useRouter()
  const route = useRoute()

  const state = useState(ui, 'state')
  const identity = useState(ui.user, 'identity')
  const pointer = useState(ui.window, 'pointer')
  const data = useState(microcosms, 'data')

  ui.keyboard.onCommand({
    m: () => {
      state.menuOpen = !state.menuOpen
    }
  })

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
    menuOpen: state.menuOpen,
    active: data.active,
    identity,
    isActive: (microcosm_uri: string) => data.active === microcosm_uri,
    pointer: readonly(pointer),
    microcosms: computed(() => sortMapToArray(data.microcosms, 'microcosm_uri')),
    gotoMicrocosm
  }
})

export type ui = ReturnType<typeof useApp>
