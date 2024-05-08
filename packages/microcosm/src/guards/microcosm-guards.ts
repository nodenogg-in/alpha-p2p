import { isObject } from '@figureland/typekit/guards'
import { entries, values } from '@figureland/typekit/object'
import type { SerializedCollection, SerializedMicrocosm } from '../schema/microcosm.schema'
import { isValidIdentityID } from './uuid-guards'
import { isEntity } from './entity-guards'

export const isSerializedCollection = (collection: unknown): collection is SerializedCollection =>
  isObject(collection) && values(collection).every(isEntity)

export const isSerializedMicrocosm = (microcosm: unknown): microcosm is SerializedMicrocosm =>
  isObject(microcosm) &&
  entries(microcosm).every(
    ([id, collection]) => isValidIdentityID(id) && isSerializedCollection(collection)
  )
