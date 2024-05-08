import { isBoolean, isObject } from '@figureland/typekit/guards'
import { isValidIdentityID } from '../guards/uuid-guards'
import type { IdentityID } from './uuid.schema'
import { isString } from '@figureland/typekit'

export type Identity = {
  identityID: IdentityID
  nickname?: string
}

export type IdentityWithStatus = Identity & {
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
