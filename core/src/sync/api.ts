import type { Box, Point, Selection } from '../views/canvas'
import type { Unsubscribe } from '../utils/emitter/Emitter'
import type { ConnectionNode, EmojiNode, HTMLNode, Node, NodeReference } from './schema'
import type { NodeUpdate } from './utils'

export type MicrocosmAPIEvents = {
  ready: boolean
  connected: boolean
}

export interface ReadonlyMicrocosmAPI {
  dispose: () => void
  nodes: () => NodeReference[]
  htmlNodes: () => NodeReference<HTMLNode>[]
  emojiNodes: () => NodeReference<EmojiNode>[]
  connectionNodes: () => NodeReference<ConnectionNode>[]
  subscribeToCollections: (fn: (collections: string[]) => void) => Unsubscribe
  subscribeToCollection: (user_id: string, fn: (nodes: NodeReference[]) => void) => Unsubscribe
}

export interface EditableMicrocosmAPI extends ReadonlyMicrocosmAPI {
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
  intersect: (point: Point, box: Box) => Selection
  join: (username?: string) => void
  leave: (username?: string) => void
  undo: () => void
  redo: () => void
}

export type MicrocosmAPI = ReadonlyMicrocosmAPI | EditableMicrocosmAPI

export const isEditableMicrocosmAPI = (api: MicrocosmAPI): api is EditableMicrocosmAPI =>
  'leave' in api
