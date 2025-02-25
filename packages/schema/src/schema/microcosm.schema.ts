import { createVersionedSchema, type InferVersionedSchema } from '@figureland/versioned-schema'
import { string } from 'valibot'

export const microcosmSchema = createVersionedSchema({
  base: {
    uid: string()
  },
  versions: {
    '1': {}
  }
})

export type Microcosm = InferVersionedSchema<typeof microcosmSchema>
