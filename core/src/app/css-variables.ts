import type { Box } from '../schema'
import { translate } from '../spatial'

export const colorName = (name: string, type: number = 100) => `--card-${name}-${type}`

export const getCardColor = (type: number = 100, name: string = 'neutral'): string =>
  `var(${colorName(name, type)})`

export const getCardStyle = <T extends Box>(backgroundColor?: string, node?: T) => ({
  '--key-color-90': getCardColor(90, backgroundColor),
  '--key-color-50': getCardColor(50, backgroundColor),
  '--key-color-20': getCardColor(20, backgroundColor),
  ...(node && {
    transform: translate(node),
    width: `${node.width}px`,
    height: `${node.height}px`
  })
})
