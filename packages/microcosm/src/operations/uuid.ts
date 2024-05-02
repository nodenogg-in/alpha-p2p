import { nanoid, customAlphabet } from 'nanoid'
import { isValidMicrocosmID } from '..'

/**
 * A unique identifier for a {@link Node}
 */
export type NodeID = `node_${string}`

/**
 * A unique identifier for an {@link Identity}
 */
export type IdentityID = `identity_${string}`

/**
 * A unique identifier for a {@link Microcosm}.
 * A microcosm ID contains a-z, 0-9 is formed of two parts: the user friendly name and the UUID,
 * for example `adam_abcdefgh1234`.
 */
export type MicrocosmID = string & { __TYPE__: 'MicrocosmID' }

export const createTimestamp = () => Date.now()

export const createUuid = (prefix: string, l: number = 18) =>
  `${prefix ? `${prefix}_` : ''}${nanoid(l)}`

export const createIdentityID = (str?: string): IdentityID =>
  str ? `identity_${str}` : (createUuid('identity', 36) as IdentityID)

export const createNodeID = (): NodeID => createUuid('node', 36) as NodeID

export const createPassword = (l: number = 6) => nanoid(l)

export const MIN_LENGTH = 16
export const MAX_LENGTH = 60
export const DEFAULT_NAME = 'untitled'

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
