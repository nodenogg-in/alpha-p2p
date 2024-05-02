import type { BaseNode, SpatialNode } from './shared'
import type { Schema } from './schema'

export type RegionNode = BaseNode<{
  type: 'region'
  schema: Schema<{
    1: SpatialNode & {
      title?: string
      background_color?: string
    }
  }>
}>
