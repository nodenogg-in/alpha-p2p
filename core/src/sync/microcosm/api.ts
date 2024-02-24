import type {
  Box,
  Vec2,
  Selection,
  NewNode,
  DistributiveOmit,
  Node,
  ViewName,
  IdentityWithStatus,
  NodeReference,
  NodeType,
  Unsubscribe
} from '../../schema'
import type { CanvasInteraction } from '../../spatial'
import { createTimestamp, isArray, type State } from '../../utils'

export type MicrocosmAPIStatus = {
  ready: boolean
  connected: boolean
}

export type ReadonlyMicrocosmAPIEvents = {
  status: MicrocosmAPIStatus
}

export interface ReadonlyMicrocosmAPI<E = {}> extends State<ReadonlyMicrocosmAPIEvents & E> {
  dispose: () => void
  nodes: () => NodeReference[]
  nodesByType: <T extends NodeType>(type?: T) => NodeReference<T>[]
  subscribeToCollections: (fn: (collections: string[]) => void) => Unsubscribe
  subscribeToCollection: (user_id: string, fn: (nodes: NodeReference[]) => void) => Unsubscribe
  intersect: (point: Vec2, box: Box) => Selection
}

export type MicrocosmAPIEvents = ReadonlyMicrocosmAPIEvents & {
  data: {
    identities: IdentityWithStatus[]
    collections: string[]
  }
}

export interface EditableMicrocosmAPI extends ReadonlyMicrocosmAPI<MicrocosmAPIEvents> {
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

export type MicrocosmAPI = ReadonlyMicrocosmAPI | EditableMicrocosmAPI

export const isEditableMicrocosmAPI = (api: MicrocosmAPI): api is EditableMicrocosmAPI =>
  'leave' in api

type Update<T extends Node> = Partial<DistributiveOmit<T, 'lastEdited'>> & { type: T['type'] }

export type NodeUpdate = [string, Update<Node>]

export const isNodeUpdate = (u: NodeUpdate | NodeUpdate[]): u is NodeUpdate =>
  isArray(u) && u.length === 2 && typeof u[0] === 'string'

export const updateNode = <T extends Node>(existing: T, update: Update<T>): T => {
  const result: T = {
    ...existing
  }
  for (const [k, v] of Object.entries(update)) {
    result[k] = v
  }

  result.lastEdited = createTimestamp()
  return result
}

export const createNode = (newNode: NewNode): Node => ({
  ...newNode,
  lastEdited: createTimestamp()
})

export type MicrocosmConfig = {
  microcosm_uri: string
  view?: ViewName
  user_id: string
  password?: string
}

export interface Microcosm<M extends MicrocosmAPI = MicrocosmAPI> {
  api: M
  canvas: CanvasInteraction
}
