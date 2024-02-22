import { map, type Output, string, object } from 'valibot'
import type { MicrocosmAPI } from './api'
import { State, createTimestamp, isValidMicrocosmURI } from '../utils'
import { microcosmReferenceSchema, type ViewName } from '../schema'
import { Microcosm, MicrocosmConfig } from './Microcosm'
import { getPersistenceName } from '../app'

export type MicrocosmAPIFactory<M extends MicrocosmAPI> = (args: MicrocosmConfig) => M

export const stateSchema = object({
  data: object({
    microcosms: map(string(), microcosmReferenceSchema)
  })
})

export type MicrocosmsState = Output<typeof stateSchema>

export class Microcosms<M extends MicrocosmAPI> extends State<MicrocosmsState> {
  public readonly microcosms: Map<string, Microcosm> = new Map()
  private microcosmFactory: MicrocosmAPIFactory<M>

  constructor(factory: MicrocosmAPIFactory<M>) {
    super({
      initial: () => ({
        data: {
          microcosms: new Map()
        }
      }),
      persist: {
        name: getPersistenceName('app', 'microcosms'),
        schema: stateSchema
      }
    })
    this.microcosmFactory = factory
  }

  private removeReference = (microcosm_uri: string) => {
    this.set('data', (data) => {
      data.microcosms.delete(microcosm_uri)
      return data
    })
  }

  private addReference = (microcosm_uri: string, view: ViewName) => {
    this.set('data', (data) => {
      data.microcosms.set(microcosm_uri, {
        microcosm_uri,
        lastAccessed: createTimestamp(),
        view
      })
      return data
    })
  }

  private getMicrocosm = (microcosm_uri: string, view: ViewName) => {
    const target = this.microcosms.get(microcosm_uri)
    if (target) {
      this.addReference(microcosm_uri, view)
      return target
    }
    return undefined
  }

  private addMicrocosm = ({ microcosm_uri, view, password, user_id }: MicrocosmConfig) => {
    const microcosm = new Microcosm(this.microcosmFactory, {
      microcosm_uri,
      view,
      password,
      user_id
    }) as Microcosm<M>
    this.microcosms.set(microcosm_uri, microcosm)
    this.addReference(microcosm_uri, view)
    return microcosm as Microcosm<M>
  }

  public register = (config: MicrocosmConfig): Microcosm<M> => {
    if (!isValidMicrocosmURI(config.microcosm_uri)) {
      throw new Error(`Invalid microcosm URI: ${config.microcosm_uri}`)
    }

    const existing = this.getMicrocosm(config.microcosm_uri, config.view)

    if (existing) {
      return existing as Microcosm<M>
    }

    console.log(`${this.microcosms.size} microcosms active`)
    if (this.microcosms.size > 5) {
      console.warn(`Performance warning: ${this.microcosms.size} active microcosms`)
    }
    return this.addMicrocosm(config)
  }

  public leave = (microcosm_uri: string) => {
    const existing = this.microcosms.get(microcosm_uri)
    if (existing) {
      this.microcosms.delete(microcosm_uri)
      this.removeReference(microcosm_uri)
    }
  }
}
