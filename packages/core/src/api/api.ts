import type { NodeType } from '@nodenogg.in/schema'
import type { MicrocosmAPI, MicrocosmAPIConfig } from './MicrocosmAPI'
import type { NewNode, NodePatch, NodeUpdate } from './utils/update'

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
