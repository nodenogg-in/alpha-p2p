import type { DistributiveOmit } from '@figureland/typekit/object'
import {
  type Entity,
  type EntityType,
  type LatestSchemaVersions,
  latestEntitySchemaVersions
} from '../schema/entity.schema'
import type { Version } from '../schema/utils/schema-utils'
import { createEntityID, createTimestamp } from './uuid'
import type { ReadonlyEntityFields } from '../schema/base-entity.schema'

export type EntityCreatePayload<T extends EntityType> = DistributiveOmit<
  Entity<T>,
  ReadonlyEntityFields
> & {
  type: T
}

export type EntityCreate<T extends EntityType = EntityType> = (
  entity: EntityCreatePayload<T>
) => Promise<Version<LatestSchemaVersions[T], Entity<T>>>

export const create = <T extends EntityType>(entity: EntityCreatePayload<T>) => {
  const created = createTimestamp()
  return {
    ...entity,
    id: createEntityID(),
    schema: latestEntitySchemaVersions[entity.type],
    created,
    lastEdited: created
  } as unknown as Version<LatestSchemaVersions[T], Entity<T>>
}
