import type { DistributiveOmit } from '@figureland/typekit/object'
import { createNodeID, createTimestamp } from '../uuid.schema'
import {
  latestNodeSchemaVersions,
  type ReadonlyNodeFields,
  type Node,
  type NodeType
} from '../node.schema'
import type { Version } from '../schema'

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
