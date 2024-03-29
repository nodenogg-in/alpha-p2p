import type { NodeType, NodeID } from '.'
import { MicrocosmAPI } from './MicrocosmAPI'
import type { NewNode, NodePatch, NodeUpdate } from './utils/update'

export class EditableMicrocosmAPI extends MicrocosmAPI {
  create: (n: NewNode | NewNode[]) => Promise<string | string[]>
  patch: <T extends NodeType>(NodeID: NodeID, patch: NodePatch<T>) => void
  update: <T extends NodeType>(...u: [NodeID, NodeUpdate<T>][]) => void
  delete: (NodeID: NodeID) => void
  deleteAll: () => void
  join: (username?: string) => void
  leave: (username?: string) => void
  destroy: () => void
  undo: () => void
  redo: () => void
}
