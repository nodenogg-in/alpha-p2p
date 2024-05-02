import { type DistributiveOmit } from '@figureland/typekit/object'
import { createTimestamp } from './uuid'
import type { Version } from '../schema/nodes/schema'
import { keys } from '@figureland/typekit'
import { Node, NodeType, latestNodeSchemaVersions } from '../schema/node.schema'
import { ReadonlyNodeFields } from '../schema/nodes/shared'

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
  const updates = omitProps(u, protectedKeys as (keyof typeof u)[])
  if (keys(updates).length === 0) {
    return existing
  }
  return {
    ...existing,
    ...updates,
    lastEdited: createTimestamp(),
    schema: latestNodeSchemaVersions[existing.type]
  }
}

const protectedKeys: ReadonlyNodeFields[] = ['id', 'type', 'schema', 'lastEdited', 'created']

export const omitProps = <N extends object, K extends keyof N>(node: N, omit: K[]): N =>
  omit.reduce((acc, key) => {
    if (key in acc) {
      delete acc[key]
    }
    return acc
  }, node)
