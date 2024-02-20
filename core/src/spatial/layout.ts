import { Box } from '../schema/spatial.schema'

const sortBoxes = <T extends Box>(items: T[], direction: LayoutDirection = 'x'): T[] => {
  const prop = direction === 'x' ? 'width' : 'height'
  return items.sort((a, b) => a[prop] - b[prop])
}

type LayoutDirection = 'x' | 'y'

type LayoutOptions = {
  direction?: LayoutDirection
  padding?: number
  sort?: boolean
}

export const layoutBoxes = <T extends Box>(
  boxes: T[],
  { direction = 'x', padding = 10, sort = false }: LayoutOptions
): T[] => {
  const result: T[] = []
  const side = direction === 'x' ? 'width' : 'height'
  let inc = boxes[0][direction]
  const alt = boxes[0][direction === 'x' ? 'y' : 'x']

  for (const box of boxes) {
    const newBox = { ...box }

    newBox[direction] = inc
    newBox[direction === 'x' ? 'y' : 'x'] = alt

    inc += newBox[side] + padding

    result.push(newBox)
  }

  if (sort) {
    return sortBoxes(result, direction)
  }

  return result
}
