import { createVersionedSchema, type InferVersionedSchema } from '@figureland/versioned-schema'
import { string, literal, array } from 'valibot'

export const microcosmSchema = createVersionedSchema({
  base: {
    uid: string()
  },
  versions: {
    '1': {},
    '2': {
      v1: string()
    },
    '3': {
      v2: string(),
      v3: array(literal('a', 'b'))
    },
    '4': {
      v1: string()
    }
  }
})

export type Microcosm = InferVersionedSchema<typeof microcosmSchema>
