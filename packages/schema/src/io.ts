import type { StandardSchemaV1 } from '@standard-schema/spec'
import { Schema, JSONSchema } from 'effect'
import { VersionedSchema } from './utils/versioned-schema'

export const createStandardSchema = ({ schema }: VersionedSchema): StandardSchemaV1<any> =>
  Schema.standardSchemaV1(schema)

export const createJSONSchema = ({ schema }: VersionedSchema) => JSONSchema.make(schema)
