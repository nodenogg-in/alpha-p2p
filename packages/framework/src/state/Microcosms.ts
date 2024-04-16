import {
  isValidMicrocosmID,
  type MicrocosmAPIFactory,
  type MicrocosmID,
  type MicrocosmAPI
} from '@nodenogg.in/microcosm'
import { isString } from '@figureland/typekit'
import { type MicrocosmEntryRequest, Telemetry, Session } from '..'

export class Microcosms<M extends MicrocosmAPI, T extends Telemetry> {
  public readonly microcosms = new Map<MicrocosmID, M>()
  constructor(
    public factory: MicrocosmAPIFactory<M>,
    private session: Session,
    private telemetry?: T
  ) {}

  public register = async (config: MicrocosmEntryRequest): Promise<M> => {
    try {
      if (!isValidMicrocosmID(config.microcosmID)) {
        throw this.telemetry?.throw({
          name: Microcosms.name,
          message: `Invalid microcosm ID: ${config.microcosmID}`,
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
      this.session.setActive(config.microcosmID)

      const timer = this.telemetry?.time({
        name: 'microcosms',
        message: `Retrieving microcosm ${config.microcosmID}`,
        level: 'info'
      })
      if (this.microcosms.size > 5) {
        this.telemetry?.log({
          name: 'microcosms',
          message: `Performance warning: ${this.microcosms.size} active microcosms`,
          level: 'warn'
        })
      }

      if (this.microcosms.has(config.microcosmID)) {
        timer?.finish()
        return this.microcosms.get(config.microcosmID) as M
      }
      console.log('registering new microcosm')
      const microcosm = await this.factory(
        {
          ...reference,
          identityID: this.session.user.key('identityID').get()
        },
        this.telemetry
      )

      this.microcosms.set(config.microcosmID, microcosm)
      timer?.finish()
      return microcosm
    } catch (error) {
      throw this.telemetry?.catch(error)
    }
  }

  public delete = async (microcosmID: MicrocosmID) => {
    const microcosm = this.microcosms.get(microcosmID)
    if (microcosm) {
      await microcosm.dispose()
      this.session.removeReference(microcosmID)
      this.microcosms.delete(microcosmID)
    }
  }

  public dispose = async () => {
    for await (const { dispose } of this.microcosms.values()) {
      await dispose()
    }
    this.microcosms.clear()
  }
}
