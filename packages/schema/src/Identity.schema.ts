import { createVersionedSchema, type InferVersionedSchema } from '@figureland/versioned-schema'
import { string, optional, custom } from 'valibot'
import { createUUID, isValidUUID } from './uuid'
import { isString } from './utils'
import { freeze } from '@figureland/kit/tools/object'

export const isValidIdentityUUID = (input: unknown): input is IdentityUUID =>
  isString(input) && input.startsWith('@') && input.length === 17 && isValidUUID(input.slice(1))

const createIdentityID = (): IdentityUUID => createUUID('@') as IdentityUUID

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

export const IdentitySchema = freeze({
  api: {
    create
  },
  schema,
  utils: {
    isValidIdentityUUID
  }
})
