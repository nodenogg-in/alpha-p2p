import type { Schema } from '../utils/schema-utils'
import type { BaseEntity, BoxLikeEntity } from '../base-entity.schema'

export type GhostNode = BaseEntity<{
  type: 'ghost'
  schema: Schema<{
    1: BoxLikeEntity & {
      deleted: number
    }
  }>
}>
