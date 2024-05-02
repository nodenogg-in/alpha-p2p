import type { BaseNode, SpatialNode } from './shared'
import type { Schema } from './schema'

export type HTMLNode = BaseNode<{
  type: 'html'
  schema: Schema<{
    1: SpatialNode & {
      body: string
      background_color?: string
    }
  }>
}>
