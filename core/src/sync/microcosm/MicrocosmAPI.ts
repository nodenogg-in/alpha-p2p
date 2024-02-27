import {
  isHTMLNode,
  type DistributiveOmit,
  type IdentityWithStatus,
  type NewNode,
  type Node,
  NodeReference,
  Unsubscribe,
  NodeType
} from '../../schema'
import { createTimestamp, deepAssign, isArray, sanitizeHTML } from '../../utils'
import { MicroState } from '../../utils/emitter/MicroState'

export type MicrocosmAPIStatus = {
  ready: boolean
  connected: boolean
}

export type ReadonlyMicrocosmAPIEvents = {
  status: MicrocosmAPIStatus
}

export interface ReadonlyMicrocosmAPI<E = {}> extends MicroState<ReadonlyMicrocosmAPIEvents & E> {
  microcosm_uri: string
  dispose: () => void
  nodes: () => NodeReference[]
  nodesByType: <T extends NodeType>(type?: T) => NodeReference<T>[]
  subscribeToCollections: (fn: (collections: string[]) => void) => Unsubscribe
  subscribeToCollection: (user_id: string, fn: (nodes: NodeReference[]) => void) => Unsubscribe
}

export type EditableMicrocosmAPIEvents = ReadonlyMicrocosmAPIEvents & {
  data: {
    identities: IdentityWithStatus[]
    collections: string[]
  }
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

type Update<T extends Node> = Partial<DistributiveOmit<T, 'lastEdited'>> & { type: T['type'] }

export type NodeUpdate = [string, Update<Node>]

export const isNodeUpdate = (u: NodeUpdate | NodeUpdate[]): u is NodeUpdate =>
  isArray(u) && u.length === 2 && typeof u[0] === 'string'

export const updateNode = <T extends Node>(existing: T, update: Update<T>): T => {
  const result: T = {
    ...existing
  }
  deepAssign(result, update as Partial<T>)

  result.lastEdited = createTimestamp()
  return result
}

export const createNode = (newNode: NewNode): Node => ({
  ...newNode,
  ...(isHTMLNode(newNode) ? { content: sanitizeHTML(newNode.content) } : {}),
  lastEdited: createTimestamp()
})
