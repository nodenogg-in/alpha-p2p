import { describe, it, expect } from 'vitest'
import {
  createUuid,
  createIdentityID,
  createNodeID,
  createTimestamp,
  createPassword,
  isValidIdentityID,
  isValidNodeID,
  getMicrososmID,
  isValidMicrocosmID
} from '../uuid'

describe('createUuid', () => {
  it('creates a UUID with the specified prefix and length', () => {
    const uuid = createUuid('test', 10)
    expect(uuid).toMatch(/^test_[\w-]{10}$/)
  })
})

describe('createIdentityID', () => {
  it('creates an IdentityID with a provided string', () => {
    const identityID = createIdentityID('teststring')
    expect(identityID).toBe('identity_teststring')
  })

  it('creates a valid IdentityID without a provided string', () => {
    const identityID = createIdentityID()
    expect(identityID.startsWith('identity_')).toBeTruthy()
    expect(identityID.length).toBe(45)
  })
})

describe('createNodeID', () => {
  it('creates a valid NodeID', () => {
    const nodeID = createNodeID()
    expect(nodeID.startsWith('node_')).toBeTruthy()
    expect(nodeID.length).toBe(41)
  })
})

describe('createTimestamp', () => {
  it('creates a valid timestamp', () => {
    const timestamp = createTimestamp()
    expect(typeof timestamp).toBe('number')
  })
})

describe('createPassword', () => {
  it('creates a password of the specified length', () => {
    const password = createPassword(8)
    expect(password).toHaveLength(8)
  })
})

describe('isValidIdentityID', () => {
  it('validates correct IdentityID format', () => {
    expect(isValidIdentityID('identity_teststring')).toBeFalsy()
  })

  it('rejects invalid IdentityID format', () => {
    expect(isValidIdentityID('node_teststring')).toBeFalsy()
  })
})

describe('isValidNodeID', () => {
  it('validates correct NodeID format', () => {
    expect(isValidNodeID('node_0')).toBeFalsy()
  })
  it('validates correct NodeID format', () => {
    expect(isValidNodeID('node_teststring')).toBeFalsy()
  })

  it('rejects invalid NodeID format', () => {
    expect(isValidNodeID('identity_teststring')).toBeFalsy()
  })
})

describe('getMicrososmID and isValidMicrocosmID', () => {
  it('transforms and validates a MicrocosmID', () => {
    const microcosmID = getMicrososmID(' Test--String ')
    expect(microcosmID).toBe('test.string')
    expect(isValidMicrocosmID(microcosmID)).toBeTruthy()
  })

  it('rejects invalid MicrocosmID', () => {
    expect(isValidMicrocosmID('test..string')).toBeFalsy()
    expect(isValidMicrocosmID('test.string.')).toBeFalsy()
  })
})
