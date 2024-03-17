import { State } from '@nodenogg.in/state'
import { Output, is, map, object, optional, string } from 'valibot'
import {
  DEFAULT_VIEW,
  MicrocosmReference,
  ViewType,
  microcosmReferenceSchema
} from '@nodenogg.in/schema'
import { createTimestamp } from '../../api/utils/uuid'
import { User } from './User'
import { Instance } from '..'

export const stateSchema = object({
  active: optional(string()),
  microcosms: map(string(), microcosmReferenceSchema)
})

export type SessionState = Output<typeof stateSchema>

export type MicrocosmEntryRequest = {
  microcosm_uri: string
  view?: ViewType
  password?: string
}

export class Session extends State<SessionState> {
  public user: User

  constructor() {
    super({
      initial: () => ({
        lastActive: null,
        microcosms: new Map<string, MicrocosmReference>()
      }),
      persist: {
        name: Instance.getPersistenceName(['app', 'microcosms']),
        validate: (v) => is(stateSchema, v)
      }
    })
    this.user = new User()
  }

  public removeReference = (microcosm_uri: string) => {
    this.key('microcosms').set((microcosms) => {
      const newMap = new Map<string, MicrocosmReference>(microcosms)
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
      view: view || existing?.view || DEFAULT_VIEW
    }
    this.key('microcosms').set((microcosms) =>
      new Map(microcosms).set(microcosm_uri, updatedReference)
    )
    return updatedReference
  }

  public getReference = (microcosm_uri: string): MicrocosmReference | false => {
    const reference = this.key('microcosms').get().get(microcosm_uri)
    if (!reference) {
      return false
    }
    this.registerReference({ microcosm_uri })
    return reference
  }

  public isActive = (microcosm_uri: string) => this.key('active').get() === microcosm_uri

  public setActive = (microcosm_uri: string) => this.key('active').set(microcosm_uri)
}
