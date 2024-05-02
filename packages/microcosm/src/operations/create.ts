import type { DistributiveOmit } from '@figureland/typekit/object'
import { type Node, type NodeType, latestNodeSchemaVersions } from '../schema/node.schema'
import type { Version } from '../schema/nodes/schema'
import type { ReadonlyNodeFields } from '../schema/nodes/shared'
import { createNodeID, createTimestamp } from './uuid'

export type NodeCreate = <
  T extends NodeType,
  N extends Version<(typeof latestNodeSchemaVersions)[T], Node<T>>
>(
  node: NodeCreatePayload<T, N>
) => Node<T> & { schema: (typeof latestNodeSchemaVersions)[T] }

export type NodeCreatePayload<
  T extends NodeType = NodeType,
  N extends Node<T> = Node<T>
> = DistributiveOmit<N, ReadonlyNodeFields> & { type: T }

export const create = <
  T extends NodeType,
  N extends Version<(typeof latestNodeSchemaVersions)[T], Node<T>>
>(
  node: NodeCreatePayload<T, N>
) => {
  const created = createTimestamp()
  return {
    ...node,
    id: createNodeID(),
    schema: latestNodeSchemaVersions[node.type],
    created,
    lastEdited: created
  } as unknown as Node<T>
}
