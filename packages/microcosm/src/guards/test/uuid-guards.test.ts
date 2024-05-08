import { describe, it, expect } from 'vitest'
import { isValidMicrocosmID, isValidEntityID, isValidIdentityID } from '../uuid-guards'

describe('isValidIdentityID', () => {
  it('validates correct IdentityID format', () => {
    expect(isValidIdentityID('@teststring')).toBeFalsy()
  })

  it('rejects invalid IdentityID format', () => {
    expect(isValidIdentityID('e_teststring')).toBeFalsy()
  })
})

describe('isValidEntityID', () => {
  it('validates correct EntityID format', () => {
    expect(isValidEntityID('e_0')).toBeFalsy()
  })
  it('validates correct EntityID format', () => {
    expect(isValidEntityID('e_teststring')).toBeFalsy()
  })

  it('rejects invalid EntityID format', () => {
    expect(isValidEntityID('@teststring')).toBeFalsy()
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
