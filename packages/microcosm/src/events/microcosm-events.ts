import type { Entity } from '../schema/entity.schema'
import type { IdentityWithStatus } from '../schema/identity.schema'
import type { EntityID, EntityLocation, IdentityID } from '../schema/uuid.schema'

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

export type EntityEventMap = Record<EntityLocation, EntityEvent>

export type CollectionEventMap = Record<IdentityID, EntityID[]>

export type CollectionsEventMap = {
  collections: IdentityID[]
}

export type IdentityEventMap = {
  identities: IdentityWithStatus[]
}
