// Core Node schema
export * from './schema/node.types'
export { isNode, isNodeType, isSpatialNode, isNodeVersion } from './schema/node.guards'
export const SCHEMA_VERSION = 0
export { MAX_CHARACTER_COUNT } from './schema/constants'

// Identity schema
export * from './schema/identity.types'
export { isIdentity, isIdentityWithStatus } from './schema/identity.guards'

// Microcosm schema
export * from './schema/microcosm.types'
export { isSerializedCollection, isSerializedMicrocosm } from './schema/microcosm.guards'

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
} from './schema/uuid.utils'
export { isValidIdentityID, isValidNodeID, isValidMicrocosmID } from './schema/uuid.guards'
export type { NodeID, IdentityID, MicrocosmID } from './schema/uuid.types'

// Operations and utilities
export { getNodesByType } from './schema/operations/query'
export { update, type NodeUpdate, type NodeUpdatePayload } from './schema/operations/update'
export { create, type NodeCreate, type NodeCreatePayload } from './schema/operations/create'
export { createUpgrade, type NodeUpgrade } from './schema/operations/upgrade'

// API types
export { type MicrocosmAPIConfig, type MicrocosmAPIEvents, MicrocosmAPI } from './MicrocosmAPI'
export { EditableMicrocosmAPI } from './EditableMicrocosmAPI'
export { isEditableAPI, type MicrocosmAPIFactory } from './api'
