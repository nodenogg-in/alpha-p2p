import { NiceMap, keys } from '@nodenogg.in/utils'
import type { MicrocosmAPI } from '../../api/MicrocosmAPI'
import type { MicrocosmViews, View } from '../../views'
import { Instance } from '../Instance'

export class Views<M extends MicrocosmAPI, V extends MicrocosmViews<M>> {
  protected readonly microcosmViews = new NiceMap<string, NiceMap<string, View>>()
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
    const collection = this.microcosmViews.getOrSet(
      microcosm.microcosm_uri,
      () => new NiceMap<string, View>()
    )

    if (collection.has(id)) {
      return collection.get(id) as R
    }

    return collection.getOrSet(id, () =>
      this.v[type](microcosm, {
        id,
        persist: this.persist
          ? Instance.getPersistenceName([microcosm.microcosm_uri, String(type), id])
          : undefined
      })
    ) as R
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
