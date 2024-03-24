// API
export { getNodesByType } from './utils/query'
export {
  type NewNode,
  type NodeUpdate,
  type NodePatch,
  isNodeUpdate,
  updateNode,
  createNode
} from './utils/update'
export {
  createUuid,
  createIdentityUID,
  getMicrocosmURI,
  isValidMicrocosmURI,
  createNodeID,
  createTimestamp,
  password
} from './utils/uuid'
export { type MicrocosmAPIConfig, type MicrocosmAPIEvents, MicrocosmAPI } from './MicrocosmAPI'
export { EditableMicrocosmAPI } from './EditableMicrocosmAPI'
export { isEditableAPI, type MicrocosmAPIFactory } from './api'
export * from './schema/guards'
export * from './schema/identity.schema'
export * from './schema/uuid.schema'
export * from './schema/core.schema'

export const SCHEMA_VERSION = 0

export { MAX_CHARACTER_COUNT } from './schema/constants'
