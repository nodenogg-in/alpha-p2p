import { type Input, boolean, object, optional, intersect, string } from 'valibot'

/**
 * Validation schema for identity
 */
export const identitySchema = object({
  user_id: string(),
  username: optional(string())
})

export type Identity = Input<typeof identitySchema>

export const identityStatusSchema = intersect([
  identitySchema,
  object({
    joined: boolean()
  })
])

export type IdentityWithStatus = Input<typeof identityStatusSchema>
