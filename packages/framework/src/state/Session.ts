import { PersistenceName, State, signal } from '@figureland/statekit'
import { typedLocalStorage } from '@figureland/statekit/typed-local-storage'
import { sortMapToArray } from '@figureland/typekit'
import {
  type MicrocosmReference,
  microcosmReferenceSchema,
  microcosmID,
  MicrocosmID,
  createTimestamp
} from '@nodenogg.in/microcosm'
import { is, map, object, optional, string } from 'valibot'

const stateSchema = object({
  active: optional(string()),
  microcosms: map(microcosmID, microcosmReferenceSchema)
})

export type SessionState = {
  active?: MicrocosmID
  microcosms: Map<MicrocosmID, MicrocosmReference>
}

export type MicrocosmEntryRequest = {
  microcosmID: MicrocosmID
  view?: string
  password?: string
}

export class Session extends State<SessionState> {
  public ready = signal(() => false)
  public microcosms = signal((get) => sortMapToArray(get(this.key('microcosms')), 'microcosmID'))

  constructor(persistanceName?: PersistenceName) {
    super({
      initial: () => ({
        active: undefined,
        microcosms: new Map<MicrocosmID, MicrocosmReference>()
      }),
      persistence:
        persistanceName &&
        typedLocalStorage({
          name: persistanceName,
          interval: 500,
          validate: (v) => is(stateSchema, v),
          fallback: (): SessionState => ({
            active: undefined,
            microcosms: new Map()
          })
        })
    })
    this.ready.set(true)
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
