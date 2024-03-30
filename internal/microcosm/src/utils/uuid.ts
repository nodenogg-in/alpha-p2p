import { nanoid } from 'nanoid'
import { isString } from '@nodenogg.in/toolkit'
import { IdentityID, MicrocosmID, NodeID } from '..'

export const createUuid = (prefix: string, l: number = 18) => `${prefix}_${nanoid(l)}`

export const createIdentityID = (str?: string): IdentityID =>
  str ? `identity_${str}` : (createUuid('identity', 36) as IdentityID)

export const createNodeID = (): NodeID => createUuid('node', 36) as NodeID

export const createTimestamp = () => Date.now()

export const createPassword = (l: number = 6) => nanoid(l)

export const isValidIdentityID = (input: unknown): input is IdentityID =>
  isString(input) && input.startsWith('identity_') && input.length === 45

export const isValidNodeID = (input: unknown): input is NodeID =>
  isString(input) && input.startsWith('node_') && input.length === 41

export const getMicrososmID = (input: string): MicrocosmID => {
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
  return sanitized as MicrocosmID
}

export const isValidMicrocosmID = (input: unknown): input is MicrocosmID => {
  // Check if the string only contains a-z, 0-9, or dot, does not have consecutive dots, and does not end with a dot
  return isString(input) && /^[a-z0-9]+(\.[a-z0-9]+)*$/.test(input)
}
