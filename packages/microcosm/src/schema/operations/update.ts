import { type DistributiveOmit } from '@figureland/typekit/object'
import { simpleMerge } from '@figureland/typekit/merge'
import { createTimestamp } from '../uuid.schema'
import {
  latestNodeSchemaVersions,
  type ReadonlyNodeFields,
  type Node,
  type NodeType
} from '../node.schema'
import type { Version } from '../schema'
import { keys } from '@figureland/typekit'

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

export const update: NodeUpdate = (existing, u) => {
  const updates = omitProps(u)
  if (keys(updates).length === 0) {
    return existing
  }
  return simpleMerge(simpleMerge(existing, updates), {
    lastEdited: createTimestamp(),
    schema: latestNodeSchemaVersions[existing.type]
  })
}

const protectedKeys: ReadonlyNodeFields[] = ['id', 'type', 'schema', 'lastEdited', 'created']

export const omitProps = <N extends Node>(node: NodeUpdatePayload<N>): NodeUpdatePayload<N> =>
  protectedKeys.reduce(
    (acc, key) => {
      delete acc[key]
      return acc
    },
    { ...node }
  )
