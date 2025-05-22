import { type State, state, store, map, events } from '@figureland/kit/state'
import type { Entity, EntityDataType, EntityPointer, IdentityUUID } from '@nodenogg.in/schema'

export type MicrocosmAPIConfig = {
  uuid: string
  view?: string
  password?: string
}

export type MicrocosmAPIState = {
  ready: boolean
  connected: boolean
}

const defaultAPIState = (): MicrocosmAPIState => ({
  ready: false,
  connected: false
})

export abstract class MicrocosmAPI<Config extends MicrocosmAPIConfig = MicrocosmAPIConfig> {
  protected store = store()
  protected use = this.store.use
  public dispose = this.store.dispose
  public readonly entities = this.store.use(map<string, Entity>())
  public readonly data = this.store.use(events<Record<string, Entity | undefined>>())

  public readonly uuid: string
  public readonly state: State<MicrocosmAPIState> = this.use(state(defaultAPIState))
  constructor(config: Config) {
    this.uuid = config.uuid
    this.store.use(() => {
      this.entities.instance().clear()
    })
  }

  protected internal = {
    add: (id: string, item: Entity): void => {
      this.entities.mutate((e) => e.set(id, item), true)
      this.data.emit(id, item)
    },
    update: (id: string, item: Entity): void => {
      this.entities.mutate((e) => e.set(id, item), true)
      this.data.emit(id, item)
    },
    delete: (id: string): void => {
      this.entities.mutate((e) => e.delete(id))
      this.data.emit(id, undefined)
    },
    get: (id: string): Entity | undefined => {
      return this.entities.instance().get(id)
    },
    subscribe: (id: string) => {
      const s = state(() => this.internal.get(id))
      this.data.on(id, s.set)
      return s
    }
  }

  abstract getEntity<T extends EntityDataType>(
    entity: EntityPointer,
    type?: T
  ): Promise<Entity | undefined>

  abstract getEntities(): AsyncGenerator<string>

  abstract getCollections(): AsyncGenerator<IdentityUUID>

  abstract getCollection(identity_id: IdentityUUID): AsyncGenerator<string>
}
