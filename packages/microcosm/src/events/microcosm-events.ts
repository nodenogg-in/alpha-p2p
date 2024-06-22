import type { Entity } from '../schema/entity.schema'

export type EntityEvent<E extends Entity = Entity> =
  | {
      type: 'create'
      entity: E
    }
  | {
      type: 'update'
      entity: E
    }
  | {
      type: 'delete'
      previous: E
    }
