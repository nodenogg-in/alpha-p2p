import type { IdentityID } from '..'

export type Identity = {
  identityID: IdentityID
  nickname?: string
}

export type IdentityWithStatus = Identity & {
  joined: boolean
}
