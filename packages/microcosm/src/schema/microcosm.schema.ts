import type { Entity } from './entity.schema'
import type { EntityID, IdentityID, MicrocosmID } from './uuid.schema'

export type SerializedCollection = Record<EntityID, Entity>

export type SerializedMicrocosm = Record<IdentityID, SerializedCollection>

export type MicrocosmReference = {
  microcosmID: MicrocosmID
  lastAccessed: number
  password?: string
}
