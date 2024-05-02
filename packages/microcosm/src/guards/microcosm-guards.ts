import { entries, isObject, values } from '@figureland/typekit'
import { isValidIdentityID } from '../operations/uuid'
import type { SerializedCollection, SerializedMicrocosm } from '../schema/microcosm.schema'
import { isNode } from './node-guards'

export const isSerializedCollection = (collection: unknown): collection is SerializedCollection =>
  isObject(collection) && values(collection).every(isNode)

export const isSerializedMicrocosm = (microcosm: unknown): microcosm is SerializedMicrocosm =>
  isObject(microcosm) &&
  entries(microcosm).every(
    ([id, collection]) => isValidIdentityID(id) && isSerializedCollection(collection)
  )
