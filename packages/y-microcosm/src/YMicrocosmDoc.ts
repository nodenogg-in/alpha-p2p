import {
  type Entity,
  type IdentityID,
  type EntityID,
  type EntityUpdatePayload,
  type EntityCreate,
  type EntityType,
  isValidIdentityID,
  update,
  create,
  isEntity,
  isEntityType,
  isValidEntityID
} from '@nodenogg.in/microcosm'
import type { Signed } from '@nodenogg.in/microcosm/crypto'
import { TelemetryError } from '@nodenogg.in/microcosm/telemetry'
import { signal, Manager, readonly, ReadonlySignal } from '@figureland/statekit'
import { Doc, UndoManager, Map as YMap } from 'yjs'

type SignedEntity = Signed<Entity>

type YEntityCollection = YMap<SignedEntity>

export class YMicrocosmDoc extends Manager {
  public readonly yDoc = new Doc()
  private identity_id!: IdentityID
  private undoManager: UndoManager
  private identities = this.yDoc.getMap<boolean>('identities')
  private collection: YEntityCollection

  private getIdentities = (): IdentityID[] =>
    Array.from(this.identities.keys()).filter(isValidIdentityID)

  public collections = this.system.unique('collections', () => {
    const s = signal<IdentityID[]>(this.getIdentities, {
      equality: (a, b) => b.every((id) => a.includes(id))
    })
    const handleChange = () => s.set(this.getIdentities)
    this.identities.observe(handleChange)
    s.use(() => this.identities.unobserve(handleChange))
    return readonly(s)
  })

  public identify = (identity_id: IdentityID) => {
    if (this.identity_id !== identity_id) {
      this.identity_id = identity_id
      this.undoManager?.destroy()
      this.collection = this.getYCollection(identity_id)
      this.undoManager = new UndoManager(this.collection)
      this.identities.set(identity_id, true)
    }
  }

  private getYCollection = (identity_id: IdentityID): YEntityCollection =>
    this.yDoc.get(identity_id, YMap<SignedEntity>)

  public getCollection = (identity_id: IdentityID): ReadonlySignal<EntityID[]> =>
    this.system.unique(identity_id, () => {
      const collection = this.getYCollection(identity_id)
      const load = (): EntityID[] => Array.from(collection?.keys() || []).filter(isValidEntityID)

      const s = signal<EntityID[]>((get) => {
        get(this.collections)
        return load()
      })

      const handleChange = () => s.set(load())
      collection?.observe(handleChange)
      s.use(() => collection?.unobserve(handleChange))
      return readonly(s)
    })

  public getEntity = <T extends EntityType>(
    identity_id: IdentityID,
    entity_id: EntityID,
    type?: T
  ): ReadonlySignal<Entity<T> | undefined> =>
    this.system.unique(`${identity_id}${entity_id}`, () =>
      readonly(
        signal((get) => {
          get(this.getCollection(identity_id))
          const result = this.getYCollection(identity_id)?.get(entity_id)
          if (!result) {
            return undefined
          }
          if (type) {
            return isEntityType(result.data, type) ? (result.data as Entity<T>) : undefined
          }
          return result.data as Entity<T>
        })
      )
    )

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
    this.yDoc.destroy()
    this.undoManager?.destroy()
  }
}
