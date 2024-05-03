import type { BaseNode } from './shared'
import type { Schema } from './schema'
import type { NodeID } from '../../operations/uuid'

export type EmojiNode = BaseNode<{
  type: 'emoji'
  schema: Schema<{
    1: {
      body: string
    }
    2: {
      node_id?: NodeID
      body: string
    }
  }>
}>
