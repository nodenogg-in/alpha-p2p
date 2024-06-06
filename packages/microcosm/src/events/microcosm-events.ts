import { Events, System, createEvents, system } from '@figureland/statekit'
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

export type MicrocosmAPIEvents = {
  collection: Events<CollectionEventMap, IdentityID>
  entity: Events<EntityEventMap, `${IdentityID}/${EntityID}`>
}

export const createMicrocosmAPIEvents = (system: System): MicrocosmAPIEvents => ({
  collection: system.use(createEvents<CollectionEventMap>()),
  entity: system.use(createEvents<EntityEventMap>())
})
