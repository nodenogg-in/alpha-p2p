import { custom, literal, number, optional, string } from 'valibot'
import { createVersionedSchema, type InferVersionedSchema } from '@figureland/versioned-schema'
import { createAlphanumericUUID, isValidUUID } from '../common/uuid'
import { isString } from 'effect/Predicate'
import { createTimestamp } from '../common/timestamp'

export type EntityUUID = `e${string}`

export const isValidEntityUUID = (input: unknown): input is EntityUUID =>
  isString(input) && input.startsWith('e') && input.length === 9 && isValidUUID(input)

export const createEntityUUID = (): EntityUUID => createAlphanumericUUID('e', 8) as EntityUUID

export const htmlEntitySchema = createVersionedSchema({
  base: {
    type: literal('html'),
    uuid: custom<EntityUUID>(isValidEntityUUID)
  },
  versions: {
    '1': {
      lastEdited: number(),
      created: number(),
      x: optional(number(), 0),
      y: optional(number(), 0),
      width: optional(number(), 200),
      height: optional(number(), 200),
      content: optional(string(), ''),
      backgroundColor: optional(string())
    }
  }
})

export const create = (html: PartialHTMLEntity = {}) => {
  const timestamp = createTimestamp()

  return htmlEntitySchema.parse({
    uuid: createEntityUUID(),
    type: 'html',
    lastEdited: timestamp,
    created: timestamp,
    version: '1',
    ...html
  } as HTMLEntity)
}

export const patch = (entity: HTMLEntity, html: PartialHTMLEntity) => {
  return htmlEntitySchema.parse({
    ...entity,
    ...html,
    lastEdited: createTimestamp()
  } as HTMLEntity)
}

export type PartialHTMLEntity = Partial<
  Pick<HTMLEntity, 'x' | 'y' | 'width' | 'height' | 'content' | 'backgroundColor'>
>

export type HTMLEntity = InferVersionedSchema<typeof htmlEntitySchema>
