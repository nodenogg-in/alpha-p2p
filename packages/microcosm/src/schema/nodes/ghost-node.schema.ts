import type { BaseNode, SpatialNode } from './shared'
import type { Schema } from './schema'

export type GhostNode = BaseNode<{
  type: 'ghost'
  schema: Schema<{
    1: SpatialNode & {
      deleted: number
    }
  }>
}>
