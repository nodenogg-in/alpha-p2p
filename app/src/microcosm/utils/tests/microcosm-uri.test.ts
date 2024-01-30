import { describe, it, expect } from 'vitest'
import { isValidMicrocosmURI, sanitizeMicrocosmURI } from '../microcosm-uri'

describe('URL String Sanitization and Validation', () => {
  // Tests for sanitizeForURL
  it('should replace spaces, hyphens, and underscores with dots', () => {
    expect(sanitizeMicrocosmURI('hello world-this_is a test')).toBe('hello.world.this.is.a.test')
  })

  it('should remove uppercase letters', () => {
    expect(sanitizeMicrocosmURI('HelloWorld')).toBe('helloworld')
  })

  it('should remove invalid characters', () => {
    expect(sanitizeMicrocosmURI('hello@#$world!')).toBe('helloworld')
  })

  it('should handle empty strings', () => {
    expect(sanitizeMicrocosmURI('')).toBe('')
  })

  it('should replace consecutive dots with a single dot', () => {
    expect(sanitizeMicrocosmURI('hello...world')).toBe('hello.world')
    expect(sanitizeMicrocosmURI('hello..world..hello...world.hello....world.')).toBe(
      'hello.world.hello.world.hello.world'
    )
  })

  it('should remove leading and trailing dots', () => {
    expect(sanitizeMicrocosmURI('hello.world.')).toBe('hello.world')
    expect(sanitizeMicrocosmURI('.hello.world.')).toBe('hello.world')
    expect(sanitizeMicrocosmURI('.hello.world')).toBe('hello.world')
    expect(sanitizeMicrocosmURI('.hello')).toBe('hello')
    expect(sanitizeMicrocosmURI('hello.')).toBe('hello')
  })

  // Tests for isValidURLString
  it('should return true for valid URI strings', () => {
    expect(isValidMicrocosmURI('hello.world.something')).toBe(true)
    expect(isValidMicrocosmURI('hello.world')).toBe(true)
    expect(isValidMicrocosmURI('hello')).toBe(true)
  })

  it('should return false for invalid Microcosm URIs', () => {
    expect(isValidMicrocosmURI('Hello World')).toBe(false)
    expect(isValidMicrocosmURI('hello world')).toBe(false)
    expect(isValidMicrocosmURI('hello@world')).toBe(false)
    expect(isValidMicrocosmURI('hello..world')).toBe(false)
    expect(isValidMicrocosmURI('hello.world.')).toBe(false)
    expect(isValidMicrocosmURI('.hello.world.')).toBe(false)
  })

  it('should return false for empty strings', () => {
    expect(isValidMicrocosmURI('')).toBe(false)
  })
})
