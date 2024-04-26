// API
export { getNodesByType } from './schema/operations/query'
export { update, type NodeUpdate, type NodeUpdatePayload } from './schema/operations/update'
export { create, type NodeCreate, type NodeCreatePayload } from './schema/operations/create'
export { createUpgrade, type NodeUpgrade } from './schema/operations/upgrade'
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
export { type MicrocosmAPIConfig, type MicrocosmAPIEvents, MicrocosmAPI } from './MicrocosmAPI'
export { EditableMicrocosmAPI } from './EditableMicrocosmAPI'
export { isEditableAPI, type MicrocosmAPIFactory } from './api'
export * from './schema/node.guards'
export * from './schema/node.types'
export * from './schema/identity.types'
export * from './schema/identity.guards'
export * from './schema/microcosm.types'
export * from './schema/microcosm.guards'

export const SCHEMA_VERSION = 0

export { MAX_CHARACTER_COUNT } from './schema/constants'
