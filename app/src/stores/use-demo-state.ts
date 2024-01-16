import { deepmerge } from 'deepmerge-ts'
import { defineStore } from 'pinia'
import { object, string, type Input, map, is } from 'valibot'
import { computed, inject, reactive, ref, type InjectionKey, watch } from 'vue'
import PQueue from 'p-queue'
// import myworker from './worker-example?worker'

// const worker = new myworker()
// worker.postMessage('any')

// worker.onmessage = (v) => {
//   console.log(v)
// }

import {
  IDENTITY_STATUS,
  type CreateNodeAction,
  type RemoveNodeAction,
  type UpdateNodeAction,
  UPDATE_ACTION_NAME,
  REMOVE_ACTION_NAME,
  IDENTITY_ACTION_NAME,
  CREATE_ACTION_NAME,
  removeNodeActionSchema,
  updateNodeActionSchema,
  createNodeActionSchema,
  type IdentifyAction
} from '@/types/actions'
import { nodeSchema, type Node, type Identity, type NodeContent } from '@/types/schema'
import { createTimestamp, createUuid } from '@/utils'
import { localReactive } from '@/utils/local-storage'
import { useIdentity } from './use-identity'
import { useAppState } from './use-app-state'
import { createFirebaseSync } from '@/utils/sync/firebase-sync'
import { WebRTCSync } from '@/utils/sync/WebRTCSync'
import { useVisibility } from '@/utils/visibility'

export const newMicrocosmSchema = object({
  microcosm_id: string()
})

export type NewMicrocosmSchema = Input<typeof newMicrocosmSchema>

// The interval in milliseconds for sending out identity updates
const INTERVAL_DURATION = 5000 as const
const JOB_CONCURRENCY = 10 as const

type PeerIdentity = Identity & {
  status: IDENTITY_STATUS
}

const MICROCOSM_STORE_NAME = 'microcosm' as const
const DEV__LOCAL_NODES_STORE_NAME = 'local' as const
const DEV__REMOTE_NODES_STORE_NAME = 'remote' as const

