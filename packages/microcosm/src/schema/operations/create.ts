import { type DistributiveOmit, simpleMerge } from '@figureland/typekit'
import { createNodeID, createTimestamp } from '../uuid.utils'
import {
  latestNodeSchemaVersions,
  type ReadonlyNodeFields,
  type Node,
  type NodeType
} from '../node.types'
import type { Version } from '../schema.types'

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

export const create: NodeCreate = (node) => {
  const created = createTimestamp()
  return simpleMerge(node, {
    id: createNodeID(),
    schema: latestNodeSchemaVersions[node.type],
    created,
    lastEdited: created
  })
}
