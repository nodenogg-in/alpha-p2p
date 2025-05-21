import { type State, state, store, map, events } from '@figureland/kit/state'
import type { Entity, EntityDataType, EntityPointer, IdentityUUID } from '@nodenogg.in/schema'

export type MicrocosmAPIConfig = {
  microcosmUUID: string
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

  public readonly microcosmUUID: string
  public readonly state: State<MicrocosmAPIState> = this.use(state(defaultAPIState))
  constructor(config: Config) {
    this.microcosmUUID = config.microcosmUUID
    this.store.use(() => {
      this.entities.instance().clear()
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

  abstract getEntity<T extends EntityDataType>(
    entity: EntityPointer,
    type?: T
  ): Promise<Entity | undefined>

  abstract getEntities(): AsyncGenerator<string>

  abstract getCollections(): AsyncGenerator<IdentityUUID>

  abstract getCollection(identity_id: IdentityUUID): AsyncGenerator<string>
}
