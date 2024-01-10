import { computed, ref, onBeforeUnmount, reactive } from 'vue'
import { defineStore } from 'pinia'
import { is, map, string } from 'valibot'
import { joinRoom } from 'trystero'
import PQueue from 'p-queue'

import { createTimestamp, createURI } from '@/utils'
import { WebRTCSync } from '@/utils/sync/WebRTCSync'
import { localReactive } from '@/utils/local-storage'
import {
  microcosmSchema,
  type Microcosm,
  identitySchema,
  type Identity,
  type NodeContent
} from '@/types/schema'
import { createUuid } from '@/utils'
import {
  type UpdateNodeAction,
  type RemoveNodeAction,
  CREATE_ACTION_NAME,
  UPDATE_ACTION_NAME,
  REMOVE_ACTION_NAME,
  type IdentityAction,
  makeIdentityAction,
  identityActionSchema,
  IDENTITY_STATUS,
  IDENTITY_ACTION_NAME,
  type CreateNodeAction,
  createNodeActionSchema,
  updateNodeActionSchema,
  removeNodeActionSchema
} from '@/types/actions'
import { useVisibilityChange } from '@/utils/visibility'
import { getLocalIdentity, signData, verifySignature } from '../utils/crypto'
import { useMicrocosm, type MicrocosmStore } from './use-microcosm'

export const groupMicrocosmsByNamespace = (microcosms: Map<string, Microcosm>) => {
  const nsMap = new Map<string, Microcosm[]>()

  microcosms.forEach((microcosm) => {
    const { namespace_id } = microcosm

    if (!nsMap.has(namespace_id)) {
      nsMap.set(namespace_id, [])
    }

    nsMap.get(namespace_id)?.push(microcosm)
  })

  return nsMap
}

const MAIN_STORE_NAME = 'app' as const

// The interval in milliseconds for sending out identity updates
const INTERVAL_DURATION = 5000 as const
const JOB_CONCURRENCY = 10 as const

type PeerIdentity = Identity & {
  peerId: string
}

const validateAction = async (
  action: CreateNodeAction | UpdateNodeAction | RemoveNodeAction,
  user_id: string,
  key?: CryptoKey
): Promise<boolean> => {
  if (!key) {
    return false
  }
  if (action.data.user_id !== user_id) {
    return true
  }

  console.log('verifying signature')

  return await verifySignature(
    key,
    action.data.signature,
    action.type === 'remove' ? 'remove' : action.data.content
  )
}

