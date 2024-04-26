import type { Doc } from 'yjs'

export interface Persistence {
  destroy: () => void
  clearData: () => void
}

export type PersistenceFactory<P extends Persistence = Persistence> = (
  microcosmID: string,
  doc: Doc
) => Promise<P>

export * from './create-indexeddb-persistence'
