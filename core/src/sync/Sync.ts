import { map, type Output, string, object } from 'valibot'
import { isEditableMicrocosmAPI, type MicrocosmAPI } from './api'
import { State, createTimestamp, isValidMicrocosmURI } from '../utils'
import { type MicrocosmReference, microcosmReferenceSchema, type ViewName } from '../schema'

export interface RegisterMicrocosm {
  microcosm_uri: string
  password?: string
  view: ViewName
}

export type MicrocosmAPIFactory<M extends MicrocosmAPI = MicrocosmAPI> = (
  args: Omit<RegisterMicrocosm, ViewName> & { user_id: string }
) => M

export const microcosmReferenceMap = object({ microcosms: map(string(), microcosmReferenceSchema) })

export type MicrocosmReferenceMap = Output<typeof microcosmReferenceMap>

export const sortMicrocosmsByName = (
  microcosms: MicrocosmReferenceMap['microcosms']
): MicrocosmReference[] =>
  Array.from(microcosms.values()).sort((a: MicrocosmReference, b: MicrocosmReference) =>
    a.microcosm_uri.localeCompare(b.microcosm_uri)
  )

export namespace Sync {
  const microcosms: Map<string, MicrocosmAPI> = new Map()

  export const state = new State(() => ({
    data: {
      microcosms: new Map<string, MicrocosmReference>()
    }
  }))

  const removeReference = (microcosm_uri: string) => {
    state.set('data', (data) => {
      data.microcosms.delete(microcosm_uri)
      return data
    })
  }

  const addReference = (microcosm_uri: string, view: ViewName) => {
    state.get('data').microcosms.set(microcosm_uri, {
      microcosm_uri,
      lastAccessed: createTimestamp(),
      view
    })
    state.set('data', (data) => {
      data.microcosms.set(microcosm_uri, {
        microcosm_uri,
        lastAccessed: createTimestamp(),
        view
      })
      return data
    })
  }

  const set = <M extends MicrocosmAPI>(microcosm_uri: string, view: ViewName, microcosm: M): M => {
    microcosms.set(microcosm_uri, microcosm)
    addReference(microcosm_uri, view)
    return microcosm as M
  }

  export const get = (microcosm_uri: string, view: ViewName) => {
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

  if (import.meta.hot) {
    import.meta.hot.accept((mod) => {
      if (mod) {
        console.log('[HMR]: UI instance')
        // manager = new MicrocosmManager(data.user_id, data.factory)
      }
    })
  }
}
