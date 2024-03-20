export type Node_ID = `node_${string}`

export type Identity_ID = `identity_${string}`

type Opaque<K, T> = T & { __TYPE__: K }
export type Microcosm_URI = Opaque<string, 'Microcosm_URI'>
