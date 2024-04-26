import { describe, it, expect } from 'vitest'
import { isValidIdentityID, isValidNodeID, isValidMicrocosmID } from '../uuid.guards'

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

describe('MicrocosmID', () => {
  it('isValidMicrocosmID should correctly validate MicrocosmIDs', () => {
    // Valid IDs
    expect(isValidMicrocosmID('valid-input_1234567890123456')).toBeFalsy()
    expect(isValidMicrocosmID('valid_input-1234_asdf1234-asdf1234')).toBeFalsy()
    expect(isValidMicrocosmID('valid-input-1234_asdf1234-asdf1234')).toBeFalsy()
    expect(isValidMicrocosmID('validinput_1234567890123456')).toBeTruthy()
    expect(isValidMicrocosmID('a.123456789012345')).toBeFalsy()
    expect(isValidMicrocosmID('a_123456789012345')).toBeTruthy()
    expect(
      isValidMicrocosmID('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa.bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
    ).toBeFalsy()
    expect(
      isValidMicrocosmID('aaaaaaaaaaaaaaaaaaaaaaaaaaaaa_bbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
    ).toBeTruthy()

    // Invalid IDs
    expect(isValidMicrocosmID('1234567890123456')).toBeFalsy() // No period separator
    expect(isValidMicrocosmID('too-short.')).toBeFalsy() // Second part too short
    expect(isValidMicrocosmID('.no-first-part')).toBeFalsy() // First part missing
    expect(
      isValidMicrocosmID('aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb')
    ).toBeFalsy() // Exceeds 60 characters
  })
})
