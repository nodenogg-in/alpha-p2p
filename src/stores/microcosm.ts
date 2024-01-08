import { computed, ref, type ComputedRef, onBeforeUnmount } from 'vue'
import { defineStore } from 'pinia'
import { map, string } from 'valibot'

import { createTimestamp, createURI } from '@/utils'
import { WebRTCSync, type SyncReadyState } from '@/utils/sync/WebRTCSync'
import { useLocalReactive } from '@/utils/local-storage'
import {
  microcosmSchema,
  nodeSchema,
  type Microcosm,
  type Node,
  identitySchema,
  type Identity
} from '@/types/schema'
import { createUuid } from '@/utils'
import {
  type UpdateAction,
  type RemoveAction,
  CREATE_ACTION_NAME,
  UPDATE_ACTION_NAME,
  REMOVE_ACTION_NAME
} from '@/types/actions'

// import { useVisibilityChange } from '@/utils/visibility'

const APP_STORE_NAME = 'appState' as const

// This hook provides some global helpers for the app.
export const useAppState = defineStore(APP_STORE_NAME, () => {
  const store = useAppInternal()

  return {
    refresh: store.syncMicrocosm,
    identity: computed(() => store.identity),
    namespaces: computed(() => store.namespaces),
    activeMicrocosm: computed(() => store.activeMicrocosm)
  }
})

const MAIN_STORE_NAME = 'app' as const

// An internal-only store that manages a few central pieces of data
// and connectivity. It's not meant to be consumed outside this file.
const useAppInternal = defineStore(MAIN_STORE_NAME, () => {
  // Sets up a trystero WebRTC connection to sync
  // You can optionally supply a sync strategy (Firebase or IPFS) as an argument to the constructor.
  // Like the original trystero library will default to the Webtorrent strategy
  const sync = ref(new WebRTCSync())
  const activeMicrocosm = ref<Microcosm>()

  // This is a placeholder for 'identity' - basically just a unique random string
  // 'useLocalRef' is a wrapped around vue's ref() that persists it to local storage.
  const identity = useLocalReactive(['identity'], identitySchema, {
    uid: createUuid()
  })

  // Retrieve existing list of microcosms from local storage
  // and instantiate a reactive store of microcosms
  const microcosms = useLocalReactive([MAIN_STORE_NAME], map(string(), microcosmSchema), new Map())

  const syncMicrocosm = ({
    microcosm = activeMicrocosm.value,
    force
  }: { force?: boolean; microcosm?: Microcosm } = {}) => {
    if (microcosm) {
      sync.value.connect(microcosm.namespace_id, microcosm.microcosm_id, force)
    }
  }

  // Method to load up a new microcosm and make it the active one
  const registerMicrocosm = (microcosm: Microcosm) => {
    activeMicrocosm.value = microcosm
    microcosms.set(microcosm.uri, microcosm)
    syncMicrocosm()
  }

  // useVisibilityChange((visible) => {
  //   if (!visible) {
  //     sync.value.leave()
  //   }
  // })

  // Create a reactive store with microcosms grouped by namespace
  const namespaces: ComputedRef<Map<string, Microcosm[]>> = computed(() => {
    const nsMap = new Map()

    microcosms.forEach((microcosm) => {
      const { namespace_id } = microcosm

      if (!nsMap.has(namespace_id)) {
        nsMap.set(namespace_id, [])
      }

      nsMap.get(namespace_id)?.push(microcosm)
    })

    return nsMap
  })

  onBeforeUnmount(() => {
    sync.value.leave()
  })

  return {
    identity,
    sync,
    activeMicrocosm,
    syncMicrocosm,
    registerMicrocosm,
    microcosms,
    namespaces
  }
})

const MICROCOSM_STORE_NAME = 'microcosm' as const
const DEV__LOCAL_NODES_STORE_NAME = 'local_nodes' as const
const DEV__REMOTE_NODES_STORE_NAME = 'remote_nodes' as const

