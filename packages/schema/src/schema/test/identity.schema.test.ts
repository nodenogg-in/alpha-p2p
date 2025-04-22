import { describe, it, expect } from 'vitest'
import identity, { type Identity } from '../identity.schema'

describe('identity schema', () => {
  describe('isValidIdentityUUID', () => {
    it('should validate correct identity UUIDs', () => {
      const validID = '@bt4nhr27z8198jp6'
      expect(identity.isValidIdentityUUID(validID)).toBe(true)
    })

    it('should reject invalid identity UUIDs', () => {
      expect(identity.isValidIdentityUUID('invalid')).toBe(false)
      expect(identity.isValidIdentityUUID('@short')).toBe(false)
      expect(identity.isValidIdentityUUID('@invalid!')).toBe(false)
      expect(identity.isValidIdentityUUID(123)).toBe(false)
      expect(identity.isValidIdentityUUID(null)).toBe(false)
    })
  })

  describe('createIdentityID', () => {
    it('should create valid identity UUID with prefix', () => {
      const { uuid } = identity.create()
      expect(identity.isValidIdentityUUID(uuid)).toBe(true)
      expect(uuid.startsWith('@')).toBe(true)
      expect(uuid.length).toBe(17)
    })
  })

  describe('identitySchema', () => {
    it('should validate correct identity object', () => {
      const validIdentity = {
        uuid: '@bt4nhr27z8198jp6',
        nickname: 'test-user',
        version: '1'
      }

      const result = identity.schema.parse(validIdentity)
      expect(result).toEqual(validIdentity)
    })

    it('should allow optional nickname', () => {
      const validIdentity: Identity = {
        uuid: '@bt4nhr27z8198jp6',
        version: '1'
      }

      const result = identity.schema.parse(validIdentity)
      expect(result).toEqual(validIdentity)
    })

    it('should reject invalid identity objects', () => {
      const invalidIdentities = [
        { uuid: 'invalid' },
        { uuid: '@invalid!' },
        { uuid: '@short' },
        { uuid: '@bt4nhr27z8198jp6', nickname: 123 }
      ]

      invalidIdentities.forEach((invalid) => {
        expect(() => identity.schema.parse(invalid)).toThrow()
      })
    })
  })
})
