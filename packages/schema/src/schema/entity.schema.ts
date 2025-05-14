import { custom, literal, number, object, optional, string, ValiError, variant } from 'valibot'
import { createVersionedSchema, type InferVersionedSchema } from '@figureland/versioned-schema'
import { createTimestamp, isString } from '../common/utils'
import { createUUID, isValidUUID } from '../common/uuid'
import { clone as c } from '@figureland/kit/tools/clone'

export const isValidEntityUUID = (input: unknown): input is string =>
  isString(input) && input.startsWith('e') && input.length === 17 && isValidUUID(input)

export const createEntityUUID = (): string => createUUID('e')

const schema = createVersionedSchema({
  base: {},
  versions: {
    '1': {
      uuid: custom<string>(isValidEntityUUID),
      lastEdited: number(),
      created: number(),
      data: variant('type', [
        object({
          type: literal('html'),
          x: number(),
          y: number(),
          width: number(),
          height: number(),
          content: string(),
          backgroundColor: optional(string())
        })
      ])
    }
  }
})

const create = (data: Entity['data']) => {
  try {
    const timestamp = createTimestamp()
    return schema.parse({
      uuid: createEntityUUID(),
      lastEdited: timestamp,
      created: timestamp,
      version: schema.latest,
      data
    })
  } catch (error) {
    throw new Error(error instanceof ValiError ? error.message : 'Unknown error')
  }
}

const clone = (entity: Entity) => create(c(entity.data))

const patch = (entity: Entity, data: Partial<Omit<Entity['data'], 'type'>>) => {
  try {
    return schema.parse({
      ...entity,
      lastEdited: createTimestamp(),
      data: {
        ...entity.data,
        ...data
      }
    } as Entity)
  } catch (error) {
    throw new Error(error instanceof ValiError ? error.message : 'Unknown error')
  }
}

export type Entity = InferVersionedSchema<typeof schema>

export type EntityDataType = Entity['data']['type']

export const isEntityDataType = (input: unknown): input is EntityDataType =>
  typeof input === 'string' && ['html'].includes(input)

export default {
  create,
  patch,
  clone,
  schema
}
