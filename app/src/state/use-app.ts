import { defineStore } from 'pinia'
import { sortMapToArray } from '@nodenogg.in/utils'
import { session, ui } from '@/state'
import { useDerivedState, useState } from '@/hooks/use-state'

export const useApp = defineStore('app', () => {
  const state = useState(ui)

  const identity = useState(session.user)
  const pointer = useState(ui.screen, 'pointer')
  const active = useState(session, 'active')

  const microcosms = useDerivedState([session], ([s]) =>
    sortMapToArray(s.microcosms, 'microcosm_uri')
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
