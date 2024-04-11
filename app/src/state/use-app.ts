import { defineStore } from 'pinia'
import { session, ui } from '@/state'
import { useSubscribable, useState } from '@nodenogg.in/statekit/vue'
import { ref } from 'vue'

export const useApp = defineStore('app', () => {
  const ready = useSubscribable(session.ready)
  const state = useState(ui)

  const filedrop = useState(ui.filedrop)
  const identity = useState(session.user)
  const pointer = useState(ui.screen, 'pointer')
  const active = useState(session, 'active')

  const microcosms = useSubscribable(session.microcosms)
  const device = useState(ui.device)

  const showCommandMenu = ref(false)

  const toggleCommandMenu = () => showCommandMenu.value = !showCommandMenu.value

  ui.keyboard.events.onMany({
    j: toggleCommandMenu,
    command: toggleCommandMenu
  })
  const { toggleMenu } = ui

  return {
    device,
    filedrop,
    ready,
    toggleMenu,
    showCommandMenu,
    state,
    pointer,
    active,
    identity,
    microcosms
  }
})
