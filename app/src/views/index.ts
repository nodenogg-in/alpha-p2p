import { SpatialView } from './spatial'
import { CollectView } from './collect'
import * as keys from './.'
// Helper to allow view names to be typed
export type ViewName = keyof typeof keys

// Views: this file should export Vue components which function
// as valid Microcosm 'views'.
export const spatial = SpatialView
export const collect = CollectView
