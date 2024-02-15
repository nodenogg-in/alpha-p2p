import { max } from 'lib0/math'
import { lastInArray } from '../utils'
import { min } from './number'
import { isBox, type Box, type BoxReference, type Point, type Selection } from './schema'

const intersectBoxWithPoint = (point: Point, box: Box): boolean =>
  point.x >= box.x &&
  point.x <= box.x + box.width &&
  point.y >= box.y &&
  point.y <= box.y + box.height

export const calculateBoundingBox = (boxes: (Box | BoxReference)[]): Box => {
  if (boxes.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 }
  }

  let minX = Infinity
  let minY = Infinity
  let maxX = -Infinity
  let maxY = -Infinity

  for (const b of boxes) {
    const box = isBox(b) ? b : b[1]
    minX = min(minX, box.x)
    minY = min(minY, box.y)
    maxX = max(maxX, box.x + box.width)
    maxY = max(maxY, box.y + box.height)
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  }
}

export const intersectPoint = (point: Point, boxes: BoxReference[]): string[] =>
  boxes.filter((b) => intersectBoxWithPoint(point, b[1])).map(([id]) => id)

const isWithin = (box: Box, selectionBox: Box) => {
  const noOverlap =
    box.x + box.width < selectionBox.x ||
    box.x > selectionBox.x + selectionBox.width ||
    box.y + box.height < selectionBox.y ||
    box.y > selectionBox.y + selectionBox.height

  return !noOverlap
}

export const intersect = (boxes: BoxReference[], point: Point, box: Box): Selection => {
  const selected = boxes.filter((b) => isWithin(b[1], box))
  const group = calculateBoundingBox(selected)

  return {
    target: lastInArray(intersectPoint(point, boxes)),
    nodes: selected.map(([id]) => id),
    group
  }
}