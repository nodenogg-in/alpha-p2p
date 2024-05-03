import type { Signal, SignalObject, Disposable } from '@figureland/statekit'
import type {
  Identity,
  IdentityID,
  IdentityWithStatus,
  MicrocosmID,
  Node,
  NodeID,
  NodeType,
  NodeUpdate,
  NodeCreate
} from '..'

export type MicrocosmAPIConfig = {
  microcosmID: MicrocosmID
  identityID: IdentityID
  view?: string
  password?: string
}

export type MicrocosmAPIState = {
  status: {
    ready: boolean
    connected: boolean
  }
  identities: IdentityWithStatus[]
  active: boolean
}

export interface MicrocosmAPI extends Disposable {
  config: Readonly<MicrocosmAPIConfig>
  state: SignalObject<MicrocosmAPIState>
  nodes: (type?: NodeType) => Node[]
  node: <T extends NodeType>(
    identityID: IdentityID,
    nodeID: NodeID,
    type?: T
  ) => Signal<Node<T> | undefined>
}

export interface EditableMicrocosmAPI extends MicrocosmAPI {
  create: NodeCreate
  update: NodeUpdate
  delete: (nodeID: NodeID) => void
  deleteAll: () => void
  join: (id: Identity) => void
  leave: () => void
  destroy: () => void
  undo: () => void
  redo: () => void
}
