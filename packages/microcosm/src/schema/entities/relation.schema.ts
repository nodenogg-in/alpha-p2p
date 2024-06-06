import type { Schema } from '../utils/schema-utils'
import type { BaseEntity } from '../base-entity.schema'
import type { EntityID } from '../uuid.schema'
import { create } from '../../operations/create'
import { createEntityID } from '../../operations/uuid'

export type Relation = BaseEntity<{
  type: 'relation'
  schema: Schema<{
    1: {
      body: string
    }
    2: {
      from?: EntityID
      to?: EntityID
      body?: string
    }
  }>
}>

const relation = create({
  type: 'relation',
  from: createEntityID(),
  to: createEntityID(),
  body: 'something'
})
