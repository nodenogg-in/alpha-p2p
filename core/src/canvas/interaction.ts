import { Output, boolean, number, object } from 'valibot'
import { BACKGROUND_GRID_UNIT, MAX_ZOOM, MIN_ZOOM } from './constants'
import { getTranslation, getZoom, snapToGrid } from './geometry'
import { abs, clamp, max, sign } from './number'
import {
  type Box,
  type Point,
  type Transform,
  defaultBox,
  defaultTransform,
  isBox,
  boxSchema,
  transformSchema,
  backgroundPattern,
  pointSchema
} from './schema'
import { min } from 'lib0/math'

export type PreviousState = {
  transform: Transform
  distance: number
}

export const canvasStateSchema = object({
  bounds: pointSchema,
  container: boxSchema,
  transform: transformSchema,
  background: backgroundPattern,
  previous: object({
    transform: transformSchema,
    distance: number()
  }),
  grid: number(),
  snapToGrid: boolean(),
  loaded: boolean()
})

export type CanvasState = Output<typeof canvasStateSchema>

export const defaultCanvasState = (): CanvasState => ({
  bounds: {
    x: Infinity,
    y: Infinity
  },
  background: 'lines',
  transform: defaultTransform(),
  container: defaultBox(),
  snapToGrid: false,
  grid: BACKGROUND_GRID_UNIT,
  previous: {
    transform: defaultTransform(),
    distance: 0
  },
  loaded: false
})

const normalise = <T extends Box | Point>(canvas: CanvasState, point: T): T => ({
  ...point,
  x: point.x - canvas.container.x,
  y: point.y - canvas.container.y
})

const screenToCanvas = <T extends Point>(
  canvas: CanvasState,
  data: T
): T extends Box ? Box : Point => {
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
    } as T extends Box ? Box : Point
  } else {
    return {
      x,
      y
    } as T extends Box ? Box : Point
  }
}

const canvasToScreen = <T extends Point>(
  canvas: CanvasState,
  data: T,
  scaled: boolean = true
): T extends Box ? Box : Point => {
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
    } as T extends Box ? Box : Point
  } else {
    return {
      x,
      y
    } as T extends Box ? Box : Point
  }
}

const getTransform = (canvas: CanvasState, newTransform: Partial<Transform> = {}): Transform => {
  const { transform } = canvas
  const x = newTransform.translate?.x || transform.translate.x
  const y = newTransform.translate?.y || transform.translate.y
  const scale = newTransform.scale || transform.scale

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

const zoom = (canvas: CanvasState, newScale: number): Transform =>
  getTransform(canvas, {
    scale: newScale,
    translate: getTranslation(canvas, newScale, {
      x: canvas.container.width / 2,
      y: canvas.container.height / 2
    })
  })

const pinch = (canvas: CanvasState, newDistance: number): Transform => {
  const scaleFactor = newDistance / canvas.previous.distance
  return getTransform(canvas, {
    scale: canvas.previous.transform.scale * scaleFactor
  })
}

const move = (canvas: CanvasState, delta: Point): Transform =>
  getTransform(canvas, {
    translate: {
      x: canvas.previous.transform.translate.x + delta.x,
      y: canvas.previous.transform.translate.y + delta.y
    }
  })

const pan = (canvas: CanvasState, delta: Point): Transform =>
  getTransform(canvas, {
    translate: {
      x: canvas.transform.translate.x - delta.x,
      y: canvas.transform.translate.y - delta.y
    }
  })

const scroll = (
  canvas: CanvasState,
  point: Point,
  delta: Point,
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

  // Apply transforms
  return getTransform(canvas, {
    scale,
    translate: getTranslation(canvas, scale, point)
  })
}

const getCurrentState = (canvas: CanvasState, distance: number = 0): PreviousState => ({
  transform: {
    translate: {
      x: canvas.transform.translate.x,
      y: canvas.transform.translate.y
    },
    scale: canvas.transform.scale
  },
  distance
})

const getViewCenter = (canvas: CanvasState) =>
  screenToCanvas(canvas, {
    x: canvas.container.x + canvas.container.width / 2,
    y: canvas.container.y + canvas.container.height / 2
  })

export const interact = {
  pan,
  getCurrentState,
  screenToCanvas,
  getViewCenter,
  canvasToScreen,
  zoom,
  pinch,
  move,
  scroll,
  normalise
}
