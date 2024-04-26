import { entries, isObject, values } from '@figureland/typekit'
import { isValidIdentityID } from './uuid.guards'
import type { SerializedCollection, SerializedMicrocosm } from './microcosm.types'
import { isNode } from './node.guards'

export const isSerializedCollection = (collection: unknown): collection is SerializedCollection =>
  isObject(collection) && values(collection).every(isNode)

export const isSerializedMicrocosm = (microcosm: unknown): microcosm is SerializedMicrocosm =>
  isObject(microcosm) &&
  entries(microcosm).every(
    ([id, collection]) => isValidIdentityID(id) && isSerializedCollection(collection)
  )
