import type { CanvasInteractionState } from './CanvasInteraction'
import { abs, clamp, dp, max, min, round, sign, sqrt } from '@nodenogg.in/utils'
import { type Box, type Vec2, type Transform, isBox } from '..'

export const zoomAndTranslate = (
  canvas: CanvasInteractionState,
  direction = 1,
  increment = canvas.zoom.increment
): Transform => {
  const scale = getZoom(canvas, direction, increment)
  return {
    scale,
    translate: getTranslation(canvas, scale, {
      x: canvas.viewport.width / 2 + canvas.viewport.x,
      y: canvas.viewport.height / 2 + canvas.viewport.y
    })
  }
}

export const getTouchDistance = (touch1: Touch, touch2: Touch) => {
  const dx = touch1.clientX - touch2.clientX
  const dy = touch1.clientY - touch2.clientY
  return sqrt(dx * dx + dy * dy)
}

export const getSelectionBox = (origin: Vec2, point: Vec2) => {
  const x = point.x > origin.x ? origin.x : point.x
  const y = point.y > origin.y ? origin.y : point.y

  const width = point.x > origin.x ? point.x - origin.x : origin.x - point.x
  const height = point.y > origin.y ? point.y - origin.y : origin.y - point.y

  return {
    x,
    y,
    width,
    height
  }
}

export const getTranslation = (canvas: CanvasInteractionState, newScale: number, point: Vec2) => {
  const containerX = point.x - canvas.viewport.x - canvas.viewport.width / 2
  const containerY = point.y - canvas.viewport.y - canvas.viewport.height / 2

  const contentX = (containerX - canvas.transform.translate.x) / canvas.transform.scale
  const contentY = (containerY - canvas.transform.translate.y) / canvas.transform.scale

  return {
    x: containerX - contentX * newScale,
    y: containerY - contentY * newScale
  }
}

export const snapToGrid = (canvas: CanvasInteractionState, value: number) => {
  const grid = canvas.snapToGrid ? canvas.grid : 1
  return round(value / grid) * grid
}

export const getZoom = (
  canvas: CanvasInteractionState,
  delta: number,
  zoomIncrement: number,
  decimal: number = 4
) => {
  const newScale = canvas.transform.scale - delta * zoomIncrement
  return dp(clamp(newScale, canvas.zoom.min, canvas.zoom.max), decimal)
}

export const relativeToContainer = <T extends Box | Vec2>(
  canvas: CanvasInteractionState,
  point: T
): T => ({
  ...point,
  x: point.x - canvas.viewport.x,
  y: point.y - canvas.viewport.y
})

export const screenToCanvas = <T extends Vec2>(
  canvas: CanvasInteractionState,
  box: T
): T extends Box ? Box : Vec2 => {
  const originX = -canvas.viewport.width / 2
  const originY = -canvas.viewport.height / 2

  const p = relativeToContainer(canvas, box)

  const px = originX + p.x - canvas.transform.translate.x
  const py = originY + p.y - canvas.transform.translate.y

  let x = px / canvas.transform.scale
  let y = py / canvas.transform.scale

  x += canvas.viewport.width / 2
  y += canvas.viewport.height / 2

  if (isBox(box)) {
    const width = box.width / canvas.transform.scale
    const height = box.height / canvas.transform.scale
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
  canvas: CanvasInteractionState,
  box: T,
  scaled: boolean = true
): T extends Box ? Box : Vec2 => {
  // Move origin to center of canvas
  let x = box.x - canvas.viewport.width / 2
  let y = box.y - canvas.viewport.height / 2

  // Apply scale
  x *= canvas.transform.scale
  y *= canvas.transform.scale

  // Apply translation
  x += canvas.transform.translate.x
  y += canvas.transform.translate.y

  // Adjust origin back to the top-left corner of the container
  x = x + canvas.viewport.width / 2
  y = y + canvas.viewport.height / 2

  if (isBox(box)) {
    // Apply scale to container
    const width = box.width * (scaled ? canvas.transform.scale : 1.0)
    const height = box.height * (scaled ? canvas.transform.scale : 1.0)
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

const getTransform = (
  canvas: CanvasInteractionState,
  newTransform: Partial<Transform> = {}
): Transform => {
  const x = newTransform.translate?.x || canvas.transform.translate.x
  const y = newTransform.translate?.y || canvas.transform.translate.y
  const scale = newTransform.scale || canvas.transform.scale

  const maxX = max(0, (canvas.bounds.x * scale - canvas.viewport.width) / 2)
  const maxY = max(0, (canvas.bounds.y * scale - canvas.viewport.height) / 2)

  return {
    translate: {
      x: clamp(x, -maxX, maxX),
      y: clamp(y, -maxY, maxY)
    },
    scale: scale
  }
}

export const zoom = (canvas: CanvasInteractionState, newScale: number): Transform =>
  getTransform(canvas, {
    scale: newScale,
    translate: getTranslation(canvas, newScale, {
      x: canvas.viewport.width / 2,
      y: canvas.viewport.height / 2
    })
  })

export const pinch = (canvas: CanvasInteractionState, newDistance: number): Transform =>
  getTransform(canvas, {
    scale: canvas.previous.transform.scale * (newDistance / canvas.previous.distance)
  })

export const move = (canvas: CanvasInteractionState, delta: Vec2): Transform =>
  getTransform(canvas, {
    translate: {
      x: canvas.transform.translate.x + delta.x,
      y: canvas.transform.translate.y + delta.y
    }
  })

export const pan = (canvas: CanvasInteractionState, delta: Vec2): Transform =>
  getTransform(canvas, {
    translate: {
      x: canvas.transform.translate.x - delta.x,
      y: canvas.transform.translate.y - delta.y
    }
  })

export const scroll = (
  canvas: CanvasInteractionState,
  point: Vec2,
  delta: Vec2,
  multiplier: number = 1
): Transform => {
  if (
    (canvas.transform.scale >= canvas.zoom.max && delta.y < 0) ||
    (canvas.transform.scale <= canvas.zoom.min && delta.y > 0)
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

export const getViewCenter = (canvas: CanvasInteractionState) =>
  screenToCanvas(canvas, {
    x: canvas.viewport.x + canvas.viewport.width / 2,
    y: canvas.viewport.y + canvas.viewport.height / 2
  })

export const centerViewAroundBox = (canvas: CanvasInteractionState, box: Box) =>
  getTransform(canvas, {
    translate: getTranslation(canvas, canvas.transform.scale, {
      x: box.x + box.width / 2,
      y: box.y + box.height / 2
    })
  })

export const center = (canvas: CanvasInteractionState) =>
  getTransform(canvas, {
    translate: getTranslation(canvas, canvas.transform.scale, {
      x: canvas.viewport.width / 2,
      y: canvas.viewport.height / 2
    })
  })
