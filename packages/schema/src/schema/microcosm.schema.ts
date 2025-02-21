import { Schema } from 'effect'
import { createVersionedSchema, type VersionedSchemaType } from '../utils/versioned-schema'

export const microcosmSchema = createVersionedSchema({
  base: {
    uid: Schema.String
  },
  versions: {
    '1': {}
  }
})

export type Microcosm = VersionedSchemaType<typeof microcosmSchema>
