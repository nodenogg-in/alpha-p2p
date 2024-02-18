import {
  number,
  object,
  string,
  type Input,
  optional,
  literal,
  intersect,
  boolean,
  picklist,
  variant
} from 'valibot'
import { viewName } from '../views'

// This is where the core data types for nodenoggin are stored.
// They are defined as schema objects so that the data can be
// validated as with a decentralised architecture there will be a lot
// of messages coming in and out from completely untrusted and/or
// unknown sources.

// Whenever we want to check if an unknown piece of data is a valid
// according to the nodenoggin schema we can use valibot's is() helper
// for example:

// import { is } from 'valibot'

// ...

// if (is(nodeSchema, data)) {
//   ... do action safely with data knowing it is a valid Node
// }

// The type definitions are then inferred from these schema objects.

/**
 * Validation schema for identity
 */
export const identitySchema = object({
  user_id: string(),
  username: optional(string())
})

export type Identity = Input<typeof identitySchema>

export const identityStatusSchema = intersect([
  identitySchema,
  object({
    joined: boolean()
  })
])

export type IdentityWithStatus = Input<typeof identityStatusSchema>

export const nodeTypeSchema = picklist(['html', 'connection', 'emoji'])

export type NodeType = Input<typeof nodeTypeSchema>

/**
 * Validation schema for a single node
 */
export const htmlNodeSchema = object({
  type: literal('html'),
  content: string(),
  x: number(),
  y: number(),
  width: number(),
  height: number(),
  background_color: optional(string())
})

export const connectionNodeSchema = object({
  type: literal('connection'),
  to: string(),
  from: string(),
  color: optional(string())
})

export const emojiNodeSchema = object({
  type: literal('emoji'),
  content: string(),
  node: string()
})

export const nodeSchema = variant('type', [htmlNodeSchema, connectionNodeSchema, emojiNodeSchema])

export type HTMLNode = Input<typeof htmlNodeSchema>
export type EmojiNode = Input<typeof emojiNodeSchema>
export type ConnectionNode = Input<typeof connectionNodeSchema>
export type Node = Input<typeof nodeSchema>

/**
 * Validation schema for a single microcosm
 */
export const microcosmReferenceSchema = object({
  microcosm_uri: string(),
  lastAccessed: number(),
  view: viewName
})

export type MicrocosmReference = Input<typeof microcosmReferenceSchema>

export type NodeReference<T extends Node = Node> = [string, T]

export type NodeCollection<T extends Node = Node> = [string, NodeReference<T>[]]
