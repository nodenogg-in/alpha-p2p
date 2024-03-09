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

export const colorName = (name: ColorName | string, type: number = 100) => `--card-${name}-${type}`

export const getCardColor = (type: number = 100, name: string | ColorName = 'neutral'): string =>
  `var(${colorName(name, type)})`
