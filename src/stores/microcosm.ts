import { getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue'
import { defineStore } from 'pinia'
import { useRouter } from 'vue-router'
import { createTimestamp } from '@/utils'
import { P2PManager, type NNode } from '@/p2p'

type NNMicrocosmEntry = {
  microcosm_id: string
  lastAccessed: string
}

const appId = 'nodenoggin' as const

export const useMicrocosmsStore = defineStore('microcosms', () => {
  const microcosms = ref<Map<string, NNMicrocosmEntry>>(new Map())
  const router = useRouter()
  const activeMicrocosm = ref<string>()

  const registerMicrocosm = (microcosm_id: string) => {
    activeMicrocosm.value = microcosm_id

    microcosms.value.set(microcosm_id, {
      microcosm_id,
      lastAccessed: createTimestamp()
    })
  }

  const setActiveMicrocosm = (microcosm_id: string, navigate: boolean = false) => {
    registerMicrocosm(microcosm_id)

    if (navigate) {
      router.push({
        name: 'microcosm',
        params: {
          microcosm_id
        }
      })
    }
  }

  return {
    setActiveMicrocosm,
    activeMicrocosm,
    microcosms
  }
})

export const useMicrocosmStore = (microcosm_id: string) => {
  const storeName = `microcosm-${microcosm_id}`

  return defineStore(storeName, () => {
    const nodes = ref<NNode[]>([])

    const addNode = (node: NNode) => {
      nodes.value.push(node as NNode)
    }

    return {
      nodes,
      addNode
    }
  })()
}
