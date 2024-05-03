// Core Node schema
export type * from './guards/node-guards'
export { isNode, isNodeType, isSpatialNode, isNodeVersion } from './guards/node-guards'
export type * from './schema/node.schema'
export { nodeTypes } from './schema/node.schema'
export const SCHEMA_VERSION = 0
export { MAX_CHARACTER_COUNT } from './constants'

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
  createNodeID,
  createPassword,
  sanitizeMicrocosmIDTitle,
  createMicrocosmID,
  parseMicrocosmID
} from './operations/uuid'
export type * from './operations/uuid'
export { isValidIdentityID, isValidNodeID, isValidMicrocosmID } from './guards/uuid-guards'

// Operations and utilities
export { getNodesByType } from './operations/query'
export { update, type NodeUpdate, type NodeUpdatePayload } from './operations/update'
export { create, type NodeCreatePayload } from './operations/create'
export { createMigration, type NodeMigration } from './operations/migrate'
export { clone } from './operations/clone'
export { createFromPartial, type NodePartialCreatePayload } from './operations/partial'

// API types
export { type MicrocosmAPIConfig, type MicrocosmAPIEvents, MicrocosmAPI } from './api/MicrocosmAPI'
export { EditableMicrocosmAPI } from './api/EditableMicrocosmAPI'
export { isEditableAPI, type MicrocosmAPIFactory } from './api'
