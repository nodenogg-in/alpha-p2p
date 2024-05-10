import { keys } from '@figureland/typekit/object'
import type { HTMLNode } from './entities/html-node.entity.schema'
import type { GhostNode } from './entities/ghost-node.entity.schema'
import type { RegionNode } from './entities/region-node.entity.schema'
import type { BaseEntity } from './base-entity.schema'
import type { Schema, SchemaVersionFields } from './utils/schema-utils'
import type { Connection } from './entities/connection.schema'
import type { Emoji } from './entities/emoji.schema'
import type { EntityID, IdentityID } from './uuid.schema'
type AllEntities = HTMLNode | RegionNode | GhostNode | Connection | Emoji

export type UnknownEntity = BaseEntity<{
  type: 'unknown' | string
  schema: Schema<{
    0: SchemaVersionFields
  }>
}>

export type EntityType = AllEntities['type']

export type Entity<T extends EntityType = EntityType> = {
  html: HTMLNode
  region: RegionNode
  ghost: GhostNode
  connection: Connection
  emoji: Emoji
}[T]

export type EntitySchemaVersions = {
  [K in EntityType]: Entity<K>['schema']
}

export type EntityReference = [IdentityID, EntityID]

export const latestEntitySchemaVersions = {
  html: 1,
  region: 1,
  ghost: 1,
  connection: 2,
  emoji: 2
} satisfies EntitySchemaVersions

export type LatestSchemaVersions = typeof latestEntitySchemaVersions

export const entityTypes = keys(latestEntitySchemaVersions)
