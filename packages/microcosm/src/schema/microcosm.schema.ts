import { entries, values } from '@figureland/typekit/object'
import { isObject } from '@figureland/typekit/guards'
import { isValidIdentityID, type IdentityID, type MicrocosmID, type NodeID } from '../operations/uuid'
import { isNode } from '../guards/node-guards'

export type SerializedCollection = Record<NodeID, Node>

export type SerializedMicrocosm = Record<IdentityID, SerializedCollection>

export type MicrocosmReference = {
  microcosmID: MicrocosmID
  lastAccessed: number
  password?: string
  view: string
}

