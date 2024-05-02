import type { Schema } from './schema'
import type { NodeID } from '../../operations/uuid'

export type ReadonlyNodeFields = 'id' | 'lastEdited' | 'created' | 'schema' | 'type'

export type BaseNode<O extends { type: string; schema: Schema }> = O['schema'] & {
  id: NodeID
  type: O['type']
  lastEdited: number
  created: number
}

export type SpatialNode = {
  x: number
  y: number
  z?: number
  width: number
  height: number
  depth?: number
  locked?: number
}
