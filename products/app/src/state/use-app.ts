import { ref } from 'vue'
import { app } from '@/state'
import { defineStore } from 'pinia'
import { vue } from '@figureland/kit/state/vue'
import type { Pointer } from '@figureland/kit/browser/pointer'

export const useApp = defineStore('app', () => {
  const ready = vue(app.microcosms.ready)
  const active = vue(app.microcosms.active)
  const microcosms = vue(app.microcosms.references)

  const showCommandMenu = ref(false)

  const toggleCommandMenu = () => (showCommandMenu.value = !showCommandMenu.value)

  app.keycommands.on({
    j: toggleCommandMenu,
    command: toggleCommandMenu
  })

  return {
    identity: vue(app.identity),
    pointer: vue<Pointer>(app.pointer),
    screen: vue(app.screen),
    device: vue(app.device),
    filedrop: vue(app.filedrop.state),
    state: vue(app.ui),
    ready,
    toggleMenu: () => app.ui.key('menuOpen').set((m) => !m),
    showCommandMenu,
    active,
    microcosms
  }
})
