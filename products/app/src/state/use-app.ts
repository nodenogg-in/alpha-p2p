import { ref } from 'vue'
import { useSubscribable } from '@figureland/statekit/vue'
import { app } from '@/state'
import { defineStore } from 'pinia'

export const useApp = defineStore('app', () => {
  const ready = useSubscribable(app.session.ready)
  const active = useSubscribable(app.session.active)
  const microcosms = useSubscribable(app.session.microcosms)

  const showCommandMenu = ref(false)

  const toggleCommandMenu = () => (showCommandMenu.value = !showCommandMenu.value)

  app.keycommands.onMany({
    j: toggleCommandMenu,
    command: toggleCommandMenu
  })

  return {
    identity: useSubscribable(app.identity),
    pointer: useSubscribable(app.pointer),
    screen: useSubscribable(app.screen),
    device: useSubscribable(app.device),
    filedrop: useSubscribable(app.filedrop),
    state: useSubscribable(app.ui),
    ready,
    toggleMenu: () => app.ui.key('menuOpen').set((m) => !m),
    showCommandMenu,
    active,
    microcosms
  }
})
