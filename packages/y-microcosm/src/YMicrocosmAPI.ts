import { signal, system, type Signal } from '@figureland/statekit'
import {
  type MicrocosmAPIConfig,
  type MicrocosmAPI,
  type EditableMicrocosmAPI,
  type MicrocosmAPIState,
  type IdentityID,
  type EntityID,
  type Entity,
  type EntityEvent,
  type MicrocosmID,
  type EntityType,
  type EntityLocation,
  getEntityLocation,
  isValidIdentityID,
  isValidEntityID
} from '@nodenogg.in/microcosm'
import type { Telemetry } from '@nodenogg.in/microcosm/telemetry'
import type { ProviderFactory } from './provider'
import type { PersistenceFactory } from './persistence'
import { YMicrocosmDoc } from './YMicrocosmDoc'
import { createYMapListener, getYCollectionChanges } from './yjs-utils'
import { CanvasQuery } from '@figureland/infinitykit'

export type YMicrocosmAPIOptions = {
  readonly config: MicrocosmAPIConfig
  readonly providers?: ProviderFactory[]
  readonly persistence?: PersistenceFactory[]
}

export class YMicrocosmAPI implements EditableMicrocosmAPI<MicrocosmAPIState> {
  private readonly system = system()
  private readonly doc: YMicrocosmDoc
  private readonly ready = this.system.use(signal(() => false))

  public readonly microcosmID: MicrocosmID
  public readonly state: Signal<MicrocosmAPIState>
  public readonly query = this.system.use(new CanvasQuery<EntityLocation, Entity>())

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

  public identify = async (identity_id: IdentityID) => {
    await this.doc.identify(identity_id)
  }

  public init = async () => {
    try {
      await this.createListeners()
      await this.doc.init()
    } catch (error) {
      this.telemetry?.catch(error)
    }
    this.setLoaded()
  }

  public async *getCollections(): AsyncGenerator<IdentityID> {
    for (const identity_id of this.doc.identities.keys()) {
      if (isValidIdentityID(identity_id)) {
        yield identity_id
      }
    }
  }

  public async *getCollection(identity_id) {
    for (const e of this.doc.getYCollection(identity_id).keys()) {
      if (isValidEntityID(e)) {
        yield e
      }
    }
  }

  public async *getEntities(): AsyncGenerator<EntityLocation> {
    for await (const c of this.getCollections()) {
      for await (const e of this.getCollection(c)) {
        yield getEntityLocation(c, e)
      }
    }
  }

  public getEntity = async <T extends EntityType>(
    entityLocation: { identity_id: IdentityID; entity_id: EntityID } | EntityLocation,
    type?: T
  ): Promise<Entity<T> | undefined> => this.doc.getEntity(entityLocation, type)

  private createListeners = async () => {
    this.system.use(
      createYMapListener(this.doc.identities, async () => {
        for await (const identity_id of this.getCollections()) {
          await this.createCollectionListener(identity_id)
        }
      })
    )
  }

  private createInitialEntities = async (identity_id: IdentityID) => {
    for await (const entity_id of this.getCollection(identity_id)) {
      const entity = await this.doc.getEntity({
        identity_id,
        entity_id
      })
      if (entity) {
        this.query.add(getEntityLocation(identity_id, entity_id), entity)
      }
    }
  }

  private createCollectionListener = async (identity_id: IdentityID) =>
    this.system.unique(identity_id, () => {
      this.createInitialEntities(identity_id)
      return createYMapListener(this.doc.getYCollection(identity_id), async (changes) => {
        for (const { entity_id, change } of getYCollectionChanges(changes)) {
          const type: EntityEvent['type'] = change.action
          const location = getEntityLocation(identity_id, entity_id)

          if (type === 'delete') {
            this.query.delete(location)
          } else {
            const entity = await this.doc.getEntity({
              identity_id,
              entity_id
            })
            if (entity) {
              this.query.add(location, entity)
            }
          }
        }
      })
    })

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
  public create: EditableMicrocosmAPI['create'] = (n) => this.doc.create(n)

  /**
   * Updates one or more {@link Entity}s
   */
  public update: EditableMicrocosmAPI['update'] = (entity_id, u) => this.doc.update(entity_id, u)

  /**
   * Deletes an array of {@link Entity}s
   */
  public delete: EditableMicrocosmAPI['delete'] = (entity_id) => this.doc.delete(entity_id)

  /**
   * Joins the Microcosm, publishing identity status to connected peers
   */
  public join: EditableMicrocosmAPI['join'] = (identity) => {
    this.telemetry?.log({
      name: 'MicrocosmAPI',
      message: `Joined ${this.microcosmID}`,
      level: 'info'
    })

    this.doc.join(identity)
  }
  /**
   * Leaves the Microcosm, publishing identity status to connected peers
   */
  public leave: EditableMicrocosmAPI['leave'] = (identity) => {
    this.telemetry?.log({
      name: 'MicrocosmAPI',
      message: `Left ${this.microcosmID}`,
      level: 'info'
    })

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
