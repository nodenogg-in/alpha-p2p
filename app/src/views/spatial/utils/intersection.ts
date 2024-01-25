import type { Box, Point } from '@/views/spatial'
interface BoxLike extends Box {}

export type BoxReference = [string, BoxLike]

const intersect = (point: Point, box: Box): boolean =>
  point.x >= box.x &&
  point.x <= box.x + box.width &&
  point.y >= box.y &&
  point.y <= box.y + box.height

export const calculateBoundingBox = (boxes: BoxReference[]): Box => {
  if (boxes.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 }
  }

  let minX = Number.MAX_VALUE
  let minY = Number.MAX_VALUE
  let maxX = Number.MIN_VALUE
  let maxY = Number.MIN_VALUE

  boxes.forEach(([, box]) => {
    minX = Math.min(minX, box.x)
    minY = Math.min(minY, box.y)
    maxX = Math.max(maxX, box.x + box.width)
    maxY = Math.max(maxY, box.y + box.height)
  })

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  }
}

export const intersectPoint = (point: Point, boxes: BoxReference[]): string[] =>
  boxes.filter((b) => intersect(point, b[1])).map(([id]) => id)

export type NodeSelection = {
  nodes: string[]
  boundingBox: Box
}

export const intersectBox = (
  selectionBox: Box,
  boxes: BoxReference[],
  overlapRatio: number = 1
): NodeSelection => {
  const isWithin = ([, box]: BoxReference) => {
    const overlapX = Math.max(
      0,
      Math.min(box.x + box.width, selectionBox.x + selectionBox.width) -
        Math.max(box.x, selectionBox.x)
    )
    const overlapY = Math.max(
      0,
      Math.min(box.y + box.height, selectionBox.y + selectionBox.height) -
        Math.max(box.y, selectionBox.y)
    )
    const overlapArea = overlapX * overlapY
    const boxArea = box.width * box.height
    return overlapArea >= boxArea * overlapRatio
  }

  const selected = boxes.filter(isWithin)
  const boundingBox = calculateBoundingBox(selected)

  return {
    nodes: selected.map(([id]) => id),
    boundingBox
  }
}
