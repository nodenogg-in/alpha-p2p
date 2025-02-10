import { disposable } from '@figureland/kit/state'
import { type EntityID, isValidEntityID } from '@nodenogg.in/microcosm'
import type { YMapEvent, Map as YMap, Doc as YDoc } from 'yjs'
import type { SignedEntity } from './YMicrocosmDoc'

export const createYMapListener = <T extends any>(
  m: YMap<T>,
  fn: (e: YMapEvent<T>['changes']) => void
) => {
  const listener = ({ changes }: YMapEvent<T>) => fn(changes)
  m.observe(listener)
  return disposable(() => m.unobserve(listener))
}

type YMapChangeEvent<T extends any> = {
  action: 'add' | 'update' | 'delete'
  oldValue: T
}

type YChangeEvent<E> = {
  entity_id: EntityID
  change: YMapChangeEvent<E>
}

export const getYCollectionChanges = (
  changes: YMapEvent<SignedEntity>['changes']
): YChangeEvent<SignedEntity>[] =>
  Array.from(changes.keys)
    .filter((e): e is [EntityID, YMapChangeEvent<SignedEntity>] => isValidEntityID(e[0]))
    .map(([entity_id, change]) => ({
      entity_id,
      change
    }))

export const createYDocListener = <Y extends YDoc>(d: Y, fn: () => void) => {
  d.on('update', fn)
  return disposable(() => d.off('update', fn))
}
