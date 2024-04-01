import { defineStore } from 'pinia'
import { session, ui } from '@/state'
import { useSignal, useState } from '@nodenogg.in/statekit/vue'

export const useApp = defineStore('app', () => {
  const ready = useSignal(session.ready)
  const state = useState(ui)

  const filedrop = useState(ui.filedrop)
  const identity = useState(session.user)
  const pointer = useState(ui.screen, 'pointer')
  const active = useState(session, 'active')

  const microcosms = useSignal(session.microcosms)
  const device = useState(ui.device)

  const { toggleMenu } = ui

  return {
    device,
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
