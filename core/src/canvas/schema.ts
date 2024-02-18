import { number, object, type Input, intersect, picklist, Output } from 'valibot'
import { isObject } from '../utils'

export const sizeSchema = object({
  width: number(),
  height: number()
})

export type Size = Input<typeof sizeSchema>

export const pointSchema = object({
  x: number(),
  y: number()
})

export type Point = Input<typeof pointSchema>

export type Box = Point & Size

export type Highlight = {
  point: Point
  box: Box
}

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

export const defaultPoint = (): Point => ({
  x: 0,
  y: 0
})

export type BoxReference<T extends Box = Box> = [string, T]

export type Selection<T extends Box = Box> = {
  nodes: string[]
  group: T
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
  translate: defaultPoint(),
  scale: 1
})
