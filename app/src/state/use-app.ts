import { defineStore } from 'pinia'
import { sortMapToArray } from '@nodenogg.in/utils'
import { session, ui } from '@/state'
import { useDerived, useState } from '@nodenogg.in/state/vue'

export const useApp = defineStore('app', () => {
  const state = useState(ui)

  const identity = useState(session.user)
  const pointer = useState(ui.screen, 'pointer')
  const active = useState(session, 'active')

  const microcosms = useDerived([session], ([{ microcosms }]) =>
    sortMapToArray(microcosms, 'microcosm_uri')
  )

  const { toggleMenu } = ui

  return {
    toggleMenu,
    state,
    pointer,
    active,
    identity,
    microcosms
  }
})
