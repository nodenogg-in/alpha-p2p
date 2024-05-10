import type { Schema } from '../utils/schema-utils'
import type { BaseEntity, BoxLikeEntity } from '../base-entity.schema'

export type RegionNode = BaseEntity<{
  type: 'region'
  schema: Schema<{
    1: BoxLikeEntity & {
      title?: string
      background_color?: string
    }
  }>
}>
