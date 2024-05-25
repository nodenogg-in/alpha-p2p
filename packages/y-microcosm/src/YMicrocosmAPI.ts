import {
  type MicrocosmAPIConfig,
  type MicrocosmAPI,
  type EditableMicrocosmAPI,
  type MicrocosmAPIState,
  type Identity,
  type EntityType,
  type IdentityID,
  type EntityID,
  type EntityCreate,
  type Entity,
  type CollectionsEventMap,
  type CollectionEventMap,
  type EntityEventMap,
  type EntityEvent,
  isValidEntityID,
  getEntityLocation,
  createEntityEvent,
  MicrocosmID
} from '@nodenogg.in/microcosm'
import type { Telemetry } from '@nodenogg.in/microcosm/telemetry'
import type { ProviderFactory } from './provider'
import type { PersistenceFactory } from './persistence'
import { YMicrocosmDoc } from './YMicrocosmDoc'
import {
  type Signal,
  type Disposable,
  type ReadonlySignal,
  signal,
  system,
  createEvents,
  readonly
} from '@figureland/statekit'
import { NiceMap } from '@figureland/typekit/map'
import { createYMapListener } from './utils'

export type YMicrocosmAPIState = MicrocosmAPIState & {
  persisted: boolean
}

export class YMicrocosmAPI implements EditableMicrocosmAPI<YMicrocosmAPIState> {
  public microcosmID: MicrocosmID
  private system = system()
  private readonly doc: YMicrocosmDoc

  public readonly collectionSubscriptions = new NiceMap<IdentityID, Disposable>()
  public readonly state: ReadonlySignal<YMicrocosmAPIState>

  private ready = this.system.use(signal(() => false))

  public events = {
    collections: this.system.use(createEvents<CollectionsEventMap>()),
    collection: this.system.use(createEvents<CollectionEventMap>()),
    entity: this.system.use(createEvents<EntityEventMap>())
  }

  /**
   * Creates a new Microcosm that optionally syncs with peers, if a provider is specified.
   */
  constructor(
    config: MicrocosmAPIConfig,
    providers?: ProviderFactory[],
    persistence?: PersistenceFactory[],
    protected telemetry?: Telemetry
  ) {
    this.microcosmID = config.microcosmID
    this.doc = this.system.use(
      new YMicrocosmDoc({
        config,
        providers,
        persistence
      })
    )
    this.state = this.system.use(
      readonly(
        signal(
          (get): YMicrocosmAPIState => ({
            ...get(this.doc.state),
            ready: get(this.ready)
          })
        )
      )
    )

    this.state.on((k) => {
      console.log(k)
    })
  }

  public identify = async (identity_id: IdentityID) => this.doc.identify(identity_id)

  public init = async () => {
    try {
      await this.doc.init()
      this.createListeners()
    } catch (error) {
      this.telemetry?.catch(error)
    }
    this.setLoaded()
  }

  private createListeners = () => {
    this.system.use(
      createYMapListener(this.doc.identities, () => {
        const collections = this.doc.getCollectionIDs()
        this.events.collections.emit('collections', collections)
        for (const c of collections) {
          this.collectionSubscriptions.getOrSet(c, () => this.createCollectionListener(c))
        }
      })
    )
  }

  private createCollectionListener = (identity_id: IdentityID) => {
    const collection = this.doc.getYCollection(identity_id)

    return createYMapListener(collection, ({ changes }) => {
      this.events.collection.emit(
        identity_id,
        Array.from(collection.keys() || []).filter(isValidEntityID)
      )

      changes.keys.forEach((change, key) => {
        if (isValidEntityID(key)) {
          const entity = collection.get(key)
          if (!entity) {
            return
          }
          const location = getEntityLocation(identity_id, key)
          const type: EntityEvent['type'] = change.action === 'add' ? 'create' : change.action
          this.events.entity.emit(location, createEntityEvent(type, entity.data))
        }
      })
    })
  }

  // public getCollection = (identity_id: IdentityID): ReadonlySignal<EntityID[]> =>
  //   this.system.unique(identity_id, () => {
  //     const collection = this.doc.getYCollection(identity_id)
  //     const load = (): EntityID[] => Array.from(collection?.keys() || []).filter(isValidEntityID)

  //     const s = signal<EntityID[]>((get) => {
  //       get(this.collections)
  //       return load()
  //     })

  //     const handleChange = (arg0: YMapEvent<SignedEntity>, arg1: Transaction) => {
  //       s.set(load())
  //     }
  //     collection?.observe(handleChange)
  //     s.use(() => collection?.unobserve(handleChange))
  //     return readonly(s)
  //   })

  // public getEntity = <T extends EntityType>(
  //   identity_id: IdentityID,
  //   entity_id: EntityID,
  //   type?: T
  // ): ReadonlySignal<Entity<T> | undefined> =>
  //   this.system.unique(`${identity_id}${entity_id}`, () =>
  //     readonly(
  //       signal((get) => {
  //         get(this.getCollection(identity_id))
  //         const result = this.doc.getYCollection(identity_id)?.get(entity_id)
  //         if (!result) {
  //           return undefined
  //         }
  //         if (type) {
  //           return isEntityType(result.data, type) ? (result.data as Entity<T>) : undefined
  //         }
  //         return result.data as Entity<T>
  //       })
  //     )
  //   )

  deleteAll: () => void

  /**
   * Triggered when the {@link MicrocosmAPI} is ready
   */
  private setLoaded = () => {
    this.ready.set(true)
  }

  /**
   * Triggered when the {@link MicrocosmAPI} is no longer ready
   */
  private setUnloaded = () => {
    this.ready.set(false)
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
  public join = (identity: Identity) => {
    const { microcosmID } = this

    this.telemetry?.log({
      name: 'MicrocosmAPI',
      message: `Joined ${microcosmID}`,
      level: 'info'
    })

    this.doc.join(identity)
  }
  /**
   * Leaves the Microcosm, publishing identity status to connected peers
   */
  public leave = (identity: Identity) => {
    this.doc.leave(identity)
  }

  /**
   * Destroys the Microcosm's content and disposes this instance
   */
  public destroy = () => {
    this.dispose()
  }

  public dispose = () => {
    console.log('disposing')
    this.system.dispose()
  }

  public undo: EditableMicrocosmAPI['undo'] = () => this.doc.undo()

  public redo: EditableMicrocosmAPI['redo'] = () => this.doc.redo()
}
