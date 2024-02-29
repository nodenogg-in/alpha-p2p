import { describe, it, expect } from 'vitest'
import { createUuid, createTimestamp } from '../uuid'

describe('uuid', () => {
  it('should create a valid UUID', () => {
    const uuid = createUuid('node')
    expect(typeof uuid).toBe('string')
    expect(uuid).toHaveLength(23)
  })

  it('should create a valid timestamp', () => {
    const timestamp = createTimestamp()
    expect(typeof timestamp).toBe('number')
    const now = Date.now()
    expect(timestamp).toBeLessThanOrEqual(now)
    expect(timestamp).toBeGreaterThan(now - 1000)
  })
})
