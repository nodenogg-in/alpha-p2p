import { computed } from 'vue'
import { defineStore } from 'pinia'

import { sortMapToArray } from 'nodenoggin/utils'
import { microcosms, ui, user } from '@/state/instance'

import { useState } from '@/hooks/use-state'

// An global store for managing microcosm state and connectivity.
export const useApp = defineStore('app', () => {
  const state = useState(ui)

  const identity = useState(user)
  const data = useState(microcosms)
  const win = useState(ui.window)

  ui.keyboard.onCommand({
    m: () => {
      ui.setKey('menuOpen', (menuOpen) => !menuOpen)
    }
  })

  return {
    state,
    pointer: computed(() => win.pointer),
    active: computed(() => data.active),
    identity,
    microcosms: computed(() => sortMapToArray(data.microcosms, 'microcosm_uri'))
  }
})
