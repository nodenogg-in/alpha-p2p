import { arraysEquals } from '@figureland/typekit/equals'
import { isString } from '@figureland/typekit/guards'
import { signal, system, type Signal } from '@figureland/statekit'
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
  type EntityEvent,
  type MicrocosmID,
  type EntityLocation,
  getEntityLocation,
  createMicrocosmAPIEvents,
  parseEntityLocation
} from '@nodenogg.in/microcosm'
import type { Telemetry } from '@nodenogg.in/microcosm/telemetry'
import type { ProviderFactory } from './provider'
import type { PersistenceFactory } from './persistence'
import { YMicrocosmDoc } from './YMicrocosmDoc'
import { createYMapListener, getYCollectionChanges } from './utils'

export type YMicrocosmAPIOptions = {
  readonly config: MicrocosmAPIConfig
  readonly providers?: ProviderFactory[]
  readonly persistence?: PersistenceFactory[]
}

export class YMicrocosmAPI implements EditableMicrocosmAPI<MicrocosmAPIState> {
  private system = system()
  public readonly microcosmID: MicrocosmID
  private readonly doc: YMicrocosmDoc
  public readonly state: Signal<MicrocosmAPIState>

  private ready = this.system.use(signal(() => false))

  public readonly events = createMicrocosmAPIEvents(this.system)

  public readonly data = {
    collections: this.system.use(
      signal((): IdentityID[] => [], {
        equality: arraysEquals
      })
    )
  }

  public getCollections = () => {
    return this.doc.getCollectionIDs()
  }
  public getCollection = (identity_id: IdentityID) => {
    return this.doc.getCollection(identity_id)
  }
  public getEntity = <T extends EntityType>(
    entityLocation: EntityLocation | { identity_id: IdentityID; entity_id: EntityID },
    type?: T
  ): Entity<T> | undefined => {
    const parsed = isString(entityLocation) ? parseEntityLocation(entityLocation) : entityLocation

    if (!parsed) {
      return undefined
    }

    const entity = this.doc.getEntity(parsed.identity_id, parsed.entity_id, type)

    if (!entity) {
      return undefined
    }

    return entity.data as Entity<T>
  }

  public getEntities = (): EntityLocation[] => {
    const collections = this.getCollections()
    return collections.map((c) => this.getCollection(c).map((e) => getEntityLocation(c, e))).flat()
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
      signal(
        (get): MicrocosmAPIState => ({
          ...get(this.doc.state),
          ready: get(this.ready)
        })
      )
    )
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
        this.data.collections.set(this.getCollections())
        for (const c of this.data.collections.get()) {
          this.system.unique(c, () => this.createCollectionListener(c))
        }
      })
    )
  }

  private createCollectionListener = (identity_id: IdentityID) => {
    const yCollection = this.doc.getYCollection(identity_id)

    const collection = signal(() => [] as EntityID[], {
      equality: arraysEquals
    })

    collection.on((entities) => this.events.collection.emit(identity_id, entities))

    collection.use(
      createYMapListener(yCollection, (e) => {
        collection.set(this.getCollection(identity_id))

        for (const { entity_id, change } of getYCollectionChanges(e)) {
          const type: EntityEvent['type'] = change.action
          const location = getEntityLocation(identity_id, entity_id)

          if (type === 'delete') {
            this.events.entity.emit(location, {
              type,
              previous: change.oldValue.data
            })
            continue
          }

          const entity = this.getEntity({
            identity_id,
            entity_id
          })
          if (!entity) {
            continue
          }
          this.events.entity.emit(location, {
            type,
            entity
          })
        }
      })
    )

    return collection
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
