import { createVersionedSchema, type InferVersionedSchema } from '@figureland/versioned-schema'
import { custom } from 'valibot'
import { createAlphanumericUUID, isValidUUID } from '../common/uuid'
import { isString } from '../common/utils'

const MICROCOSM_UUID_LENGTH = 36

export const isValidMicrocosmUUID = (input: unknown): input is string =>
  isString(input) &&
  input.startsWith('m') &&
  input.length === MICROCOSM_UUID_LENGTH &&
  isValidUUID(input.slice(1))

export const createMicrocosmUUID = (): string =>
  createAlphanumericUUID('m', MICROCOSM_UUID_LENGTH - 1) as string

export const microcosmSchema = createVersionedSchema({
  base: {
    uuid: custom<string>(isValidMicrocosmUUID)
  },
  versions: {
    '1': {}
  }
})

export type Microcosm = InferVersionedSchema<typeof microcosmSchema>
