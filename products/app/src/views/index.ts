import { defineAsyncComponent, type Component } from 'vue'
import SimpleView from './spatial/views/MicrocosmSpatialView.vue'
import MicrocosmListView from './spatial/views/MicrocosmListView.vue'

// Original view components
export const viewComponents: Record<string, Component> = {
  collect: defineAsyncComponent(() => import('./collect/CollectView.vue'))
}

// Registry of available view types
export const viewRegistry = {
  // Key is the view type identifier that will be used in the URL
  spatial: SimpleView,
  list: MicrocosmListView
}

// Type for the view parameter
export type ViewType = keyof typeof viewRegistry

// Default view type when none is specified
export const DEFAULT_VIEW: ViewType = 'list'

// Helper to get a view component by type
export const getViewComponent = (type?: string) => {
  if (type && type in viewRegistry) {
    return viewRegistry[type as ViewType]
  }
  return viewRegistry[DEFAULT_VIEW]
}
