import { createVersionedSchema, type InferVersionedSchema } from '@figureland/versioned-schema'
import { string, optional, custom } from 'valibot'
import { isString } from '@figureland/kit/tools/guards'
import { createAlphanumericUUID, isValidUUID } from '../common/uuid'

export const isValidIdentityUUID = (input: unknown): input is IdentityUUID =>
  isString(input) && input.startsWith('@') && input.length === 36 && isValidUUID(input.slice(1))

export const createIdentityID = (): IdentityUUID => createAlphanumericUUID('@', 35) as IdentityUUID

export type IdentityUUID = `@${string}`

export const identitySchema = createVersionedSchema({
  base: {
    uuid: custom<IdentityUUID>(isValidIdentityUUID)
  },
  versions: {
    '1': {
      nickname: optional(string())
    }
  }
})

export const create = (nickname?: string) =>
  identitySchema.parse({
    uuid: createIdentityID(),
    nickname
  })

export type Identity = InferVersionedSchema<typeof identitySchema>
