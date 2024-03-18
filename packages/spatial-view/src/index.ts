import type { PersistenceName } from '@nodenogg.in/state'
import type { CanvasAPI } from './api'
import { Canvas } from '.'

export * from './constants'
export * from './style'
export * from './tools'
export * from './minimap'
export * from './layout'
export * from './Canvas'
export type * from './CanvasInteraction'
export type * from './CanvasActions'
export * from './interaction'
export * from './intersection'
export * from './geometry'
export * from './schema'
export * from './pointer.schema'
export type * from './canvas-styles'
export type { CanvasAPI, EditableCanvasAPI } from './api'
export const createCanvasView = <API extends CanvasAPI>(config: {
  id: string
  api: API
  persist?: PersistenceName
}) => new Canvas(config.api, config.id, config.persist)
