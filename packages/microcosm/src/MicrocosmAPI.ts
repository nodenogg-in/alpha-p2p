import { type State, state, store, map, events } from '@figureland/kit/state'
import type {
  Entity,
  CreateEntity,
  EntityType,
  UpdateEntityPayload,
  Identity,
  IdentityWithStatus
} from '.'
import type {
  EntityID,
  EntityLocation,
  EntityPointer,
  IdentityID,
  MicrocosmID
} from './schema/uuid.schema'
import { Telemetry } from './telemetry'
import { arraysEquals } from '@figureland/kit/tools'

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

export abstract class MicrocosmAPI<Config extends MicrocosmAPIConfig = MicrocosmAPIConfig> {
  protected store = store()
  protected use = this.store.use
  public dispose = this.store.dispose
  public readonly entities = this.store.use(map<string, Entity>())
  public readonly data = this.store.use(events<Record<string, Entity | undefined>>())
  public readonly ids = this.store.use(
    state<string[]>([], {
      equality: arraysEquals
    })
  )

  public readonly microcosmID: MicrocosmID
  public readonly state: State<MicrocosmAPIState> = this.use(state(defaultAPIState))
  constructor(
    config: Config,
    protected telemetry?: Telemetry
  ) {
    this.microcosmID = config.microcosmID
    this.store.use(() => {
      this.entities.instance().clear()
    })
    this.data.all(() => {
      this.ids.set(Array.from(this.entities.instance().keys()))
    })
  }

  protected addStore = (id: string, item: Entity): void => {
    this.entities.mutate((e) => e.set(id, item), true)
    this.data.emit(id, item)
  }

  protected updateStore = (id: string, item: Entity): void => {
    this.entities.mutate((e) => e.set(id, item), true)
    this.data.emit(id, item)
  }

  protected deleteStore = (id: string): void => {
    const previous = this.get(id)
    if (previous) {
      this.entities.mutate((e) => e.delete(id))
      this.data.emit(id, undefined)
    }
  }

  public subscribe = (id: string) =>
    this.store.unique(id, () => {
      const s = state(() => this.get(id))
      this.data.on(id, s.set)
      return s
    })

  protected get = (id: string) => this.entities.instance().get(id)

  abstract getEntity<T extends EntityType>(
    entity: EntityPointer,
    type?: T
  ): Promise<Entity<T> | undefined>

  abstract getEntities(): AsyncGenerator<EntityLocation>

  abstract getCollections(): AsyncGenerator<IdentityID>

  abstract getCollection(identity_id: IdentityID): AsyncGenerator<EntityID>
}

export abstract class EditableMicrocosmAPI<
  Config extends MicrocosmAPIConfig = MicrocosmAPIConfig
> extends MicrocosmAPI<Config> {
  abstract identify(identity_id: IdentityID): Promise<void>

  abstract create: CreateEntity

  abstract update(updates: [EntityPointer, UpdateEntityPayload][]): Promise<void>

  abstract delete(entities: EntityPointer[]): Promise<void>

  abstract join(id: Identity): void

  abstract leave(id: Identity): void

  abstract undo(): void

  abstract redo(): void
}
