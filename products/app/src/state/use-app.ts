import { ref } from 'vue'
import { useSubscribable } from '@figureland/statekit/vue'
import { identity, screen, session, pointer, keycommands, filedrop, device, ui } from '@/state'
import { defineStore } from 'pinia'

export const useApp = defineStore('app', () => {
  const ready = useSubscribable(session.ready)
  const active = useSubscribable(session.key('active'))
  const microcosms = useSubscribable(session.microcosms)

  const showCommandMenu = ref(false)

  const toggleCommandMenu = () => (showCommandMenu.value = !showCommandMenu.value)

  keycommands.onMany({
    j: toggleCommandMenu,
    command: toggleCommandMenu
  })

  return {
    identity: useSubscribable(identity),
    pointer: useSubscribable(pointer),
    screen: useSubscribable(screen),
    device: useSubscribable(device),
    filedrop: useSubscribable(filedrop),
    state: useSubscribable(ui),
    ready,
    toggleMenu: () => ui.key('menuOpen').set((m) => !m),
    showCommandMenu,
    active,
    microcosms
  }
})
