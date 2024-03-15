import { number, object, string, type Input, optional, literal, variant } from 'valibot'
import { viewType } from './views.schema'
import type { DistributiveOmit } from './utils'

// This is where the core data types for nodenoggin are stored.
// They are defined as schema objects so that the data can be
// validated as with a decentralised architecture there could be a lot
// of messages coming in and out from completely untrusted and/or
// unknown sources.

// Whenever we want to check if an unknown piece of data is a valid
// according to the nodenoggin schema we can use valibot's is() helper
// for example:

// import { is } from 'valibot'

// if (is(nodeSchema, data)) {
//   ... do action safely with data knowing it is a valid Node
// }

// The type definitions are then inferred from these schema objects.

/**
 * Validation schema for a single node
 */

export const htmlNodeSchema = object({
  type: literal('html'),
  lastEdited: number(),
  content: string(),
  x: number(),
  y: number(),
  width: number(),
  height: number(),
  background_color: optional(string())
})

export const connectionNodeSchema = object({
  type: literal('connection'),
  lastEdited: number(),
  to: string(),
  from: string(),
  color: optional(string())
})

export const emojiNodeSchema = object({
  type: literal('emoji'),
  lastEdited: number(),
  content: string(),
  node: string()
})

export const nodeSchema = variant('type', [htmlNodeSchema, connectionNodeSchema, emojiNodeSchema])

export type NodeMap = {
  html: Input<typeof htmlNodeSchema>
  emoji: Input<typeof emojiNodeSchema>
  connection: Input<typeof connectionNodeSchema>
}

export type Node<T extends string | undefined = undefined> = T extends keyof NodeMap
  ? NodeMap[T]
  : Input<typeof nodeSchema>

export type NodeType = keyof NodeMap

export type NewNode<T extends string | undefined = undefined> = DistributiveOmit<
  Node<T>,
  'lastEdited'
>

/**
 * Validation schema for a single microcosm
 */
export const microcosmReferenceSchema = object({
  microcosm_uri: string(),
  lastAccessed: number(),
  password: optional(string()),
  view: viewType
})

export type MicrocosmReference = Input<typeof microcosmReferenceSchema>

export type NodeReference<T extends NodeType = NodeType> = [string, Node<T>]

export type NodeCollection<T extends NodeType = NodeType> = [string, NodeReference<T>[]]
