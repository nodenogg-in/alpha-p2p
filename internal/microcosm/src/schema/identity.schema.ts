import { type Input, boolean, object, optional, intersect, string, special } from 'valibot'
import { type IdentityID } from '..'
import { isValidIdentityUID } from '../utils/uuid'

export const identityUID = special<IdentityID>(isValidIdentityUID)
/**
 * Validation schema for identity
 */
export const identitySchema = object({
  IdentityID: identityUID,
  username: optional(string())
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
