import {
  type MicrocosmAPIFactory,
  // type MicrocosmID,
  type MicrocosmAPI,
  MicrocosmUUID,
  microcosm
  // type MicrocosmReference,
  // isValidMicrocosmID,
  // createTimestamp
} from '@nodenogg.in/core'
import { state, persist, store } from '@figureland/kit/state'
import { sortMapToArray } from '@figureland/kit/tools/map'
import { storage } from '@figureland/kit/state/local-storage'
import { getPersistenceName } from './create-app'
import { isMap } from '@figureland/kit/tools/guards'
import { createIdentitySession } from './identity'
import { createTimestamp } from '@figureland/kit/tools/time'

export type MicrocosmReference = {
  microcosmID: MicrocosmUUID
  lastAccessed: number
  password?: string
}

type MicrocosmMap = Map<MicrocosmUUID, MicrocosmReference>

export type MicrocosmEntryRequest = {
  microcosmID: MicrocosmUUID
  password?: string
}

type ResourceMap = Map<string, any>

export class NNClient<M extends MicrocosmAPI = MicrocosmAPI> {
  private store = store()
  private use = this.store.use
  identity = this.use(createIdentitySession())
  private resources = new Map<MicrocosmUUID, ResourceMap>()

  private microcosms = new Map<MicrocosmUUID, M>()
  private state = this.use(state<MicrocosmMap>(new Map()))
  public active = this.use(state<MicrocosmUUID | undefined>(undefined))
  public ready = this.use(state(false))
  private ongoingRegistrations = new Map<MicrocosmUUID, Promise<M>>()
  public references = this.use(
    state((get) =>
      sortMapToArray(get(this.state), 'microcosmID').filter((m) =>
        microcosm.isValidMicrocosmUUID(m.microcosmID)
      )
    )
  )

  constructor(
    private config: {
      api: MicrocosmAPIFactory<M>
    }
  ) {
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

  private removeReference = (microcosmID: MicrocosmUUID) => {
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

  public isActive = (microcosmID: MicrocosmUUID) =>
    this.store.unique(microcosmID, () => state((get) => get(this.active) === microcosmID))

  public setActive = (microcosmID: MicrocosmUUID) => this.active.set(microcosmID)

  public register = async (config: MicrocosmEntryRequest): Promise<M> => {
    try {
      if (!microcosm.isValidMicrocosmUUID(config.microcosmID)) {
        throw new Error(`Invalid microcosm ID: ${config.microcosmID}`)
      }

      const promise = this.performRegistration(config).finally(() => {
        this.ongoingRegistrations.delete(config.microcosmID)
      })

      this.ongoingRegistrations.set(config.microcosmID, promise)

      return promise
    } catch (error) {
      throw new Error('Registration error')
    }
  }

  public registerResource = async <R extends any, RC extends () => Promise<R>>(
    microcosm_id: MicrocosmUUID,
    resource_id: string,
    createResource: RC
  ) => {
    if (!this.resources.has(microcosm_id)) {
      this.resources.set(microcosm_id, new Map<string, R>())
    }

    const collection = this.resources.get(microcosm_id) as ResourceMap

    const r = collection.get(resource_id) ?? createResource()

    collection.set(resource_id, r)

    return r
  }

  public removeResource = async (microcosmID: MicrocosmUUID, resource_id: string) => {
    const collection = this.resources.get(microcosmID)
    if (collection) {
      const target = collection.get(resource_id)
      if (target) {
        target.dispose()
        collection.delete(resource_id)
      }
    }
  }

  private performRegistration = async (config: MicrocosmEntryRequest): Promise<M> => {
    const reference = this.registerReference(config)
    this.setActive(config.microcosmID)

    console.log('registering', config)
    // const timer = this.config.telemetry?.time({
    //   name: 'microcosms',
    //   message: `Retrieving microcosm ${config.microcosmID}`,
    //   level: 'info'
    // })
    if (this.microcosms.size > 5) {
      // this.config.telemetry?.log({
      //   name: 'microcosms',
      //   message: `Performance warning: ${this.microcosms.size} active microcosms`,
      //   level: 'warn'
      // })
    }

    if (this.microcosms.has(config.microcosmID)) {
      // timer?.finish()
      return this.microcosms.get(config.microcosmID) as M
    }

    const microcosm = await this.config.api(reference)

    this.microcosms.set(config.microcosmID, microcosm)
    // timer?.finish()
    return microcosm
  }

  public remove = async (microcosmID: MicrocosmUUID) => {
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
    for (const viewCollection of this.resources.values()) {
      Array.from(viewCollection.values()).forEach((v) => {
        v.dispose()
      })
    }

    this.microcosms.clear()
    this.store.dispose()
  }
}
