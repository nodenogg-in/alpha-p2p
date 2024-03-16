import { defineStore } from 'pinia'
import { sortMapToArray } from '@nodenogg.in/utils'
import { session, ui } from '@/state'
import { useDerived, useSignal, useState } from '@/hooks/use-state'
import type { MicrocosmReference } from '@nodenogg.in/schema'
import type { Session } from '@nodenogg.in/core'

export const useApp = defineStore('app', () => {
  const state = useState(ui)

  const identity = useSignal(session.user.signal)
  const pointer = useState(ui.screen, 'pointer')
  const active = useState(session, 'active')

  const microcosms = useDerived<[Session], MicrocosmReference[]>([session], ([{ microcosms }]) =>
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
