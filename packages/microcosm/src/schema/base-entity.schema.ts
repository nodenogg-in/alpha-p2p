import { Box } from '@figureland/mathkit/box'
import type { Schema } from './utils/schema-utils'
import type { EntityID } from './uuid.schema'

export type BaseEntity<O extends { type: string; schema: Schema }> = O['schema'] & {
  id: EntityID
  type: O['type']
  lastEdited: number
  created: number
}

export type ReadonlyEntityFields = 'id' | 'lastEdited' | 'created' | 'schema' | 'type'

export type EntityBoxFields = Box & { z?: number }
