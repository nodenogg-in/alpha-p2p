import { Tool } from './tools'

export const INITIAL_ZOOM = 1
export const INITIAL_TRANSLATION = { x: 0, y: 0 }
export const MAX_ZOOM = 1.7
export const MIN_ZOOM = 0.3

export const ZOOM_INCREMENT = 0.1
export const PAN_INCREMENT = 50
export const PAN_TIME = 250

export const DEFAULT_TOOL = Tool.Select

export const DEFAULT_PATTERN = 'lines'
export const BACKGROUND_GRID_UNIT = 10
export const SNAP_GRID_UNIT = 1

export const MINIMUM_NODE_SIZE = {
  width: 100,
  height: 100
}

export const DEFAULT_NODE_SIZE = {
  width: 400,
  height: 300
}

export const DEFAULT_BOUNDS = {
  x: Infinity,
  y: Infinity
}

export const DEFAULT_SNAP_TO_GRID = false
