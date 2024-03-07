import { Output, map, object, optional, string } from 'valibot'
import { DEFAULT_VIEW, MicrocosmReference, ViewType, microcosmReferenceSchema } from '../../schema'
import { APP_NAME, SCHEMA_VERSION } from '../../sync'
import { State, createTimestamp } from '../../utils'
import { getPersistenceName } from '../create-app'
import { User } from './User'

export const stateSchema = object({
  active: optional(string()),
  microcosms: map(string(), microcosmReferenceSchema)
})

export type SessionState = Output<typeof stateSchema>

export class Session extends State<SessionState> {
  public user = new User()
  static appName = APP_NAME
  static schemaVersion = SCHEMA_VERSION

  constructor() {
    super({
      initial: () => ({
        lastActive: null,
        microcosms: new Map()
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

  public addReference = (microcosm_uri: string, view?: ViewType) =>
    this.setKey('microcosms', (microcosms) =>
      new Map(microcosms).set(microcosm_uri, {
        microcosm_uri,
        lastAccessed: createTimestamp(),
        view: view || microcosms.get(microcosm_uri)?.view || DEFAULT_VIEW
      })
    )

  public getReference = (microcosm_uri: string): MicrocosmReference | false => {
    const reference = this.getKey('microcosms').get(microcosm_uri)
    if (!reference) {
      return false
    }
    this.addReference(microcosm_uri)
    return reference
  }

  public isActive = (microcosm_uri: string) => this.getKey('active') === microcosm_uri

  public setActive = (microcosm_uri: string) => this.setKey('active', microcosm_uri)
}
