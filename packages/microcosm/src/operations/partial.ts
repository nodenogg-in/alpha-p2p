import type { DistributiveOmit } from '@figureland/typekit/object'
import type { LatestSchemaVersions, Entity, EntityType } from '../schema/entity.schema'
import type { EntityCreatePayload } from './create'
import type { Version } from '../schema/utils/schema-utils'
import type { ReadonlyEntityFields } from '../schema/base-entity.schema'
import { box } from '@figureland/mathkit/box'

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
  html: box(0, 0, 300, 200),
  emoji: {
    body: ''
  },
  connection: {
    body: ''
  },
  ghost: box(0, 0, 300, 200),
  region: box(0, 0, 300, 200)
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
