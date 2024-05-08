import type { Box } from '@figureland/mathkit/box'
import type { Schema } from '../utils/schema-utils'
import type { BaseEntity } from '../base-entity.schema'

export type HTMLNode = BaseEntity<{
  type: 'html'
  schema: Schema<{
    1: Box & {
      body: string
      background_color?: string
    }
  }>
}>
