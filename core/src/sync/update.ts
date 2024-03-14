import { type DistributiveOmit, type NewNode, type Node, isHTMLNode, NodeType } from '../schema'
import { createTimestamp, isArray, merge, sanitizeHTML } from '../utils'

export type NodeUpdate<T extends NodeType> = Partial<DistributiveOmit<Node<T>, 'lastEdited'>>

export const isNodeUpdate = <T extends NodeType>(
  u: NodeUpdate<T> | NodeUpdate<T>[]
): u is NodeUpdate<T> => isArray(u) && u.length === 2 && typeof u[0] === 'string'

export const updateNode = <T extends string & NodeType>(
  existing: Node<T>,
  update: NodeUpdate<T>
): Node<T> => merge(existing, { ...(update as Partial<Node<T>>), lastEdited: createTimestamp() })

export const createNode = (newNode: NewNode): Node => ({
  ...newNode,
  ...(isHTMLNode(newNode) ? { content: sanitizeHTML(newNode.content) } : {}),
  lastEdited: createTimestamp()
})

export type NodePatch<T extends NodeType> = (node: Node<T>) => NodeUpdate<T>
