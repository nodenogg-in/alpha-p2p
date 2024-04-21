import { type Vector2 } from '@figureland/mathkit/matrix2D'
import type { Box } from '@figureland/mathkit/box'

export type BoxReference<B extends Box = Box> = [string, B]

export const backgroundPattern = ['dots', 'lines', 'none'] as const

export type BackgroundPatternType = (typeof backgroundPattern)[number]

export type CanvasScreen<V extends Vector2> = {
  screen: V
  canvas: V
}

export type BoxUpdate = [string, Partial<Box>]
