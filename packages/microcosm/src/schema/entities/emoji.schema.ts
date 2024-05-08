import type { Schema } from '../utils/schema-utils'
import type { BaseEntity } from '../base-entity.schema'
import type { EntityID } from '../uuid.schema'

export type Emoji = BaseEntity<{
  type: 'emoji'
  schema: Schema<{
    1: {
      body: string
    }
    2: {
      entity_id?: EntityID
      body: string
    }
  }>
}>
