import { number, object, type Input } from 'valibot'

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

export const isBox = (box: Box | Point): box is Box => {
  return 'width' in box && 'height' in box
}

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

export type BoxSelection<T extends Box = Box> = {
  nodes: string[]
  group: T
}

export type IntersectionResult = {
  point: string | null
  selection: BoxSelection
}

export type BackgroundPatternType = 'dots' | 'lines' | 'none'

export const transformSchema = object({
  translate: pointSchema,
  scale: number()
})

export type Transform = Input<typeof transformSchema>

export const defaultTransform = (): Transform => ({
  translate: {
    x: 0,
    y: 0
  },
  scale: 1
})
