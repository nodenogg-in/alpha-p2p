import type { Size, Transform, Point } from './schema'
import { MAX_ZOOM, MIN_ZOOM } from './constants'
import { CanvasState } from './interaction'
import { abs, clamp, dp, round, sqrt } from './number'

export const getTranslation = (canvas: CanvasState, newScale: number, point: Point) => {
  const containerX = point.x - canvas.container.x - canvas.container.width / 2
  const containerY = point.y - canvas.container.y - canvas.container.height / 2

  const contentX = (containerX - canvas.transform.translate.x) / canvas.transform.scale
  const contentY = (containerY - canvas.transform.translate.y) / canvas.transform.scale

  return {
    x: containerX - contentX * newScale,
    y: containerY - contentY * newScale
  }
}

export const snapToGrid = (canvas: CanvasState, value: number) => {
  const grid = canvas.snapToGrid ? canvas.grid : 1
  return round(value / grid) * grid
}

export const getZoom = (
  canvas: CanvasState,
  delta: number,
  zoomIncrement: number,
  decimal: number = 4
) => {
  const scaleAdjustment = delta * zoomIncrement
  const newScale = canvas.transform.scale - scaleAdjustment

  return dp(clamp(newScale, MIN_ZOOM, MAX_ZOOM), decimal)
}

export const zoomAndTranslate = (
  canvas: CanvasState,
  direction = 1,
  increment = 0.1
): Transform => {
  const scale = getZoom(canvas, direction, increment)
  return {
    scale,
    translate: getTranslation(canvas, scale, {
      x: canvas.container.width / 2 + canvas.container.x,
      y: canvas.container.height / 2 + canvas.container.y
    })
  }
}

export const getTouchDistance = (touch1: Touch, touch2: Touch) => {
  const dx = touch1.clientX - touch2.clientX
  const dy = touch1.clientY - touch2.clientY
  return sqrt(dx * dx + dy * dy)
}

export const getSelectionBox = (origin: Point, delta: Point) => ({
  x: delta.x < 0 ? origin.x + delta.x : origin.x,
  y: delta.y < 0 ? origin.y + delta.y : origin.y,
  width: abs(delta.x),
  height: abs(delta.y)
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
