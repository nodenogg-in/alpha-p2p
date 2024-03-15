import type { BoxReference, Canvas } from '@nodenogg.in/spatial-view'
import type { BaseMicrocosm, MicrocosmConfig } from './Microcosm'
import type { NewNode, Node, NodeReference, NodeType } from '@nodenogg.in/schema'
import type { State } from '@nodenogg.in/state/src'
import type { NodePatch, NodeUpdate } from './utils/update'

export interface Microcosm extends BaseMicrocosm {
  dispose: () => void
  getCanvas: (id: string) => Canvas<this>
  node: <T extends NodeType>(node_id: string, type?: T) => Node<T> | undefined
  nodes: <T extends NodeType | undefined = undefined>(
    type?: T
  ) => (T extends undefined ? NodeReference[] : never) | NodeReference<NonNullable<T>>[]
  getCollections: () => string[]
  subscribeToCollection: (user_id: string) => State<{ nodes: NodeReference[] }>
  getCollection: (user_id: string) => NodeReference[]
  boxes: () => BoxReference[]
}

export type EditableMicrocosm = Microcosm & {
  clearPersistence: (reset?: boolean) => void
  deleteAll: () => void
  create: (n: NewNode | NewNode[]) => Promise<string | string[]>
  patch: <T extends NodeType>(node_id: string, patch: NodePatch<T>) => void
  update: <T extends NodeType>(...u: [string, NodeUpdate<T>][]) => void
  delete: (node_id: string) => void
  join: (username?: string) => void
  leave: (username?: string) => void
  destroy: () => void
  undo: () => void
  redo: () => void
}

export type MicrocosmFactory<M extends Microcosm = Microcosm> = (args: MicrocosmConfig) => M
