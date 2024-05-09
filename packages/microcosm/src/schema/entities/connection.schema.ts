import type { Schema } from '../utils/schema-utils'
import type { BaseEntity } from '../base-entity.schema'
import type { EntityID } from '../uuid.schema'
import { create } from '../../operations/create'
import { createEntityID } from '../../operations/uuid'

export type Connection = BaseEntity<{
  type: 'connection'
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

const connection = create({
  type: 'connection',
  from: createEntityID(),
  to: createEntityID(),
  body: 'something'
})
