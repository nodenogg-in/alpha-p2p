import { isValidMicrocosmURI } from '@nodenogg.in/schema'
import { NiceMap, isString } from '@nodenogg.in/utils'
import type { MicrocosmAPI, MicrocosmEntryRequest } from '..'
import type { MicrocosmAPIFactory } from '../api/api'
import { Instance } from './Instance'

export class Microcosms<M extends MicrocosmAPI> {
  public readonly microcosms = new NiceMap<string, M>()
  constructor(public factory: MicrocosmAPIFactory<M>) {}

  public register = async (config: MicrocosmEntryRequest): Promise<M> => {
    try {
      if (!isValidMicrocosmURI(config.microcosm_uri)) {
        throw Instance.telemetry.throw({
          name: Microcosms.name,
          message: `Invalid microcosm URI: ${config.microcosm_uri}`,
          level: 'warn'
        })
      }
      if (config.view && !isString(config.view)) {
        throw Instance.telemetry.throw({
          name: Microcosms.name,
          message: `Invalid view: ${config.view}`,
          level: 'warn'
        })
      }
      const reference = Instance.session.registerReference(config)
      Instance.session.setActive(config.microcosm_uri)

      const timer = Instance.telemetry.time({
        name: 'microcosms',
        message: `Retrieving microcosm ${config.microcosm_uri}`,
        level: 'info'
      })
      if (this.microcosms.size > 5) {
        Instance.telemetry.log({
          name: 'microcosms',
          message: `Performance warning: ${this.microcosms.size} active microcosms`,
          level: 'warn'
        })
      }

      const result = this.microcosms.getOrSet<M>(config.microcosm_uri, () =>
        this.factory({
          ...reference,
          user_id: Instance.session.user.key('user_id').get()
        })
      )
      timer.finish()
      return result
    } catch (error) {
      throw Instance.telemetry.catch(
        {
          name: 'microcosms',
          message: `Failed to add microcosm ${config.microcosm_uri}`,
          level: 'fail'
        },
        error
      )
    }
  }

  public delete = async (microcosm_uri: string) => {
    const microcosm = this.microcosms.get(microcosm_uri)
    if (microcosm) {
      await microcosm.dispose()
      Instance.session.removeReference(microcosm_uri)
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
