import { NiceMap } from '@figureland/typekit'
import type { MicrocosmAPI, MicrocosmID } from '@nodenogg.in/microcosm'
import { createView, type View } from './create-view'
import { App, getPersistenceName } from './create-app'

export const createViewManager = () => {
  const microcosmViews = new NiceMap<MicrocosmID, Map<string, View>>()

  const register = async <M extends MicrocosmAPI>(microcosm: M, app: App<M>, view_id: string) => {
    const collection = microcosmViews.getOrSet(microcosm.microcosmID, () => new Map<string, View>())

    if (collection.has(view_id)) {
      return collection.get(view_id) as View
    }
    const view = createView(microcosm, app, getPersistenceName([microcosm.microcosmID, view_id]))
    collection.set(view_id, view)
    return view
  }

  const remove = async (microcosmID: MicrocosmID, view_id: string) => {
    const collection = microcosmViews.get(microcosmID)
    if (collection) {
      const target = collection.get(view_id)
      if (target) {
        await target.dispose()
        collection.delete(view_id)
      }
    }
  }

  const dispose = async () => {
    console.log('disposing views')
    for (const viewCollection of microcosmViews.values()) {
      console.log(viewCollection)
      console.log('-----')
      Array.from(viewCollection.values()).forEach((v) => {
        v.dispose()
      })
    }
  }

  return {
    dispose,
    register,
    remove
  }
}

export type ViewManager = {
  dispose: () => Promise<void>
  remove: (microcosmID: MicrocosmID, view_id: string) => Promise<void>
  register: <M extends MicrocosmAPI>(microcosm: M, app: App<M>, view_id: string) => Promise<View>
}
