import { CanvasOptions } from './Canvas'

export const DEFAULT_CANVAS_OPTIONS = {
  background: 'dots',
  bounds: {
    x: Infinity,
    y: Infinity
  },
  zoom: {
    min: 0.1,
    max: 2,
    increment: 0.1
  },
  snapToGrid: false,
  grid: 10
} satisfies CanvasOptions
