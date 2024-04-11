import { lastInArray } from '@figureland/toolkit'
import { min, max } from '@figureland/mathkit'
import { isBox, type Box, type BoxReference, type Vec2 } from '..'

export const intersectBoxWithPoint = (point: Vec2, box: Box, padding: number = 0): boolean =>
  point.x >= box.x - padding &&
  point.x <= box.x + box.width + padding &&
  point.y >= box.y - padding &&
  point.y <= box.y + box.height + padding

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

export const intersectBoxWithBox = (box: Box, selectionBox: Box, padding: number = 0) =>
  !(
    box.x + box.width + padding < selectionBox.x ||
    box.x - padding > selectionBox.x + selectionBox.width ||
    box.y + box.height + padding < selectionBox.y ||
    box.y - padding > selectionBox.y + selectionBox.height
  )

export const getCanvasSelection = (
  boxes: BoxReference[],
  box: Box,
  padding: number = 0
): string[] => {
  const selected = boxes.filter((b) => intersectBoxWithBox(b[1], box, padding))
  return selected.map(([id]) => id)
}

export const getCanvasPoint = (
  boxes: BoxReference[],
  point: Vec2,
  padding: number = 0
): string | null =>
  lastInArray(boxes.filter((b) => intersectBoxWithPoint(point, b[1], padding)).map(([id]) => id))
