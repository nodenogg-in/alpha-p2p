import { disposable } from '@figureland/statekit'
import { type EntityID, isValidEntityID } from '@nodenogg.in/microcosm'
import type { YMapEvent, Map as YMap } from 'yjs'
import { SignedEntity, YCollection } from './YMicrocosmDoc'

export const createYMapListener = <T extends any>(m: YMap<T>, fn: (e: YMapEvent<T>) => void) => {
  m.observe(fn)
  return disposable(() => m.unobserve(fn))
}

export const getEntityKeys = (m: YCollection): EntityID[] =>
  Array.from(m.keys()).filter(isValidEntityID)

type YMapChangeEvent = {
  action: 'add' | 'update' | 'delete'
  oldValue: any
}

export const getYCollectionChanges = ({ changes }: YMapEvent<SignedEntity>) =>
  Array.from(changes.keys)
    .filter((e): e is [EntityID, YMapChangeEvent] => isValidEntityID(e[0]))
    .map(([entity_id, change]) => ({
      entity_id,
      change
    }))
