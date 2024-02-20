import type { ViewName } from 'nodenoggin/schema'
import { defineAsyncComponent, type Component } from 'vue'

export const views: Record<ViewName, Component> = {
  spatial: defineAsyncComponent(() => import('./spatial/SpatialView.vue')),
  collect: defineAsyncComponent(() => import('./collect/CollectView.vue'))
}
