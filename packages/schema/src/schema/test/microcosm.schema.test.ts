import { describe, it, expect } from 'vitest'
import { isValidMicrocosmUUID, createMicrocosmUUID } from '../microcosm.schema'

describe('isValidMicrocosmUUID', () => {
  it('should validate correct microcosm UUIDs', () => {
    const validID = createMicrocosmUUID()
    expect(isValidMicrocosmUUID(validID)).toBe(true)
  })
})
