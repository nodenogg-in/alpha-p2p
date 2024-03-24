import { isString } from '@nodenogg.in/toolkit'

export type Node_ID = `node_${string}`

export type Identity_UID = `identity_${string}`

type Opaque<K, T> = T & { __TYPE__: K }
export type Microcosm_URI = Opaque<string, 'Microcosm_URI'>
