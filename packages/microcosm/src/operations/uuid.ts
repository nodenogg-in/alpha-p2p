import { nanoid, customAlphabet } from 'nanoid'
import { isValidEntityID, isValidIdentityID, isValidMicrocosmID } from '../guards/uuid-guards'
import type { EntityID, EntityLocation, IdentityID, MicrocosmID } from '../schema/uuid.schema'
import { isString } from '@figureland/typekit/guards'

export const createTimestamp = () => Date.now()

export const createUuid = (prefix: string, l: number = 18) =>
  `${prefix ? `${prefix}` : ''}${nanoid(l)}`

export const createIdentityID = (str?: string): IdentityID =>
  str ? `@${str}` : (createUuid('@', 36) as IdentityID)

export const createEntityID = (): EntityID => createUuid('e_', 36) as EntityID

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

export const getEntityLocation = (identity_id: IdentityID, entity_id: EntityID): EntityLocation =>
  `${identity_id}/${entity_id}`

export const parseEntityLocation = (
  location: EntityLocation
): { identity_id: IdentityID; entity_id: EntityID } | undefined => {
  if (!isString(location)) {
    return undefined
  }

  const [identity_id, entity_id] = location.split('/')

  if (!isValidIdentityID(identity_id) || !isValidEntityID(entity_id)) {
    return undefined
  }

  return {
    identity_id,
    entity_id
  }
}
