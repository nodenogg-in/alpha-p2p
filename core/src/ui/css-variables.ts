import type { HSLColor } from './colors'
import * as colors from './colors'

export const colorName = (name: string) => `--color-${name}`

export const setCSSColors = (
  colors: [string, HSLColor][],
  element: HTMLElement = document.body
) => {
  for (const [name, color] of colors) {
    element.style.setProperty(colorName(name), hsla(color, 1.0))
  }
}

export const setCSSVariables = () => {
  setCSSColors(Object.entries(colors))
}

export const getColorVar = (name?: string): string => `var(${colorName(name || 'neutral')})`

export const getColor = (name?: string, alpha?: number) => {
  const value = colors[(name || 'neutral') as colors.ColorName]
  return hsla(value, alpha)
}

export const hsla = (value: HSLColor, alpha: number = 1.0) =>
  `hsla(${value[0]}, ${value[1]}%, ${value[2]}%, ${alpha})`
