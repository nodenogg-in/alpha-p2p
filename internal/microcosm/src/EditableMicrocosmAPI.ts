import { type NodeType, type NodeID } from '.'
import { MicrocosmAPI } from './MicrocosmAPI'
import type { NewNode, NodePatch, NodeUpdate } from './utils/update'

/**
 * Creates an instance of the **EditableMicrocosmAPI** class. This permits
 * edit (create, patch, update, delete) operations on the Microcosm.
 * @example
 * ```ts
 * const example = new EditableMicrocosmAPI({
 *    microcosmID: getMicrososmID('example'),
 *    identityID: 'identity_example'
 * })
 * ```
 */
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
