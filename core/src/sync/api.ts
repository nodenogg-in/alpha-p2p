import type { Box, Vec2, Selection } from '../schema'
import type { Emitter, Unsubscribe } from '../utils/emitter/Emitter'
import type { IdentityWithStatus, Node, NodeReference, NodeType } from '../schema'
import type { NodeUpdate } from './utils'

export type ReadonlyMicrocosmAPIEvents = {
  ready: boolean
  connected: boolean
}

export interface ReadonlyMicrocosmAPI<E = {}> extends Emitter<ReadonlyMicrocosmAPIEvents & E> {
  dispose: () => void
  nodes: (type?: NodeType) => NodeReference<typeof type>[]
  subscribeToCollections: (fn: (collections: string[]) => void) => Unsubscribe
  subscribeToCollection: (user_id: string, fn: (nodes: NodeReference[]) => void) => Unsubscribe
  intersect: (point: Vec2, box: Box) => Selection
}

export type MicrocosmAPIEvents = ReadonlyMicrocosmAPIEvents & {
  identities: IdentityWithStatus[]
  collections: string[]
  collection: NodeReference[]
}

export interface EditableMicrocosmAPI extends ReadonlyMicrocosmAPI<MicrocosmAPIEvents> {
  dispose: () => void
  clearPersistence: (reset?: boolean) => void
  deleteAll: () => void
  create: (n: Node | Node[]) => string | string[]
  update: (...u: NodeUpdate | NodeUpdate[]) => void
  delete: (node_id: string) => void
  join: (username?: string) => void
  leave: (username?: string) => void
  undo: () => void
  redo: () => void
}

export type MicrocosmAPI = ReadonlyMicrocosmAPI | EditableMicrocosmAPI

export const isEditableMicrocosmAPI = (api: MicrocosmAPI): api is EditableMicrocosmAPI =>
  'leave' in api
