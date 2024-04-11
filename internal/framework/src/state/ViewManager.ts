import type { PersistenceName, Signal } from '@figureland/statekit'
import type { MicrocosmAPI, MicrocosmID, NodeID } from '@nodenogg.in/microcosm'
import { NiceMap, keys } from '@figureland/toolkit'
import { getPersistenceName } from '../create-app'
import { Session, Telemetry, UI } from '..'

export type MicrocosmViews = Record<string, ViewFactory>

export type View<T extends string = string> = {
  type: T
  id: string
  dispose: () => Promise<void>
  [key: string]: any
}

export type ViewConfig = {
  id: string
  persist?: PersistenceName
}

export type ViewFactory<API extends MicrocosmAPI = MicrocosmAPI, V extends View = View> = (
  options: ViewFactoryOptions<API>
) => Promise<V>

export type ViewFactoryOptions<API extends MicrocosmAPI> = {
  ui: UI
  session: Session
  api: API
  config: ViewConfig
}

export type APISubscription = {
  node: (NodeID: NodeID) => Signal<Node>
  nodes: () => Signal<string[]>
}

export class ViewManager<M extends MicrocosmAPI, V extends MicrocosmViews> {
  protected readonly microcosmViews = new NiceMap<MicrocosmID, Map<string, View>>()
  public readonly create = {} as {
    [K in keyof V]: (microcosm: M, view_id: string) => Promise<ReturnType<V[K]>>
  }
  public readonly types: (keyof V)[]
  constructor(
    private readonly v: V,
    private ui: UI,
    private session: Session,
    public readonly defaultView: keyof V = keys(v)[0],
    public readonly persist?: boolean
  ) {
    this.types = keys(v) as (keyof V)[]
  }

  public register = async <K extends keyof V, R = ReturnType<V[K]>>(
    type: K,
    api: M,
    id: string
  ): Promise<R> => {
    const collection = this.microcosmViews.getOrSet(api.microcosmID, () => new Map<string, View>())

    console.log('registering view', api.microcosmID, collection, collection.get(id))
    if (collection.has(id)) {
      return collection.get(id) as R
    }

    const view = await this.v[type]({
      api,
      session: this.session,
      ui: this.ui,
      config: {
        id,
        persist: this.persist ? getPersistenceName([api.microcosmID, String(type), id]) : undefined
      }
    })
    collection.set(id, view)
    return view as R
  }

  public remove = async (microcosmID: MicrocosmID, id: string) => {
    const collection = this.microcosmViews.get(microcosmID)
    if (collection) {
      const target = collection.get(id)
      if (target) {
        await target.dispose()
        collection.delete(id)
      }
    }
  }

  public dispose = async () => {
    for (const viewCollection of this.microcosmViews.values()) {
      for (const view of viewCollection.values()) {
        await view.dispose()
      }
    }
  }
}
