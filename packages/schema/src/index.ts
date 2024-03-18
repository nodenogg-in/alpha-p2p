export {
  type NodeMap,
  type Node,
  type NodeType,
  type MicrocosmReference,
  type NodeReference,
  htmlNodeSchema,
  connectionNodeSchema,
  emojiNodeSchema,
  nodeSchema,
  microcosmReferenceSchema
} from './core.schema'
export {
  type Identity,
  type IdentityWithStatus,
  identitySchema,
  identityStatusSchema
} from './identity.schema'
export { type ViewType, viewTypes, DEFAULT_VIEW, isValidView } from './views.schema'
export { isNode, isNodeReference, isNodeType, isNodeReferenceType } from './guards'
export { sanitizeMicrocosmURI, isValidMicrocosmURI } from './microcosm-uri'

export const SCHEMA_VERSION = 0

export const MAX_CHARACTER_COUNT = 2000
