import { keys } from '@figureland/typekit'
import type { NodeID } from './uuid.schema'
import type { Schema } from './schema-types'

export type ReadonlyNodeFields = 'id' | 'lastEdited' | 'created' | 'schema' | 'type'

export type BaseNode<O extends { type: string; schema: Schema }> = O['schema'] & {
  id: NodeID
  type: O['type']
  lastEdited: number
  created: number
}

export type SpatialNode = {
  x: number
  y: number
  z?: number
  width: number
  height: number
  depth?: number
  locked?: number
}

export type RegionNode = BaseNode<{
  type: 'region'
  schema: Schema<{
    1: SpatialNode & {
      title?: string
      background_color?: string
    }
  }>
}>

export type GhostNode = BaseNode<{
  type: 'ghost'
  schema: Schema<{
    1: SpatialNode & {
      deleted: number
    }
  }>
}>

export type HTMLNode = BaseNode<{
  type: 'html'
  schema: Schema<{
    1: SpatialNode & {
      body: string
      background_color?: string
    }
  }>
}>

export type EmojiNode = BaseNode<{
  type: 'emoji'
  schema: Schema<{
    1: {
      node_id: NodeID
      content: string
    }
    2: {
      node_id: NodeID
      content: string
      background_color?: string
    }
  }>
}>

export type ConnectionNode = BaseNode<{
  type: 'connection'
  schema: Schema<{
    1: {
      from: NodeID
      to: NodeID
      content: string
    }
  }>
}>

type Nodes = {
  html: HTMLNode
  region: RegionNode
  ghost: GhostNode
  emoji: EmojiNode
  connection: ConnectionNode
}

export type NodeType = string & keyof Nodes

export type Node<T extends NodeType = NodeType> = Nodes[T]

export type NodeSchemaVersions = {
  [K in NodeType]: Node<K>['schema']
}

export const latestNodeSchemaVersions = {
  html: 1,
  region: 1,
  ghost: 1,
  emoji: 2,
  connection: 1
} satisfies NodeSchemaVersions

export type LatestSchemaVersions = typeof latestNodeSchemaVersions

export const nodeTypes: NodeType[] = keys(latestNodeSchemaVersions) as NodeType[]
