import {
  type MicrocosmAPIFactory,
  type MicrocosmID,
  type MicrocosmAPI,
  type MicrocosmReference,
  isValidMicrocosmID,
  createTimestamp
} from '@nodenogg.in/microcosm'
import type { Telemetry } from '@nodenogg.in/microcosm/telemetry'
import { state, persist, Manager } from '@figureland/kit/state'
import { NiceMap, sortMapToArray } from '@figureland/kit/ts/map'
import { storage } from '@figureland/kit/state/local-storage'
import { getPersistenceName } from './create-app'
import { isMap } from '@figureland/kit/ts/guards'

type MicrocosmMap = Map<MicrocosmID, MicrocosmReference>

export type MicrocosmEntryRequest = {
  microcosmID: MicrocosmID
  password?: string
}

export class MicrocosmManager<
  M extends MicrocosmAPI = MicrocosmAPI,
  T extends Telemetry = Telemetry
> extends Manager {
  private microcosms = new Map<MicrocosmID, M>()
  private state = this.use(state<MicrocosmMap>(new Map()))
  public active = this.use(state<MicrocosmID | undefined>(undefined))
  public ready = this.use(state(false))
  private ongoingRegistrations = new NiceMap<MicrocosmID, Promise<M>>()
  public references = this.use(
    state((get) =>
      sortMapToArray(get(this.state), 'microcosmID').filter((m) =>
        isValidMicrocosmID(m.microcosmID)
      )
    )
  )

  constructor(
    private config: {
      api: MicrocosmAPIFactory<M>
      telemetry?: T
    }
  ) {
    super()
    persist(
      this.state,
      storage<MicrocosmMap>({
        name: getPersistenceName(['session', 'microcosms']),
        validate: isMap,
        fallback: () => new Map(),
        parse: (v) => new Map(JSON.parse(v)),
        stringify: (v) => JSON.stringify(Array.from(v.entries()))
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
    password
  }: MicrocosmEntryRequest): MicrocosmReference => {
    const existing = this.state.get().get(microcosmID)
    const updatedReference = {
      microcosmID,
      lastAccessed: createTimestamp(),
      password: password || existing?.password
    }
    this.state.mutate((microcosms) => {
      microcosms.set(microcosmID, updatedReference)
    })
    return updatedReference
  }

  public isActive = (microcosmID: MicrocosmID) =>
    this.unique(microcosmID, () => state((get) => get(this.active) === microcosmID))

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

      return this.ongoingRegistrations.getOrSet(config.microcosmID, () =>
        this.performRegistration(config).finally(() => {
          this.ongoingRegistrations.delete(config.microcosmID)
        })
      )
    } catch (error) {
      throw new Error('Registration error')
    }
  }

  private performRegistration = async (config: MicrocosmEntryRequest): Promise<M> => {
    const reference = this.registerReference(config)
    this.setActive(config.microcosmID)

    console.log('registering', config)
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

    const microcosm = await this.config.api(reference, this.config.telemetry)

    this.microcosms.set(config.microcosmID, microcosm)
    timer?.finish()
    return microcosm
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
