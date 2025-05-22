import { state } from '@figureland/kit/state'
import { isString } from '@figureland/kit/tools/guards'

import { YMicrocosmDoc } from './YMicrocosmDoc'
import { createYMapListener, getYCollectionChanges } from './yjs-utils'
import {
  IdentitySchema,
  EntitySchema,
  type IdentityUUID,
  type EntityLocation,
  type Entity,
  type Identity,
  type EntityPointer
} from '@nodenogg.in/schema'
import { MicrocosmAPI } from '@nodenogg.in/core'
import { YMicrocosmAPIOptions } from '.'

export type EntityEvent<E extends Entity = Entity> =
  | {
      type: 'create'
      entity: E
    }
  | {
      type: 'update'
      entity: E
    }
  | {
      type: 'delete'
      previous: E
    }

export class YMicrocosmAPI extends MicrocosmAPI {
  private readonly doc: YMicrocosmDoc
  private readonly ready = this.use(state(false))

  /**
   * Creates a new YMicrocosm that optionally syncs with peers, if a provider is specified.
   */
  constructor(options: YMicrocosmAPIOptions) {
    super(options.config)
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

  public identify = async (identity_id: IdentityUUID) => {
    await this.doc.identify(identity_id)
  }

  public init = async () => {
    await this.createListeners()
    await this.doc.init()
    this.setLoaded()
  }

  public async *getCollections(): AsyncGenerator<IdentityUUID> {
    for (const identity_id of this.doc.identities.keys()) {
      if (IdentitySchema.utils.isValidIdentityUUID(identity_id)) {
        yield identity_id
      }
    }
  }

  public async *getCollection(identity_id: IdentityUUID): AsyncGenerator<string> {
    for (const entity_id of this.doc.getYCollection(identity_id).keys()) {
      if (EntitySchema.utils.isValidEntityUUID(entity_id)) {
        yield entity_id
      }
    }
  }

  public async *getEntities(): AsyncGenerator<EntityLocation> {
    for await (const identity_id of this.getCollections()) {
      for await (const entity_id of this.getCollection(identity_id)) {
        yield EntitySchema.utils.getEntityLocation(identity_id, entity_id)
      }
    }
  }

  public getEntity = async (entityLocation: EntityPointer) => this.doc.getEntity(entityLocation)

  private createListeners = async () => {
    this.use(
      createYMapListener(this.doc.identities, async () => {
        for await (const identity_id of this.getCollections()) {
          await this.createCollectionListener(identity_id)
        }
      })
    )
  }

  private createInitialEntities = async (identity_id: IdentityUUID) => {
    for await (const entity_id of this.getCollection(identity_id)) {
      const e = await this.doc.getEntity({
        identity_id,
        entity_id
      })
      if (e) {
        this.internal.add(EntitySchema.utils.getEntityLocation(identity_id, entity_id), e)
      }
    }
  }

  private createCollectionListener = async (identity_id: IdentityUUID) =>
    this.store.unique(identity_id, () => {
      this.createInitialEntities(identity_id)

      return createYMapListener(this.doc.getYCollection(identity_id), async (changes) => {
        for (const { entity_id, change } of getYCollectionChanges(changes)) {
          const type: EntityEvent['type'] = change.action === 'add' ? 'create' : change.action
          const location = EntitySchema.utils.getEntityLocation(identity_id, entity_id)

          if (type === 'delete') {
            this.internal.delete(location)
          } else {
            const entity = await this.doc.getEntity({
              identity_id,
              entity_id
            })
            if (entity) {
              this.internal.update(location, entity)
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
  public create = (n: Entity['data']) => this.doc.create(n)

  /**
   * Updates one or more {@link Entity}s
   */
  public update = async (updates: [EntityPointer, Partial<Omit<Entity['data'], 'type'>>][]) => {
    this.doc.yDoc.transact(() => {
      for (const [e, update] of updates) {
        const parsed = isString(e) ? EntitySchema.utils.parseEntityLocation(e) : e
        if (parsed) {
          this.doc.update(parsed.entity_id, update)
        }
      }
    })
  }

  /**
   * Deletes an array of {@link Entity}s
   */
  public delete = async (entities: EntityPointer[]) => {
    this.doc.yDoc.transact(() => {
      for (const e of entities) {
        const parsed = isString(e) ? EntitySchema.utils.parseEntityLocation(e) : e

        if (parsed) {
          this.doc.delete(parsed.entity_id)
        }
      }
    })
  }

  /**
   * Joins the Microcosm, publishing identity status to connected peers
   */
  public join = (identity: Identity) => {
    // this.telemetry?.log({
    //   name: 'MicrocosmAPI',
    //   message: `Joined ${this.uuid} (${identity.IdentityUUID}:${identity.nickname || ''})`,
    //   level: 'info'
    // })

    this.doc.join(identity)
  }
  /**
   * Leaves the Microcosm, publishing identity status to connected peers
   */
  public leave = (identity: Identity) => {
    // this.telemetry?.log({
    //   name: 'MicrocosmAPI',
    //   message: `Left ${this.uuid} (${identity.IdentityUUID}:${identity.nickname || ''})`,
    //   level: 'info'
    // })

    this.doc.leave(identity)
  }

  /**
   * Destroys the Microcosm's content and disposes this instance
   */
  public destroy = () => {
    this.dispose()
  }

  public undo = () => this.doc.undo()

  public redo = () => this.doc.redo()
}
