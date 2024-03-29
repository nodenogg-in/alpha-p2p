import { PersistenceName, State, signal } from '@nodenogg.in/statekit'
import { sortMapToArray } from '@nodenogg.in/toolkit'
import {
  type MicrocosmReference,
  createTimestamp,
  microcosmReferenceSchema,
  microcosmURI,
  MicrocosmID
} from '@nodenogg.in/microcosm'
import { type Output, is, map, object, optional, string } from 'valibot'
import { User } from './User'

const stateSchema = object({
  active: optional(string()),
  microcosms: map(microcosmURI, microcosmReferenceSchema)
})

export type SessionState = Output<typeof stateSchema>

export type MicrocosmEntryRequest = {
  MicrocosmID: MicrocosmID
  view?: string
  password?: string
}

export class Session extends State<SessionState> {
  public user: User
  public ready = signal(() => false)
  public microcosms = signal(() => sortMapToArray(this.key('microcosms').get(), 'MicrocosmID'))

  constructor(persistanceName?: PersistenceName) {
    super({
      initial: () => ({
        active: undefined,
        microcosms: new Map<MicrocosmID, MicrocosmReference>()
      }),
      persist: persistanceName && {
        name: persistanceName,
        validate: (v) => is(stateSchema, v)
      }
    })
    this.ready.set(true)
    this.user = new User()
  }

  public removeReference = (MicrocosmID: MicrocosmID) => {
    this.key('microcosms').set((microcosms) => {
      const newMap = new Map<MicrocosmID, MicrocosmReference>(microcosms)
      newMap.delete(MicrocosmID)
      return newMap
    })
  }

  public registerReference = ({
    MicrocosmID,
    view,
    password
  }: MicrocosmEntryRequest): MicrocosmReference => {
    const existing = this.key('microcosms').get().get(MicrocosmID)
    const updatedReference = {
      MicrocosmID,
      lastAccessed: createTimestamp(),
      password: password || existing?.password,
      view: view || (existing?.view as string)
    }
    this.key('microcosms').set((microcosms) =>
      new Map(microcosms).set(MicrocosmID, updatedReference)
    )
    return updatedReference
  }

  public getReference = (MicrocosmID: MicrocosmID): MicrocosmReference | false => {
    const reference = this.key('microcosms').get().get(MicrocosmID)
    if (!reference) {
      return false
    }
    this.registerReference({ MicrocosmID })
    return reference
  }

  public isActive = (MicrocosmID: MicrocosmID) => this.key('active').get() === MicrocosmID
  public setActive = (MicrocosmID: MicrocosmID) => this.key('active').set(MicrocosmID)
}
