import type { DistributiveOmit } from '@figureland/typekit'
import type { LatestSchemaVersions, Entity, EntityType } from '../schema/entity.schema'
import type { EntityCreatePayload } from './create'
import type { Version } from '../schema/utils/schema-utils'
import { ReadonlyEntityFields } from '../schema/base-entity.schema'
import { defaultBoxEntity } from './defaults'

/* 
Provides a partial record of all the fields that are specific to each entity type
*/
export type PartialEntityFields<T extends EntityType> = DistributiveOmit<
  Partial<Version<LatestSchemaVersions[T], Entity<T>>>,
  ReadonlyEntityFields
> & { type: T }

export type PartialEntityFieldsRecord = {
  [K in EntityType]: DistributiveOmit<PartialEntityFields<K>, 'type'>
}

/* 
For each entity type, here are a set of defaults fields
*/
export const partialEntityFields: PartialEntityFieldsRecord = {
  html: defaultBoxEntity(),
  emoji: {
    body: ''
  },
  connection: {
    body: ''
  },
  ghost: defaultBoxEntity(),
  region: defaultBoxEntity()
}

export type EntityPartialCreatePayload<T extends EntityType> = PartialEntityFields<T> & {
  type: T
}

export const fromPartialEntity = <T extends EntityType>(
  entity: EntityPartialCreatePayload<T>
): EntityCreatePayload<T> =>
  ({
    ...partialEntityFields[entity.type],
    ...entity
  }) as unknown as EntityCreatePayload<T>
