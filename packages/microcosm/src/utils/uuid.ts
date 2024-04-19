import { nanoid, customAlphabet } from 'nanoid'
import { isString } from '@figureland/typekit'
import type { IdentityID, MicrocosmID, NodeID } from '../schema/uuid.schema'

export const createTimestamp = () => Date.now()

export const createUuid = (prefix: string, l: number = 18) =>
  `${prefix ? `${prefix}_` : ''}${nanoid(l)}`

export const createIdentityID = (str?: string): IdentityID =>
  str ? `identity_${str}` : (createUuid('identity', 36) as IdentityID)

export const createNodeID = (): NodeID => createUuid('node', 36) as NodeID

export const createPassword = (l: number = 6) => nanoid(l)

export const isValidIdentityID = (input: unknown): input is IdentityID =>
  isString(input) && input.startsWith('identity_') && input.length === 45

export const isValidNodeID = (input: unknown): input is NodeID =>
  isString(input) && input.startsWith('node_') && input.length === 41

const MIN_LENGTH = 16
const MAX_LENGTH = 60
const DEFAULT_NAME = 'untitled'

export const sanitizeMicrocosmIDTitle = (input?: string): string => {
  if (input) {
    if (isValidMicrocosmID(input)) {
      return input
    } else {
      return input.toLowerCase().replace(/[^a-z0-9]/g, '')
    }
  } else {
    return DEFAULT_NAME
  }
}

const microcosmUuid = customAlphabet('abcdefghijklmnopqrstuvwxyz', 16)

export const createMicrocosmID = (input?: string): MicrocosmID => {
  if (isValidMicrocosmID(input)) return input
  const sanitizedInput = sanitizeMicrocosmIDTitle(input)
  const uuid = microcosmUuid()
  return `${sanitizedInput}_${uuid}`.slice(0, MAX_LENGTH) as MicrocosmID
}

// Function to check if a given input is a valid MicrocosmID
export const isValidMicrocosmID = (input: unknown): input is MicrocosmID => {
  return (
    typeof input === 'string' &&
    /^[a-z0-9]+\_[a-z0-9]+$/i.test(input) &&
    input.length >= MIN_LENGTH &&
    input.length <= MAX_LENGTH
  )
}

export const parseMicrocosmID = (
  microcosmID: MicrocosmID | string
): { title: string; id: string } => {
  try {
    if (isValidMicrocosmID(microcosmID)) {
      const [title, id] = microcosmID.split('_')
      return { title, id }
    } else {
      throw new Error()
    }
  } catch {
    throw new Error(`Invalid MicrocosmID: ${microcosmID}`)
  }
}
