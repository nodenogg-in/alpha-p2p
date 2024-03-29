import {
  isValidMicrocosmURI,
  type MicrocosmAPIFactory,
  type MicrocosmID,
  type MicrocosmAPI
} from '@nodenogg.in/microcosm'
import { isString } from '@nodenogg.in/toolkit'
import { type MicrocosmEntryRequest, Telemetry, Session } from '..'

export class Microcosms<M extends MicrocosmAPI> {
  public readonly microcosms = new Map<MicrocosmID, M>()
  constructor(
    public factory: MicrocosmAPIFactory<M>,
    private session: Session,
    private telemetry?: Telemetry
  ) {}

  public register = async (config: MicrocosmEntryRequest): Promise<M> => {
    try {
      if (!isValidMicrocosmURI(config.MicrocosmID)) {
        throw this.telemetry?.throw({
          name: Microcosms.name,
          message: `Invalid microcosm URI: ${config.MicrocosmID}`,
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
      this.session.setActive(config.MicrocosmID)

      const timer = this.telemetry?.time({
        name: 'microcosms',
        message: `Retrieving microcosm ${config.MicrocosmID}`,
        level: 'info'
      })
      if (this.microcosms.size > 5) {
        this.telemetry?.log({
          name: 'microcosms',
          message: `Performance warning: ${this.microcosms.size} active microcosms`,
          level: 'warn'
        })
      }

      if (this.microcosms.has(config.MicrocosmID)) {
        timer?.finish()
        return this.microcosms.get(config.MicrocosmID) as M
      } else {
      }
      const microcosm = await this.factory(
        {
          ...reference,
          IdentityID: this.session.user.key('IdentityID').get()
        },
        this.telemetry
      )

      this.microcosms.set(config.MicrocosmID, microcosm)
      timer?.finish()
      return microcosm
    } catch (error) {
      throw this.telemetry?.catch(error)
    }
  }

  public delete = async (MicrocosmID: MicrocosmID) => {
    const microcosm = this.microcosms.get(MicrocosmID)
    if (microcosm) {
      await microcosm.dispose()
      this.session.removeReference(MicrocosmID)
      this.microcosms.delete(MicrocosmID)
    }
  }

  public dispose = async () => {
    for await (const { dispose } of this.microcosms.values()) {
      await dispose()
    }
    this.microcosms.clear()
  }
}
