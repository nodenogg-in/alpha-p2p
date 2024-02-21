import type { NewNode, Node, Box } from '../schema'
import type { CanvasState } from './state'
import { DEFAULT_NODE_SIZE } from './constants'
import { getViewCenter } from './interaction'

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

type NodeWithoutPosition<
  T extends Pick<Node<'html'>, 'content'> = { content: Node<'html'>['content'] }
> = T

export const assignNodePositions = (
  canvas: CanvasState,
  nodes: NodeWithoutPosition[] = []
): NewNode<'html'>[] => {
  const position = getViewCenter(canvas)

  const { width, height } = DEFAULT_NODE_SIZE

  const result: NewNode<'html'>[] = nodes.map(({ content }) => ({
    type: 'html',
    content,
    x: position.x - width / 2,
    y: position.y - height / 2,
    width,
    height
  }))

  return layoutBoxes(result, { direction: 'x' })
}
