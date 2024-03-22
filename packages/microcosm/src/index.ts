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
export { createUuid, createIdentityID, createNodeID, createTimestamp, password } from './utils/uuid'
export { type MicrocosmAPIConfig, type MicrocosmAPIEvents, MicrocosmAPI } from './MicrocosmAPI'
export { EditableMicrocosmAPI } from './EditableMicrocosmAPI'
export { isEditableAPI, type MicrocosmAPIFactory } from './api'
export * from './schema/core.schema'
export * from './schema/guards'
export * from './schema/identity.schema'
export * from './schema/microcosm-uri'
export * from './schema/uuid.schema'

export const SCHEMA_VERSION = 0
