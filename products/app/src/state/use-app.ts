import { ref } from 'vue'
import { app, api } from '@/state'
import { defineStore } from 'pinia'
import { vue } from '@figureland/kit/state/vue'
import type { Pointer } from '@figureland/kit/browser/pointer'

export const useApp = defineStore('app', () => {
  const ready = vue(api.ready)
  const active = vue(api.active)
  const microcosms = vue(api.references)

  const showCommandMenu = ref(false)

  const toggleCommandMenu = () => (showCommandMenu.value = !showCommandMenu.value)

  app.keycommands.on({
    j: toggleCommandMenu,
    command: toggleCommandMenu
  })

  return {
    identity: vue(api.identity),
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
