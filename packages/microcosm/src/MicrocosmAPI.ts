import type { Signal, Disposable, Subscribable } from '@figureland/statekit'
import type { EntityCreate, EntityUpdatePayload, Identity, IdentityWithStatus } from '.'
import type { EntityID, IdentityID, MicrocosmID } from './schema/uuid.schema'

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
  // identities: Signal<IdentityWithStatus[]>
  microcosmID: MicrocosmID
  state: Subscribable<S>
  // entities: <T extends EntityType>(type?: T) => Entity<T>[]
  // entity: <T extends EntityType>(
  //   identityID: IdentityID,
  //   entityID: EntityID,
  //   type?: T
  // ) => Signal<Entity<T> | undefined>
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
