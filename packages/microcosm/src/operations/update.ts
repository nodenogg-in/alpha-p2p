import type { DistributiveOmit } from '@figureland/typekit/object'
import { createTimestamp } from './uuid'
import type { Version } from '../schema/utils/schema-utils'
import { keys, omit } from '@figureland/typekit/object'
import {
  type LatestSchemaVersions,
  type Entity,
  type EntityType,
  latestEntitySchemaVersions
} from '../schema/entity.schema'
import type { ReadonlyEntityFields } from '../schema/base-entity.schema'

export type UpdateEntity = <
  T extends EntityType,
  N extends Version<LatestSchemaVersions[T], Entity<T>>
>(
  existing: N,
  update: UpdateEntityPayload<N>
) => Promise<N>

export type UpdateEntityPayload<N extends Entity = Entity> = Partial<
  DistributiveOmit<N, ReadonlyEntityFields>
>

export const update: UpdateEntity = async (existing, u) => {
  const updates = omit(u, protectedKeys as (keyof typeof u)[])
  if (keys(updates).length === 0) {
    return existing
  }
  return {
    ...existing,
    ...updates,
    lastEdited: createTimestamp(),
    schema: latestEntitySchemaVersions[existing.type]
  }
}

const protectedKeys = ['id', 'type', 'schema', 'lastEdited', 'created']
