import { computed, ref, type ComputedRef, onBeforeUnmount, reactive } from 'vue'
import { defineStore } from 'pinia'
import { is, map, string } from 'valibot'
import { joinRoom } from 'trystero'

import { createTimestamp, createURI } from '@/utils'
import { WebRTCSync, type SyncReadyState } from '@/utils/sync/WebRTCSync'
import { localReactive } from '@/utils/local-storage'
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
  REMOVE_ACTION_NAME,
  updateActionSchema,
  removeActionSchema,
  createActionSchema,
  makeRemoveAction,
  makeUpdateAction,
  makeCreateAction,
  IDENTITY_ACTION_NAME,
  type IdentityAction,
  makeIdentityAction,
  identityActionSchema
} from '@/types/actions'

// import { useVisibilityChange } from '@/utils/visibility'

const APP_STORE_NAME = 'appState' as const

// This hook provides some global helpers for the app.
export const useAppState = defineStore(APP_STORE_NAME, () => {
  const store = useAppInternal()

  return {
    refresh: () => store.syncMicrocosm({ force: true }),
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
  // Like the trystero library it will default to the Webtorrent strategy
  const sync = ref(new WebRTCSync(joinRoom))

  // A reference to the currently active microcosm
  const activeMicrocosm = ref<Microcosm>()

  // This is a placeholder for 'identity' - basically just a unique random string and an optional username
  // If one doesn't exist it will be created when the app first loads.

  // 'localReactive' is a wrapper around vue's reactive() that persists it to local storage.
  const identity = localReactive(['identity'], identitySchema, {
    uid: createUuid()
  })

  // Retrieve existing list of microcosms from local storage
  // and instantiate a reactive store of microcosms
  const microcosms = localReactive([MAIN_STORE_NAME], map(string(), microcosmSchema), new Map())

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
const DEV__LOCAL_NODES_STORE_NAME = 'local' as const
const DEV__REMOTE_NODES_STORE_NAME = 'remote' as const

// The interval in milliseconds for sending out identity updates
const INTERVAL_DURATION = 5000 as const

type PeerIdentity = Identity & {
  peerId: string
}

/**
 * Hook to provide access to a single named Pinia store
 * for each microcosm. Automatically backs up store to localStorage.
 */
export const useMicrocosm = (namespace_id: string, microcosm_id: string) => {
  const internals = useAppInternal()
  const identities = reactive<Map<string, PeerIdentity>>(new Map())
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
  internals.registerMicrocosm(microcosmEntry)

  return defineStore(storeName, () => {
    const connected = ref<SyncReadyState>(false)
    const peers = ref<string[]>([])

    const localNodes = localReactive(
      [storeName, DEV__LOCAL_NODES_STORE_NAME],
      map(string(), nodeSchema),
      new Map()
    )
    const remoteNodes = localReactive(
      [storeName, DEV__REMOTE_NODES_STORE_NAME],
      map(string(), nodeSchema),
      new Map()
    )

    internals.sync.onStateChange((s) => {
      connected.value = s
    })

    internals.sync.onPeersChange((newPeers) => {
      peers.value = [...newPeers]
    })

    // Method to create a new node. If the node is being created by the client,
    // this method will also generate a unique ID and add the identity field to the node
    const createNode = (
      newNodes: ({ id?: string; identity?: Identity } & Omit<Node, 'id' | 'identity'>)[],
      remote: boolean = false
    ) => {
      // Make a new 'create' action
      const action = makeCreateAction(
        newNodes.map((d) => ({
          ...d,
          // This adds id and identity fields to the new node if they don't exist
          // (i.e. nodes being generated by the client)
          id: d.id || createUuid(),
          identity: d.identity || internals.identity
        }))
      )

      // If the action is originating from the client, validate it
      if (!remote && !is(createActionSchema, action)) {
        return
      }

      if (remote) {
        action.data.forEach((d) => remoteNodes.set(d.id, d))
      } else {
        action.data.forEach((d) => localNodes.set(d.id, d))
        internals.sync.sendAction(action)
      }
    }

    // Method to remove a node.
    const removeNode = (data: RemoveAction['data'], remote: boolean = false) => {
      // Make a new 'remove' action
      const action = makeRemoveAction(data)

      // If the action is originating from the client, validate it
      if (!remote && !is(removeActionSchema, action)) {
        return
      }

      if (remote) {
        action.data.forEach(remoteNodes.delete)
      } else {
        action.data.forEach(localNodes.delete)

        // Sync the node via Trystero/WebRTC
        internals.sync.sendAction(action)
      }
    }

    // Method to update a node
    const updateNode = (data: UpdateAction['data'], remote: boolean = false) => {
      // Create an 'update' action
      const action = makeUpdateAction(data)

      // If the action is originating from the client, validate it
      if (!remote && !is(updateActionSchema, action)) {
        return
      }

      if (remote) {
        action.data.forEach((d) => {
          // Patch each node with the update
          const newNode = { ...remoteNodes.get(d.id), ...d }
          remoteNodes.set(d.id, newNode)
        })
      } else {
        action.data.forEach((d) => {
          // Patch each node with the update
          const newNode = { ...localNodes.get(d.id), ...d }
          localNodes.set(d.id, newNode)
        })

        // Sync the node via Trystero/WebRTC
        internals.sync.sendAction(action)
      }
    }

    const updateIdentity = (data: IdentityAction['data'], peerId?: string) => {
      const action = makeIdentityAction(data)

      // If the action is originating from the client, validate it
      if (!peerId && !is(identityActionSchema, action)) {
        return
      }

      if (peerId) {
        identities.set(action.data.uid, {
          ...action.data,
          peerId
        })
      } else {
        // Sync the node via Trystero/WebRTC
        internals.sync.sendAction(action)
      }
    }

    identities.clear()

    const loop = setInterval(() => {
      if (internals.activeMicrocosm?.uri === uri) {
        updateIdentity(internals.identity)
      }
    }, INTERVAL_DURATION)

    onBeforeUnmount(() => {
      clearInterval(loop)
    })

    // This watches for incoming sync events from WebRTC. These are then
    // filtered and the store is updated.
    internals.sync.onAction(([syncURI, action, peerId]) => {
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
        } else if (action.type === IDENTITY_ACTION_NAME) {
          // Update connected identity
          updateIdentity(action.data, peerId)
        }
      }
    })

    return {
      identities,
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
