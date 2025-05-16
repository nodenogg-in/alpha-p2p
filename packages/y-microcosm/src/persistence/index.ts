import type { Doc } from 'yjs'

export interface Persistence {
  destroy: () => void
  clearData: () => void
}

export type PersistenceFactory<P extends Persistence = Persistence> = (
  microcosmUUID: string,
  doc: Doc
) => Promise<P>

export { createIndexedDBPersistence } from './IndexedDBPersistence'
