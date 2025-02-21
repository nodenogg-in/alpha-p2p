import { Schema } from 'effect'
import {
  createVersionedSchema,
  SchemaVersionNumbers,
  type VersionedSchemaType
} from '../utils/versioned-schema'

export const htmlEntitySchema = createVersionedSchema({
  base: {
    uid: Schema.NonEmptyString,
    type: Schema.Literal('html'),
    lastEdited: Schema.Number,
    created: Schema.Number,
    x: Schema.Number,
    y: Schema.Number,
    width: Schema.Number,
    height: Schema.Number,
    backgroundColor: Schema.String
  },
  versions: {
    '1': {
      content: Schema.String
    }
  }
})
export type HTMLEntityVersion = SchemaVersionNumbers<typeof htmlEntitySchema>

export type HTMLEntity<V extends HTMLEntityVersion> = VersionedSchemaType<
  typeof htmlEntitySchema,
  V
>

htmlEntitySchema.validate
