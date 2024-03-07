import { describe, it, expect, beforeEach } from 'vitest'
import {
  CanvasInteractionState,
  canvasToScreen,
  move,
  pan,
  pinch,
  relativeToContainer,
  screenToCanvas,
  scroll,
  zoom
} from '..'
import { MAX_ZOOM, MIN_ZOOM } from '../constants'

let canvasState: CanvasInteractionState

beforeEach(() => {
  canvasState = {
    viewport: { x: 0, y: 0, width: 800, height: 600 },
    transform: { translate: { x: 0, y: 0 }, scale: 1 },
    bounds: { x: 1000, y: 1000 },
    previous: {
      distance: 0,
      transform: { translate: { x: 0, y: 0 }, scale: 1 }
    },
    cardOutline: 1,
    snapToGrid: true,
    grid: 10,
    background: 'none',
    loaded: false
  }
})

describe('relativeToContainer', () => {
  it('should normalize a point relative to the canvas container', () => {
    const point = { x: 100, y: 150 }
    const normalized = relativeToContainer(canvasState, point)
    expect(normalized).toEqual({ x: 100, y: 150 })
  })
})

describe('screenToCanvas', () => {
  it('should convert screen coordinates to canvas coordinates for Point', () => {
    const point = { x: 400, y: 300 }
    const converted = screenToCanvas(canvasState, point)
    expect(converted).toEqual(
      expect.objectContaining({ x: expect.any(Number), y: expect.any(Number) })
    )
  })

  it('should convert screen coordinates to canvas coordinates for Box', () => {
    const box = { x: 400, y: 300, width: 100, height: 50 }
    const converted = screenToCanvas(canvasState, box)
    expect(converted).toEqual(
      expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number),
        width: expect.any(Number),
        height: expect.any(Number)
      })
    )
  })
})

describe('canvasToScreen', () => {
  it('should convert canvas coordinates to screen coordinates for Point', () => {
    const point = { x: 0, y: 0 } // Assuming this is the center of the canvas
    const converted = canvasToScreen(canvasState, point)
    expect(converted).toEqual({ x: 400, y: 300 }) // Considering the container's dimensions
  })

  it('should handle scaling correctly for Box', () => {
    canvasState.transform.scale = 2
    const box = { x: 0, y: 0, width: 50, height: 25 }
    const converted = canvasToScreen(canvasState, box, true)
    expect(converted).toEqual(expect.objectContaining({ width: 100, height: 50 }))
  })
})

describe('zoom', () => {
  it('should correctly apply zoom to the canvas', () => {
    const newScale = 2
    const transformed = zoom(canvasState, newScale)
    expect(transformed.scale).toBe(newScale)
  })

  it('should not exceed the MAX_ZOOM limit', () => {
    const newScale = MAX_ZOOM + 1
    const transformed = zoom(canvasState, newScale)
    expect(transformed.scale).toBeLessThanOrEqual(MAX_ZOOM)
  })

  it('should not go below MIN_ZOOM limit', () => {
    const newScale = 0
    const transformed = zoom(canvasState, newScale)
    expect(transformed.scale).toBe(MIN_ZOOM)
  })
})

describe('pinch', () => {
  it('should adjust scale based on pinch distance', () => {
    canvasState.previous.distance = 100
    const newDistance = 200
    const transformed = pinch(canvasState, newDistance)
    expect(transformed.scale).toBeGreaterThan(1)
  })
})

describe('move and pan', () => {
  it('should move the canvas by the delta amount', () => {
    const delta = { x: 10, y: -20 }
    const movedTransform = move(canvasState, delta)
    expect(movedTransform.translate.x).toBe(delta.x)
    expect(movedTransform.translate.y).toBe(delta.y)
  })

  it('should pan the canvas inversely by the delta amount', () => {
    const delta = { x: 10, y: -20 }
    const panTransform = pan(canvasState, delta)
    expect(panTransform.translate.x).toBe(-delta.x)
    expect(panTransform.translate.y).toBe(-delta.y)
  })
})

describe('scroll', () => {
  it('should adjust the zoom based on scroll direction and delta', () => {
    const point = { x: 400, y: 300 }
    const delta = { x: 0, y: 100 } // Scrolling up to zoom in
    const initialScale = canvasState.transform.scale
    const transformed = scroll(canvasState, point, delta, 1)
    expect(transformed.scale).toBeGreaterThan(initialScale)
  })

  it('should not zoom out beyond MIN_ZOOM', () => {
    const point = { x: 400, y: 300 }
    const delta = { x: 0, y: -100 } // Scrolling down to zoom out
    canvasState.transform.scale = MIN_ZOOM // Assuming MIN_ZOOM is a predefined limit
    const transformed = scroll(canvasState, point, delta, 1)
    expect(transformed.scale).toBeGreaterThanOrEqual(MIN_ZOOM)
  })
})
