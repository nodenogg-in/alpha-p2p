import { describe, it, expect } from 'vitest'
import {
  createUuid,
  createIdentityID,
  createPassword,
  parseMicrocosmID,
  createTimestamp,
  createEntityID
} from '../uuid'

describe('createUuid', () => {
  it('creates a UUID with the specified prefix and length', () => {
    const uuid = createUuid('test', 10)
    expect(uuid).toMatch(/^test[\w-]{10}$/)
  })
})

describe('createIdentityID', () => {
  it('creates an IdentityID with a provided string', () => {
    const identityID = createIdentityID('teststring')
    expect(identityID).toBe('@teststring')
  })

  it('creates a valid IdentityID without a provided string', () => {
    const identityID = createIdentityID()
    expect(identityID.startsWith('@')).toBeTruthy()
    expect(identityID.length).toBe(37)
  })
})

describe('createEntityID', () => {
  it('creates a valid EntityID', () => {
    const entityID = createEntityID()
    expect(entityID.startsWith('e')).toBeTruthy()
    expect(entityID.length).toBe(9)
  })
})

describe('createPassword', () => {
  it('creates a password of the specified length', () => {
    const password = createPassword(8)
    expect(password).toHaveLength(8)
  })
})

describe('MicrocosmID', () => {
  it('should correctly parse a valid MicrocosmID into its title and id components', () => {
    const microcosmID = 'exampletitle_1234567890abcdef'
    const parsed = parseMicrocosmID(microcosmID)
    expect(parsed).toEqual({ title: 'exampletitle', id: '1234567890abcdef' })
  })

  it('should handle MicrocosmIDs with multiple segments before the period', () => {
    const microcosmID = 'exampletitlemore_1234567890abcdef'
    const parsed = parseMicrocosmID(microcosmID)
    expect(parsed).toEqual({ title: 'exampletitlemore', id: '1234567890abcdef' })
  })

  it('should throw an error for MicrocosmIDs without a period separator', () => {
    const microcosmID = 'exampletitle1234567890abcdef'
    expect(() => parseMicrocosmID(microcosmID)).toThrowError(`Invalid MicrocosmID: ${microcosmID}`)
  })

  it('should throw an error for MicrocosmIDs that are too short', () => {
    const microcosmID = 'short_id'
    expect(() => parseMicrocosmID(microcosmID)).toThrowError(`Invalid MicrocosmID: ${microcosmID}`)
  })

  it('should throw an error for MicrocosmIDs that are too long', () => {
    const microcosmID = 'a'.repeat(45) + '_' + 'b'.repeat(16) // Total length exceeds 60
    expect(() => parseMicrocosmID(microcosmID)).toThrowError(`Invalid MicrocosmID: ${microcosmID}`)
  })
})

describe('createTimestamp', () => {
  it('creates a valid timestamp', () => {
    const timestamp = createTimestamp()
    expect(typeof timestamp).toBe('number')
  })
})
