import type { Box, Size, Transform, Point } from './schema'
import { MAX_ZOOM, MIN_ZOOM } from './constants'

export const calculateTranslation = (
  oldScale: number,
  newScale: number,
  currentTranslation: Point,
  pointerPoint: Point,
  container: Box
) => {
  const containerX = pointerPoint.x - container.x - container.width / 2
  const containerY = pointerPoint.y - container.y - container.height / 2

  const contentX = (containerX - currentTranslation.x) / oldScale
  const contentY = (containerY - currentTranslation.y) / oldScale

  return {
    x: containerX - contentX * newScale,
    y: containerY - contentY * newScale
  }
}

export const calculateZoom = (scale: number, delta: number, zoomIncrement: number) => {
  const scaleAdjustment = delta * zoomIncrement
  const newScale = scale - scaleAdjustment

  return Number(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newScale)).toFixed(9))
}

export const zoomAndTranslate = (
  direction = 1,
  container: Box,
  transform: Transform,
  increment = 0.1
): Transform => {
  const scale = calculateZoom(transform.scale, direction, increment)
  return {
    scale,
    translate: calculateTranslation(
      transform.scale,
      scale,
      transform.translate,
      {
        x: container.width / 2 + container.x,
        y: container.height / 2 + container.y
      },
      container
    )
  }
}

export const getTouchDistance = (touch1: Touch, touch2: Touch) => {
  const dx = touch1.clientX - touch2.clientX
  const dy = touch1.clientY - touch2.clientY
  return Math.sqrt(dx * dx + dy * dy)
}

export const getSelectionBox = (origin: Point, delta: Point) => ({
  x: delta.x < 0 ? origin.x + delta.x : origin.x,
  y: delta.y < 0 ? origin.y + delta.y : origin.y,
  width: Math.abs(delta.x),
  height: Math.abs(delta.y)
})

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
    outputHeight = Math.round(outputWidth / inputAspectRatio)

    // Check if the output height is larger than the container height
    if (outputHeight > containerHeight) {
      outputHeight = containerHeight
      outputWidth = Math.round(outputHeight * inputAspectRatio)
    }
  }

  return {
    width: outputWidth,
    height: outputHeight
  }
}
