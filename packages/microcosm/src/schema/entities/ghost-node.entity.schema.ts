import type { Box } from '@figureland/mathkit/box'
import type { Schema } from '../utils/schema-utils'
import type { BaseEntity } from '../base-entity.schema'

export type GhostNode = BaseEntity<{
  type: 'ghost'
  schema: Schema<{
    1: Box & {
      deleted: number
    }
  }>
}>
