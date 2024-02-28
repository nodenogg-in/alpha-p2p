import { map, type Output, string, object, optional } from 'valibot'
import { createTimestamp, createUserId, isValidMicrocosmURI } from '../../utils'
import {
  DEFAULT_VIEW,
  Identity,
  identitySchema,
  microcosmReferenceSchema,
  type ViewType
} from '../../schema'
import type { MicrocosmConfig, MicrocosmFactory } from './api'
import { type Microcosm } from './Microcosm'
import { APP_NAME, SCHEMA_VERSION } from '../constants'
import { getPersistenceName } from '../../app'
import { State } from '../../utils'

export const stateSchema = object({
  active: optional(string()),
  microcosms: map(string(), microcosmReferenceSchema)
})

export type MicrocosmsState = Output<typeof stateSchema>

export class Microcosms<M extends Microcosm = Microcosm> extends State<MicrocosmsState> {
  public readonly microcosms: Map<string, M> = new Map()
  private microcosmFactory: MicrocosmFactory<M>
  public user = new State<Identity>({
    initial: () => ({ user_id: createUserId() }),
    persist: {
      name: getPersistenceName(['app', 'identity']),
      schema: identitySchema
    }
  })
  static appName = APP_NAME
  static schemaVersion = SCHEMA_VERSION

  constructor(factory: MicrocosmFactory<M>) {
    super({
      initial: () => ({
        active: undefined,
        microcosms: new Map()
      }),
      persist: {
        name: getPersistenceName(['app', 'microcosms']),
        schema: stateSchema
      }
    })

    this.microcosmFactory = factory
  }

  private removeReference = (microcosm_uri: string) => {
    console.log('remove reference')
    this.set((data) => {
      data.microcosms.delete(microcosm_uri)
      return data
    })
  }

  private addReference = (microcosm_uri: string, view?: ViewType) => {
    this.set((data) => {
      const currentView = view || data.microcosms.get(microcosm_uri)?.view || DEFAULT_VIEW
      data.microcosms.set(microcosm_uri, {
        microcosm_uri,
        lastAccessed: createTimestamp(),
        view: currentView
      })
      return data
    })
  }

  public getMicrocosm = (microcosm_uri: string, view?: ViewType): M | false => {
    try {
      const target = this.microcosms.get(microcosm_uri)
      if (!target) {
        throw new Error()
      }
      this.addReference(microcosm_uri, view)
      return target
    } catch (e) {
      return false
    }
  }

  private addMicrocosm = ({ microcosm_uri, view, password, user_id }: MicrocosmConfig) => {
    const existingReference = this.getKey('microcosms').get(microcosm_uri)

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
    if (microcosm.isEditable()) {
      microcosm.api.join(this.user.getKey('username'))
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
        this.setKey('active', () => existing.microcosm_uri)
        return existing as M
      }

      console.log(`${this.microcosms.size} microcosms active`)
      if (this.microcosms.size > 5) {
        console.warn(`Performance warning: ${this.microcosms.size} active microcosms`)
      }

      this.setKey('active', () => config.microcosm_uri)

      return this.addMicrocosm({
        ...config,
        user_id: this.user.getKey('user_id')
      })
    } catch (e) {
      throw e || new Error(`Failed to register microcosm ${config.microcosm_uri}`)
    }
  }

  public isActive = (microcosm_uri: string) => this.getKey('active') === microcosm_uri
}
