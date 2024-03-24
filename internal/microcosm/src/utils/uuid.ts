import { nanoid } from 'nanoid'
import { isString } from '@nodenogg.in/toolkit'
import { Identity_UID, Microcosm_URI, Node_ID } from '..'

export const createUuid = (prefix: string, l: number = 18) => `${prefix}_${nanoid(l)}`

export const createIdentityUID = (): Identity_UID => createUuid('identity', 36) as Identity_UID

export const createNodeID = (): Node_ID => createUuid('node', 36) as Node_ID

export const createTimestamp = () => Date.now()

export const password = (l: number = 6) => nanoid(l)

export const isValidIdentityUID = (input: unknown): input is Identity_UID =>
  isString(input) && input.startsWith('identity_') && input.length === 45

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
