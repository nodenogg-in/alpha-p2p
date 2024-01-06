import { number, object, string } from 'valibot'

/**
 * Validation schema for a single node
 */
export const nodeSchema = object({
  id: string(),
  content: string(),
  x: number(),
  y: number()
})

/**
 * Validation schema for a single microcosm
 */
export const microcosmSchema = object({
  uri: string(),
  microcosm_id: string(),
  namespace_id: string(),
  lastAccessed: string()
})
