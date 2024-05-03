import type { BaseNode } from './shared'
import type { Schema } from './schema'
import type { NodeID } from '../../operations/uuid'

export type ConnectionNode = BaseNode<{
  type: 'connection'
  schema: Schema<{
    1: {
      from?: NodeID
      to?: NodeID
    }
    2: {
      from?: NodeID
      to?: NodeID
      body: string
    }
  }>
}>
