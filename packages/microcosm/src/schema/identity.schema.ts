import { isBoolean, isObject, isString } from '@figureland/kit/ts/guards'
import { isValidIdentityID } from '../guards/uuid-guards'
import type { IdentityID } from './uuid.schema'

export type Identity = {
  identityID: IdentityID
  nickname?: string
}

export type IdentityWithStatus = Identity & {
  timestamp: number
  joined: boolean
}

export const isIdentity = (id: unknown): id is Identity => {
  if (!isObject(id)) {
    return false
  }
  const valid = 'identityID' in id && isValidIdentityID(id.identityID)
  if ('nickname' in id) {
    return valid && isString(id.nickname)
  } else {
    return valid
  }
}

export const isIdentityWithStatus = (id: unknown): id is IdentityWithStatus =>
  isIdentity(id) && 'joined' in id && isBoolean(id.joined)
