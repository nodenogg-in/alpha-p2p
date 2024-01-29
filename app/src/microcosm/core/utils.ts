import { isString } from '@/utils'

export const sanitizeMicrocosmURI = (input: string): string => {
  // Convert to lowercase
  input = input.toLowerCase()
  // Replace spaces, hyphens, and underscores with dots
  let sanitized = input.replace(/[\s-_]+/g, '.')
  // Remove any characters that are not A-Z, a-z, 0-9, or dot
  sanitized = sanitized.replace(/[^a-zA-Z0-9.]/g, '')
  // Replace consecutive dots with a single dot
  sanitized = sanitized.replace(/\.{2,}/g, '.')
  // Remove trailing dot
  sanitized = sanitized.replace(/\.$/, '')
  return sanitized
}

export const isValidMicrocosmURI = (input: string): boolean => {
  // Check if the string only contains a-z, 0-9, or dot, does not have consecutive dots, and does not end with a dot
  return isString(input) && /^[a-z0-9]+(\.[a-z0-9]+)*$/.test(input)
}
