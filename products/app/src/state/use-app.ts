import { ref } from 'vue'
import { app } from '@/state'
import { defineStore } from 'pinia'
import { useSubscribable } from '@figureland/statekit/vue'
import type { Pointer } from '@figureland/toolkit/pointer'

export const useApp = defineStore('app', () => {
  const ready = useSubscribable(app.microcosms.ready)
  const active = useSubscribable(app.microcosms.active)
  const microcosms = useSubscribable(app.microcosms.references)

  const showCommandMenu = ref(false)

  const toggleCommandMenu = () => (showCommandMenu.value = !showCommandMenu.value)

  app.keycommands.on({
    j: toggleCommandMenu,
    command: toggleCommandMenu
  })

  return {
    identity: useSubscribable(app.identity),
    pointer: useSubscribable<Pointer>(app.pointer),
    screen: useSubscribable(app.screen),
    device: useSubscribable(app.device),
    filedrop: useSubscribable(app.filedrop.state),
    state: useSubscribable(app.ui),
    ready,
    toggleMenu: () => app.ui.key('menuOpen').set((m) => !m),
    showCommandMenu,
    active,
    microcosms
  }
})
