import { createVersionedSchema, type InferVersionedSchema } from '@figureland/versioned-schema'
import { custom } from 'valibot'
import { createUUID, isValidUUID } from '../common/uuid'
import { isString } from '../common/utils'
import { NNError } from '../log'

const MAX_LENGTH = 60
const DEFAULT_NAME = 'untitled'

const sanitizeMicrocosmUUIDTitle = (input?: string): string => {
  if (input) {
    if (isValidMicrocosmUUID(input)) {
      return input
    } else {
      return (input as string).toLowerCase().replace(/[^a-z0-9]/g, '')
    }
  } else {
    return DEFAULT_NAME
  }
}

const createMicrocosmUUID = (input?: string): MicrocosmUUID => {
  if (isValidMicrocosmUUID(input)) return input
  const sanitizedInput = sanitizeMicrocosmUUIDTitle(input)
  const uuid = createUUID()
  return `${sanitizedInput}_${uuid}`.slice(0, MAX_LENGTH) as MicrocosmUUID
}

export const parseMicrocosmUUID = (
  microcosmUUID: MicrocosmUUID | string
): { title: string; id: string } => {
  try {
    if (isValidMicrocosmUUID(microcosmUUID)) {
      const [title, id] = microcosmUUID.split('_')
      return { title, id }
    } else {
      throw new Error()
    }
  } catch {
    throw new NNError({
      name: 'MicrocosmUUID',
      level: 'warn',
      message: `Invalid MicrocosmUUID: ${microcosmUUID}`
    })
  }
}

export const isValidMicrocosmUUID = (input: unknown): input is MicrocosmUUID =>
  isString(input) && /^[0-9A-Za-z]+\_[0-9A-Za-z]+$/i.test(input)

export type MicrocosmUUID = string

const schema = createVersionedSchema({
  base: {
    uuid: custom<string>(isValidMicrocosmUUID)
  },
  versions: {
    '1': {}
  }
})

export type Microcosm = InferVersionedSchema<typeof schema>

export default {
  schema,
  createMicrocosmUUID,
  isValidMicrocosmUUID,
  parseMicrocosmUUID,
  sanitizeMicrocosmUUIDTitle
}
