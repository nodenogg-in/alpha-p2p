import type { ViewType } from '@nodenogg.in/core/schema'
import { defineAsyncComponent, type Component } from 'vue'

export const views: Record<ViewType, Component> = {
  spatial: defineAsyncComponent(() => import('./spatial/SpatialView.vue')),
  collect: defineAsyncComponent(() => import('./collect/CollectView.vue'))
}
