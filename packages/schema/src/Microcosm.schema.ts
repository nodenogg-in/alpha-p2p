import { createVersionedSchema, type InferVersionedSchema } from '@figureland/versioned-schema'
import { freeze } from '@figureland/kit/tools/object'
import { custom } from 'valibot'
import { createUUID, isValidUUID } from './uuid'
import { isString } from './utils'

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
  // const sanitizedInput = sanitizeMicrocosmUUIDTitle(input)
  // const uuid = createUUID()
  return createUUID()
  // return `${sanitizedInput}_${uuid}`.slice(0, MAX_LENGTH) as MicrocosmUUID
}

export const parseMicrocosmUUID = (microcosmUUID: string) => {
  if (isValidMicrocosmUUID(microcosmUUID)) {
    return microcosmUUID
  } else {
    throw new Error()
  }
}

export const isValidMicrocosmUUID = (input: unknown): input is MicrocosmUUID =>
  // isString(input) && /^[0-9A-Za-z]+\_[0-9A-Za-z]+$/i.test(input)
  isString(input) && isValidUUID(input) && input.length > 2

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

export const MicrocosmSchema = freeze({
  schema,
  utils: {
    createMicrocosmUUID,
    isValidMicrocosmUUID,
    parseMicrocosmUUID,
    sanitizeMicrocosmUUIDTitle
  }
})
