import { type Output, boolean, number, object } from 'valibot'
import {
  type Transform,
  backgroundPattern,
  boxSchema,
  defaultBox,
  defaultTransform,
  pointSchema,
  transformSchema
} from '../schema/spatial.schema'
import {
  BACKGROUND_GRID_UNIT,
  DEFAULT_BOUNDS,
  DEFAULT_PATTERN,
  DEFAULT_SNAP_TO_GRID
} from './constants'

export type PreviousState = {
  transform: Transform
  distance: number
}

export const canvasStateSchema = object({
  bounds: pointSchema,
  container: boxSchema,
  transform: transformSchema,
  background: backgroundPattern,
  previous: object({
    transform: transformSchema,
    distance: number()
  }),
  grid: number(),
  snapToGrid: boolean(),
  loaded: boolean()
})

export type CanvasState = Output<typeof canvasStateSchema>

export const defaultCanvasState = (): CanvasState => ({
  bounds: DEFAULT_BOUNDS,
  background: DEFAULT_PATTERN,
  transform: defaultTransform(),
  container: defaultBox(),
  snapToGrid: DEFAULT_SNAP_TO_GRID,
  grid: BACKGROUND_GRID_UNIT,
  previous: {
    transform: defaultTransform(),
    distance: 0
  },
  loaded: false
})
