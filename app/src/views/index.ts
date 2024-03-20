import { defineAsyncComponent, type Component } from 'vue'

export const viewComponents: Record<string, Component> = {
  spatial: defineAsyncComponent(() => import('./spatial/SpatialView.vue')),
  collect: defineAsyncComponent(() => import('./collect/CollectView.vue'))
}
