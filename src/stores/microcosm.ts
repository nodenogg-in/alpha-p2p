import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { array, is } from 'valibot'
import { joinRoom } from 'trystero'

import { createTimestamp } from '@/utils/string'
import { WebRTCSync, type NNode } from '@/utils/sync/WebRTCSync'
import { get, getMap, set, setMap } from '@/utils/local-storage'
import { microcosmSchema, nodeSchema } from '@/utils/validation'
import { uuid } from '@/utils/uuid'

type NNMicrocosmEntry = {
  uri: string
  microcosm_id: string
  namespace_id: string
  lastAccessed: string
}

const MAIN_STORE_NAME = 'microcosms' as const

export const useMicrocosms = defineStore(MAIN_STORE_NAME, () => {
  const sync = ref(new WebRTCSync())

  // Retrieve existing list of microcosms from local storage
  const existingMicrocosms = getMap([MAIN_STORE_NAME], microcosmSchema)

  // Instantiate a reactive store of microcosms
  const microcosms = ref<Map<string, NNMicrocosmEntry>>(existingMicrocosms)

  // Reactive store to track active microcosm
  const active = ref<string>()

  // Method to load up a new microcosm
  const registerMicrocosm = (namespace_id: string, microcosm_id: string) => {
    // Create our URI, which is a globally unique identifier for a microcosm
    const uri = `${namespace_id}/${microcosm_id}`

    active.value = uri

    microcosms.value.set(uri, {
      uri,
      microcosm_id,
      namespace_id,
      lastAccessed: createTimestamp()
    })

    // Persist store to local storage
    setMap([MAIN_STORE_NAME], microcosms.value)

    // Start the p2p sync with trystero
    sync.value.init(namespace_id, microcosm_id, joinRoom)
  }

  // Derived value representing the currently active microcosm, if there is one
  const activeMicrocosm = computed(() => microcosms.value.get(active.value || ''))

  return {
    sync,
    activeMicrocosm,
    registerMicrocosm,
    microcosms
  }
})

export type MicrocosmStore = {
  nodes: NNode[]
  addNode: (node: Omit<NNode, 'id'>, sync?: boolean) => void
}

const MICROCOSM_STORE_NAME = 'microcosm' as const
const NODES_STORE_NAME = 'nodes' as const

/**
 * Hook to provide access to a single named Pinia store
 * for each microcosm. Automatically backs up store to localStorage.
 */
export const useMicrocosmStore = (namespace_id: string, microcosm_id: string): MicrocosmStore => {
  const microcosms = useMicrocosms()

  // Create a unique identifier for our microcosm's store
  const storeName = [MICROCOSM_STORE_NAME, namespace_id, microcosm_id].join('_')

  // Register our microcosm with the main store
  microcosms.registerMicrocosm(namespace_id, microcosm_id)

  return defineStore(storeName, () => {
    // Retrieve existing nodes from local storage
    const storedNodes = get([storeName, NODES_STORE_NAME], array(nodeSchema), [])

    // Reactive list of nodes in each microcosm
    const nodes = ref<MicrocosmStore['nodes']>(storedNodes)

    // Method to add a new node
    const addNode: MicrocosmStore['addNode'] = (node, sync = false) => {
      const newNode = {
        id: uuid(),
        ...node
      }
      nodes.value.push(newNode)
      set([storeName, NODES_STORE_NAME], nodes.value)

      // Sync the node via Trystero/WebRTC
      if (sync) {
        microcosms.sync.sendNode(newNode)
      }
    }

    // Triggered when the WebRTC sync receives a new node
    microcosms.sync.getNode((data) => {
      // Validate that it is a valid nodenoggin node object
      if (is(nodeSchema, data)) {
        // If valid, add it to the store
        addNode(data)
      }
    })

    return {
      nodes,
      addNode
    }
  })()
}
