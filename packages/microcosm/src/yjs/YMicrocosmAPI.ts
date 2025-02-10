import { state, manager } from '@figureland/kit/state'
import { isString } from '@figureland/kit/tools/guards'
import {
  type MicrocosmAPIConfig,
  type IdentityID,
  type EntityID,
  type Entity,
  type EntityEvent,
  type EntityType,
  type EntityLocation,
  EditableMicrocosmAPI,
  getEntityLocation,
  isValidIdentityID,
  isValidEntityID,
  parseEntityLocation
} from '@nodenogg.in/microcosm'
import type { Telemetry } from '@nodenogg.in/microcosm/telemetry'

import type { ProviderFactory } from './provider'
import type { PersistenceFactory } from './persistence'
import { YMicrocosmDoc } from './YMicrocosmDoc'
import { createYMapListener, getYCollectionChanges } from './yjs-utils'

export type YMicrocosmAPIOptions = {
  readonly config: MicrocosmAPIConfig
  readonly providers?: ProviderFactory[]
  readonly persistence?: PersistenceFactory[]
}

export class YMicrocosmAPI extends EditableMicrocosmAPI {
  protected manager = manager()
  protected use = this.manager.use
  public dispose = this.manager.dispose

  private readonly doc: YMicrocosmDoc
  private readonly ready = this.use(state(false))

  /**
   * Creates a new YMicrocosm that optionally syncs with peers, if a provider is specified.
   */
  constructor(
    options: YMicrocosmAPIOptions,
    protected telemetry?: Telemetry
  ) {
    super(options.config, telemetry)
    this.doc = this.use(new YMicrocosmDoc(options))

    this.use(
      state((get) => {
        const s = get(this.doc.state)
        const r = get(this.ready)
        this.state.set({
          ...s,
          ready: r
        })
      })
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

  public async *getCollection(identity_id: IdentityID): AsyncGenerator<EntityID> {
    for (const entity_id of this.doc.getYCollection(identity_id).keys()) {
      if (isValidEntityID(entity_id)) {
        yield entity_id
      }
    }
  }

  public async *getEntities(): AsyncGenerator<EntityLocation> {
    for await (const identity_id of this.getCollections()) {
      for await (const entity_id of this.getCollection(identity_id)) {
        yield getEntityLocation(identity_id, entity_id)
      }
    }
  }

  public getEntity = async <T extends EntityType>(
    entityLocation: { identity_id: IdentityID; entity_id: EntityID } | EntityLocation,
    type?: T
  ): Promise<Entity<T> | undefined> => this.doc.getEntity(entityLocation, type)

  private createListeners = async () => {
    this.use(
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
    this.manager.unique(identity_id, () => {
      this.createInitialEntities(identity_id)
      return createYMapListener(this.doc.getYCollection(identity_id), async (changes) => {
        for (const { entity_id, change } of getYCollectionChanges(changes)) {
          const type: EntityEvent['type'] = change.action === 'add' ? 'create' : change.action
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
  public update: EditableMicrocosmAPI['update'] = async (updates) => {
    this.doc.yDoc.transact(() => {
      for (const [entity, update] of updates) {
        const parsed = isString(entity) ? parseEntityLocation(entity) : entity

        if (parsed) {
          this.doc.update(parsed.entity_id, update)
        }
      }
    })
  }

  /**
   * Deletes an array of {@link Entity}s
   */
  public delete: EditableMicrocosmAPI['delete'] = async (entities) => {
    this.doc.yDoc.transact(() => {
      for (const entity of entities) {
        const parsed = isString(entity) ? parseEntityLocation(entity) : entity

        if (parsed) {
          this.doc.delete(parsed.entity_id)
        }
      }
    })
  }

  /**
   * Joins the Microcosm, publishing identity status to connected peers
   */
  public join: EditableMicrocosmAPI['join'] = (identity) => {
    this.telemetry?.log({
      name: 'MicrocosmAPI',
      message: `Joined ${this.microcosmID} (${identity.identityID}:${identity.nickname || ''})`,
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
      message: `Left ${this.microcosmID} (${identity.identityID}:${identity.nickname || ''})`,
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

  public undo: EditableMicrocosmAPI['undo'] = () => this.doc.undo()

  public redo: EditableMicrocosmAPI['redo'] = () => this.doc.redo()
}
