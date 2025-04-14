import { createVersionedSchema, type InferVersionedSchema } from '@figureland/versioned-schema'
import { string, optional, custom } from 'valibot'
import { createAlphanumericUUID, isValidUUID } from '../common/uuid'
import { isString } from '../common/utils'

const isValidIdentityUUID = (input: unknown): input is IdentityUUID =>
  isString(input) && input.startsWith('@') && input.length === 36 && isValidUUID(input.slice(1))

export const createIdentityID = (): IdentityUUID => createAlphanumericUUID('@', 35) as IdentityUUID

export type IdentityUUID = `@${string}`

const schema = createVersionedSchema({
  base: {
    uuid: custom<IdentityUUID>(isValidIdentityUUID)
  },
  versions: {
    '1': {
      nickname: optional(string())
    }
  }
})

const create = (nickname?: string) =>
  schema.parse({
    uuid: createIdentityID(),
    nickname,
    version: schema.latest
  })

export type Identity = InferVersionedSchema<typeof schema>

export default {
  create,
  schema,
  isValidIdentityUUID
}
