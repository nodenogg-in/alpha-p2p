import { TelemetryError } from '@nodenogg.in/microcosm/telemetry'
import type { PersistenceFactory } from '.'
import { IndexedDBPersistence } from './IndexedDBPersistence'

export const createIndexedDBPersistence = (): PersistenceFactory => async (microcosmID, doc) => {
  try {
    return new IndexedDBPersistence(microcosmID, doc)
  } catch (error) {
    throw new TelemetryError({
      name: 'createIndexedDBPersistence',
      message: `Could not create IndexedDBPersistence for ${microcosmID}`,
      level: 'warn',
      error
    })
  }
}
