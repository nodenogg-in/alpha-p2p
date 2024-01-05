import { ref } from 'vue'
import { P2PManager, type NNode } from './p2p'
import { useMicrocosmsStore, type MicrocosmStore, useMicrocosmStore } from './stores/microcosm'
import { defineStore } from 'pinia'

export const useMicrocosm = defineStore('microcosmView', () => {
  const p2p = ref(new P2PManager())
  const ready = ref(false)

  let store!: MicrocosmStore
  const microcosm = useMicrocosmsStore()

  const register = (id: string) => {
    if (id) {
      microcosm.setActiveMicrocosm(id)
      store = useMicrocosmStore(id)
      p2p.value.init('nodenoggin', id)
      p2p.value.getNode((data) => {
        store?.addNode(data as NNode)
      })
      ready.value = true
    }
  }

  const addNode = (newNode: NNode) => {
    store.addNode(newNode)
    p2p.value.sendNode(newNode)
  }

  return {
    ready,
    store,
    addNode,
    register
  }
})
