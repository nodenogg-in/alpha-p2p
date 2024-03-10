import { NiceMap, isValidMicrocosmURI } from '../../utils'
import { MicrocosmFactory, type Microcosm } from './Microcosm'
import { Instance } from '../../app/Instance'
import { TelemetryError } from '../../app/state/Telemetry'
import { MicrocosmEntryRequest } from '../../app'
import { isValidView } from '../../schema'

export class Microcosms<M extends Microcosm = Microcosm> {
  public readonly microcosms = new NiceMap<string, M>()
  private microcosmFactory: MicrocosmFactory<M>

  constructor(factory: MicrocosmFactory<M>) {
    this.microcosmFactory = factory
  }

  public registerMicrocosm = (config: MicrocosmEntryRequest): M => {
    try {
      if (!isValidMicrocosmURI(config.microcosm_uri)) {
        throw new TelemetryError(`Invalid microcosm URI: ${config.microcosm_uri}`)
      }
      if (config.view && !isValidView(config.view)) {
        throw new TelemetryError(`Invalid view: ${config.view}`)
      }
      const reference = Instance.session.registerReference(config)
      Instance.session.setActive(config.microcosm_uri)

      const timer = Instance.telemetry.time({
        name: 'Microcosms',
        message: `Retrieving microcosm ${config.microcosm_uri}`,
        level: 'info'
      })
      if (this.microcosms.size > 5) {
        Instance.telemetry.log({
          name: 'Microcosms',
          message: `Performance warning: ${this.microcosms.size} active microcosms`,
          level: 'warn'
        })
      }

      const result = this.microcosms.getOrSet<M>(config.microcosm_uri, () =>
        this.microcosmFactory({
          ...reference,
          user_id: Instance.session.user.getKey('user_id')
        })
      )
      timer.finish()
      return result
    } catch (error) {
      throw Instance.telemetry.catch({
        name: 'Microcosms',
        message: `Failed to add microcosm ${config.microcosm_uri}`,
        level: 'fail',
        error
      })
    }
  }

  public deleteMicrocosm = (microcosm_uri: string) => {
    const microcosm = this.microcosms.get(microcosm_uri)
    if (microcosm) {
      microcosm.destroy()
      Instance.session.removeReference(microcosm_uri)
      this.microcosms.delete(microcosm_uri)
    }
  }

  public dispose = () => {
    this.microcosms.forEach((microcosm) => microcosm.dispose())
    this.microcosms.clear()
  }
}
