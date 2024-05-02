import type { NodeID, NodeCreate, NodeUpdatePayload } from '..'
import { MicrocosmAPI } from './MicrocosmAPI'

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
  create: NodeCreate
  update: (node_id: NodeID, payload: NodeUpdatePayload) => void
  delete: (nodeID: NodeID) => void
  deleteAll: () => void
  join: (nickname?: string) => void
  leave: (nickname?: string) => void
  destroy: () => void
  undo: () => void
  redo: () => void
}
