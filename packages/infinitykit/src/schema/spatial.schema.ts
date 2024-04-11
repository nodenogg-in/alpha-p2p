import {
  number,
  object,
  type Input,
  intersect,
  picklist,
  type Output,
  is,
  any,
  array
} from 'valibot'
import { Matrix2D, matrix2D } from '@figureland/mathkit/Matrix2D'

export const sizeSchema = object({
  width: number(),
  height: number()
})

export type Size = Input<typeof sizeSchema>

export const pointSchema = object({
  x: number(),
  y: number()
})

export type Vec2 = Input<typeof pointSchema>

export type Box = Vec2 & Size

export const boxSchema = intersect([pointSchema, sizeSchema])

export const isBox = (box: unknown): box is Box => is(boxSchema, box)

export const defaultSize = (): Size => ({
  width: 0,
  height: 0
})

export const defaultBox = (): Box => ({
  x: 0,
  y: 0,
  width: 0,
  height: 0
})

export const defaultVec2 = (): Vec2 => ({
  x: 0,
  y: 0
})

export type BoxReference<B extends Box = Box> = [string, B]

export const backgroundPattern = picklist(['dots', 'lines', 'none'])

export type BackgroundPatternType = Output<typeof backgroundPattern>

export const defaultTransform = (): Transform => matrix2D()

export const transformSchema = any()

export type Transform = Matrix2D

export type CanvasScreen<V extends Vec2> = {
  screen: V
  canvas: V
}

export type BoxUpdate = [string, Partial<Box>]
