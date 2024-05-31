import type { Schema } from '../utils/schema-utils'
import type { BaseEntity, EntityBoxFields } from '../base-entity.schema'

export type HTMLNode = BaseEntity<{
  type: 'html'
  schema: Schema<{
    1: EntityBoxFields & {
      body: string
      background_color?: string
    }
  }>
}>
