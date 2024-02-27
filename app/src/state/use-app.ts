import { defineStore } from 'pinia'
import { sortMapToArray } from 'nodenoggin/utils'
import { api, ui, user } from '@/state/instance'
import { useDerivedRef, useDerivedState, useState } from '@/hooks/use-state'

export const useApp = defineStore('app', () => {
  const state = useState(ui)

  const identity = useState(user)
  const pointer = useDerivedState(ui.window, ({ pointer }) => pointer)
  const microcosms = useDerivedState(api, ({ microcosms }) =>
    sortMapToArray(microcosms, 'microcosm_uri')
  )
  const active = useDerivedRef(api, ({ active }) => active)

  ui.keyboard.onCommand({
    m: () => {
      ui.setKey('menuOpen', (menuOpen) => !menuOpen)
    }
  })

  return {
    state,
    pointer,
    active,
    identity,
    microcosms
  }
})
