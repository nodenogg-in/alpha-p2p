import type { MicrocosmAPI, MicrocosmID } from '@nodenogg.in/microcosm'
import { createView, type View } from './create-view'
import { getPersistenceName, type App } from './create-app'

type ViewMap = Map<string, View>

export class ViewStore {
  private views = new Map<MicrocosmID, ViewMap>()

  public register = async <M extends MicrocosmAPI>(microcosm: M, app: App<M>, view_id: string) => {
    if (!this.views.has(microcosm.microcosmUUID)) {
      this.views.set(microcosm.microcosmUUID, new Map<string, View>())
    }

    const collection = this.views.get(microcosm.microcosmUUID) as ViewMap

    const view =
      collection.get(view_id) ??
      createView(microcosm, app, getPersistenceName([microcosm.microcosmUUID, view_id]))

    collection.set(view_id, view)

    return view
  }

  public remove = async (microcosmUUID: MicrocosmID, view_id: string) => {
    const collection = this.views.get(microcosmUUID)
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
