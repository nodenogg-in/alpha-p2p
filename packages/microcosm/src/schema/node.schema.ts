import { keys } from '@figureland/typekit'
import type { EmojiNode } from './nodes/emoji-node.schema'
import type { HTMLNode } from './nodes/html-node.schema'
import type { ConnectionNode } from './nodes/connection-node.schema'
import type { GhostNode } from './nodes/ghost-node.schema'
import type { RegionNode } from './nodes/region-node.schema'

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
