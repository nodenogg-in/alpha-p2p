import type { Node } from './node-types'
import type { IdentityID, NodeID } from './uuid.schema'

export type SerializedCollection = Record<NodeID, Node>

export type SerializedMicrocosm = Record<IdentityID, SerializedCollection>
