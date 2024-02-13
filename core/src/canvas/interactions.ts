import { BACKGROUND_GRID_UNIT, MAX_ZOOM, MIN_ZOOM, SNAP_GRID_UNIT } from './constants'
import { calculateTranslation, calculateZoom } from './geometry'
import { clamp } from './number'
import { type Box, type Point, type Transform, defaultBox, defaultTransform, isBox } from './schema'
import { Tool } from './tools'

export type PreviousState = {
  transform: Transform
  distance: number
}

export type CanvasState = {
  container: Box
  transform: Transform
  previous: PreviousState
  backgroundGrid: number
  snapGrid: number
  tool: Tool
  loaded: boolean
}

export const defaultCanvasState = (): CanvasState => ({
  transform: defaultTransform(),
  container: defaultBox(),
  snapGrid: SNAP_GRID_UNIT,
  backgroundGrid: BACKGROUND_GRID_UNIT,
  previous: {
    transform: defaultTransform(),
    distance: 0
  },
  loaded: false,
  tool: Tool.Select
})

const snapToGrid = ({ snapGrid }: CanvasState, value: number) =>
  Math.round(value / snapGrid) * snapGrid

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

const transform = (canvas: CanvasState, newTransform: Partial<Transform> = {}): Transform => {
  const { transform } = canvas
  const x = newTransform.translate?.x || transform.translate.x
  const y = newTransform.translate?.y || transform.translate.y
  const scale = newTransform.scale || transform.scale

  // const maxX = Math.max(0, (canvas.width * scale - container.width) / 2)
  // const maxY = Math.max(0, (canvas.height * scale - container.height) / 2)
  const maxX = Infinity
  const maxY = Infinity

  return {
    translate: {
      x: clamp(x, -maxX, maxX),
      y: clamp(y, -maxY, maxY)
    },
    scale: scale
  }
}

const zoom = (canvas: CanvasState, newScale: number): Transform => {
  const newTranslation = calculateTranslation(
    canvas.transform.scale,
    newScale,
    canvas.transform.translate,
    {
      x: canvas.container.width / 2,
      y: canvas.container.height / 2
    },
    canvas.container
  )

  return transform(canvas, {
    scale: newScale,
    translate: newTranslation
  })
}

const pinch = (canvas: CanvasState, newDistance: number): Transform => {
  const scaleFactor = newDistance / canvas.previous.distance
  return transform(canvas, {
    scale: canvas.previous.transform.scale * scaleFactor
  })
}

const move = (canvas: CanvasState, delta: Point): Transform => {
  return transform(canvas, {
    translate: {
      x: canvas.previous.transform.translate.x + delta.x,
      y: canvas.previous.transform.translate.y + delta.y
    }
  })
}

const scroll = (canvas: CanvasState, point: Point, delta: Point): Transform => {
  if (!isTool(canvas, Tool.Move) && delta.y % 1 === 0) {
    return transform(canvas, {
      translate: {
        x: canvas.transform.translate.x - delta.x,
        y: canvas.transform.translate.y - delta.y
      }
    })
  }

  if (
    (canvas.transform.scale >= MAX_ZOOM && delta.y < 0) ||
    (canvas.transform.scale <= MIN_ZOOM && delta.y > 0)
  ) {
    return canvas.transform
  }

  const multiplier = 1
  const scrollAdjustment = Math.min(0.009 * multiplier * Math.abs(delta.y), 0.08)
  const scale = calculateZoom(canvas.transform.scale, Math.sign(delta.y), scrollAdjustment)

  // Apply transforms
  return transform(canvas, {
    scale,
    translate: calculateTranslation(
      canvas.transform.scale,
      scale,
      canvas.transform.translate,
      point,
      canvas.container
    )
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

const isTool = (canvas: CanvasState, ...tools: Tool[]): boolean => tools.includes(canvas.tool)

export const interact = {
  isTool,
  getCurrentState,
  screenToCanvas,
  getViewCenter,
  canvasToScreen,
  transform,
  zoom,
  pinch,
  move,
  scroll,
  normalise
}
