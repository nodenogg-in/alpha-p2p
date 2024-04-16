import { number, object, intersect, picklist, type Output, any } from 'valibot'
import { type Vector2 } from '@figureland/mathkit/matrix2D'
import type { Box } from '@figureland/mathkit/box'

export const sizeSchema = object({
  width: number(),
  height: number()
})

export const pointSchema = object({
  x: number(),
  y: number()
})

export const boxSchema = intersect([pointSchema, sizeSchema])

export const transformSchema = any()

export type BoxReference<B extends Box = Box> = [string, B]

export const backgroundPattern = picklist(['dots', 'lines', 'none'])

export type BackgroundPatternType = Output<typeof backgroundPattern>

export type CanvasScreen<V extends Vector2> = {
  screen: V
  canvas: V
}

export type BoxUpdate = [string, Partial<Box>]
