import {
  isValidMicrocosmURI,
  type MicrocosmAPIFactory,
  type Microcosm_URI,
  type MicrocosmAPI
} from '@nodenogg.in/microcosm'
import { NiceMap, isString } from '@nodenogg.in/toolkit'
import { type MicrocosmEntryRequest, Telemetry, Session } from '..'

export class Microcosms<M extends MicrocosmAPI> {
  public readonly microcosms = new NiceMap<Microcosm_URI, M>()
  constructor(
    public factory: MicrocosmAPIFactory<M>,
    private session: Session,
    private telemetry?: Telemetry
  ) {}

  public register = async (config: MicrocosmEntryRequest): Promise<M> => {
    try {
      if (!isValidMicrocosmURI(config.microcosm_uri)) {
        throw this.telemetry?.throw({
          name: Microcosms.name,
          message: `Invalid microcosm URI: ${config.microcosm_uri}`,
          level: 'warn'
        })
      }
      if (config.view && !isString(config.view)) {
        throw this.telemetry?.throw({
          name: Microcosms.name,
          message: `Invalid view: ${config.view}`,
          level: 'warn'
        })
      }
      const reference = this.session.registerReference(config)
      this.session.setActive(config.microcosm_uri)

      const timer = this.telemetry?.time({
        name: 'microcosms',
        message: `Retrieving microcosm ${config.microcosm_uri}`,
        level: 'info'
      })
      if (this.microcosms.size > 5) {
        this.telemetry?.log({
          name: 'microcosms',
          message: `Performance warning: ${this.microcosms.size} active microcosms`,
          level: 'warn'
        })
      }

      const result = this.microcosms.getOrSet<M>(config.microcosm_uri, () =>
        this.factory(
          {
            ...reference,
            identity_uid: this.session.user.key('identity_uid').get()
          },
          this.telemetry
        )
      )
      timer?.finish()
      return result
    } catch (error) {
      throw this.telemetry?.catch(
        {
          name: 'microcosms',
          message: `Failed to add microcosm ${config.microcosm_uri}`,
          level: 'fail'
        },
        error
      )
    }
  }

  public delete = async (microcosm_uri: Microcosm_URI) => {
    const microcosm = this.microcosms.get(microcosm_uri)
    if (microcosm) {
      await microcosm.dispose()
      this.session.removeReference(microcosm_uri)
      this.microcosms.delete(microcosm_uri)
    }
  }

  public dispose = async () => {
    for await (const { dispose } of this.microcosms.values()) {
      await dispose()
    }
    this.microcosms.clear()
  }
}