// An global store for managing microcosm state and connectivity.
export const useAppState = defineStore(MAIN_STORE_NAME, () => {
  // Sets up a trystero WebRTC connection to sync
  // You can optionally supply a sync strategy (Firebase or IPFS) as an argument to the constructor.
  // Like the trystero library it will default to the Webtorrent strategy
  const sync = ref(new WebRTCSync(joinRoom))
  const queue = new PQueue({ concurrency: JOB_CONCURRENCY })
  const dispatchQueue = new PQueue({ concurrency: JOB_CONCURRENCY })
  // Reactive array of identities connected to current microcosm/room pairing
  const peerIdentities = reactive<Map<string, PeerIdentity>>(new Map())

  // Dynamic store for current microcosm
  const microcosm = ref<MicrocosmStore>()

  // Signing keys for validating personal data
  const keys = ref<CryptoKeyPair>()

  // Identity store (user_id and username)
  // 'localReactive' is a wrapper around vue's reactive() that persists it to local storage.
  const identity = localReactive('identity', identitySchema, {
    user_id: createUuid()
  })

  getLocalIdentity().then((storedKeys) => {
    keys.value = storedKeys
  })

  // Retrieve existing list of microcosms from local storage
  // and instantiate a reactive store of microcosms
  const microcosms = localReactive([MAIN_STORE_NAME], map(string(), microcosmSchema), new Map())

  const connectMicrocosmToWebRTC = ({ force }: { force?: boolean } = {}) => {
    if (microcosm.value) {
      const { namespace_id, microcosm_id } = microcosm.value
      sync.value.connect(namespace_id, microcosm_id, force)
    }
  }

  const dispatchNodes = () => {
    if (microcosm.value) {
      microcosm.value.getAllNodes().forEach((data) => {
        dispatchQueue.add(() => sync.value.sendAction({ type: 'create', data }))
      })
    }
  }

  const updateIdentity = (data: IdentityAction['data'], peerId?: string) => {
    if (peerId) {
      if (data.status === IDENTITY_STATUS.Join) {
        if (!peerIdentities.get(data.user_id)) {
          dispatchNodes()
          peerIdentities.set(data.user_id, {
            ...data,
            peerId
          })
        }
      } else {
        peerIdentities.delete(data.user_id)
      }
    } else {
      const action = makeIdentityAction(data)

      // If the action is originating from the client, validate it
      if (!peerId && !is(identityActionSchema, action)) {
        return
      }
      // Sync the node via Trystero/WebRTC
      sync.value.sendAction(action)
    }
  }

  // CREATE

  const createNodeRemote = async (payload: CreateNodeAction) => {
    queue.add(async () => {
      // If the action is coming from a remote source, validate its contents and signature
      if (is(createNodeActionSchema, payload)) {
        const isValid = await validateAction(payload, identity.user_id, keys.value?.publicKey)
        if (isValid) {
          const isRemote = identity.user_id !== payload.data.user_id
          microcosm.value?.createNode(payload.data, isRemote)
        }
      }
    })
  }

  const createNode = async (payload: NodeContent) => {
    queue.add(async () => {
      const signature = await signData(keys.value?.privateKey as CryptoKey, payload)

      const action: CreateNodeAction = {
        type: 'create',
        data: {
          id: createUuid(),
          user_id: identity.user_id,
          updated: createTimestamp(),
          signature,
          content: payload
        }
      }

      microcosm.value?.createNode(action.data, false)
      sync.value.sendAction(action)
    })
  }

  // REMOVE

  // Method to remove a node.
  const removeNodeRemote = (payload: string | RemoveNodeAction) => {
    queue.add(async () => {
      // If the action is coming from a remote source, validate its contents and signature
      if (is(removeNodeActionSchema, payload)) {
        const isValid = await validateAction(payload, identity.user_id, keys.value?.publicKey)
        if (isValid) {
          const isRemote = identity.user_id !== payload.data.user_id
          microcosm.value?.removeNode(payload.data, isRemote)
        }
      }
    })
  }

  const removeNode = (id: string) => {
    queue.add(async () => {
      const targetNode = microcosm.value?.getNode(id)

      if (!targetNode) {
        return
      }

      const signature = await signData(keys.value?.privateKey as CryptoKey, 'remove')
      const action: RemoveNodeAction = {
        type: 'remove',
        data: {
          ...targetNode,
          signature
        }
      }

      microcosm.value?.removeNode(action.data, false)
      sync.value.sendAction(action)
    })
  }

  // UPDATE

  // Method to update a node
  const updateNodeRemote = (payload: UpdateNodeAction) => {
    queue.add(async () => {
      // If the action is coming from a remote source, validate its contents and signature
      if (is(updateNodeActionSchema, payload)) {
        const isValid = await validateAction(payload, identity.user_id, keys.value?.publicKey)
        if (isValid) {
          const isRemote = identity.user_id !== payload.data.user_id
          microcosm.value?.updateNode(payload.data, isRemote)
        }
      }
    })
  }

  const updateNode = (
    id: string,
    payload: Partial<UpdateNodeAction['data']['content']>,
    dispatch: boolean = true
  ) => {
    queue.add(async () => {
      const targetNode = microcosm.value?.getNode(id)

      if (!targetNode) {
        return
      }

      const signature = await signData(keys.value?.privateKey as CryptoKey, payload)

      const action: UpdateNodeAction = {
        type: 'update',
        data: {
          ...targetNode,
          signature,
          updated: createTimestamp(),
          content: payload
        }
      }

      microcosm.value?.updateNode(action.data, false)
      if (dispatch) {
        sync.value.sendAction(action)
      }
    })
  }

  const leaveMicrocosm = () => {
    updateIdentity({ ...identity, status: IDENTITY_STATUS.Leave })
    peerIdentities.clear()
  }

  // Method to load up a new microcosm and make it the active one

  const registerMicrocosm = (namespace_id: string, microcosm_id: string) => {
    const uri = createURI(namespace_id, microcosm_id)

    if (uri !== microcosm.value?.uri) {
      const microcosmEntry: Microcosm = {
        uri,
        microcosm_id,
        namespace_id,
        lastAccessed: createTimestamp()
      }

      microcosm.value = useMicrocosm(namespace_id, microcosm_id)
      if (microcosm.value) leaveMicrocosm()

      microcosms.set(microcosmEntry.uri, microcosmEntry)

      connectMicrocosmToWebRTC()

      // This watches for incoming sync events from WebRTC. These are then
      // filtered and the store is updated.
      sync.value.onAction(([syncURI, action, peerId]) => {
        if (microcosm.value?.uri === syncURI) {
          if (action.type === CREATE_ACTION_NAME) {
            // Create a new node
            createNodeRemote(action)
          } else if (action.type === UPDATE_ACTION_NAME) {
            // Update node partially
            updateNodeRemote(action)
          } else if (action.type === REMOVE_ACTION_NAME) {
            // Remove node
            removeNodeRemote(action)
          } else if (action.type === IDENTITY_ACTION_NAME) {
            updateIdentity(action.data, peerId)
          }
        }
      })

      updateIdentity({ ...identity, status: IDENTITY_STATUS.Join })
    }
  }

  const clearout = () => {
    leaveMicrocosm()
    clearInterval(loop)
    sync.value.leave()
  }

  // If the page visibility changes
  useVisibilityChange((visible) => {
    if (!visible) {
      // leaveMicrocosm()
    } else {
      // updateIdentity({ ...identity, status: IDENTITY_STATUS.Join })
    }
  })

  // Periodically send out a beacon
  const loop = setInterval(() => {
    updateIdentity({ ...identity, status: IDENTITY_STATUS.Join })
  }, INTERVAL_DURATION)

  onBeforeUnmount(() => {
    clearout()
  })

  return {
    createNode,
    updateNode,
    removeNode,
    peerIdentities,
    identity,
    microcosm,
    registerMicrocosm,
    namespaces: computed(() => groupMicrocosmsByNamespace(microcosms))
  }
})

export type AppState = ReturnType<typeof useAppState>
