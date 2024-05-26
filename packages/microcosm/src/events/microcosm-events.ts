import { isString } from '@figureland/typekit/guards'
import { isValidEntityID, isValidIdentityID } from '../guards/uuid-guards'
import type { Entity } from '../schema/entity.schema'
import { IdentityWithStatus } from '../schema/identity.schema'
import type { EntityID, IdentityID } from '../schema/uuid.schema'

export type EntityLocation = `${IdentityID}/${EntityID}`

export type EntityEvent =
  | {
      type: 'create'
      entity: Entity
    }
  | {
      type: 'update'
      entity: Entity
    }
  | {
      type: 'delete'
    }

export type EntityEventMap = Record<EntityLocation, EntityEvent>

export const createEntityEvent = (type: EntityEvent['type'], entity: Entity): EntityEvent => ({
  type,
  entity
})

export const getEntityLocation = (identity_id: IdentityID, entity_id: EntityID): EntityLocation =>
  `${identity_id}/${entity_id}`

export const parseEntityLocation = (
  location: EntityLocation
): { identity_id: IdentityID; entity_id: EntityID } | undefined => {
  if (!isString(location)) {
    return undefined
  }

  const [identity_id, entity_id] = location.split('/')

  if (!isValidIdentityID(identity_id) || !isValidEntityID(entity_id)) {
    return undefined
  }

  return {
    identity_id,
    entity_id
  }
}

export type CollectionEventMap = Record<IdentityID, EntityID[]>

export type CollectionsEventMap = {
  collections: IdentityID[]
}

export type IdentityEventMap = {
  identities: IdentityWithStatus[]
}
