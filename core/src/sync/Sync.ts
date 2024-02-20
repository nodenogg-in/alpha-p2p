import { map, type Output, string } from 'valibot'
import { isEditableMicrocosmAPI, type MicrocosmAPI } from './api'
import { Emitter, createTimestamp, isValidMicrocosmURI } from '../utils'
import { type MicrocosmReference, microcosmReferenceSchema, type ViewName } from '../schema'

export interface RegisterMicrocosm {
  microcosm_uri: string
  password?: string
  view: ViewName
}

export type MicrocosmAPIFactory<M extends MicrocosmAPI = MicrocosmAPI> = (
  args: Omit<RegisterMicrocosm, ViewName> & { user_id: string }
) => M

export const microcosmReferenceMap = map(string(), microcosmReferenceSchema)

export type MicrocosmReferenceMap = Output<typeof microcosmReferenceMap>

export const sortMicrocosmsByName = (microcosms: MicrocosmReferenceMap): MicrocosmReference[] =>
  Array.from(microcosms.values()).sort((a: MicrocosmReference, b: MicrocosmReference) =>
    a.microcosm_uri.localeCompare(b.microcosm_uri)
  )

type SyncEvents = {
  microcosms: IterableIterator<[string, MicrocosmReference]>
}

class SyncEmitter extends Emitter<SyncEvents> {
  public emitMicrocosms = (microcosms: SyncEvents['microcosms']) => {
    this.emit('microcosms', microcosms)
  }
}

export namespace Sync {
  const microcosms: Map<string, MicrocosmAPI> = new Map()
  const references: MicrocosmReferenceMap = new Map()
  const emitter = new SyncEmitter()

  const addReference = (microcosm_uri: string, view: ViewName) => {
    references.set(microcosm_uri, {
      microcosm_uri,
      lastAccessed: createTimestamp(),
      view
    })
    emitter.emitMicrocosms(references.entries())
  }

  const removeReference = (microcosm_uri: string) => {
    references.delete(microcosm_uri)
    emitter.emitMicrocosms(references.entries())
  }

  const set = <M extends MicrocosmAPI>(microcosm_uri: string, view: ViewName, microcosm: M): M => {
    microcosms.set(microcosm_uri, microcosm)
    addReference(microcosm_uri, view)
    return microcosm as M
  }

  const get = (microcosm_uri: string, view: ViewName) => {
    const target = microcosms.get(microcosm_uri)
    if (target) {
      addReference(microcosm_uri, view)
      return target
    }
    return undefined
  }

  export const has = (microcosm_uri: string) => microcosms.has(microcosm_uri)

  export const register = <M extends MicrocosmAPI>(
    factory: MicrocosmAPIFactory<M>,
    user_id: string,
    { microcosm_uri, password, view }: RegisterMicrocosm
  ): M => {
    if (!isValidMicrocosmURI(microcosm_uri)) {
      throw new Error(`Invalid microcosm URI: ${microcosm_uri}`)
    }

    const existing = get(microcosm_uri, view)
    if (existing) {
      return existing as M
    }

    console.log(`${microcosms.size} microcosms active`)
    if (microcosms.size > 5) {
      console.warn(`Performance warning: ${microcosms.size} active microcosms`)
    }

    return set<M>(
      microcosm_uri,
      view,
      factory({
        user_id,
        microcosm_uri,
        password,
        view
      })
    )
  }

  export const leave = (microcosm_uri: string) => {
    const existing = microcosms.get(microcosm_uri)
    if (existing) {
      if (isEditableMicrocosmAPI(existing)) {
        existing.leave()
      }
      existing.dispose()
      microcosms.delete(microcosm_uri)
      removeReference(microcosm_uri)
    }
  }

  export const on: Emitter<SyncEvents>['on'] = (...args) => emitter.on(...args)

  if (import.meta.hot) {
    import.meta.hot.accept((mod) => {
      if (mod) {
        console.log('[HMR]: UI instance')
        // manager = new MicrocosmManager(data.user_id, data.factory)
      }
    })
  }
}
