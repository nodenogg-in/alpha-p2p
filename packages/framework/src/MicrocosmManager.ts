import {
  isValidMicrocosmID,
  type MicrocosmAPIFactory,
  type MicrocosmID,
  type MicrocosmAPI,
  MicrocosmReference,
  createTimestamp
} from '@nodenogg.in/microcosm'
import { isString } from '@figureland/typekit/guards'
import type { MicrocosmEntryRequest } from '.'
import type { IdentitySession } from './identity'
import { Telemetry } from '@nodenogg.in/microcosm/telemetry'
import { system, signal, persist } from '@figureland/statekit'
import { sortMapToArray } from '@figureland/typekit/map'
import { typedLocalStorage } from '@figureland/statekit/typed-local-storage'
import { getPersistenceName } from './create-app'
import { isMap } from '@figureland/typekit'

type MicrocosmMap = Map<MicrocosmID, MicrocosmReference>

export class MicrocosmManager<
  M extends MicrocosmAPI = MicrocosmAPI,
  T extends Telemetry = Telemetry
> {
  private system = system()
  private microcosms = new Map<MicrocosmID, M>()
  private state = this.system.use(signal<MicrocosmMap>(() => new Map()))
  public active = this.system.use(signal<MicrocosmID | undefined>(() => undefined))
  public ready = this.system.use(signal(() => false))
  public references = this.system.use(
    signal((get) =>
      sortMapToArray(get(this.state), 'microcosmID').filter((m) =>
        isValidMicrocosmID(m.microcosmID)
      )
    )
  )

  constructor(
    private config: {
      api: MicrocosmAPIFactory<M>
      identity: IdentitySession
      telemetry?: T
    }
  ) {
    persist(
      this.state,
      typedLocalStorage({
        name: getPersistenceName(['session', 'microcosms']),
        validate: isMap,
        fallback: this.state.get
      })
    )
    this.ready.set(true)
  }

  private removeReference = (microcosmID: MicrocosmID) => {
    this.state.mutate((microcosms) => {
      microcosms.delete(microcosmID)
    })
  }

  private registerReference = ({
    microcosmID,
    view,
    password
  }: MicrocosmEntryRequest): MicrocosmReference => {
    const existing = this.state.get().get(microcosmID)
    const updatedReference = {
      microcosmID,
      lastAccessed: createTimestamp(),
      password: password || existing?.password,
      view: view || (existing?.view as string)
    }
    this.state.mutate((microcosms) => {
      microcosms.set(microcosmID, updatedReference)
    })
    return updatedReference
  }

  public isActive = (microcosmID: MicrocosmID) =>
    this.system.unique(microcosmID, () => signal((get) => get(this.active) === microcosmID))

  public setActive = (microcosmID: MicrocosmID) => this.active.set(microcosmID)

  public register = async (config: MicrocosmEntryRequest): Promise<M> => {
    try {
      if (!isValidMicrocosmID(config.microcosmID)) {
        throw this.config.telemetry?.throw({
          name: 'microcosms',
          message: `Invalid microcosm ID: ${config.microcosmID}`,
          level: 'warn'
        })
      }
      if (config.view && !isString(config.view)) {
        throw this.config.telemetry?.throw({
          name: 'microcosms',
          message: `Invalid view: ${config.view}`,
          level: 'warn'
        })
      }
      const reference = this.registerReference(config)
      this.setActive(config.microcosmID)

      const timer = this.config.telemetry?.time({
        name: 'microcosms',
        message: `Retrieving microcosm ${config.microcosmID}`,
        level: 'info'
      })
      if (this.microcosms.size > 5) {
        this.config.telemetry?.log({
          name: 'microcosms',
          message: `Performance warning: ${this.microcosms.size} active microcosms`,
          level: 'warn'
        })
      }

      if (this.microcosms.has(config.microcosmID)) {
        timer?.finish()
        return this.microcosms.get(config.microcosmID) as M
      }
      const microcosm = await this.config.api(
        {
          ...reference,
          identityID: this.config.identity.key('identityID').get()
        },
        this.config.telemetry
      )

      this.microcosms.set(config.microcosmID, microcosm)
      timer?.finish()
      return microcosm
    } catch (error) {
      throw this.config.telemetry?.catch(error)
    }
  }

  public remove = async (microcosmID: MicrocosmID) => {
    const microcosm = this.microcosms.get(microcosmID)
    if (microcosm) {
      microcosm.dispose()
      this.removeReference(microcosmID)
      this.microcosms.delete(microcosmID)
    }
  }

  public dispose = () => {
    for (const m of this.microcosms.values()) {
      m.dispose()
    }
    this.microcosms.clear()
  }
}
