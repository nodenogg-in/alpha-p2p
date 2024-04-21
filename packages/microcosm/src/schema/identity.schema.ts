import { type Input, boolean, object, optional, intersect, string, special } from 'valibot'
import { type IdentityID } from '..'
import { isValidIdentityID } from '../utils/uuid'

export const identityID = special<IdentityID>(isValidIdentityID)
/**
 * Validation schema for identity
 */
export const identitySchema = object({
  identityID,
  nickname: optional(string())
})

export type Identity = Input<typeof identitySchema>

export const identityStatusSchema = intersect([
  identitySchema,
  object({
    joined: boolean()
  })
])

export type IdentityWithStatus = Identity & {
  joined: boolean
}
