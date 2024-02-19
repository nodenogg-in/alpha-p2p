import type { Box, Point, Selection } from '../views/spatial'
import type { Emitter, Unsubscribe } from '../utils/emitter/Emitter'
import type {
  ConnectionNode,
  EmojiNode,
  HTMLNode,
  IdentityWithStatus,
  Node,
  NodeReference
} from './schema'
import type { NodeUpdate } from './utils'

export type ReadonlyMicrocosmAPIEvents = {
  ready: boolean
  connected: boolean
}

export interface ReadonlyMicrocosmAPI<E = {}> extends Emitter<ReadonlyMicrocosmAPIEvents & E> {
  dispose: () => void
  nodes: () => NodeReference[]
  htmlNodes: () => NodeReference<HTMLNode>[]
  emojiNodes: () => NodeReference<EmojiNode>[]
  connectionNodes: () => NodeReference<ConnectionNode>[]
  subscribeToCollections: (fn: (collections: string[]) => void) => Unsubscribe
  subscribeToCollection: (user_id: string, fn: (nodes: NodeReference[]) => void) => Unsubscribe
  intersect: (point: Point, box: Box) => Selection
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
  nodes: () => NodeReference[]
  htmlNodes: () => NodeReference<HTMLNode>[]
  emojiNodes: () => NodeReference<EmojiNode>[]
  connectionNodes: () => NodeReference<ConnectionNode>[]
  join: (username?: string) => void
  leave: (username?: string) => void
  undo: () => void
  redo: () => void
}

export type MicrocosmAPI = ReadonlyMicrocosmAPI | EditableMicrocosmAPI

export const isEditableMicrocosmAPI = (api: MicrocosmAPI): api is EditableMicrocosmAPI =>
  'leave' in api
