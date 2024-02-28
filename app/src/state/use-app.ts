import { defineStore } from 'pinia'
import { sortMapToArray } from 'nodenoggin/utils'
import { api, ui } from '@/state/instance'
import { useDerived, useState } from '@/hooks/use-state'

export const useApp = defineStore('app', () => {
  const state = useState(ui)

  const identity = useState(api.user)
  const pointer = useState(ui.window, 'pointer')
  const active = useState(api, 'active')

  const microcosms = useDerived(api, ({ microcosms }) =>
    sortMapToArray(microcosms, 'microcosm_uri')
  )

  const toggleMenu = () => {
    ui.setKey('menuOpen', (menuOpen) => !menuOpen)
  }

  ui.keyboard.onCommand({
    m: toggleMenu
  })

  return {
    toggleMenu,
    state,
    pointer,
    active,
    identity,
    microcosms
  }
})
