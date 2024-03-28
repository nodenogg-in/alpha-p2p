import { PersistenceName, State, signal } from '@nodenogg.in/statekit'
import { sortMapToArray } from '@nodenogg.in/toolkit'
import {
  type MicrocosmReference,
  createTimestamp,
  microcosmReferenceSchema,
  microcosmURI,
  Microcosm_URI
} from '@nodenogg.in/microcosm'
import { type Output, is, map, object, optional, string } from 'valibot'
import { User } from './User'

const stateSchema = object({
  active: optional(string()),
  microcosms: map(microcosmURI, microcosmReferenceSchema)
})

export type SessionState = Output<typeof stateSchema>

export type MicrocosmEntryRequest = {
  microcosm_uri: Microcosm_URI
  view?: string
  password?: string
}

export class Session extends State<SessionState> {
  public user: User
  public ready = signal(() => false)
  public microcosms = signal(() => sortMapToArray(this.key('microcosms').get(), 'microcosm_uri'))

  constructor(persistanceName?: PersistenceName) {
    super({
      initial: () => ({
        active: undefined,
        microcosms: new Map<Microcosm_URI, MicrocosmReference>()
      }),
      persist: persistanceName && {
        name: persistanceName,
        validate: (v) => is(stateSchema, v)
      }
    })
    this.ready.set(true)
    this.user = new User()
  }

  public removeReference = (microcosm_uri: Microcosm_URI) => {
    this.key('microcosms').set((microcosms) => {
      const newMap = new Map<Microcosm_URI, MicrocosmReference>(microcosms)
      newMap.delete(microcosm_uri)
      return newMap
    })
  }

  public registerReference = ({
    microcosm_uri,
    view,
    password
  }: MicrocosmEntryRequest): MicrocosmReference => {
    const existing = this.key('microcosms').get().get(microcosm_uri)
    const updatedReference = {
      microcosm_uri,
      lastAccessed: createTimestamp(),
      password: password || existing?.password,
      view: view || (existing?.view as string)
    }
    this.key('microcosms').set((microcosms) =>
      new Map(microcosms).set(microcosm_uri, updatedReference)
    )
    return updatedReference
  }

  public getReference = (microcosm_uri: Microcosm_URI): MicrocosmReference | false => {
    const reference = this.key('microcosms').get().get(microcosm_uri)
    if (!reference) {
      return false
    }
    this.registerReference({ microcosm_uri })
    return reference
  }

  public isActive = (microcosm_uri: Microcosm_URI) => this.key('active').get() === microcosm_uri
  public setActive = (microcosm_uri: Microcosm_URI) => this.key('active').set(microcosm_uri)
}
