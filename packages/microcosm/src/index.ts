// Core Node schema
export type * from './schema/node.schema'
export { isNode, isNodeType, isSpatialNode, isNodeVersion, nodeTypes } from './schema/node.schema'
export const SCHEMA_VERSION = 0
export { MAX_CHARACTER_COUNT } from './schema/constants'

// Identity schema
export type * from './schema/identity.schema'
export { isIdentity, isIdentityWithStatus } from './schema/identity.schema'

// Microcosm schema
export type * from './schema/microcosm.schema'
export { isSerializedCollection, isSerializedMicrocosm } from './schema/microcosm.schema'

// UUID schema
export {
  createTimestamp,
  createUuid,
  createIdentityID,
  createNodeID,
  createPassword,
  sanitizeMicrocosmIDTitle,
  createMicrocosmID,
  parseMicrocosmID,
  isValidIdentityID,
  isValidNodeID,
  isValidMicrocosmID
} from './schema/uuid.schema'
export type * from './schema/uuid.schema'

// Operations and utilities
export { getNodesByType } from './schema/operations/query'
export { update, type NodeUpdate, type NodeUpdatePayload } from './schema/operations/update'
export { create, type NodeCreate, type NodeCreatePayload } from './schema/operations/create'
export { createUpgrade, type NodeUpgrade } from './schema/operations/upgrade'

// API types
export { type MicrocosmAPIConfig, type MicrocosmAPIEvents, MicrocosmAPI } from './MicrocosmAPI'
export { EditableMicrocosmAPI } from './EditableMicrocosmAPI'
export { isEditableAPI, type MicrocosmAPIFactory } from './api'
