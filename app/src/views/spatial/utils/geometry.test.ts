import { describe, it, expect } from 'vitest'
import {
  calculateTranslation,
  calculateZoom,
  fitAspectRatio,
  getSelectionBox,
  zoomAndTranslate
} from './geometry'
import { MIN_ZOOM, MAX_ZOOM } from '../constants'

describe('calculateTranslation', () => {
  it('should correctly calculate translation for positive scaling', () => {
    const oldScale = 1
    const newScale = 2
    const currentTranslation = { x: 100, y: 100 }
    const pointerPoint = { x: 100, y: 100 }
    const container = { x: 50, y: 50, width: 400, height: 400 }

    const result = calculateTranslation(
      oldScale,
      newScale,
      currentTranslation,
      pointerPoint,
      container
    )
    expect(result).toEqual({ x: 350, y: 350 })
  })

  it('should correctly calculate translation for negative scaling', () => {
    const oldScale = 2
    const newScale = 1
    const currentTranslation = { x: 200, y: 200 }
    const pointerPoint = { x: 300, y: 300 }
    const container = { x: 50, y: 50, width: 400, height: 400 }

    const result = calculateTranslation(
      oldScale,
      newScale,
      currentTranslation,
      pointerPoint,
      container
    )
    expect(result).toEqual({ x: 125, y: 125 })
  })

  it('should handle zero scale', () => {
    const oldScale = 0
    const newScale = 1
    const currentTranslation = { x: 0, y: 0 }
    const pointerPoint = { x: 300, y: 300 }
    const container = { x: 50, y: 50, width: 400, height: 400 }

    const result = calculateTranslation(
      oldScale,
      newScale,
      currentTranslation,
      pointerPoint,
      container
    )
    expect(result).toEqual({ x: -Infinity, y: -Infinity })
  })
})

describe('calculateZoom', () => {
  it('should increase zoom level correctly', () => {
    const scale = 1
    const delta = -1 // Negative delta for zooming in
    const zoomIncrement = 0.1

    const result = calculateZoom(scale, delta, zoomIncrement)
    expect(result).toBeCloseTo(1.1, 9)
  })

  it('should decrease zoom level correctly', () => {
    const scale = 1
    const delta = 1 // Positive delta for zooming out
    const zoomIncrement = 0.1

    const result = calculateZoom(scale, delta, zoomIncrement)
    expect(result).toBe(0.9)
  })

  it('should not exceed MAX_ZOOM', () => {
    const scale = MAX_ZOOM - 0.05
    const delta = -1 // Zooming in
    const zoomIncrement = 0.1

    const result = calculateZoom(scale, delta, zoomIncrement)
    expect(result).toBe(MAX_ZOOM)
  })

  it('should not go below MIN_ZOOM', () => {
    const scale = MIN_ZOOM + 0.05
    const delta = 1 // Zooming out
    const zoomIncrement = 0.1

    const result = calculateZoom(scale, delta, zoomIncrement)
    expect(result).toBe(MIN_ZOOM)
  })
})

describe('zoomAndTranslate', () => {
  it('should correctly apply zoom and translation for zoom in', () => {
    const direction = -1 // Zoom in
    const container = { x: 50, y: 50, width: 400, height: 400 }
    const transform = { scale: 1, translate: { x: 100, y: 100 } }
    const increment = 0.1

    const result = zoomAndTranslate(direction, container, transform, increment)

    expect(result.scale).toBeCloseTo(1.1, 9)
    expect(result.translate).toEqual(expect.any(Object)) // Todo: check for translation object
  })

  it('should correctly apply zoom and translation for zoom out', () => {
    const direction = 1 // Zoom out
    const container = { x: 50, y: 50, width: 400, height: 400 }
    const transform = { scale: 1, translate: { x: 100, y: 100 } }
    const increment = 0.1

    const result = zoomAndTranslate(direction, container, transform, increment)

    expect(result.scale).toBeCloseTo(0.9, 9)

    expect(result.translate).toEqual(expect.any(Object)) // Todo: check for translation object
  })
})

describe('getSelectionBox', () => {
  it('should calculate the correct selection box for positive deltas', () => {
    const origin = { x: 100, y: 100 }
    const delta = { x: 50, y: 50 }

    const result = getSelectionBox(origin, delta)
    expect(result).toEqual({ x: 100, y: 100, width: 50, height: 50 })
  })

  it('should calculate the correct selection box for negative deltas', () => {
    const origin = { x: 100, y: 100 }
    const delta = { x: -30, y: -40 }

    const result = getSelectionBox(origin, delta)
    expect(result).toEqual({ x: 70, y: 60, width: 30, height: 40 })
  })

  it('should handle zero deltas correctly', () => {
    const origin = { x: 100, y: 100 }
    const delta = { x: 0, y: 0 }

    const result = getSelectionBox(origin, delta)
    expect(result).toEqual({ x: 100, y: 100, width: 0, height: 0 })
  })
})

describe('fitAspectRatio', () => {
  it('should correctly fit item into container without padding', () => {
    const item = { width: 800, height: 600 }
    const container = { width: 400, height: 300 }

    const result = fitAspectRatio(item, container)
    expect(result).toEqual({ width: 400, height: 300 })
  })

  it('should correctly fit item into container with padding', () => {
    const item = { width: 800, height: 600 }
    const container = { width: 400, height: 300 }
    const padding: [number, number] = [50, 25]

    const result = fitAspectRatio(item, container, padding)
    expect(result).toEqual({ width: 300, height: 225 })
  })

  it('should handle item smaller than container', () => {
    const item = { width: 200, height: 150 }
    const container = { width: 400, height: 300 }

    const result = fitAspectRatio(item, container)
    expect(result).toEqual({ width: 200, height: 150 })
  })

  it('should maintain aspect ratio when item is wider', () => {
    const item = { width: 800, height: 300 }
    const container = { width: 400, height: 600 }

    const result = fitAspectRatio(item, container)
    expect(result).toEqual({ width: 400, height: 150 })
  })

  it('should maintain aspect ratio when item is taller', () => {
    const item = { width: 300, height: 800 }
    const container = { width: 600, height: 400 }

    const result = fitAspectRatio(item, container)
    expect(result).toEqual({ width: 150, height: 400 })
  })
})
