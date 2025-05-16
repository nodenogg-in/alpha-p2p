import { describe, it, expect } from 'vitest'
import microcosm from '../microcosm.schema'

describe('isValidMicrocosmUUID', () => {
  it('should validate correct microcosm UUIDs', () => {
    const validID = microcosm.createMicrocosmUUID()
    expect(microcosm.isValidMicrocosmUUID(validID)).toBe(true)
  })
})
