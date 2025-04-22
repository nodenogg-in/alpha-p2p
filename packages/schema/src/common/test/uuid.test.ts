import { expect, describe, it } from 'vitest'
import { createUUID, isValidUUID } from '../uuid'

describe('UUID Module', () => {
  describe('createUUID', () => {
    it('should generate UUID with default length', () => {
      const uuid = createUUID()
      expect(uuid).toHaveLength(16)
      expect(isValidUUID(uuid)).toBe(true)
    })

    it('should generate UUID with prefix', () => {
      const prefix = 'test_'
      const uuid = createUUID(prefix)
      expect(uuid).toMatch(/^test_/)
      expect(uuid.length).toBe(prefix.length + 16)
      expect(isValidUUID(uuid.slice(prefix.length))).toBe(true)
    })

    it('should generate unique values', () => {
      const uuids = new Set()
      for (let i = 0; i < 1000; i++) {
        uuids.add(createUUID())
      }
      expect(uuids.size).toBe(1000)
    })
  })

  describe('isValidUUID', () => {
    it('should return true for valid alphanumeric strings', () => {
      expect(isValidUUID('abc123')).toBe(true)
      expect(isValidUUID('ABC123')).toBe(true)
      expect(isValidUUID('123456')).toBe(true)
      expect(isValidUUID('abcDEF123')).toBe(true)
    })

    it('should return false for invalid strings', () => {
      expect(isValidUUID('')).toBe(false)
      expect(isValidUUID('abc-123')).toBe(false)
      expect(isValidUUID('abc_123')).toBe(false)
      expect(isValidUUID('abc 123')).toBe(false)
      expect(isValidUUID('abc#123')).toBe(false)
    })
  })
})
