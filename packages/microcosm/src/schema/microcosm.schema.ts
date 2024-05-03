import { type IdentityID, type MicrocosmID, type NodeID } from '../operations/uuid'

export type SerializedCollection = Record<NodeID, Node>

export type SerializedMicrocosm = Record<IdentityID, SerializedCollection>

export type MicrocosmReference = {
  microcosmID: MicrocosmID
  lastAccessed: number
  password?: string
  view: string
}