/**
 * Hook to provide access to a single named Pinia store
 * for each microcosm. Automatically backs up store to localStorage.
 */
export const useMicrocosm = (namespace_id: string, microcosm_id: string) => {
  const microcosms = useAppInternal()

  // Create our URI, which is a globally unique identifier for a microcosm
  const uri = createURI(namespace_id, microcosm_id)

  // Create a unique identifier for our microcosm's store
  const storeName = [MICROCOSM_STORE_NAME, uri].join('/')

  const microcosmEntry: Microcosm = {
    uri,
    microcosm_id,
    namespace_id,
    lastAccessed: createTimestamp()
  }

  // Register our microcosm with the main store
  microcosms.registerMicrocosm(microcosmEntry)

  return defineStore(storeName, () => {
    const connected = ref<SyncReadyState>(false)
    const peers = ref<string[]>([])
    const localNodes = useLocalReactive(
      [storeName, DEV__LOCAL_NODES_STORE_NAME],
      map(string(), nodeSchema),
      new Map()
    )
    const remoteNodes = useLocalReactive(
      [storeName, DEV__REMOTE_NODES_STORE_NAME],
      map(string(), nodeSchema),
      new Map()
    )

    microcosms.sync.onStateChange((s) => {
      connected.value = s
    })

    microcosms.sync.onPeersChange((newPeers) => {
      peers.value = [...newPeers]
    })

    // Method to create a new node. If the node is being created by the client,
    // this method will also generate a unique ID and add the author field to the node
    const createNode = (
      newNodes: ({ id?: string; identity?: Identity } & Omit<Node, 'id' | 'identity'>)[],
      remote: boolean = false
    ) => {
      const data: Node[] = newNodes.map((d) => ({
        // This adds id and identity fields to the new node if they don't exist
        // (i.e. nodes being generated by the client)
        ...d,
        id: d.id || createUuid(),
        identity: d.identity || microcosms.identity
      }))

      if (remote) {
        data.forEach((d) => remoteNodes.set(d.id, d))
      } else {
        data.forEach((d) => localNodes.set(d.id, d))
        microcosms.sync.sendAction({
          type: 'create',
          data
        })
      }
    }

    // Method to remove a node.
    const removeNode = (data: RemoveAction['data'], remote: boolean = false) => {
      // Sync the node via Trystero/WebRTC
      if (remote) {
        data.forEach(remoteNodes.delete)
      } else {
        data.forEach(localNodes.delete)
        microcosms.sync.sendAction({ type: 'remove', data })
      }
    }

    // Method to update a node
    const updateNode = (data: UpdateAction['data'], remote: boolean = false) => {
      // Sync the node via Trystero/WebRTC
      if (remote) {
        data.forEach((action) => {
          // Patch each node with the update
          const newNode = { ...remoteNodes.get(action.id), ...action }
          remoteNodes.set(action.id, newNode)
        })
      } else {
        data.forEach((action) => {
          // Patch each node with the update
          const newNode = { ...localNodes.get(action.id), ...action }
          localNodes.set(action.id, newNode)
        })
        microcosms.sync.sendAction({ type: 'update', data })
      }
    }

    // This watches for incoming sync events from WebRTC. These are then
    // filtered and the store is updated.
    microcosms.sync.onAction(([syncURI, action]) => {
      if (uri === syncURI) {
        if (action.type === CREATE_ACTION_NAME) {
          // Create a new node
          createNode(action.data, true)
        } else if (action.type === UPDATE_ACTION_NAME) {
          // Update node partially
          updateNode(action.data, true)
        } else if (action.type === REMOVE_ACTION_NAME) {
          // Remove node
          removeNode(action.data, true)
        }
      }
    })

    return {
      connected,
      peers,
      localNodes,
      remoteNodes,
      createNode,
      updateNode,
      removeNode
    }
  })()
}

export type MicrocosmStore = ReturnType<typeof useMicrocosm>
