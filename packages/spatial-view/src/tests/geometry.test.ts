import { describe, it, expect } from 'vitest'
import { fitAspectRatio } from '../geometry'

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
