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
  microcosmUUID: MicrocosmUUID
  lastAccessed: number
  password?: string
}

type MicrocosmMap = Map<MicrocosmUUID, MicrocosmReference>

export type MicrocosmEntryRequest = {
  microcosmUUID: MicrocosmUUID
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
      sortMapToArray(get(this.state), 'microcosmUUID').filter((m) =>
        microcosm.isValidMicrocosmUUID(m.microcosmUUID)
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

  private removeReference = (microcosmUUID: MicrocosmUUID) => {
    this.state.mutate((microcosms) => {
      microcosms.delete(microcosmUUID)
    })
  }

  private registerReference = ({
    microcosmUUID,
    password
  }: MicrocosmEntryRequest): MicrocosmReference => {
    const existing = this.state.get().get(microcosmUUID)
    const updatedReference = {
      microcosmUUID,
      lastAccessed: createTimestamp(),
      password: password || existing?.password
    }
    this.state.mutate((microcosms) => {
      microcosms.set(microcosmUUID, updatedReference)
    })
    return updatedReference
  }

  public isActive = (microcosmUUID: MicrocosmUUID) =>
    this.store.unique(microcosmUUID, () => state((get) => get(this.active) === microcosmUUID))

  public setActive = (microcosmUUID: MicrocosmUUID) => this.active.set(microcosmUUID)

  public register = async (config: MicrocosmEntryRequest): Promise<M> => {
    try {
      if (!microcosm.isValidMicrocosmUUID(config.microcosmUUID)) {
        throw new Error(`Invalid microcosm ID: ${config.microcosmUUID}`)
      }

      const promise = this.performRegistration(config).finally(() => {
        this.ongoingRegistrations.delete(config.microcosmUUID)
      })

      this.ongoingRegistrations.set(config.microcosmUUID, promise)

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

  public removeResource = async (microcosmUUID: MicrocosmUUID, resource_id: string) => {
    const collection = this.resources.get(microcosmUUID)
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
    this.setActive(config.microcosmUUID)

    console.log('registering', config)
    // const timer = this.config.telemetry?.time({
    //   name: 'microcosms',
    //   message: `Retrieving microcosm ${config.microcosmUUID}`,
    //   level: 'info'
    // })
    if (this.microcosms.size > 5) {
      // this.config.telemetry?.log({
      //   name: 'microcosms',
      //   message: `Performance warning: ${this.microcosms.size} active microcosms`,
      //   level: 'warn'
      // })
    }

    if (this.microcosms.has(config.microcosmUUID)) {
      // timer?.finish()
      return this.microcosms.get(config.microcosmUUID) as M
    }

    const microcosm = await this.config.api(reference)

    this.microcosms.set(config.microcosmUUID, microcosm)
    // timer?.finish()
    return microcosm
  }

  public remove = async (microcosmUUID: MicrocosmUUID) => {
    const microcosm = this.microcosms.get(microcosmUUID)
    if (microcosm) {
      microcosm.dispose()
      this.removeReference(microcosmUUID)
      this.microcosms.delete(microcosmUUID)
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
