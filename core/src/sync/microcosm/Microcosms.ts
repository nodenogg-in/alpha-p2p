import { map, type Output, string, object, optional } from 'valibot'
import { State, createTimestamp, isValidMicrocosmURI } from '../../utils'
import { microcosmReferenceSchema, type ViewName } from '../../schema'
import type { Microcosm, MicrocosmConfig } from './api'
import type { MicrocosmAPI } from './api'
import { UI, getPersistenceName } from '../../app/UI'

export type MicrocosmFactory<M extends Microcosm<API>, API extends MicrocosmAPI = MicrocosmAPI> = (
  args: MicrocosmConfig
) => M

export const stateSchema = object({
  data: object({
    active: optional(string()),
    microcosms: map(string(), microcosmReferenceSchema)
  })
})

export type MicrocosmsState = Output<typeof stateSchema>

export class Microcosms<M extends Microcosm> extends State<MicrocosmsState> {
  public readonly microcosms: Map<string, M> = new Map()
  private microcosmFactory: MicrocosmFactory<M>
  private ui: UI

  constructor(factory: MicrocosmFactory<M>, ui: UI) {
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
    this.ui = ui
    this.microcosmFactory = factory
  }

  private removeReference = (microcosm_uri: string) => {
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
        user_id: this.ui.user.get('identity').user_id
      })
    } catch (e) {
      throw e || new Error(`Failed to register microcosm ${config.microcosm_uri}`)
    }
  }

  public leave = (microcosm_uri: string) => {
    const existing = this.microcosms.get(microcosm_uri)
    if (existing) {
      this.microcosms.delete(microcosm_uri)
      this.removeReference(microcosm_uri)
    }
  }

  public isActive = (microcosm_uri: string) => this.get('data').active === microcosm_uri
}
