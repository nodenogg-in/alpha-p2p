import { isNumber, isObject, isString } from '@figureland/typekit/guards'
import { type Box, isBox } from '@figureland/mathkit/box'
import { type Entity, type EntityType, entityTypes, UnknownEntity } from '../schema/entity.schema'
import type { SchemaNumber, Version } from '../schema/utils/schema-utils'
import { isValidEntityID } from './uuid-guards'

export const isAnyEntity = (e: unknown): e is Entity | UnknownEntity =>
  isObject(e) &&
  'type' in e &&
  isString(e.type) &&
  'schema' in e &&
  isNumber(e.schema) &&
  'lastEdited' in e &&
  isNumber(e.lastEdited) &&
  'created' in e &&
  isNumber(e.created) &&
  'id' in e &&
  isValidEntityID(e.id)

export const isEntity = <T extends EntityType = EntityType>(e: unknown): e is Entity<T> =>
  isAnyEntity(e) && entityTypes.includes(e.type as T)

export const isEntityType = <T extends EntityType | string>(
  e: unknown,
  type: T
): e is T extends EntityType ? Entity<T> : Entity => isEntity(e) && e.type === type

export const isEntityVersion = <S extends SchemaNumber, T extends string & EntityType>(
  e: unknown,
  schema: S,
  type?: T
): e is Version<S, T extends EntityType ? Entity<T> : Entity> => {
  const check = isEntity(e) && e.schema === schema
  return type ? isEntityType(e, type) && check : check
}

export const isSpatialNode = <E extends Entity>(e: unknown): e is E & Box => isEntity(e) && isBox(e)
