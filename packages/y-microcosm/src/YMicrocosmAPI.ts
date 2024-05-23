import {
  type MicrocosmAPIConfig,
  type MicrocosmAPI,
  type IdentityWithStatus,
  type EditableMicrocosmAPI,
  type MicrocosmAPIState,
  type Identity,
  type EntityType,
  type IdentityID,
  type EntityID,
  type EntityCreate,
  type Entity,
  isIdentityWithStatus,
  isEntityType
} from '@nodenogg.in/microcosm'
import type { Telemetry } from '@nodenogg.in/microcosm/telemetry'
import { isArray } from '@figureland/typekit/guards'
import { promiseSome } from '@figureland/typekit/promise'

import type { Provider, ProviderFactory } from './provider'
import type { Persistence, PersistenceFactory } from './persistence'
import { YMicrocosmDoc } from './YMicrocosmDoc'
import { signalObject, signal, type Signal, Manager } from '@figureland/statekit'

export class YMicrocosmAPI extends Manager implements EditableMicrocosmAPI {
  public readonly identities = this.use(signal<IdentityWithStatus[]>(() => []))
  private readonly doc = this.use(new YMicrocosmDoc())
  public collections: Signal<IdentityID[]> = signal((): IdentityID[] => [])
  private persistence!: Persistence[]
  private providers!: Provider[]
  private currentIdentity?: Identity

  public readonly state = this.use(
    signalObject<MicrocosmAPIState>({
      status: {
        connected: false,
        ready: false
      },
      active: false
    })
  )

  /**
   * Creates a new Microcosm that optionally syncs with peers, if a provider is specified.
   */
  constructor(
    public readonly config: MicrocosmAPIConfig,
    private readonly providerFactories?: ProviderFactory[],
    private readonly persistenceFactories?: PersistenceFactory[],
    protected telemetry?: Telemetry
  ) {
    super()
    this.use(() => console.log('disposing microcosmapi'))
  }

  public identify = async (identity_id: IdentityID) => {
    this.doc.identify(identity_id)
    const s = this.doc.getCollection(identity_id)
    s.on((v) => {
      console.log(v)
    })
  }

  public init = async () => {
    try {
      await this.createPersistences()
      await this.createProviders()
      this.setLoaded()
    } catch (error) {
      this.telemetry?.catch(error)
    }
  }

  public updatePassword = async (password: string) => {
    if (password === this.config.password) {
      this.disconnectProviders()
      this.setUnloaded()
      this.config.password = password
      await this.createProviders()
      this.setLoaded()
    }
  }

  deleteAll: () => void

  /**
   * Triggered when the {@link MicrocosmAPI} is ready
   */
  private setLoaded = () => {
    this.state.key('status').set({ ready: true })
  }

  /**
   * Triggered when the {@link MicrocosmAPI} is no longer ready
   */
  private setUnloaded = () => {
    this.state.key('status').set({ ready: false })
  }

  private disconnectProviders = async () => {
    if (this.provider) {
      this.provider.awareness.off('change', this.handleAwareness)
      this.provider.awareness.off('update', this.handleAwareness)
    }
    this.providers?.forEach((p) => {
      p.shouldConnect = false
      p.disconnect()
    })
    this.state.key('status').set({ connected: false })
  }

  private destroyProviders = () => {
    this.providers?.forEach((p) => p.destroy())
  }

  private destroyPersistence = () => {
    this.persistence?.forEach((p) => p.destroy())
  }

  private createPersistences = async () => {
    try {
      if (!this.persistenceFactories) {
        return
      }
      const { fulfilled, rejected } = await promiseSome(
        this.persistenceFactories.map(this.createPersistence)
      )

      if (fulfilled.length > 0) {
        this.persistence = fulfilled

        this.state.key('status').set({
          ready: true
        })
      } else {
        throw this.telemetry?.throw({
          name: 'YMicrocosmAPI',
          level: 'warn',
          message: `No persistence available (${rejected.length} failed)`
        })
      }
    } catch (error) {
      this.state.key('status').set({
        ready: false
      })
      throw this.telemetry?.catch(error)
    }
  }

  private createPersistence = async (factory: PersistenceFactory) => {
    const { microcosmID } = this.config
    try {
      const persistence = await factory(microcosmID, this.doc.yDoc)
      this.telemetry?.log({
        name: 'YMicrocosmAPI',
        message: `Persisted ${microcosmID} [${persistence.constructor.name}]`,
        level: 'info'
      })
      return persistence
    } catch (error) {
      throw this.telemetry?.catch(error)
    }
  }

  private createProvider = async (create: ProviderFactory) => {
    const { microcosmID, password } = this.config

    try {
      const provider = await create(microcosmID, this.doc.yDoc, password)
      this.telemetry?.log({
        name: 'YMicrocosmAPI',
        message: `Connected provider for ${microcosmID} [${provider.constructor.name}]`,
        level: 'info'
      })
      return provider
    } catch (error) {
      throw this.telemetry?.catch(error)
    }
  }

