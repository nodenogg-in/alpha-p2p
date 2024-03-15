import { isArray, merge } from '@nodenogg.in/utils'
import { sanitizeHTML } from '@nodenogg.in/parsers'
import {
  type DistributiveOmit,
  type NewNode,
  type Node,
  isHTMLNode,
  NodeType
} from '@nodenogg.in/schema'
import { createTimestamp } from './uuid'

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
