import { number, object, string, type Input } from 'valibot'

/**
 * Validation schema for a single node
 */
export const nodeSchema = object({
  id: string(),
  author: string(),
  content: string(),
  x: number(),
  y: number()
})

export type Node = Input<typeof nodeSchema>

/**
 * Validation schema for a single microcosm
 */
export const microcosmSchema = object({
  uri: string(),
  microcosm_id: string(),
  namespace_id: string(),
  lastAccessed: string()
})

export type Microcosm = Input<typeof microcosmSchema>
