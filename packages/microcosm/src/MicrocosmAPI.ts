import type { Disposable, Subscribable, Events, Signal } from '@figureland/statekit'
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
  readonly events: MicrocosmAPIEvents
  getEntities: () => EntityLocation[]
  getEntity: <T extends EntityType>(
    entity: EntityLocation | { identity_id: IdentityID; entity_id: EntityID },
    type?: T
  ) => Entity<T> | undefined
  getCollections: () => IdentityID[]
  getCollection: (identity_id: IdentityID) => EntityID[]
}

export interface EditableMicrocosmAPI<S extends MicrocosmAPIState = MicrocosmAPIState>
  extends MicrocosmAPI<S> {
  identify: (identity_id: IdentityID) => Promise<void>
  create: EntityCreate
  update: (id: EntityID, u: EntityUpdatePayload) => void
  delete: (entity_id: EntityID) => void
  deleteAll: () => void
  join: (id: Identity) => void
  leave: (id: Identity) => void
  destroy: () => void
  undo: () => void
  redo: () => void
}
