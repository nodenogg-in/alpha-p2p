import type { CanvasState } from './state'
import { type Box, type Vec2, type Transform, isBox } from '../schema/spatial.schema'
import { MAX_ZOOM, MIN_ZOOM } from './constants'
import { abs, clamp, dp, max, min, round, sign, sqrt } from '../utils/number'

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

export const getSelectionBox = (origin: Vec2, delta: Vec2) => ({
  x: delta.x < 0 ? origin.x + delta.x : origin.x,
  y: delta.y < 0 ? origin.y + delta.y : origin.y,
  width: abs(delta.x),
  height: abs(delta.y)
})

export const getTranslation = (canvas: CanvasState, newScale: number, point: Vec2) => {
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

export const normalise = <T extends Box | Vec2>(canvas: CanvasState, point: T): T => ({
  ...point,
  x: point.x - canvas.container.x,
  y: point.y - canvas.container.y
})

export const screenToCanvas = <T extends Vec2>(
  canvas: CanvasState,
  data: T
): T extends Box ? Box : Vec2 => {
  const { transform, container } = canvas
  const originX = -container.width / 2
  const originY = -container.height / 2

  const p = normalise(canvas, data)

  const px = originX + p.x - transform.translate.x
  const py = originY + p.y - transform.translate.y

  let x = px / transform.scale
  let y = py / transform.scale

  x += container.width / 2
  y += container.height / 2

  x = snapToGrid(canvas, x)
  y = snapToGrid(canvas, y)

  if (isBox(data)) {
    const width = snapToGrid(canvas, data.width / transform.scale)
    const height = snapToGrid(canvas, data.height / transform.scale)
    return {
      x,
      y,
      width,
      height
    } as T extends Box ? Box : Vec2
  } else {
    return {
      x,
      y
    } as T extends Box ? Box : Vec2
  }
}

export const canvasToScreen = <T extends Vec2>(
  canvas: CanvasState,
  data: T,
  scaled: boolean = true
): T extends Box ? Box : Vec2 => {
  const { container, transform } = canvas

  // Move origin to center of canvas
  let x = data.x - container.width / 2
  let y = data.y - container.height / 2

  // Apply scale
  x *= transform.scale
  y *= transform.scale

  // Apply translation
  x += transform.translate.x
  y += transform.translate.y

  // Adjust origin back to the top-left corner of the container
  x = x + container.width / 2
  y = y + container.height / 2

  if (isBox(data)) {
    // Apply scale to container
    const width = data.width * (scaled ? transform.scale : 1.0)
    const height = data.height * (scaled ? transform.scale : 1.0)
    return {
      x,
      y,
      width,
      height
    } as T extends Box ? Box : Vec2
  } else {
    return {
      x,
      y
    } as T extends Box ? Box : Vec2
  }
}

const getTransform = (canvas: CanvasState, newTransform: Partial<Transform> = {}): Transform => {
  const x = newTransform.translate?.x || canvas.transform.translate.x
  const y = newTransform.translate?.y || canvas.transform.translate.y
  const scale = newTransform.scale || canvas.transform.scale

  const maxX = max(0, (canvas.bounds.x * scale - canvas.container.width) / 2)
  const maxY = max(0, (canvas.bounds.y * scale - canvas.container.height) / 2)

  return {
    translate: {
      x: clamp(x, -maxX, maxX),
      y: clamp(y, -maxY, maxY)
    },
    scale: scale
  }
}

export const zoom = (canvas: CanvasState, newScale: number): Transform =>
  getTransform(canvas, {
    scale: newScale,
    translate: getTranslation(canvas, newScale, {
      x: canvas.container.width / 2,
      y: canvas.container.height / 2
    })
  })

export const pinch = (canvas: CanvasState, newDistance: number): Transform =>
  getTransform(canvas, {
    scale: canvas.previous.transform.scale * (newDistance / canvas.previous.distance)
  })

export const move = (canvas: CanvasState, delta: Vec2): Transform =>
  getTransform(canvas, {
    translate: {
      x: canvas.previous.transform.translate.x + delta.x,
      y: canvas.previous.transform.translate.y + delta.y
    }
  })

export const pan = (canvas: CanvasState, delta: Vec2): Transform =>
  getTransform(canvas, {
    translate: {
      x: canvas.transform.translate.x - delta.x,
      y: canvas.transform.translate.y - delta.y
    }
  })

export const scroll = (
  canvas: CanvasState,
  point: Vec2,
  delta: Vec2,
  multiplier: number = 1
): Transform => {
  if (
    (canvas.transform.scale >= MAX_ZOOM && delta.y < 0) ||
    (canvas.transform.scale <= MIN_ZOOM && delta.y > 0)
  ) {
    return canvas.transform
  }
  const scrollAdjustment = min(0.009 * multiplier * abs(delta.y), 0.08)
  const scale = getZoom(canvas, sign(delta.y), scrollAdjustment)

  return getTransform(canvas, {
    scale,
    translate: getTranslation(canvas, scale, point)
  })
}

export const getViewCenter = (canvas: CanvasState) =>
  screenToCanvas(canvas, {
    x: canvas.container.x + canvas.container.width / 2,
    y: canvas.container.y + canvas.container.height / 2
  })

export const centerViewAroundBox = (canvas: CanvasState, box: Box) =>
  getTransform(canvas, {
    translate: getTranslation(canvas, canvas.transform.scale, {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    })
  })