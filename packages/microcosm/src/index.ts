// Schema utils
export * from './schema/utils/schema-utils'

// Core Entity schema
export * from './guards/entity-guards'
export { isEntity, isEntityType, isEntityVersion } from './guards/entity-guards'
export type * from './schema/entity.schema'
export { entityTypes } from './schema/entity.schema'
export { MAX_CHARACTER_COUNT } from './constants'
export type { BaseEntity, ReadonlyEntityFields } from './schema/base-entity.schema'

// Identity schema
export type * from './schema/identity.schema'
export { isIdentity, isIdentityWithStatus } from './schema/identity.schema'

// Microcosm schema
export type * from './schema/microcosm.schema'
export { isSerializedCollection, isSerializedMicrocosm } from './guards/microcosm-guards'

// UUID schema
export {
  createTimestamp,
  createUuid,
  createIdentityID,
  createEntityID,
  createPassword,
  sanitizeMicrocosmIDTitle,
  createMicrocosmID,
  parseMicrocosmID
} from './operations/uuid'
export type * from './operations/uuid'
export type * from './schema/uuid.schema'
export { isValidIdentityID, isValidEntityID, isValidMicrocosmID } from './guards/uuid-guards'

// Operations and utilities
export { getEntitiesByType } from './operations/query'
export { update, type EntityUpdate, type EntityUpdatePayload } from './operations/update'
export { create, type EntityCreate, type EntityCreatePayload } from './operations/create'
export { createMigration, type EntityMigration } from './operations/migrate'
export { clone } from './operations/clone'
export { fromPartialEntity, type EntityPartialCreatePayload } from './operations/partial'

// API types
export {
  type MicrocosmAPI,
  type EditableMicrocosmAPI,
  type MicrocosmAPIConfig,
  type MicrocosmAPIState
} from './MicrocosmAPI'
export { isEditableAPI, type MicrocosmAPIFactory } from './api'
