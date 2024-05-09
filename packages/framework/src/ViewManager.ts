import { NiceMap } from '@figureland/typekit/map'
import type { MicrocosmAPI, MicrocosmID } from '@nodenogg.in/microcosm'
import { createView, type View } from './create-view'
import { getPersistenceName, type App } from './create-app'

type ViewMap = NiceMap<string, View>

const createViewMap = (): ViewMap => new NiceMap<string, View>()

export class ViewManager {
  private views = new NiceMap<MicrocosmID, ViewMap>()

  public register = async <M extends MicrocosmAPI>(microcosm: M, app: App<M>, view_id: string) => {
    const collection = this.views.getOrSet(microcosm.config.microcosmID, createViewMap)

    return collection.getOrSet(view_id, () =>
      createView(microcosm, app, getPersistenceName([microcosm.config.microcosmID, view_id]))
    )
  }

  public remove = async (microcosmID: MicrocosmID, view_id: string) => {
    const collection = this.views.get(microcosmID)
    if (collection) {
      const target = collection.get(view_id)
      if (target) {
        target.dispose()
        collection.delete(view_id)
      }
    }
  }

  public dispose = () => {
    for (const viewCollection of this.views.values()) {
      Array.from(viewCollection.values()).forEach((v) => {
        v.dispose()
      })
    }
  }
}
