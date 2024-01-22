import type { Box, Size, Transform, Point } from '../types'
import { MAX_ZOOM, MIN_ZOOM } from '../constants'
import type { SpatialView } from '../stores/use-spatial-view'

export const calculateFitView = (dimensions: Box, bounds: Box) => {
  const { width, height } = dimensions
  const { x, y } = bounds
  const right = x + bounds.width
  const bottom = y + bounds.height

  const boundsWidth = right - x
  const boundsHeight = bottom - y

  if (!boundsWidth || !boundsHeight) return { x: null, y: null, scale: null }

  const centerX = x + boundsWidth / 2
  const centerY = y + boundsHeight / 2

  const scale = Math.min(width / boundsWidth, height / boundsHeight) * 0.8

  const viewportCenterX = width / 2
  const viewportCenterY = height / 2

  const translateX = viewportCenterX - centerX
  const translateY = viewportCenterY - centerY

  return {
    x: translateX * scale,
    y: translateY * scale,
    scale: scale
  }
}

export const calculateTranslation = (
  oldScale: number,
  newScale: number,
  currentTranslation: Point,
  pointerPoint: Point,
  dimensions: Box
) => {
  // Calculate the cursor position relative to the wrapper
  const pointerXRelativeToWrapper = pointerPoint.x - dimensions.x - dimensions.width / 2
  const pointerYRelativeToWrapper = pointerPoint.y - dimensions.y - dimensions.height / 2

  // Calculate the cursor position relative to the scaled content
  const pointerXRelativeToContent = (pointerXRelativeToWrapper - currentTranslation.x) / oldScale
  const pointerYRelativeToContent = (pointerYRelativeToWrapper - currentTranslation.y) / oldScale

  return {
    x: pointerXRelativeToWrapper - pointerXRelativeToContent * newScale,
    y: pointerYRelativeToWrapper - pointerYRelativeToContent * newScale
  }
}

export const calculateZoom = (scale: number, delta: number, zoomIncrement: number) => {
  const scaleAdjustment = delta * zoomIncrement
  const newScale = scale - scaleAdjustment

  return Number(Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, newScale)).toFixed(9))
}

export const zoomAndTranslate = (
  direction = 1,
  dimensions: Box,
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
        x: dimensions.width / 2 + dimensions.x,
        y: dimensions.height / 2 + dimensions.y
      },
      dimensions
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

export const transformBox = (box: Box, view: SpatialView): Box => {
  const { x, y } = transformPoint(box, view)

  const width = box.width / view.transform.scale
  const height = box.height / view.transform.scale

  return { x, y, width, height }
}

export const transformPoint = (point: Point, view: SpatialView): Point => {
  const originX = -view.dimensions.width / 2
  const originY = -view.dimensions.height / 2
  const p = normalise(point, view)
  const px = originX + p.x - view.transform.translate.x
  const py = originY + p.y - view.transform.translate.y
  let x = px / view.transform.scale
  let y = py / view.transform.scale
  x += originX + view.dimensions.width
  y += originY + view.dimensions.height

  return { x, y }
}

export const normalise = <T extends Box | Point>(point: T, view: SpatialView): T => ({
  ...point,
  x: point.x - view.dimensions.x,
  y: point.y - view.dimensions.y
})

export const fitAspectRatio = (
  item: Size,
  container: Size,
  padding: [number, number] = [0, 0]
): Size => {
  // Apply padding to container dimensions
  const containerWidth = container.width - 2 * padding[0]
  const containerHeight = container.height - 2 * padding[1]

  // Calculate the aspect ratio of the input dimensions
  const inputAspectRatio = item.width / item.height

  // Set output dimensions to input dimensions initially
  let outputWidth = item.width
  let outputHeight = item.height

  // Check if input dimensions exceed container dimensions in either dimension
  if (item.width > containerWidth || item.height > containerHeight) {
    // Calculate the maximum output dimensions that maintain the aspect ratio
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

export const createBoxFromDOMRect = (element: HTMLElement): Box => {
  const { top: y, left: x, width, height } = element.getBoundingClientRect()
  return { x, y, width, height }
}
