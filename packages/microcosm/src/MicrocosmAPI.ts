import type { Disposable, Signal, Gettable } from '@figureland/statekit'
import type {
  Entity,
  EntityCreate,
  EntityType,
  EntityUpdatePayload,
  Identity,
  IdentityWithStatus,
  MicrocosmAPIEvents
} from '.'
import type { EntityID, EntityLocation, IdentityID, MicrocosmID } from './schema/uuid.schema'
import type { CanvasQuery } from '@figureland/infinitykit'
export type MicrocosmAPIConfig = {
  microcosmID: MicrocosmID
  view?: string
  password?: string
}

export type MicrocosmAPIState = {
  ready: boolean
  connected: boolean
  identities: IdentityWithStatus[]
}

export interface MicrocosmAPI<S extends MicrocosmAPIState = MicrocosmAPIState> extends Disposable {
  readonly microcosmID: MicrocosmID
  readonly state: Signal<S>
  query: CanvasQuery<EntityLocation, Entity>
  getEntity: <T extends EntityType>(
    entityLocation: { identity_id: IdentityID; entity_id: EntityID } | EntityLocation,
    type?: T
  ) => Promise<Entity<T> | undefined>
  getEntities: () => AsyncGenerator<EntityLocation>
  getCollections: () => AsyncGenerator<IdentityID>
  getCollection: (identity_id: IdentityID) => AsyncGenerator<EntityID>
}

export interface EditableMicrocosmAPI<S extends MicrocosmAPIState = MicrocosmAPIState>
  extends MicrocosmAPI<S> {
  identify: (identity_id: IdentityID) => Promise<void>
  create: EntityCreate
  update: (id: EntityID, u: EntityUpdatePayload) => void
  delete: (entity_id: EntityID) => void
  join: (id: Identity) => void
  leave: (id: Identity) => void
  destroy: () => void
  undo: () => void
  redo: () => void
}
