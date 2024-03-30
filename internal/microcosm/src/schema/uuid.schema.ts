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
 * A unique identifier for a {@link Microcosm}.
 * A microcosm ID contains a-z, 0-9, or dot, does not have consecutive dots, and does not end with a dot.
 * ```
 * microcosm
 * example.microcosm
 * another.example.microcosm.1
 * ```
 */
export type MicrocosmID = Opaque<string, 'MicrocosmID'>
