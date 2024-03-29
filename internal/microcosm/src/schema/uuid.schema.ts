import { isString } from '@nodenogg.in/toolkit'

/**
 * A unique identifier for a {@link Node}
 */
export type NodeID = `node_${string}`

/**
 * A unique identifier for an {@link Identity}
 */
export type IdentityID = `identity_${string}`

type Opaque<K, T> = T & { __TYPE__: K }

/**
 * A unique identifier for a {@link Microcosm}
 */
export type MicrocosmID = Opaque<string, 'MicrocosmID'>
