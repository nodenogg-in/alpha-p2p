import { type DistributiveOmit, type NewNode, type Node, isHTMLNode, NodeType } from '../../schema'
import { createTimestamp, isArray, merge, sanitizeHTML } from '../../utils'

type Update<T extends Node> = Partial<DistributiveOmit<T, 'lastEdited'>>

export type NodeUpdate<T extends NodeType> = [string, T, Update<Node<T>>]

export const isNodeUpdate = <T extends NodeType>(
  u: NodeUpdate<T> | NodeUpdate<T>[]
): u is NodeUpdate<T> => isArray(u) && u.length === 2 && typeof u[0] === 'string'

export const updateNode = <T extends Node>(existing: T, update: Update<T>): T =>
  merge(existing, { ...(update as Partial<T>), lastEdited: createTimestamp() })

export const createNode = (newNode: NewNode): Node => ({
  ...newNode,
  ...(isHTMLNode(newNode) ? { content: sanitizeHTML(newNode.content) } : {}),
  lastEdited: createTimestamp()
})

export type NodePatch<T extends NodeType> = (node: Node<T>) => Update<Node<T>>
