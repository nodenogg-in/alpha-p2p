import { describe, it, expect } from 'vitest'
import {
  type BoxReference,
  calculateBoundingBox,
  intersectBox,
  intersectPoint
} from './intersection'

describe('intersectPoint', () => {
  it('should return an empty array when no boxes are intersected', () => {
    const point = { x: 10, y: 10 }
    const boxes: BoxReference[] = [['box1', { x: 0, y: 0, width: 5, height: 5 }]]

    const result = intersectPoint(point, boxes)
    expect(result).toEqual([])
  })

  it('should return array with intersected box IDs', () => {
    const point = { x: 3, y: 3 }
    const boxes: BoxReference[] = [
      ['box1', { x: 0, y: 0, width: 5, height: 5 }],
      ['box2', { x: 5, y: 5, width: 5, height: 5 }]
    ]

    const result = intersectPoint(point, boxes)
    expect(result).toEqual(['box1'])
  })

  it('should handle points on box edges', () => {
    const point = { x: 5, y: 5 }
    const boxes: BoxReference[] = [['box1', { x: 0, y: 0, width: 5, height: 5 }]]

    const result = intersectPoint(point, boxes)
    expect(result).toEqual(['box1'])
  })
})

describe('intersectBox', () => {
  it('should return no nodes and an empty bounding box for no intersection', () => {
    const selectionBox = { x: 0, y: 0, width: 2, height: 2 }
    const boxes: BoxReference[] = [['box1', { x: 3, y: 3, width: 2, height: 2 }]]

    const result = intersectBox(selectionBox, boxes)
    expect(result).toEqual({ nodes: [], group: { x: 0, y: 0, width: 0, height: 0 } })
  })

  it('should return intersected nodes and their bounding box', () => {
    const selectionBox = { x: 1, y: 1, width: 4, height: 4 }
    const boxes: BoxReference[] = [
      ['box1', { x: 0, y: 0, width: 3, height: 3 }],
      ['box2', { x: 2, y: 2, width: 3, height: 3 }]
    ]

    const result = intersectBox(selectionBox, boxes, 0.001)
    expect(result.nodes).toEqual(['box1', 'box2'])
    expect(result.group).toEqual({ x: 0, y: 0, width: 5, height: 5 })
  })
})

describe('calculateBoundingBox', () => {
  it('should return an empty bounding box for no boxes', () => {
    const boxes: BoxReference[] = []

    const result = calculateBoundingBox(boxes)
    expect(result).toEqual({ x: 0, y: 0, width: 0, height: 0 })
  })

  it('should calculate the correct bounding box for multiple boxes', () => {
    const boxes: BoxReference[] = [
      ['box1', { x: 1, y: 1, width: 2, height: 2 }],
      ['box2', { x: 4, y: 3, width: 3, height: 3 }]
    ]

    const result = calculateBoundingBox(boxes)
    expect(result).toEqual({ x: 1, y: 1, width: 6, height: 5 })
  })

  it('should handle overlapping boxes correctly', () => {
    const boxes: BoxReference[] = [
      ['box1', { x: 1, y: 1, width: 4, height: 4 }],
      ['box2', { x: 3, y: 3, width: 2, height: 2 }]
    ]

    const result = calculateBoundingBox(boxes)
    expect(result).toEqual({ x: 1, y: 1, width: 4, height: 4 }) // Should encompass both boxes
  })

  it('should handle boxes with negative coordinates', () => {
    const boxes: BoxReference[] = [
      ['box1', { x: -2, y: -2, width: 3, height: 3 }],
      ['box2', { x: 1, y: 1, width: 2, height: 2 }]
    ]

    const result = calculateBoundingBox(boxes)
    expect(result).toEqual({ x: -2, y: -2, width: 5, height: 5 })
  })

  it('should not include origin in bounding box for negative coordinate boxes', () => {
    const boxes: BoxReference[] = [
      ['box1', { x: -1000, y: -600, width: 300, height: 200 }],
      ['box2', { x: -700, y: -400, width: 100, height: 100 }]
    ]

    const result = calculateBoundingBox(boxes)
    expect(result).toEqual({ x: -1000, y: -600, width: 400, height: 300 })
  })
})


