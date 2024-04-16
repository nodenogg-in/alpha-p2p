import type { Box } from '@figureland/mathkit/box'
import type { Size } from '@figureland/mathkit/size'
import type { Vector2 } from '@figureland/mathkit/vector2'

const sortBoxes = (items: Box[], direction: LayoutDirection = 'x'): Box[] => {
  const prop = direction === 'x' ? 'width' : 'height'
  return items.sort((a, b) => a[prop] - b[prop])
}

type LayoutDirection = 'x' | 'y'

type LayoutOptions = {
  direction?: LayoutDirection
  padding?: number
  sort?: boolean
}

export const layoutBoxes = (
  boxes: Box[],
  { direction = 'x', padding = 10, sort = false }: LayoutOptions
): Box[] => {
  if (boxes.length === 0) return []
  const result: Box[] = []
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

export const generateBoxPositions = <InputBox extends Partial<Box>>(
  position: Vector2,
  defaultSize: Size,
  boxes: InputBox[]
): Box[] => {
  const positioned: Box[] = []
  const unpositioned: Box[] = []

  boxes.forEach((box) => {
    const isPositioned = 'x' in box && 'y' in box

    const width = box?.width || defaultSize.width
    const height = box?.height || defaultSize.height
    const x = isPositioned && box?.x ? box.x : position.x - width / 2
    const y = isPositioned && box?.y ? box.y : position.y - height / 2

    const result = { x, y, width, height }
    if (isPositioned) {
      positioned.push(result)
    } else {
      unpositioned.push(result)
    }
  })

  return [...positioned, ...layoutBoxes(unpositioned, { direction: 'x' })]
}
