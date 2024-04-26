import type { Node } from './node.types'
import type { IdentityID, MicrocosmID, NodeID } from './uuid.types'

export type SerializedCollection = Record<NodeID, Node>

export type SerializedMicrocosm = Record<IdentityID, SerializedCollection>

export type MicrocosmReference = {
  microcosmID: MicrocosmID
  lastAccessed: number
  password?: string
  view: string
}
