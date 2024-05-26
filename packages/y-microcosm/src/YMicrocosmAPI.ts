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
  type MicrocosmID,
  isValidEntityID,
  getEntityLocation,
  createEntityEvent
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
import { createYMapListener, getEntityKeys, getYCollectionChanges } from './utils'

export type YMicrocosmAPIState = MicrocosmAPIState & {
  persisted: boolean
}

export type YMicrocosmAPIOptions = {
  readonly config: MicrocosmAPIConfig
  readonly providers?: ProviderFactory[]
  readonly persistence?: PersistenceFactory[]
}

export class YMicrocosmAPI implements EditableMicrocosmAPI<YMicrocosmAPIState> {
  private system = system()
  public readonly microcosmID: MicrocosmID
  private readonly doc: YMicrocosmDoc

  private readonly collectionSubscriptions = new NiceMap<IdentityID, Disposable>()
  public readonly state: ReadonlySignal<YMicrocosmAPIState>

  private ready = this.system.use(signal(() => false))

  public readonly events = {
    collection: this.system.use(createEvents<CollectionEventMap>()),
    entity: this.system.use(createEvents<EntityEventMap>())
  }

  public readonly data = {
    collections: this.system.use(
      signal((): IdentityID[] => [], {
        equality: (a, b) => a.length === b.length && b.every((v) => a.includes(v))
      })
    )
  }

  public readonly get = {
    collection: (identity_id: IdentityID) => {
      const collection = this.doc.getYCollection(identity_id)
      return getEntityKeys(collection)
    },
    entity: (identity_id: IdentityID, entity_id: EntityID) => {
      const collection = this.doc.getYCollection(identity_id)
      return collection?.get(entity_id)?.data
    }
  }

  /**
   * Creates a new YMicrocosm that optionally syncs with peers, if a provider is specified.
   */
  constructor(
    options: YMicrocosmAPIOptions,
    protected telemetry?: Telemetry
  ) {
    this.microcosmID = options.config.microcosmID
    this.doc = this.system.use(new YMicrocosmDoc(options))
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
  }

  public identify = async (identity_id: IdentityID) => this.doc.identify(identity_id)

  public init = async () => {
    try {
      await this.doc.init()
      this.createListeners()
      this.dev__()
    } catch (error) {
      this.telemetry?.catch(error)
    }
    this.setLoaded()
  }

  private createListeners = () => {
    this.system.use(
      createYMapListener(this.doc.identities, () => {
        this.data.collections.set(this.doc.getCollectionIDs())
        for (const c of this.data.collections.get()) {
          this.collectionSubscriptions.getOrSet(c, () => this.createCollectionListener(c))
        }
      })
    )
  }

  public dev__ = () => {
    this.data.collections.on((c) => {
      console.log(c)
    })

    this.events.entity.onAll((e) => {
      console.log('entity')
      console.log(e)
    })
    this.events.collection.onAll((e) => {
      console.log('collection')
      console.log(e)
    })
  }

  private createCollectionListener = (identity_id: IdentityID) => {
    const collection = this.doc.getYCollection(identity_id)
    return createYMapListener(collection, (e) => {
      this.events.collection.emit(identity_id, this.get.collection(identity_id))

      for (const { entity_id, change } of getYCollectionChanges(e)) {
        const entity = this.get.entity(identity_id, entity_id)
        if (!entity) {
          return
        }
        const location = getEntityLocation(identity_id, entity_id)
        const type: EntityEvent['type'] = change.action === 'add' ? 'create' : change.action
        this.events.entity.emit(location, createEntityEvent(type, entity))
      }
    })
  }

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
    this.system.dispose()
  }

  public undo: EditableMicrocosmAPI['undo'] = () => this.doc.undo()

  public redo: EditableMicrocosmAPI['redo'] = () => this.doc.redo()
}
