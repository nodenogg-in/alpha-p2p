import { type DistributiveOmit, simpleMerge, assignSame, entries } from '@figureland/typekit'
import { createNodeID, createTimestamp } from '../utils/uuid'
import {
  latestNodeSchemaVersions,
  type ReadonlyNodeFields,
  type Node,
  type NodeType
} from './node-types'
import type { Version } from './schema-types'
import { isNodeVersion } from './node-guards'

export const create = <
  T extends NodeType,
  N extends Version<(typeof latestNodeSchemaVersions)[T], Node<T>>
>(
  node: DistributiveOmit<N, ReadonlyNodeFields> & { type: T }
): Node<T> & { schema: (typeof latestNodeSchemaVersions)[T] } => {
  const created = createTimestamp()
  return simpleMerge(node, {
    id: createNodeID(),
    schema: latestNodeSchemaVersions[node.type],
    created,
    lastEdited: created
  })
}

export const update = <
  T extends NodeType,
  N extends Version<(typeof latestNodeSchemaVersions)[T], Node<T>>
>(
  existing: N,
  update: Partial<DistributiveOmit<N, ReadonlyNodeFields>>
): N =>
  simpleMerge(simpleMerge(existing, update), {
    lastEdited: createTimestamp(),
    schema: latestNodeSchemaVersions[existing.type]
  })

export const createNodeUpgrade =
  <
    T extends NodeType,
    V1 extends Node<T>['schema'],
    V2 extends Node<T>['schema'],
    I extends Version<V1, Node<T>>,
    O extends Version<V2, Node<T>>,
    AddFields extends Omit<Partial<O>, ReadonlyNodeFields>
  >(
    type: T,
    migration: [V1, V2],
    changes: {
      add?: (i: I) => AddFields
      remove?: (keyof I)[]
    }
  ): ((node: I) => O) =>
  (node: I): O => {
    if (isNodeVersion(node, migration[1], type)) {
      return node as unknown as O
    }
    const newNode: any = {}

    entries(node).forEach(([key, value]) => {
      if (!changes.remove?.includes(key)) {
        newNode[key] = value
      }
    })

    if (changes.add) {
      assignSame(newNode, changes.add(node))
    }

    newNode.lastEdited = createTimestamp()
    newNode.schema = migration[1]

    return newNode as O
  }
