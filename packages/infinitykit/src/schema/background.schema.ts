import { isString } from '@figureland/typekit/guards'

export const backgroundPatterns = ['dots', 'lines', 'none'] as const

export type BackgroundPatternType = (typeof backgroundPatterns)[number]

export const isBackgroundPatternType = (t: unknown): t is BackgroundPatternType =>
  isString(t) && backgroundPatterns.includes(t as BackgroundPatternType)
