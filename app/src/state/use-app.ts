import { defineStore } from 'pinia'
import { sortMapToArray } from 'nodenoggin/utils'
import { app, ui } from '@/state/instance'
import { useDerived, useState } from '@/hooks/use-state'

export const useApp = defineStore('app', () => {
  const state = useState(ui)

  const identity = useState(app.user)
  const pointer = useState(ui.window, 'pointer')
  const active = useState(app, 'active')

  const microcosms = useDerived(app, ({ microcosms }) =>
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
