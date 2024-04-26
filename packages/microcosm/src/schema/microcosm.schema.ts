import { entries, isObject, values } from '@figureland/typekit'
import { isValidIdentityID } from './uuid.schema'
import { isNode } from './node.schema'
import type { Node } from './node.schema'
import type { IdentityID, MicrocosmID, NodeID } from './uuid.schema'

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
