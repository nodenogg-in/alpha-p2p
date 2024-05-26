/**
 * A unique identifier for a {@link Entity}
 */
export type EntityID = `e_${string}`

/**
 * A unique identifier for an {@link Identity}
 */
export type IdentityID = `@${string}`

/**
 * A unique identifier for a {@link Microcosm}.
 * A microcosm ID contains a-z, 0-9 is formed of two parts: the user friendly name and the UUID,
 * for example `adam_abcdefgh1234`.
 */
export type MicrocosmID = string & { __TYPE__: 'MicrocosmID' }

export type EntityLocation = `${IdentityID}/${EntityID}`
