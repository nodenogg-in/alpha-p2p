import type { DistributiveOmit } from '@figureland/kit/ts/object'
import {
  type Entity,
  type EntityType,
  type LatestSchemaVersions,
  latestEntitySchemaVersions
} from '../schema/entity.schema'
import type { Version } from '../schema/utils/schema-utils'
import { createEntityID, createTimestamp } from './uuid'
import type { ReadonlyEntityFields } from '../schema/base-entity.schema'

export type CreateEntityPayload<T extends EntityType = EntityType> = DistributiveOmit<
  Entity<T>,
  ReadonlyEntityFields
> & {
  type: T
}

export type CreateEntity<T extends EntityType = EntityType> = (
  entity: CreateEntityPayload<T>
) => Promise<Version<LatestSchemaVersions[T], Entity<T>>>

export const create = <T extends EntityType>(entity: CreateEntityPayload<T>) => {
  const created = createTimestamp()
  return {
    ...entity,
    id: createEntityID(),
    schema: latestEntitySchemaVersions[entity.type],
    created,
    lastEdited: created
  } as unknown as Version<LatestSchemaVersions[T], Entity<T>>
}
