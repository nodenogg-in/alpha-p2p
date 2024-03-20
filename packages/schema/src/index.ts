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
export { type Node_ID, type Identity_ID, type Microcosm_URI } from './uuid.schema'

export { isNode, isNodeReference, isNodeType, isNodeReferenceType } from './guards'
export { getMicrocosmURI, isValidMicrocosmURI } from './microcosm-uri'

export const SCHEMA_VERSION = 0

export const MAX_CHARACTER_COUNT = 2000
