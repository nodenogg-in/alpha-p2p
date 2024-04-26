import { type DistributiveOmit, simpleMerge } from '@figureland/typekit'
import { createTimestamp } from '../uuid.schema'
import {
  latestNodeSchemaVersions,
  type ReadonlyNodeFields,
  type Node,
  type NodeType
} from '../node.schema'
import type { Version } from '../schema'

export type NodeUpdate = <
  T extends NodeType,
  N extends Version<(typeof latestNodeSchemaVersions)[T], Node<T>>
>(
  existing: N,
  update: NodeUpdatePayload<N>
) => N

export type NodeUpdatePayload<N extends Node = Node> = Partial<
  DistributiveOmit<N, ReadonlyNodeFields>
>

export const update: NodeUpdate = (existing, update) =>
  simpleMerge(simpleMerge(existing, update), {
    lastEdited: createTimestamp(),
    schema: latestNodeSchemaVersions[existing.type]
  })
