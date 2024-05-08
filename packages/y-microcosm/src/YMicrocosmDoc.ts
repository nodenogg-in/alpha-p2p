import { signal, type Signal, system } from '@figureland/statekit'
import {
  type Entity,
  type EntityType,
  type IdentityID,
  type EntityID,
  type EntityUpdatePayload,
  type EntityCreate,
  isValidIdentityID,
  isValidEntityID,
  update,
  create,
  isEntity
} from '@nodenogg.in/microcosm'
import { Doc, UndoManager, Map as YMap } from 'yjs'

const isYMap = (value: any): value is YMap<any> => value instanceof YMap

export const getCollectionEntityIDs = (collection?: YMap<Entity>): EntityID[] =>
  collection && isYMap(collection)
    ? Array.from(collection.keys() || []).filter(isValidEntityID)
    : []

const getCollectionKeys = (collections: YMap<any>): IdentityID[] =>
  Array.from(collections.keys()).filter(isValidIdentityID)

export class YMicrocosmDoc extends Doc {
  private current_identity_id!: IdentityID
  private undoManager: UndoManager
  private system = system()

  private identitiesMap: YMap<boolean>
  private identityEntitiesMap: YMap<Entity>
  public collections: Signal<IdentityID[]>

  constructor() {
    super()
    this.identitiesMap = this.getMap<boolean>('collections')

    this.collections = this.system.use(signal(() => getCollectionKeys(this.identitiesMap)))
    const load = () => {
      this.collections.set(getCollectionKeys(this.identitiesMap))
    }

    this.identitiesMap.observe(load)
    this.system.use(() => this.identitiesMap.unobserve(load))
    this.system.use(this.destroy)
  }

  /**
   * Initialize the document with a new identity_id
   *
   * @param identity_id
   */
  public init = (identity_id: IdentityID) => {
    if (this.current_identity_id !== identity_id) {
      this.identityEntitiesMap = this.get(identity_id, YMap<Entity>)
      this.undoManager = new UndoManager(this.identityEntitiesMap)
      this.system.use(this.undoManager.destroy)
      this.identitiesMap.set(identity_id, true)
    }
  }

  public getCollection = (identity_id: IdentityID) => this.get(identity_id, YMap<Entity>)

  public entities = <T extends EntityType>(type?: T) => {}

  /**
   * Updates a single {@link Entity}
   */
  public update = (entity_id: EntityID, u: EntityUpdatePayload) => {
    const collection = this.identityEntitiesMap
    if (collection) {
      const target = collection.get(entity_id)
      if (isEntity(target)) {
        collection.set(entity_id, update(target, u))
      }
    }
  }

  public create: EntityCreate = (newEntity) => {
    const collection = this.identityEntitiesMap
    const entity = create(newEntity)
    collection.set(entity.id, entity)
    return entity
  }

  public delete = (entity_id: EntityID) => {
    this.identityEntitiesMap?.delete(entity_id)
  }

  public undo = () => {
    this.undoManager?.undo()
  }

  public redo = () => {
    this.undoManager?.redo()
  }

  public dispose = () => this.system.dispose()
}
