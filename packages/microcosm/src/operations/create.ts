import type { DistributiveOmit } from '@figureland/typekit/object'
import {
  type Node,
  type NodeType,
  type PartialNode,
  type LatestSchemaVersions,
  latestNodeSchemaVersions
} from '../schema/node.schema'
import type { Version } from '../schema/nodes/schema'
import type { ReadonlyNodeFields } from '../schema/nodes/shared'
import { createNodeID, createTimestamp } from './uuid'

export type NodeCreatePayload<T extends NodeType> = DistributiveOmit<
  Node<T>,
  ReadonlyNodeFields
> & {
  type: T
}

export const create = <T extends NodeType>(node: NodeCreatePayload<T>) => {
  const created = createTimestamp()
  return {
    ...node,
    id: createNodeID(),
    schema: latestNodeSchemaVersions[node.type],
    created,
    lastEdited: created
  } as unknown as Version<LatestSchemaVersions[T], Node<T>>
}
