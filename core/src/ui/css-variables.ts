export const colorName = (name: string, type: number = 100) => `--card-${name}-${type}`

export const getCardColor = (name?: string): string => `var(${colorName(name || 'neutral')})`
