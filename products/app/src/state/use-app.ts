import { ref } from 'vue'
import { useSubscribable } from '@figureland/statekit/vue'
import { app } from '@/state'
import { defineStore } from 'pinia'
import type { MicrocosmReference } from '@nodenogg.in/microcosm'

export const useApp = defineStore('app', () => {
  const ready = useSubscribable(app.microcosms.ready)
  const active = useSubscribable(app.microcosms.active)
  const microcosms = useSubscribable<MicrocosmReference[]>(app.microcosms.references)

  const showCommandMenu = ref(false)

  const toggleCommandMenu = () => (showCommandMenu.value = !showCommandMenu.value)

  app.keycommands.on({
    j: toggleCommandMenu,
    command: toggleCommandMenu
  })

  return {
    identity: useSubscribable(app.identity),
    pointer: useSubscribable(app.pointer),
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
