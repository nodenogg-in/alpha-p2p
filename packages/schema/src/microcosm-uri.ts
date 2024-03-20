import { isString } from '@nodenogg.in/utils'
import { Microcosm_URI } from './uuid.schema'

export const getMicrocosmURI = (input: string): Microcosm_URI => {
  // Convert to lowercase
  input = input.toLowerCase()
  // Replace spaces, hyphens, and underscores with dots
  let sanitized = input.replace(/[\s-_]+/g, '.')
  // Remove any characters that are not A-Z, a-z, 0-9, or dot
  sanitized = sanitized.replace(/[^a-zA-Z0-9.]/g, '')
  // Replace consecutive dots with a single dot
  sanitized = sanitized.replace(/\.{2,}/g, '.')
  // Remove leading and trailing dot if present
  sanitized = sanitized.replace(/^\./, '').replace(/\.$/, '')
  return sanitized as Microcosm_URI
}

export const isValidMicrocosmURI = (input: unknown): input is Microcosm_URI => {
  // Check if the string only contains a-z, 0-9, or dot, does not have consecutive dots, and does not end with a dot
  return isString(input) && /^[a-z0-9]+(\.[a-z0-9]+)*$/.test(input)
}
