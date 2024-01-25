import { isString } from '@/utils'

export const sanitizeMicrocosmURI = (input: string): string => {
  // Replace spaces, hyphens, and underscores with dots
  let sanitized = input.replace(/[\s-_]/g, '.')
  // Remove any characters that are not A-Z, a-z, 0-9, or dot
  sanitized = sanitized.replace(/[^a-zA-Z0-9.]/g, '')
  return sanitized
}

export const isValidMicrocosmURI = (input: string): boolean => {
  // Check if the string only contains A-Z, a-z, 0-9, or dot
  return isString(input) && /^[a-zA-Z0-9.]+$/.test(input)
}
