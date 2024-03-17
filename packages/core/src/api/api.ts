import type { NewNode, Node, NodeReference, NodeType } from '@nodenogg.in/schema'
import type { Signal } from '@nodenogg.in/state'
import type { Canvas } from '@nodenogg.in/spatial-view'
import type { BaseMicrocosmAPI, MicrocosmAPIConfig } from './BaseMicrocosmAPI'
import type { NodePatch, NodeUpdate } from './utils/update'

export interface MicrocosmAPI extends BaseMicrocosmAPI {
  canvas: (id: string) => Canvas<this>
  node: <T extends NodeType>(node_id: string, type?: T) => Node<T> | undefined
  nodes: <T extends NodeType | undefined = undefined>(
    type?: T
  ) => (T extends undefined ? NodeReference[] : never) | NodeReference<NonNullable<T>>[]
  getCollections: () => string[]
  subscribeToCollection: (user_id: string) => Signal<NodeReference[]>
  getCollection: (user_id: string) => NodeReference[]
}

export interface EditableMicrocosmAPI extends MicrocosmAPI {
  create: (n: NewNode | NewNode[]) => Promise<string | string[]>
  patch: <T extends NodeType>(node_id: string, patch: NodePatch<T>) => void
  update: <T extends NodeType>(...u: [string, NodeUpdate<T>][]) => void
  delete: (node_id: string) => void
  deleteAll: () => void
  join: (username?: string) => void
  leave: (username?: string) => void
  destroy: () => void
  undo: () => void
  redo: () => void
}

export type MicrocosmAPIFactory<M extends MicrocosmAPI = MicrocosmAPI> = (
  args: MicrocosmAPIConfig
) => M
