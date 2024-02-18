import type { ViewName } from 'nodenoggin-core/views'
import { defineAsyncComponent, type Component } from 'vue'

export const views: Record<ViewName, Component> = {
  spatial: defineAsyncComponent(() => import('./spatial/SpatialView.vue')),
  collect: defineAsyncComponent(() => import('./collect/CollectView.vue'))
}
