import { number, object, string, type Input, optional, literal } from 'valibot'

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

export const isHTMLNode = (node: Node): node is HTMLNode => node.type === 'html'

export const connectionNodeSchema = object({
  type: literal('connection'),
  to: string(),
  from: string(),
  color: optional(string())
})

export const isConnectionNode = (node: Node): node is ConnectionNode => node.type === 'connection'

export const emojiNodeSchema = object({
  type: literal('emoji'),
  content: string(),
  node: string()
})

export const isEmojiNode = (node: Node): node is EmojiNode => node.type === 'emoji'

export type HTMLNode = Input<typeof htmlNodeSchema>
export type EmojiNode = Input<typeof emojiNodeSchema>
export type ConnectionNode = Input<typeof connectionNodeSchema>
export type Node = HTMLNode | EmojiNode | ConnectionNode

/**
 * Validation schema for a single microcosm
 */
export const microcosmSchema = object({
  microcosm_uri: string(),
  lastAccessed: number()
})

export type Microcosm = Input<typeof microcosmSchema>
