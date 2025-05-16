import { custom, literal, number, object, optional, string, ValiError, variant } from 'valibot'
import { createVersionedSchema, type InferVersionedSchema } from '@figureland/versioned-schema'
import { createTimestamp, isString } from '../common/utils'
import { createUUID, isValidUUID } from '../common/uuid'
import { clone as c } from '@figureland/kit/tools/clone'
import { identity, type IdentityUUID } from '..'

export const isValidEntityUUID = (input: unknown): input is string =>
  isString(input) && input.startsWith('e') && input.length === 17 && isValidUUID(input)

export const createEntityUUID = (): string => createUUID('e')

const entityUUID = custom<string>(isValidEntityUUID)

const schema = createVersionedSchema({
  base: {},
  versions: {
    '1': {
      uuid: entityUUID,
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
        }),
        object({
          type: literal('connection'),
          from: optional(entityUUID),
          to: optional(entityUUID)
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

const update = (entity: Entity, data: Partial<Omit<Entity['data'], 'type'>>) => {
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

export type EntityLocation = `${IdentityUUID}/${string}`

export type EntityPointer =
  | {
      entity_id: string
      identity_id: IdentityUUID
    }
  | EntityLocation

export const getEntityLocation = (identity_id: IdentityUUID, entity_id: string): EntityLocation =>
  `${identity_id}/${entity_id}`

export const parseEntityLocation = (
  location: EntityLocation
): { identity_id: IdentityUUID; entity_id: string } | undefined => {
  if (!isString(location)) {
    return undefined
  }

  const [identity_id, entity_id] = location.split('/')

  if (!identity.isValidIdentityUUID(identity_id) || !isValidEntityUUID(entity_id)) {
    return undefined
  }

  return {
    identity_id,
    entity_id
  }
}

const isEntityType = <T extends EntityDataType>(
  entity: unknown,
  type: T
): entity is Entity & { data: Extract<Entity['data'], { type: T }> } =>
  schema.validate(entity) && entity.data.type === type

export default {
  getEntityLocation,
  parseEntityLocation,
  isValidEntityUUID,
  createEntityUUID,
  isEntityType,
  create,
  update,
  clone,
  schema
}
