import type { NodeType, Node_ID } from '.'
import { MicrocosmAPI } from './MicrocosmAPI'
import type { NewNode, NodePatch, NodeUpdate } from './utils/update'

export class EditableMicrocosmAPI extends MicrocosmAPI {
  create: (n: NewNode | NewNode[]) => Promise<string | string[]>
  patch: <T extends NodeType>(node_id: Node_ID, patch: NodePatch<T>) => void
  update: <T extends NodeType>(...u: [Node_ID, NodeUpdate<T>][]) => void
  delete: (node_id: Node_ID) => void
  deleteAll: () => void
  join: (username?: string) => void
  leave: (username?: string) => void
  destroy: () => void
  undo: () => void
  redo: () => void
}
