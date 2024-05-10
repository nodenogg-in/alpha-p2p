import type { Schema } from '../utils/schema-utils'
import type { BaseEntity, BoxLikeEntity } from '../base-entity.schema'

export type HTMLNode = BaseEntity<{
  type: 'html'
  schema: Schema<{
    1: BoxLikeEntity & {
      body: string
      background_color?: string
    }
  }>
}>
