import { number, object, type Input, intersect, picklist, type Output } from 'valibot'
import { isObject } from './utils'

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

export const isBox = (box: unknown): box is Box =>
  isObject(box) && 'width' in box && 'height' in box

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

export type BoxReference<T extends Box = Box> = [string, T]

export type Selection = {
  nodes: string[]
  target: string | null
}

export const backgroundPattern = picklist(['dots', 'lines', 'none'])

export type BackgroundPatternType = Output<typeof backgroundPattern>

export const transformSchema = object({
  translate: pointSchema,
  scale: number()
})

export type Transform = Input<typeof transformSchema>

export const defaultTransform = (): Transform => ({
  translate: defaultVec2(),
  scale: 1
})

export type CanvasScreen<T extends Vec2> = {
  screen: T
  canvas: T
}
