import { describe, it, expect } from 'vitest'
import { clamp, lerp, mapRange } from './number'

describe('clamp', () => {
  it('should return the value if it is within the bounds', () => {
    const value = 5
    const low = 1
    const high = 10

    const result = clamp(value, low, high)
    expect(result).toBe(5)
  })

  it('should return the low bound if the value is below it', () => {
    const value = -3
    const low = 0
    const high = 10

    const result = clamp(value, low, high)
    expect(result).toBe(0)
  })

  it('should return the high bound if the value is above it', () => {
    const value = 15
    const low = 0
    const high = 10

    const result = clamp(value, low, high)
    expect(result).toBe(10)
  })
})

describe('mapRange', () => {
  it('should correctly map value from one range to another', () => {
    const value = 5
    const low1 = 0
    const high1 = 10
    const low2 = 0
    const high2 = 100

    const result = mapRange(value, low1, high1, low2, high2)
    expect(result).toBe(50)
  })

  it('should handle negative ranges', () => {
    const value = -5
    const low1 = -10
    const high1 = 0
    const low2 = 0
    const high2 = 10

    const result = mapRange(value, low1, high1, low2, high2)
    expect(result).toBe(5)
  })

  it('should handle input value outside the input range', () => {
    const value = 15
    const low1 = 0
    const high1 = 10
    const low2 = 0
    const high2 = 100

    const result = mapRange(value, low1, high1, low2, high2)
    expect(result).toBe(150)
  })
})

describe('lerp', () => {
  it('should interpolate towards the first value for amount close to 0', () => {
    const from = 0
    const to = 10
    const amount = 0.1

    const result = lerp(from, to, amount)
    expect(result).toBe(1)
  })

  it('should interpolate towards the second value for amount close to 1', () => {
    const from = 0
    const to = 10
    const amount = 0.9

    const result = lerp(from, to, amount)
    expect(result).toBe(9)
  })

  it('should return the first value for amount 0', () => {
    const from = 0
    const to = 10
    const amount = 0

    const result = lerp(from, to, amount)
    expect(result).toBe(0)
  })

  it('should return the second value for amount 1', () => {
    const from = 0
    const to = 10
    const amount = 1

    const result = lerp(from, to, amount)
    expect(result).toBe(10)
  })

  it('should handle negative values', () => {
    const from = -10
    const to = 10
    const amount = 0.5

    const result = lerp(from, to, amount)
    expect(result).toBe(0)
  })
})
