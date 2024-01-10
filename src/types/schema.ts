import { number, object, string, type Input, optional } from 'valibot'

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
export const nodeContentSchema = object({
  markdown: string(),
  x: number(),
  y: number(),
  background_color: optional(string())
})

export type NodeContent = Input<typeof nodeContentSchema>

export const nodeSchema = object({
  signature: string(),
  updated: number(),
  id: string(),
  user_id: string(),
  content: nodeContentSchema
})

export type Node = Input<typeof nodeSchema>

/**
 * Validation schema for a single microcosm
 */
export const microcosmSchema = object({
  uri: string(),
  microcosm_id: string(),
  namespace_id: string(),
  lastAccessed: number()
})

export type Microcosm = Input<typeof microcosmSchema>
