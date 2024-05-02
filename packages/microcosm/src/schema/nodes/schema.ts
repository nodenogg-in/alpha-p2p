export type SchemaNumber = number

export type SchemaVersionFields = Record<string, any>

export type Schema<
  Versions extends Record<SchemaNumber, SchemaVersionFields> = Record<
    SchemaNumber,
    SchemaVersionFields
  >
> = {
  [V in keyof Versions]: {
    schema: V
  } & Versions[V]
}[keyof Versions]

export type Version<S extends SchemaNumber, V extends SchemaVersionFields> = V & {
  schema: S
}
