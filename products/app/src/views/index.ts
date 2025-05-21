import { freeze } from '@figureland/kit/tools/object'
import { defineAsyncComponent, type Component } from 'vue'

export const viewRegistry = freeze({
  spatial: defineAsyncComponent(() => import('./spatial/MicrocosmSpatialView.vue')),
  list: defineAsyncComponent(() => import('./list/MicrocosmListView.vue'))
})

export type ViewType = keyof typeof viewRegistry

export const DEFAULT_VIEW: ViewType = 'list'

export const getViewComponent = (type?: string) => {
  if (type && type in viewRegistry) {
    return viewRegistry[type as ViewType]
  }
  return viewRegistry[DEFAULT_VIEW]
}
