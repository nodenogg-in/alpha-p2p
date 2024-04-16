import { PersistenceName, State, signal } from '@figureland/statekit'
import { sortMapToArray } from '@figureland/typekit'
import {
  type MicrocosmReference,
  microcosmReferenceSchema,
  microcosmID,
  MicrocosmID,
  createTimestamp
} from '@nodenogg.in/microcosm'
import { type Output, is, map, object, optional, string } from 'valibot'
import { User } from './User'

const stateSchema = object({
  active: optional(string()),
  microcosms: map(microcosmID, microcosmReferenceSchema)
})

export type SessionState = Output<typeof stateSchema>

export type MicrocosmEntryRequest = {
  microcosmID: MicrocosmID
  view?: string
  password?: string
}

export class Session extends State<SessionState> {
  public user: User
  public ready = signal(() => false)
  public microcosms = signal((get) => sortMapToArray(get(this.key('microcosms')), 'microcosmID'))

  constructor(persistanceName?: PersistenceName) {
    super({
      initial: () => ({
        active: undefined,
        microcosms: new Map<MicrocosmID, MicrocosmReference>()
      }),
      persistence: persistanceName && {
        name: persistanceName,
        validate: (v) => is(stateSchema, v)
      }
    })
    this.ready.set(true)
    this.user = new User()
  }

  public removeReference = (microcosmID: MicrocosmID) => {
    this.key('microcosms').set((microcosms) => {
      const newMap = new Map<MicrocosmID, MicrocosmReference>(microcosms)
      newMap.delete(microcosmID)
      return newMap
    })
  }

  public registerReference = ({
    microcosmID,
    view,
    password
  }: MicrocosmEntryRequest): MicrocosmReference => {
    const existing = this.key('microcosms').get().get(microcosmID)
    const updatedReference = {
      microcosmID,
      lastAccessed: createTimestamp(),
      password: password || existing?.password,
      view: view || (existing?.view as string)
    }
    this.key('microcosms').set((microcosms) =>
      new Map(microcosms).set(microcosmID, updatedReference)
    )
    return updatedReference
  }

  public getReference = (microcosmID: MicrocosmID): MicrocosmReference | false => {
    const reference = this.key('microcosms').get().get(microcosmID)
    if (!reference) {
      return false
    }
    this.registerReference({ microcosmID })
    return reference
  }
  public isActive = (microcosmID: MicrocosmID) => this.key('active').get() === microcosmID
  public setActive = (microcosmID: MicrocosmID) => this.key('active').set(microcosmID)
}
