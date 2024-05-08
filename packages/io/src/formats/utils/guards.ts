import { isNumber, isObject, isString } from '@figureland/typekit/guards'
import { type Entity, type EntityType, isValidEntityID, entityTypes } from '@nodenogg.in/microcosm'

export const isPartialEntity = (entity: unknown): entity is Partial<Entity> => {
  if (!isObject(entity)) {
    return false
  }
  const hasType =
    'type' in entity && isString(entity.type) && entityTypes.includes(entity.type as EntityType)

  return (
    hasType ||
    ('schema' in entity && isNumber(entity.schema)) ||
    ('lastEdited' in entity && isNumber(entity.lastEdited)) ||
    ('created' in entity && isNumber(entity.created)) ||
    ('id' in entity && isValidEntityID(entity.id))
  )
}

export const isPartialEntityType = <T extends string & EntityType>(
  entity: unknown,
  type: T
): entity is Entity<T> => isPartialEntity(entity) && 'type' in entity && entity.type === type
