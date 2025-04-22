import { createVersionedSchema, type InferVersionedSchema } from '@figureland/versioned-schema'
import { custom } from 'valibot'
import { createUUID, isValidUUID } from '../common/uuid'
import { isString } from '../common/utils'

export const isValidMicrocosmUUID = (input: unknown): input is string =>
  isString(input) && input.startsWith('m') && isValidUUID(input.slice(1))

export const createMicrocosmUUID = (): string => createUUID('m') as string

export const microcosmSchema = createVersionedSchema({
  base: {
    uuid: custom<string>(isValidMicrocosmUUID)
  },
  versions: {
    '1': {}
  }
})

export type Microcosm = InferVersionedSchema<typeof microcosmSchema>
