import { Output, map, object, optional, string } from 'valibot'
import { DEFAULT_VIEW, MicrocosmReference, ViewType, microcosmReferenceSchema } from '../../schema'
import { State, createTimestamp } from '../../utils'
import { User } from './User'
import { getPersistenceName } from '../Instance'

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
  public user = new User()

  constructor() {
    super({
      initial: () => ({
        lastActive: null,
        microcosms: new Map<string, MicrocosmReference>()
      }),
      persist: {
        name: getPersistenceName(['app', 'microcosms']),
        schema: stateSchema
      }
    })
  }

  public removeReference = (microcosm_uri: string) => {
    this.setKey('microcosms', (microcosms) => {
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
    const existing = this.getKey('microcosms').get(microcosm_uri)
    const updatedReference = {
      microcosm_uri,
      lastAccessed: createTimestamp(),
      password: password || existing?.password,
      view: view || existing?.view || DEFAULT_VIEW
    }
    this.setKey('microcosms', (microcosms) =>
      new Map(microcosms).set(microcosm_uri, updatedReference)
    )
    return updatedReference
  }

  public getReference = (microcosm_uri: string): MicrocosmReference | false => {
    const reference = this.getKey('microcosms').get(microcosm_uri)
    if (!reference) {
      return false
    }
    this.registerReference({ microcosm_uri })
    return reference
  }

  public isActive = (microcosm_uri: string) => this.getKey('active') === microcosm_uri

  public setActive = (microcosm_uri: string) => this.setKey('active', microcosm_uri)
}
