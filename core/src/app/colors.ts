export const cardColors = [
  'neutral',
  'red',
  'orange',
  'yellow',
  'green',
  'blue',
  'purple',
  'pink',
  'turquoise',
  'putty'
] as const

export type ColorName = (typeof cardColors)[number]
