import { describe, it, expect } from 'vitest'
import { MicrocosmSchema } from '../microcosm.schema'

describe('isValidMicrocosmUUID', () => {
  it('should validate correct microcosm UUIDs', () => {
    const validID = MicrocosmSchema.utils.createMicrocosmUUID()
    expect(MicrocosmSchema.utils.isValidMicrocosmUUID(validID)).toBe(true)
  })
})
