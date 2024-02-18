import { defineAsyncComponent } from 'vue'
import * as keys from './.'

// Helper to allow view names to be typed
export type ViewName = keyof typeof keys

// Views: this file should export Vue components which function as valid Microcosm 'views'.
export const spatial = defineAsyncComponent(() => import('./spatial/SpatialView.vue'))
export const collect = defineAsyncComponent(() => import('./collect/CollectView.vue'))
