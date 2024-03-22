import type { PersistenceName, Signal } from '@nodenogg.in/state'
import type { MicrocosmAPI, Node_ID } from '@nodenogg.in/microcosm'
import { NiceMap, keys } from '@nodenogg.in/utils'
import { Instance } from '../Instance'

export type MicrocosmViews<API extends MicrocosmAPI> = Record<string, ViewFactory<API>>

export interface View<T extends string = string> {
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
  api: API,
  config: ViewConfig
) => Promise<V>

export type APISubscription = {
  node: (node_id: Node_ID) => Signal<Node>
  nodes: () => Signal<string[]>
}

export class ViewManager<M extends MicrocosmAPI, V extends MicrocosmViews<M>> {
  protected readonly microcosmViews = new NiceMap<string, Map<string, View>>()
  public readonly create = {} as {
    [K in keyof V]: (microcosm: M, id: string) => Promise<ReturnType<V[K]>>
  }
  public readonly types: (keyof V)[]
  constructor(
    private readonly v: V,
    public readonly defaultView: keyof V = keys(v)[0],
    public readonly persist?: boolean
  ) {
    this.types = keys(v) as (keyof V)[]
  }

  public register = async <K extends keyof V, R = ReturnType<V[K]>>(
    type: K,
    microcosm: M,
    id: string
  ): Promise<R> => {
    const collection = await this.microcosmViews.getOrSet(
      microcosm.microcosm_uri,
      () => new Map<string, View>()
    )

    if (collection.has(id)) {
      return collection.get(id) as R
    }

    const v = await this.v[type](microcosm, {
      id,
      persist: this.persist
        ? Instance.getPersistenceName([microcosm.microcosm_uri, String(type), id])
        : undefined
    })
    collection.set(id, v)
    return v as R
  }

  public remove = async (microcosm_uri: string, id: string) => {
    const collection = this.microcosmViews.get(microcosm_uri)
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
