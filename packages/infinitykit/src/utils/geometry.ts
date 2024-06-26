import { abs, round } from '@figureland/mathkit'
import { calculateBoundingBox } from './intersection'
import type { Size } from '@figureland/mathkit/size'
import type { Vector2 } from '@figureland/mathkit/vector2'
import type { Box } from '@figureland/mathkit/box'
import type { BoxReference, BoxUpdate } from '../schema/spatial.schema'

export const fitAspectRatio = (
  item: Size,
  container: Size,
  padding: [number, number] = [0, 0]
): Size => {
  // Apply padding to container container
  const containerWidth = container.width - 2 * padding[0]
  const containerHeight = container.height - 2 * padding[1]

  // Calculate the aspect ratio of the input container
  const inputAspectRatio = item.width / item.height

  // Set output container to input container initially
  let outputWidth = item.width
  let outputHeight = item.height

  // Check if input container exceed container container in either dimension
  if (item.width > containerWidth || item.height > containerHeight) {
    // Calculate the maximum output container that maintain the aspect ratio
    outputWidth = containerWidth
    outputHeight = round(outputWidth / inputAspectRatio)

    // Check if the output height is larger than the container height
    if (outputHeight > containerHeight) {
      outputHeight = containerHeight
      outputWidth = round(outputHeight * inputAspectRatio)
    }
  }

  return {
    width: outputWidth,
    height: outputHeight
  }
}

export const scalePoint = (pt: Vector2, scale: number): Vector2 => ({
  x: pt.x * scale,
  y: pt.y * scale
})

export const getBoxEdgeProximity = (
  pointer: Vector2,
  box: Box,
  proximity: number = 10
): BoxEdgeProximity => {
  const isNearTop = abs(pointer.y - box.y) < proximity
  const isNearLeft = abs(pointer.x - box.x) < proximity
  if (isNearTop && isNearLeft) return 'top-left'

  const isNearRight = abs(pointer.x - (box.x + box.width)) < proximity
  if (isNearTop && isNearRight) return 'top-right'

  const isNearBottom = abs(pointer.y - (box.y + box.height)) < proximity
  if (isNearBottom && isNearLeft) return 'bottom-left'
  if (isNearBottom && isNearRight) return 'bottom-right'

  if (isNearTop) return 'top'
  if (isNearLeft) return 'left'
  if (isNearRight) return 'right'
  if (isNearBottom) return 'bottom'

  return 'none'
}

export type BoxEdgeProximity =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'top-left'
  | 'top-right'
  | 'bottom-right'
  | 'bottom-left'
  | 'none'

export const resizeBoxes = <B extends BoxReference>(
  boxes: B[],
  edge: BoxEdgeProximity,
  delta: Vector2
): BoxUpdate[] => {
  // Calculate new dimensions of boundingBox
  const boundingBox = calculateBoundingBox(boxes)

  const newBoundingBox: Box = {
    ...boundingBox,
    width: boundingBox.width + delta.x,
    height: boundingBox.height + delta.y
  }

  // Determine scale factor for width and height

  // Adjust each box's dimensions and position based on the edge and scale factor
  return boxes.map(([id, box]) => {
    const scaledBox: Partial<B[1]> = {}
    const scaleX = newBoundingBox.width / box.width
    const scaleY = newBoundingBox.height / box.height

    // if (edge.includes([]))
    switch (edge) {
      case 'right':
        scaledBox.width = box.width * scaleX
        break
      case 'bottom':
        scaledBox.height = box.height * scaleY
        break
      case 'bottom-right':
        scaledBox.width = box.width * scaleX
        scaledBox.height = box.height * scaleY
        break
        // No change in position needed for these edges
        break
      case 'left':
        scaledBox.width = box.width * scaleX
        scaledBox.x = boundingBox.x + (box.x - boundingBox.x) * scaleX
        break
      case 'top':
        scaledBox.height = box.height * scaleY
        scaledBox.y = boundingBox.y + (box.y - boundingBox.y) * scaleY
        break
      case 'top-left':
        scaledBox.width = box.width * scaleX
        scaledBox.height = box.height * scaleY
        // Adjust position to maintain relative position in bounding box
        scaledBox.x = boundingBox.x + (box.x - boundingBox.x) * scaleX
        scaledBox.y = boundingBox.y + (box.y - boundingBox.y) * scaleY
        break
      case 'top-right':
        scaledBox.height = box.height * scaleY
        scaledBox.width = box.width * scaleX
        scaledBox.y = boundingBox.y + (box.y - boundingBox.y) * scaleY
        break
      case 'bottom-left':
        scaledBox.height = box.height * scaleY
        scaledBox.width = box.width * scaleX
        scaledBox.x = boundingBox.x + (box.x - boundingBox.x) * scaleX
        break
      case 'none':
        break
    }

    return [id, scaledBox]
  })
}

export const scaleToFitViewport = (container: Box, target: Box) => {
  const scaleX = container.width / target.width
  const scaleY = container.height / target.height
  return Math.min(scaleX, scaleY)
}
