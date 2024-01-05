import { getCurrentInstance, onBeforeUnmount, onMounted, ref } from 'vue'
import { defineStore, type Store } from 'pinia'
import { useRouter } from 'vue-router'
import { createTimestamp } from '@/utils'
import { P2PManager, type NNode } from '@/p2p'
import { array, number, object, parse, string, type BaseSchema, map } from 'valibot'
import { get, getMap, set, setMap } from '@/local-storage'

type NNMicrocosmEntry = {
  microcosm_id: string
  lastAccessed: string
}

const appId = 'nodenoggin' as const

const microcosmSchema = object({
  microcosm_id: string(),
  lastAccessed: string()
})

export const useMicrocosmsStore = defineStore('microcosms', () => {
  const microcosms = ref<Map<string, NNMicrocosmEntry>>(getMap(['microcosms'], microcosmSchema))
  const router = useRouter()
  const activeMicrocosm = ref<string>()

  const registerMicrocosm = (microcosm_id: string) => {
    activeMicrocosm.value = microcosm_id

    microcosms.value.set(microcosm_id, {
      microcosm_id,
      lastAccessed: createTimestamp()
    })

    setMap(['microcosms'], microcosms.value)
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

export type MicrocosmStore = {
  nodes: NNode[]
  addNode: (node: NNode) => void
}

const nodeSchema = object({
  content: string(),
  x: number(),
  y: number()
})

export const useMicrocosmStore = (microcosm_id: string): MicrocosmStore => {
  const storeName = `microcosm-${microcosm_id}`

  return defineStore(storeName, () => {
    const nodes = ref<NNode[]>(get([storeName, 'nodes'], array(nodeSchema), []))

    const addNode = (node: NNode) => {
      nodes.value.push(node as NNode)
      set([storeName, 'nodes'], nodes.value)
    }

    return {
      nodes,
      addNode
    }
  })()
}
