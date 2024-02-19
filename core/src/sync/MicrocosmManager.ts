import { type Output, map, string } from 'valibot'

import { Emitter } from '../utils/emitter/Emitter'
import { createTimestamp, isValidMicrocosmURI } from '../utils'
import { microcosmReferenceSchema, type MicrocosmReference } from './schema'
import { isEditableMicrocosmAPI, type MicrocosmAPI } from './api'
import { type ViewName } from '../views'

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

export class MicrocosmManager<M extends MicrocosmAPI> extends Emitter<{
  microcosms: IterableIterator<[string, MicrocosmReference]>
}> {
  private microcosms: Map<string, M> = new Map()
  private readonly user_id: string
  private factory: MicrocosmAPIFactory<M>
  public references: MicrocosmReferenceMap = new Map()

  constructor(user_id: string, factory: MicrocosmAPIFactory<M>) {
    super()
    this.factory = factory
    this.user_id = user_id
  }

  private addReference = (microcosm_uri: string, view: ViewName) => {
    this.references.set(microcosm_uri, {
      microcosm_uri,
      lastAccessed: createTimestamp(),
      view
    })
    this.emitMicrocosms()
  }

  private removeReference = (microcosm_uri: string) => {
    this.references.delete(microcosm_uri)
    this.emitMicrocosms()
  }

  public has = (microcosm_uri: string) => this.microcosms.has(microcosm_uri)

  private set = (microcosm_uri: string, view: ViewName, microcosm: M) => {
    this.microcosms.set(microcosm_uri, microcosm)
    this.addReference(microcosm_uri, view)
    return microcosm
  }

  private get = (microcosm_uri: string, view: ViewName) => {
    const target = this.microcosms.get(microcosm_uri)
    if (target) {
      this.addReference(microcosm_uri, view)
      return target
    }
    return undefined
  }

  public register = ({ microcosm_uri, password, view }: RegisterMicrocosm): M => {
    if (!isValidMicrocosmURI(microcosm_uri)) {
      throw new Error(`Invalid microcosm URI: ${microcosm_uri}`)
    }

    const existing = this.get(microcosm_uri, view)
    if (existing) {
      return existing
    }

    console.log(`${this.microcosms.size} microcosms active`)
    if (this.microcosms.size > 5) {
      console.warn(`Performance warning: ${this.microcosms.size} active microcosms`)
    }

    return this.set(
      microcosm_uri,
      view,
      this.factory({
        user_id: this.user_id,
        microcosm_uri,
        password,
        view
      })
    )
  }

  public leave = (microcosm_uri: string) => {
    const existing = this.microcosms.get(microcosm_uri)
    if (existing) {
      if (isEditableMicrocosmAPI(existing)) {
        existing.leave()
      }
      existing.dispose()
      this.microcosms.delete(microcosm_uri)
      this.removeReference(microcosm_uri)
    }
  }

  private emitMicrocosms = () => {
    this.emit('microcosms', this.references.entries())
  }
}
