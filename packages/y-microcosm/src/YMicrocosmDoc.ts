import {
  type Entity,
  type IdentityID,
  type EntityID,
  type EntityUpdatePayload,
  type EntityCreate,
  isValidIdentityID,
  isValidEntityID,
  update,
  create,
  isEntity,
  EntityType,
  isEntityType
} from '@nodenogg.in/microcosm'
import type { Signed } from '@nodenogg.in/microcosm/crypto'
import { TelemetryError } from '@nodenogg.in/microcosm/telemetry'
import { system, signal, type Signal } from '@figureland/statekit'
import { Doc, UndoManager, Map as YMap } from 'yjs'

const isYMap = (value: any): value is YMap<any> => value instanceof YMap

type EntityCollection = YMap<Signed<Entity>>

type CollectionEntities = Record<EntityID, Signed<Entity>>

type YCollection = YMap<Signed<Entity>> & {
  toJSON: () => CollectionEntities
}

export class YMicrocosmDoc extends Doc {
  private system = system()
  private identity_id!: IdentityID
  private undoManager: UndoManager
  public identities = this.getMap<boolean>('identities')
  public collection: EntityCollection

  public getIdentities = (): IdentityID[] =>
    Array.from(this.identities.keys()).filter(isValidIdentityID)

  public collections = this.system.unique('collections', () => {
    const s = signal<IdentityID[]>(this.getIdentities, {
      equality: (a, b) => b.every((id) => a.includes(id))
    })
    this.identities.observe(() => s.set(this.getIdentities))
    return s
  })

  public identify = (identity_id: IdentityID) => {
    if (this.identity_id !== identity_id) {
      this.identity_id = identity_id
      this.undoManager?.destroy()
      this.collection = this.get(identity_id, YMap<Signed<Entity>>)
      this.undoManager = new UndoManager(this.collection)
      this.identities.set(identity_id, true)
    }
    this.getCollection(this.identity_id).on((e) => {
      console.log(e)
    })
  }

  public getCollection = (identity_id: IdentityID): Signal<CollectionEntities> => {
    return this.system.unique(`${identity_id}`, () => {
      const collection: YCollection = this.get(identity_id, YMap<Signed<Entity>>)
      const load = () => {
        return collection ? collection.toJSON() : {}
      }
      const s = signal<CollectionEntities>((get) => {
        get(this.collections)
        return load()
      })

      collection.observe(() => s.set(load()))
      return s
    })
  }

  public getEntity = <T extends EntityType>(
    identity_id: IdentityID,
    entity_id: EntityID,
    type?: T
  ): Signal<Entity<T> | undefined> => {
    return this.system.unique(`${identity_id}${entity_id}`, () =>
      signal((get) => {
        const col = get(this.getCollection(identity_id))
        const result = col[entity_id]
        if (!result) {
          return undefined
        }
        if (type) {
          return isEntityType(result.data, type) ? (result.data as Entity<T>) : undefined
        }
        return result.data as Entity<T>
      })
    )
  }

  public getEntities = () => {
    const identities = this.getIdentities()

    // return identities.flatMap((identity_id) => {
    //   const entities = this.getCollectionEntityIDs(identity_id)
    //   return entities.map((entity_id) => this.getEntity(entity_id))
    // })
  }

  public getCollectionEntityIDs = (identity_id: IdentityID): EntityID[] => {
    const target = this.get(identity_id, YMap<Signed<Entity>>)
    return target && isYMap(target) ? Array.from(target.keys() || []).filter(isValidEntityID) : []
  }

  // public getCollections = () =>
  // public getCollection = (identity_id: IdentityID) => this.get(identity_id, YMap<Signed<Entity>>)

  /**
   * Updates a single {@link Entity}
   */
  public update = (entity_id: EntityID, u: EntityUpdatePayload) => {
    if (!this.collection) {
      throw new TelemetryError({
        level: 'warn',
        message: 'No identity available for microcosm operations',
        name: 'YMicrocosmAPI'
      })
    }
    const target = this.collection.get(entity_id)
    if (isEntity(target)) {
      const signed = {
        signature: '',
        data: update(target, u)
      }
      this.collection.set(entity_id, signed)
    }
  }

  public create: EntityCreate = (newEntity) => {
    if (!this.collection) {
      throw new TelemetryError({
        level: 'warn',
        message: 'No identity available for microcosm operations',
        name: 'YMicrocosmAPI'
      })
    }

    const entity = create(newEntity)
    const payload = { signature: '', data: entity }
    this.collection.set(entity.id, payload)
    return entity
  }

  public delete = (entity_id: EntityID) => {
    if (!this.collection) {
      throw new TelemetryError({
        level: 'warn',
        message: 'No identity available for microcosm operations',
        name: 'YMicrocosmAPI'
      })
    }
    this.collection?.delete(entity_id)
  }

  public undo = () => {
    this.undoManager?.undo()
  }

  public redo = () => {
    this.undoManager?.redo()
  }

  public dispose = () => {
    this.destroy()
    this.undoManager?.destroy()
  }
}
