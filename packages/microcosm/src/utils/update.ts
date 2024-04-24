import { isArray, type DistributiveOmit, simpleMerge } from '@figureland/typekit'
import type { Node, NodeType } from '../schema/core.schema'
import { createNodeID, createTimestamp } from './uuid'
import { NodeID } from '../schema/uuid.schema'

export type NewNode<T extends string | undefined = undefined> = DistributiveOmit<
  Node<T>,
  'lastEdited'
>

export type NodeUpdate<T extends NodeType> = Partial<DistributiveOmit<Node<T>, 'lastEdited'>>

export const isNodeUpdate = <T extends NodeType>(
  u: NodeUpdate<T> | NodeUpdate<T>[]
): u is NodeUpdate<T> => isArray(u) && u.length === 2 && typeof u[0] === 'string'

export const updateNode = <T extends string & NodeType>(
  existing: Node<T>,
  update: NodeUpdate<T>
): Node<T> => {
  const node = simpleMerge(existing, update as Partial<Node<T>>)
  node.lastEdited = createTimestamp()
  return node
}

export const createNode = (newNode: NewNode): [NodeID, Node] => [
  createNodeID(),
  {
    ...newNode,
    lastEdited: createTimestamp()
  }
]

export type NodePatch<T extends NodeType> = (node: Node<T>) => NodeUpdate<T>
