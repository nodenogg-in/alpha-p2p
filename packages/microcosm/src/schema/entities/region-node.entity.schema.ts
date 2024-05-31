import type { Schema } from '../utils/schema-utils'
import type { BaseEntity, EntityBoxFields } from '../base-entity.schema'

export type RegionNode = BaseEntity<{
  type: 'region'
  schema: Schema<{
    1: EntityBoxFields & {
      title?: string
      background_color?: string
    }
  }>
}>
