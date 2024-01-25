import { describe, it, expect } from 'vitest'
import { isValidMicrocosmURI, sanitizeMicrocosmURI } from './utils'

describe('URL String Sanitization and Validation', () => {
  // Tests for sanitizeForURL
  it('should replace spaces, hyphens, and underscores with dots', () => {
    expect(sanitizeMicrocosmURI('hello world-this_is a test')).toBe('hello.world.this.is.a.test')
  })

  it('should remove invalid characters', () => {
    expect(sanitizeMicrocosmURI('hello@#$world!')).toBe('helloworld')
  })

  it('should handle empty strings', () => {
    expect(sanitizeMicrocosmURI('')).toBe('')
  })

  // Tests for isValidURLString
  it('should return true for valid URL strings', () => {
    expect(isValidMicrocosmURI('hello.world')).toBe(true)
  })

  it('should return false for invalid URL strings', () => {
    expect(isValidMicrocosmURI('hello world')).toBe(false)
    expect(isValidMicrocosmURI('hello@world')).toBe(false)
  })

  it('should return false for empty strings', () => {
    expect(isValidMicrocosmURI('')).toBe(false)
  })
})
