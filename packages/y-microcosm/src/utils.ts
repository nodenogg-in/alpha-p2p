import { disposable } from '@figureland/statekit'
import { type EntityID, isValidEntityID, EntityEvent, Entity } from '@nodenogg.in/microcosm'
import type { YMapEvent, Map as YMap } from 'yjs'
import type { SignedEntity, YCollection } from './YMicrocosmDoc'
import type { Signed } from '@nodenogg.in/microcosm/crypto'

export const createYMapListener = <T extends any>(m: YMap<T>, fn: (e: YMapEvent<T>) => void) => {
  m.observe(fn)
  return disposable(() => m.unobserve(fn))
}

export const getEntityKeys = (m: YCollection): EntityID[] =>
  Array.from(m.keys()).filter(isValidEntityID)

type YMapChangeEvent<T extends any> = {
  action: 'add' | 'update' | 'delete'
  oldValue: T
}

type YChangeEvent<E> = {
  entity_id: EntityID
  change: YMapChangeEvent<E>
}

export const getYCollectionChanges = ({
  changes
}: YMapEvent<SignedEntity>): YChangeEvent<SignedEntity>[] =>
  Array.from(changes.keys)
    .filter((e): e is [EntityID, YMapChangeEvent<SignedEntity>] => isValidEntityID(e[0]))
    .map(([entity_id, change]) => ({
      entity_id,
      change
    }))
