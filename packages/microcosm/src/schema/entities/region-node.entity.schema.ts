import type { Box } from '@figureland/mathkit/box'
import type { Schema } from '../utils/schema-utils'
import type { BaseEntity } from '../base-entity.schema'

export type Region = BaseEntity<{
  type: 'region'
  schema: Schema<{
    1: Box & {
      title?: string
      background_color?: string
    }
  }>
}>
