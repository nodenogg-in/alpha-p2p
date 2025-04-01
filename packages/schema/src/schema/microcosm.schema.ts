import { isString } from '@figureland/kit/tools'
import { createVersionedSchema, type InferVersionedSchema } from '@figureland/versioned-schema'
import { custom } from 'valibot'
import { isValidUUID } from '../common/uuid'

export type MicrocosmUUID = `m${string}`

export const isValidMicrocosmUUID = (input: unknown): input is MicrocosmUUID =>
  isString(input) && input.startsWith('@') && input.length === 36 && isValidUUID(input.slice(1))

export const microcosmSchema = createVersionedSchema({
  base: {
    uuid: custom<MicrocosmUUID>(isValidMicrocosmUUID)
  },
  versions: {
    '1': {}
  }
})

export type Microcosm = InferVersionedSchema<typeof microcosmSchema>
