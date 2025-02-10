import { entries } from '@figureland/kit/tools/object'
import type { Entity, EntityType } from '../schema/entity.schema'
import type { Version } from '../schema/utils/schema-utils'
import type { ReadonlyEntityFields } from '../schema/base-entity.schema'
import { isEntityVersion } from '../guards/entity-guards'
import { createTimestamp } from './uuid'

export type EntityMigration<F, T> = (i: F) => T

export const createMigration =
  <
    T extends EntityType,
    V1 extends Entity<T>['schema'],
    V2 extends Entity<T>['schema'],
    I extends Version<V1, Entity<T>>,
    O extends Version<V2, Entity<T>>,
    AddFields extends Omit<Partial<O>, ReadonlyEntityFields>
  >(
    type: T,
    migration: [V1, V2],
    changes: {
      add?: (i: I) => AddFields
      remove?: (keyof I)[]
    }
  ): EntityMigration<I, O> =>
  (entity) => {
    if (isEntityVersion(entity, migration[1], type)) {
      return entity as unknown as O
    }
    const newEntity: any = {}

    for (const [key, value] of entries(entity)) {
      if (!changes.remove?.includes(key)) {
        newEntity[key] = value
      }
    }

    if (changes.add) {
      Object.assign(newEntity, changes.add(entity))
    }

    newEntity.lastEdited = createTimestamp()
    newEntity.schema = migration[1]

    return newEntity as O
  }
