import { assignSame, entries } from '@figureland/typekit/object'
import { isNodeVersion } from '../guards/node-guards'
import { Version } from '../schema/nodes/schema'
import { Node, NodeType } from '../schema/node.schema'
import { ReadonlyNodeFields } from '../schema/nodes/shared'
import { createTimestamp } from './uuid'

export type NodeMigration<F, T> = (i: F) => T

export const createMigration =
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
  ): NodeMigration<I, O> =>
  (node) => {
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
