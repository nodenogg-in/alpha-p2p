import { type Disposable, type Signal, system, signal } from '@figureland/statekit'
import type {
  Entity,
  EntityCreate,
  EntityType,
  EntityUpdatePayload,
  Identity,
  IdentityWithStatus
} from '.'
import type { EntityID, EntityLocation, IdentityID, MicrocosmID } from './schema/uuid.schema'
import { CanvasQuery, QueryAPI } from '@figureland/infinitykit'
import { Telemetry } from './telemetry'

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

const defaultAPIState = (): MicrocosmAPIState => ({
  ready: false,
  connected: false,
  identities: []
})
// <Key extends string | number | symbol>(key: Key, value: Record<QueryIdentifier, `@${string}/e${string}`[]>[Key]) => void
// is not assignable to type
// <Key extends string | number | symbol>(key: Key, value: Record<QueryIdentifier, string[]>[Key]) => void

export abstract class MicrocosmAPI<Config extends MicrocosmAPIConfig = MicrocosmAPIConfig>
  implements Disposable
{
  protected readonly system = system()
  public readonly microcosmID: MicrocosmID
  public readonly state: Signal<MicrocosmAPIState> = this.system.use(signal(defaultAPIState))
  public readonly query = this.system.use(new CanvasQuery<Entity>()) satisfies QueryAPI<Entity>

  constructor(
    config: Config,
    protected telemetry?: Telemetry
  ) {
    this.microcosmID = config.microcosmID
  }

  abstract getEntity<T extends EntityType>(
    entityLocation: { identity_id: IdentityID; entity_id: EntityID } | EntityLocation,
    type?: T
  ): Promise<Entity<T> | undefined>

  abstract getEntities(): AsyncGenerator<EntityLocation>

  abstract getCollections(): AsyncGenerator<IdentityID>

  abstract getCollection(identity_id: IdentityID): AsyncGenerator<EntityID>

  public dispose = () => {
    this.system.dispose()
  }
}

export type EntityPointer = { identity_id: IdentityID; entity_id: EntityID } | EntityLocation

export abstract class EditableMicrocosmAPI<
  Config extends MicrocosmAPIConfig = MicrocosmAPIConfig
> extends MicrocosmAPI<Config> {
  abstract identify(identity_id: IdentityID): Promise<void>

  abstract create: EntityCreate

  abstract update(updates: [EntityPointer, EntityUpdatePayload][]): Promise<void>

  abstract delete(entities: EntityPointer[]): Promise<void>

  abstract join(id: Identity): void

  abstract leave(id: Identity): void

  abstract undo(): void

  abstract redo(): void
}
