import { defineStore } from 'pinia'
import { sortMapToArray } from 'nodenoggin/utils'
import { session, ui } from '@/state'
import { useDerived, useState } from '@/hooks/use-state'

export const useApp = defineStore('app', () => {
  const state = useState(ui)

  const identity = useState(session.user)
  const pointer = useState(ui.screen, 'pointer')
  const active = useState(session, 'active')

  const microcosms = useDerived([session], (s) => sortMapToArray(s.microcosms, 'microcosm_uri'))

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