  private createProviders = async () => {
    try {
      if (!this.providerFactories) {
        return
      }
      const { fulfilled, rejected } = await promiseSome(
        this.providerFactories.map(this.createProvider)
      )

      if (fulfilled.length > 0) {
        this.providers = fulfilled

        if (this.provider) {
          this.provider.awareness.on('change', this.handleAwareness)
          this.provider.awareness.on('update', this.handleAwareness)
        }

        this.providers?.forEach((p) => {
          p.shouldConnect = true
          p.connect()
        })

        this.state.key('status').set({
          connected: true
        })
      } else {
        throw this.telemetry?.throw({
          name: 'YMicrocosmAPI',
          level: 'warn',
          message: `No providers available (${rejected.length} failed)`
        })
      }
    } catch (error) {
      this.state.key('status').set({
        connected: false
      })
      throw this.telemetry?.catch(error)
    }
  }

  private get provider(): Provider | undefined {
    return this.providers[0]
  }

  private handleAwareness = () => {
    if (!this.provider) {
      return
    }
    this.identities.set(
      Array.from(this.provider.awareness.getStates())
        .map(([, state]) => state?.identity || {})
        .filter(isIdentityWithStatus)
    )
  }

  /**
   * Erases this Microcosm's locally stored content and disposes this instance
   */
  public clearPersistence = (reset?: boolean) => {
    this.persistence?.forEach((p) => {
      p.clearData()
      p.destroy()
    })

    if (reset) {
      this.createPersistences()
    }
  }

  /**
   * Creates a new {@link Entity}
   */
  private createEntity: EntityCreate = (newEntity) => {
    try {
      return this.doc.create(newEntity)
    } catch (error) {
      throw this.telemetry?.catch(error)
    }
  }

  /**
   * Creates a new {@link Entity}
   */
  public create: EditableMicrocosmAPI['create'] = (n) => this.createEntity(n)

  /**
   * Updates one or more {@link Entity}s
   */
  public update: EditableMicrocosmAPI['update'] = (entity_id, u) => {
    this.doc.update(entity_id, u)
  }
  /**
   * Deletes an array of {@link Entity}s
   */
  public delete: EditableMicrocosmAPI['delete'] = (entity_id: EntityID) => {
    this.doc.delete(entity_id)
  }

  // public entities: EditableMicrocosmAPI['entities'] = (type) => this.doc.entities(type)

  /**
   * Get a Signal containing a single {@link Entity} or undefined if it doesn't exist
   *
   * @param identity_id
   * @param entity_id
   * @returns {@link Signal<EntityID[]>}
   */
  public entity = <T extends EntityType>(
    identity_id: IdentityID,
    entity_id: EntityID,
    type?: T
  ): Signal<Entity<T> | undefined> => {
    // const target = this.doc.getCollection(identity_id)
    // const getEntity = (): Entity<T> | undefined => {
    //   const result = target?.get(entity_id)
    //   if (!result) {
    //     return undefined
    //   }
    //   if (type) {
    //     return isEntityType(result.data, type) ? (result.data as Entity<T>) : undefined
    //   }
    //   return [] as any
    // }

    // const value = this.unique(`${identity_id}${entity_id}`, () =>
    //   signal<Entity<T> | undefined>(getEntity, {
    //     equality: (a, b) => a?.lastEdited === b?.lastEdited
    //   })
    // )

    // if (target) {
    //   target?.observe(getEntity)
    //   value.use(() => target?.unobserve(getEntity))
    // }
    return [] as any
  }

  public entities = () => []

  /**
   * Returns a Signal containing a collection of {@link EntityID}s
   *
   * @param identity_id
   * @returns {@link Signal<EntityID[]>}
   */
  public collection = (identity_id: IdentityID): Signal<EntityID[]> => {
    // const target = this.doc.getCollection(identity_id)
    // const value = this.unique(identity_id, () => signal(() => getCollectionEntityIDs(target)))

    // const load = () => {
    //   value.set(getCollectionEntityIDs(target))
    // }
    // target.observe(load)
    // value.use(() => target.unobserve(load))
    return [] as any
  }

  /**
   * Joins the Microcosm, publishing identity status to connected peers
   */
  public join: EditableMicrocosmAPI['join'] = (identity) => {
    const { microcosmID } = this.config

    this.telemetry?.log({
      name: 'MicrocosmAPI',
      message: `Joined ${microcosmID}`,
      level: 'info'
    })

    this.provider?.awareness.setLocalStateField('identity', {
      ...identity,
      joined: true
    } as IdentityWithStatus)
  }
  /**
   * Leaves the Microcosm, publishing identity status to connected peers
   */
  public leave: EditableMicrocosmAPI['leave'] = () => {
    if (!this.currentIdentity) {
      return
    }

    const { microcosmID } = this.config

    this.telemetry?.log({
      name: 'MicrocosmAPI',
      message: `Left ${microcosmID}`,
      level: 'info'
    })

    this.provider?.awareness.setLocalStateField('identity', {
      ...this.currentIdentity,
      joined: false
    } as IdentityWithStatus)
  }

  /**
   * Destroys the Microcosm's content and disposes this instance
   */
  public destroy = () => {
    this.clearPersistence()
    this.dispose()
  }

  public undo: EditableMicrocosmAPI['undo'] = () => this.doc.undo()

  public redo: EditableMicrocosmAPI['redo'] = () => this.doc.redo()
}
