import { custom, literal, number, object, optional, string, ValiError, variant } from 'valibot'
import { createVersionedSchema, type InferVersionedSchema } from '@figureland/versioned-schema'
import { isString } from '@figureland/kit/tools'
import { createTimestamp } from '../common/timestamp'
import { createAlphanumericUUID, isValidUUID } from '../common/uuid'

export type EntityUUID = `e${string}`

const ENTITY_UUID_LENGTH = 9

export const isValidEntityUUID = (input: unknown): input is EntityUUID =>
  isString(input) &&
  input.startsWith('e') &&
  input.length === ENTITY_UUID_LENGTH &&
  isValidUUID(input)

export const createEntityUUID = (): EntityUUID =>
  createAlphanumericUUID('e', ENTITY_UUID_LENGTH - 1) as EntityUUID

export const entitySchema = createVersionedSchema({
  base: {
    uuid: custom<EntityUUID>(isValidEntityUUID),
    lastEdited: number(),
    created: number()
  },
  versions: {
    '1': {
      data: variant('type', [
        object({
          type: literal('html'),
          x: number(),
          y: number(),
          width: number(),
          height: number(),
          content: optional(string()),
          backgroundColor: optional(string())
        })
      ])
    }
  }
})

export const create = (data: Entity['data']) => {
  try {
    const timestamp = createTimestamp()
    return entitySchema.parse({
      uuid: createEntityUUID(),
      lastEdited: timestamp,
      created: timestamp,
      version: '1',
      data
    })
  } catch (error) {
    throw new Error(error instanceof ValiError ? error.message : 'Unknown error')
  }
}

export const patch = (entity: Entity, data: Partial<Omit<Entity['data'], 'type'>>) => {
  try {
    return entitySchema.parse({
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

export type Entity = InferVersionedSchema<typeof entitySchema>
