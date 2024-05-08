import type { Signal, SignalObject, Disposable } from '@figureland/statekit'
import type {
  EntityCreate,
  EntityUpdate,
  EntityUpdatePayload,
  Identity,
  IdentityWithStatus
} from '.'
import type { EntityID, IdentityID, MicrocosmID } from './schema/uuid.schema'
import type { Entity, EntityType } from './schema/entity.schema'

export type MicrocosmAPIConfig = {
  microcosmID: MicrocosmID
  identityID: IdentityID
  view?: string
  password?: string
}

export type MicrocosmAPIState = {
  status: {
    ready: boolean
    connected: boolean
  }
  identities: IdentityWithStatus[]
  active: boolean
}

export interface MicrocosmAPI extends Disposable {
  config: Readonly<MicrocosmAPIConfig>
  state: SignalObject<MicrocosmAPIState>
  entities: <T extends EntityType>(type?: T) => Entity<T>[]
  entity: <T extends EntityType>(
    identityID: IdentityID,
    entityID: EntityID,
    type?: T
  ) => Signal<Entity<T> | undefined>
}

export interface EditableMicrocosmAPI extends MicrocosmAPI {
  create: EntityCreate
  update: (id: EntityID, u: EntityUpdatePayload) => void
  delete: (entity_id: EntityID) => void
  deleteAll: () => void
  join: (id: Identity) => void
  leave: () => void
  destroy: () => void
  undo: () => void
  redo: () => void
}
