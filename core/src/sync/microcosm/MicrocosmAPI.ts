import {
  type IdentityWithStatus,
  type NewNode,
  type NodeReference,
  type Unsubscribe,
  type NodeType
} from '../../schema'
import type { State } from '../../utils'
import { MicrocosmAPI } from './api'
import { NodeUpdate } from './node-update-utils'

export type MicrocosmAPIStatus = {
  ready: boolean
  connected: boolean
}

export type ReadonlyMicrocosmAPIEvents = {
  status: MicrocosmAPIStatus
}

export interface ReadonlyMicrocosmAPI<E = {}> extends State<ReadonlyMicrocosmAPIEvents & E> {
  microcosm_uri: string
  dispose: () => void
  nodes: <T extends NodeType | undefined = undefined>(
    type?: T
  ) => (T extends undefined ? NodeReference[] : never) | NodeReference<NonNullable<T>>[]
  subscribeToCollections: (fn: (collections: string[]) => void) => Unsubscribe
  getCollections: () => string[]
  subscribeToCollection: (user_id: string, fn: (nodes: NodeReference[]) => void) => Unsubscribe
  getCollection: (user_id: string) => NodeReference[]
}

export type EditableMicrocosmAPIEvents = ReadonlyMicrocosmAPIEvents & {
  identities: IdentityWithStatus[]
  collections: string[]
}

export interface EditableMicrocosmAPI extends ReadonlyMicrocosmAPI<EditableMicrocosmAPIEvents> {
  clearPersistence: (reset?: boolean) => void
  deleteAll: () => void
  create: (n: NewNode | NewNode[]) => string | string[]
  update: (...u: NodeUpdate | NodeUpdate[]) => void
  delete: (node_id: string) => void
  join: (username?: string) => void
  leave: (username?: string) => void
  undo: () => void
  redo: () => void
}

export const isEditableMicrocosmAPI = (m: MicrocosmAPI): m is EditableMicrocosmAPI => 'leave' in m
