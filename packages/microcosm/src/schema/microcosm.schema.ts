import { entries, values } from '@figureland/typekit/object'
import { isObject } from '@figureland/typekit/guards'
import { isValidIdentityID, type IdentityID, type MicrocosmID, type NodeID } from './uuid.schema'
import { isNode, type Node } from './node.schema'

export type SerializedCollection = Record<NodeID, Node>

export type SerializedMicrocosm = Record<IdentityID, SerializedCollection>

export type MicrocosmReference = {
  microcosmID: MicrocosmID
  lastAccessed: number
  password?: string
  view: string
}

export const isSerializedCollection = (collection: unknown): collection is SerializedCollection =>
  isObject(collection) && values(collection).every(isNode)

export const isSerializedMicrocosm = (microcosm: unknown): microcosm is SerializedMicrocosm =>
  isObject(microcosm) &&
  entries(microcosm).every(
    ([id, collection]) => isValidIdentityID(id) && isSerializedCollection(collection)
  )
