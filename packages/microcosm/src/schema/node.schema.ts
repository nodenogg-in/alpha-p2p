import { isNumber, isObject, isString } from '@figureland/typekit/guards'
import { keys } from '@figureland/typekit/object'
import { isValidNodeID, type NodeID } from './uuid.schema'
import type { Schema, SchemaNumber, Version } from './schema'

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
      body: string
    }
    2: {
      node_id: NodeID
      body: string
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

export const isNode = (node: unknown): node is Node =>
  isObject(node) &&
  'type' in node &&
  isString(node.type) &&
  nodeTypes.includes(node.type as NodeType) &&
  'schema' in node &&
  isNumber(node.schema) &&
  'lastEdited' in node &&
  isNumber(node.lastEdited) &&
  'created' in node &&
  isNumber(node.created) &&
  'id' in node &&
  isValidNodeID(node.id)

export const isNodeType = <T extends string & NodeType>(node: unknown, type: T): node is Node<T> =>
  isNode(node) && node.type === type

export const isSpatialNode = <N extends SpatialNode>(node: unknown): node is N =>
  isNode(node) &&
  'x' in node &&
  isNumber(node.x) &&
  'y' in node &&
  isNumber(node.y) &&
  'width' in node &&
  isNumber(node.width) &&
  'height' in node &&
  isNumber(node.height)

export const isNodeVersion = <S extends SchemaNumber, T extends string & NodeType>(
  node: unknown,
  schema: S,
  type?: T
): node is Version<S, T extends NodeType ? Node<T> : Node> => {
  const check = isNode(node) && node.schema === schema
  return type ? isNodeType(node, type) && check : check
}
