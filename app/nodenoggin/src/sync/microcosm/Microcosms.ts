import { map, type Output, string, object, optional } from 'valibot'
import { State, createTimestamp, isValidMicrocosmURI } from '../../utils'
import { microcosmReferenceSchema, type ViewName } from '../../schema'
import { isEditableMicrocosmAPI, type MicrocosmConfig } from './api'
import type { MicrocosmAPI } from './api'
import { getPersistenceName } from '../../app/UI'
import { UserState } from '../../app/state/UserState'

export type MicrocosmFactory<M extends MicrocosmAPI = MicrocosmAPI> = (args: MicrocosmConfig) => M

export const stateSchema = object({
  data: object({
    active: optional(string()),
    microcosms: map(string(), microcosmReferenceSchema)
  })
})

export type MicrocosmsState = Output<typeof stateSchema>

export class Microcosms<M extends MicrocosmAPI> extends State<MicrocosmsState> {
  public readonly microcosms: Map<string, M> = new Map()
  private microcosmFactory: MicrocosmFactory<M>
  private user: UserState

  constructor(factory: MicrocosmFactory<M>, user: UserState) {
    super({
      initial: () => ({
        data: {
          active: undefined,
          microcosms: new Map()
        }
      }),
      persist: {
        name: getPersistenceName('app', 'microcosms'),
        schema: stateSchema
      }
    })
    this.user = user
    this.microcosmFactory = factory
  }

  private removeReference = (microcosm_uri: string) => {
    console.log('remove reference')
    this.set('data', (data) => {
      data.microcosms.delete(microcosm_uri)
      return data
    })
  }

  private addReference = (microcosm_uri: string, view?: ViewName) => {
    this.set('data', (data) => {
      const currentView = view || data.microcosms.get(microcosm_uri).view
      data.microcosms.set(microcosm_uri, {
        microcosm_uri,
        lastAccessed: createTimestamp(),
        view: currentView
      })
      return data
    })
  }

  public getMicrocosm = (microcosm_uri: string, view?: ViewName): M => {
    try {
      const target = this.microcosms.get(microcosm_uri)
      this.addReference(microcosm_uri, view)
      return target
    } catch (e) {
      throw e || new Error(`Failed to get microcosm ${microcosm_uri}`)
    }
  }

  private addMicrocosm = ({ microcosm_uri, view, password, user_id }: MicrocosmConfig) => {
    const existingReference = this.get('data').microcosms.get(microcosm_uri)

    const config: MicrocosmConfig = existingReference
      ? {
          ...existingReference,
          user_id
        }
      : {
          microcosm_uri,
          view,
          password,
          user_id
        }

    const microcosm = this.microcosmFactory(config)
    this.microcosms.set(microcosm_uri, microcosm)
    this.addReference(microcosm_uri, view)
    if (isEditableMicrocosmAPI(microcosm)) {
      microcosm.join(this.user.get('identity').username)
    }
    return microcosm as M
  }

  public register = (config: Omit<MicrocosmConfig, 'user_id'>): M => {
    try {
      if (!isValidMicrocosmURI(config.microcosm_uri)) {
        throw new Error(`Invalid microcosm URI: ${config.microcosm_uri}`)
      }

      const existing = this.getMicrocosm(config.microcosm_uri, config.view)

      if (existing) {
        this.set('data', {
          active: config.microcosm_uri
        })
        return existing as M
      }

      console.log(`${this.microcosms.size} microcosms active`)
      if (this.microcosms.size > 5) {
        console.warn(`Performance warning: ${this.microcosms.size} active microcosms`)
      }

      this.set('data', {
        active: config.microcosm_uri
      })

      return this.addMicrocosm({
        ...config,
        user_id: this.user.get('identity').user_id
      })
    } catch (e) {
      throw e || new Error(`Failed to register microcosm ${config.microcosm_uri}`)
    }
  }

  public isActive = (microcosm_uri: string) => this.get('data').active === microcosm_uri
}