export const useStore = (microcosm_uri: string) => {
  // Create a unique identifier for our microcosm's store
  const storeName = [MICROCOSM_STORE_NAME, microcosm_uri].join('/')

  return defineStore(storeName, () => {
    const uri = microcosm_uri
    const app = useAppState()
    // Sets up a trystero WebRTC connection to sync
    // You can optionally supply a sync strategy (Firebase or IPFS) as an argument to the constructor.
    // Like the trystero library it will default to the Webtorrent strategy
    const sync = ref<WebRTCSync>(createFirebaseSync(uri))
    const identity = useIdentity()
    const status = ref<IDENTITY_STATUS>(IDENTITY_STATUS.Join)

    const queue = new PQueue({ concurrency: JOB_CONCURRENCY })
    const dispatchQueue = new PQueue({ concurrency: JOB_CONCURRENCY })

    // Reactive array of identities connected to current microcosm/room pairing
    const peerIdentities = reactive<Map<string, PeerIdentity>>(new Map())

    const localNodes = localReactive<Map<string, Node>>(
      [storeName, DEV__LOCAL_NODES_STORE_NAME],
      map(string(), nodeSchema),
      new Map()
    )

    const remoteNodes = localReactive<Map<string, Node>>(
      [storeName, DEV__REMOTE_NODES_STORE_NAME],
      map(string(), nodeSchema),
      new Map()
    )

    const dispatchNodes = () => {
      localNodes.forEach((data) => {
        dispatchQueue.add(() => sync.value.sendAction({ type: 'create', data }))
      })
    }

    watch(identity.meta, () => {
      identify()
    })

    sync.value.onPeerChange((peerId) => {
      console.log(peerId)
    })

    const identifyRemote = ({ data: { user_id, content } }: IdentifyAction) => {
      const target = peerIdentities.get(user_id)
      if (!target || target.status !== content.status || target.username !== content.username) {
        if (!target) {
          dispatchNodes()
        }
        peerIdentities.set(user_id, content)
      }
    }

    const identify = async () => {
      const action = await identity.createIdentityAction(status.value)

      if (action) {
        // Sync the node via Trystero/WebRTC
        sync.value.sendAction(action)
      }
    }

    // CREATE

    const createNodeRemote = async (payload: CreateNodeAction) => {
      queue.add(async () => {
        // If the action is coming from a remote source, validate its contents and signature
        if (is(createNodeActionSchema, payload)) {
          const isValid = await identity.validate(payload)
          if (isValid) {
            const isRemote = identity.user.user_id !== payload.data.user_id
            createNodeInternal(payload.data, isRemote)
          }
        }
      })
    }

    const createNode = async (payload: NodeContent) => {
      queue.add(async () => {
        const signature = await identity.sign(payload)

        const action: CreateNodeAction = {
          type: 'create',
          data: {
            id: createUuid(),
            user_id: identity.user.user_id,
            updated: createTimestamp(),
            signature,
            content: payload
          }
        }

        createNodeInternal(action.data, false)
        sync.value.sendAction(action)
      })
    }

    // REMOVE

    // Method to remove a node.
    const removeNodeRemote = (payload: string | RemoveNodeAction) => {
      queue.add(async () => {
        // If the action is coming from a remote source, validate its contents and signature
        if (is(removeNodeActionSchema, payload)) {
          const isValid = await identity.validate(payload)
          if (isValid) {
            const isRemote = identity.user.user_id !== payload.data.user_id
            removeNodeInternal(payload.data, isRemote)
          }
        }
      })
    }

    const removeNode = (id: string) => {
      queue.add(async () => {
        const targetNode = getNode(id)

        if (!targetNode) {
          return
        }

        const signature = await identity.sign('remove')
        const action: RemoveNodeAction = {
          type: 'remove',
          data: {
            ...targetNode,
            signature
          }
        }

        removeNodeInternal(action.data, false)
        sync.value.sendAction(action)
      })
    }

    // UPDATE

    // Method to update a node
    const updateNodeRemote = (payload: UpdateNodeAction) => {
      queue.add(async () => {
        // If the action is coming from a remote source, validate its contents and signature
        if (is(updateNodeActionSchema, payload)) {
          const isValid = await identity.validate(payload)
          if (isValid) {
            const isRemote = identity.user.user_id !== payload.data.user_id
            updateNodeInternal(payload.data, isRemote)
          }
        }
      })
    }

    const updateNode = (
      id: string,
      payload: Partial<UpdateNodeAction['data']['content']>,
      dispatch: boolean = true
    ) => {
      console.log(uri)
      queue.add(async () => {
        const targetNode = getNode(id)

        if (!targetNode) {
          return
        }

        const signature = await identity.sign(payload)

        const action: UpdateNodeAction = {
          type: 'update',
          data: {
            ...targetNode,
            signature,
            updated: createTimestamp(),
            content: payload
          }
        }

        updateNodeInternal(action.data, false)
        if (dispatch) {
          sync.value.sendAction(action)
        }
      })
    }

    const joinMicrocosm = () => {
      status.value = IDENTITY_STATUS.Join
      identify()
    }

    const leaveMicrocosm = () => {
      status.value = IDENTITY_STATUS.Leave
      identify()
      peerIdentities.forEach((p) => p.status === 'leave')
    }

    // Method to load up a new microcosm and make it the active one

    // This watches for incoming sync events from WebRTC. These are then
    // filtered and the store is updated.
    sync.value.onAction(([, action]) => {
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
        identifyRemote(action)
      }
    })

    app.registerMicrocosm(uri)

    const dispose = () => {
      leaveMicrocosm()
      clearInterval(loop)
      queue.clear()
      dispatchQueue.clear()
      sync.value.leave()
    }

    // If the page visibility changes
    const visible = useVisibility((visible) => {
      if (!visible) {
        leaveMicrocosm()
        // leaveMicrocosm()
      } else {
        joinMicrocosm()
        // updateIdentity({ ...identity, status: IDENTITY_STATUS.Join })
      }
    })

    const getUser = (user_id: string) => {
      return peerIdentities.get(user_id)
    }

    // Periodically send out a beacon
    const loop = setInterval(() => {
      if (visible.value) {
        status.value = IDENTITY_STATUS.Join
        identify()
      }
    }, INTERVAL_DURATION)

    // Create a node
    const createNodeInternal = (data: CreateNodeAction['data'], remote: boolean) => {
      if (remote) {
        const existing = remoteNodes.get(data.id)
        if (!existing || data.updated > existing.updated) {
          remoteNodes.set(data.id, data)
        }
      } else {
        const existing = localNodes.get(data.id)
        if (!existing || data.updated > existing.updated) {
          localNodes.set(data.id, data)
        }
      }
    }

    // Remove a node
    const removeNodeInternal = async (data: RemoveNodeAction['data'], remote: boolean) => {
      if (remote) {
        remoteNodes.delete(data.id)
      } else {
        localNodes.delete(data.id)
      }
    }

    // Method to update a node
    const updateNodeInternal = (data: UpdateNodeAction['data'], remote: boolean) => {
      if (remote) {
        const existing = remoteNodes.get(data.id)
        if (existing && data.updated > existing.updated) {
          // Patch each node with the update
          remoteNodes.set(data.id, deepmerge(remoteNodes.get(data.id), data) as Node)
        } else {
          console.log(`warning: missing existing entry for remote node: ${data.id}`)
        }
      } else {
        const existing = localNodes.get(data.id)
        if (existing && data.updated > existing.updated) {
          // Patch each node with the update
          localNodes.set(data.id, deepmerge(localNodes.get(data.id), data) as Node)
        } else {
          console.log(`warning: missing existing entry for local node: ${data.id}`)
        }
      }
    }

    const getNode = (id: string, localOnly?: boolean): Node | undefined => {
      const target = localNodes.get(id)
      if (target) {
        return target
      } else if (!target && !localOnly) {
        return remoteNodes.get(id)
      } else {
        return undefined
      }
    }

    return {
      uri,
      localNodes,
      allUsers: computed(() => peerIdentities),
      remoteNodes,
      joinMicrocosm,
      leaveMicrocosm,
      getUser,
      createNode,
      updateNode,
      removeNode,
      dispose
    }
  })()
}

export type State = ReturnType<typeof useStore>

export type Data = Pick<State, 'uri' | 'localNodes' | 'remoteNodes' | 'allUsers'>

export const MICROCOSM_DATA_INJECTION_KEY: InjectionKey<Data> = Symbol('STORE')

type API = Pick<State, 'createNode' | 'removeNode' | 'updateNode'>
export const MICROCOSM_API_INJECTION_KEY: InjectionKey<API> = Symbol('API')

// export const useMicrocosmData = () => inject(MICROCOSM_DATA_INJECTION_KEY) as Data

// export const useMicrocosmAPI = () => inject(MICROCOSM_API_INJECTION_KEY) as API

export const useCurrentMicrocosm = () => ({
  data: inject(MICROCOSM_DATA_INJECTION_KEY) as Data,
  actions: inject(MICROCOSM_API_INJECTION_KEY) as API
})
