import { describe, it, expect } from 'vitest'
import {
  identitySchema,
  isValidIdentityUUID,
  createIdentityID,
  type Identity
} from './identity.schema'

describe('identity schema', () => {
  describe('isValidIdentityUUID', () => {
    it('should validate correct identity UUIDs', () => {
      const validID = '@abcdefghijklmnopqrstuvwxyz123456789'
      expect(isValidIdentityUUID(validID)).toBe(true)
    })

    it('should reject invalid identity UUIDs', () => {
      expect(isValidIdentityUUID('invalid')).toBe(false)
      expect(isValidIdentityUUID('@short')).toBe(false)
      expect(isValidIdentityUUID('@invalid!')).toBe(false)
      expect(isValidIdentityUUID(123)).toBe(false)
      expect(isValidIdentityUUID(null)).toBe(false)
    })
  })

  describe('createIdentityID', () => {
    it('should create valid identity UUID with prefix', () => {
      const id = createIdentityID()
      expect(isValidIdentityUUID(id)).toBe(true)
      expect(id.startsWith('@')).toBe(true)
      expect(id.length).toBe(36)
    })
  })

  describe('identitySchema', () => {
    it('should validate correct identity object', () => {
      const validIdentity = {
        uuid: '@abcdefghijklmnopqrstuvwxyz123456789',
        nickname: 'test-user',
        version: '1'
      }

      const result = identitySchema.parse(validIdentity)
      expect(result).toEqual(validIdentity)
    })

    it('should allow optional nickname', () => {
      const validIdentity: Identity = {
        uuid: '@abcdefghijklmnopqrstuvwxyz123456789',
        version: '1'
      }

      const result = identitySchema.parse(validIdentity)
      expect(result).toEqual(validIdentity)
    })

    it('should reject invalid identity objects', () => {
      const invalidIdentities = [
        { uuid: 'invalid' },
        { uuid: '@invalid!' },
        { uuid: '@short' },
        { uuid: '@abcdefghijklmnopqrstuvwxyz123456789', nickname: 123 }
      ]

      invalidIdentities.forEach((invalid) => {
        expect(() => identitySchema.parse(invalid)).toThrow()
      })
    })
  })
})
