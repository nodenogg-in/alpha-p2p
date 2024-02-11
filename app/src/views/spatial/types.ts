import { pointSchema } from '@/core/2d'
import { number, object, type Input } from 'valibot'

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
