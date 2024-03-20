import { defineStore } from 'pinia'
import { sortMapToArray } from '@nodenogg.in/utils'
import { session, ui } from '@/state'
import { useDerived, useSignal, useState } from '@nodenogg.in/state/vue'

export const useApp = defineStore('app', () => {
  const ready = useSignal(session.ready)
  const state = useState(ui)

  const filedrop = useState(ui.filedrop)
  const identity = useState(session.user)
  const pointer = useState(ui.screen, 'pointer')
  const active = useState(session, 'active')

  const microcosms = useDerived([session], ([{ microcosms }]) =>
    sortMapToArray(microcosms, 'microcosm_uri')
  )

  const { toggleMenu } = ui

  return {
    filedrop,
    ready,
    toggleMenu,
    state,
    pointer,
    active,
    identity,
    microcosms
  }
})
