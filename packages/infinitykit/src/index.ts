export * from './constants'
export { staticCanvasStyle, getCanvasStyle, boxStyle, getGridSVGPattern } from './utils/style'
export * from './tools'
export * from './utils/layout'
export type * from './Canvas'
export type * from './_old/Actions'
export * from './utils/geometry'
export {
  backgroundPatterns,
  type BackgroundPatternType,
  isBackgroundPatternType
} from './schema/background.schema'

export { CanvasQuery, initializeCanvasQuery } from './query/CanvasQuery'
export type * from './query/query-api'
export { Canvas } from './Canvas'
export { Actions } from './_old/Actions'
export {
  type CanvasInteractionHandler,
  createInteractionHandler,
  attachHandler
} from './interaction-handler'
