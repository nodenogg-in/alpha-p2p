import { isBoolean, isObject } from '@figureland/typekit'
import { isValidIdentityID } from './uuid.schema'
import type { IdentityID } from '..'

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
    return valid && typeof id.nickname === 'string'
  } else {
    return valid
  }
}

export const isIdentityWithStatus = (id: unknown): id is IdentityWithStatus =>
  isIdentity(id) && 'joined' in id && isBoolean(id.joined)
