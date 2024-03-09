import type { IdentityWithStatus, NewNode, NodeReference, NodeType, Node } from '../schema'
import type { State } from '../utils'
import type { NodePatch, NodeUpdate } from './microcosm/update'

export type MicrocosmAPIStatus = {
  ready: boolean
  connected: boolean
}

export type ReadonlyMicrocosmAPIEvents = {
  status: MicrocosmAPIStatus
  collections: string[]
}

export interface ReadonlyMicrocosmAPI<E = {}> extends State<ReadonlyMicrocosmAPIEvents & E> {
  microcosm_uri: string
  dispose: () => void
  node: <T extends NodeType>(node_id: string, type?: T) => Node<T> | undefined
  nodes: <T extends NodeType | undefined = undefined>(
    type?: T
  ) => (T extends undefined ? NodeReference[] : never) | NodeReference<NonNullable<T>>[]
  getCollections: () => string[]
  subscribeToCollection: (user_id: string) => State<{ nodes: NodeReference[] }>
  getCollection: (user_id: string) => NodeReference[]
}

export type EditableMicrocosmAPIEvents = ReadonlyMicrocosmAPIEvents & {
  identities: IdentityWithStatus[]
}

export interface EditableMicrocosmAPI extends ReadonlyMicrocosmAPI<EditableMicrocosmAPIEvents> {
  clearPersistence: (reset?: boolean) => void
  deleteAll: () => void
  create: (n: NewNode | NewNode[]) => string | string[]
  patch: <T extends NodeType>(node_id: string, type: T, patch: NodePatch<T>) => void
  update: <T extends NodeType>(u: NodeUpdate<T>[]) => void
  delete: (node_id: string) => void
  join: (username?: string) => void
  leave: (username?: string) => void
  undo: () => void
  redo: () => void
}

export const isEditableMicrocosmAPI = (m: MicrocosmAPI): m is EditableMicrocosmAPI => 'leave' in m

export type MicrocosmAPI = ReadonlyMicrocosmAPI | EditableMicrocosmAPI
