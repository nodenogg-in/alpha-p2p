import { isArray, merge } from '@nodenogg.in/utils'
import { sanitizeHTML } from '@nodenogg.in/parsers'
import {
  type DistributiveOmit,
  type NewNode,
  type Node,
  isHTMLNode,
  NodeType,
  isNodeType
} from '@nodenogg.in/schema'
import { createTimestamp } from './uuid'

export type NodeUpdate<T extends NodeType> = Partial<DistributiveOmit<Node<T>, 'lastEdited'>>

export const isNodeUpdate = <T extends NodeType>(
  u: NodeUpdate<T> | NodeUpdate<T>[]
): u is NodeUpdate<T> => isArray(u) && u.length === 2 && typeof u[0] === 'string'

export const updateNode = async <T extends string & NodeType>(
  existing: Node<T>,
  update: NodeUpdate<T>
): Promise<Node<T>> => {
  if (isNodeType(existing, 'html') && 'content' in update) {
    update.content = await sanitizeHTML(update.content as string)
  }

  const node = merge(existing, update as Partial<Node<T>>)
  node.lastEdited = createTimestamp()
  return node
}

export const createNode = async (newNode: NewNode): Promise<Node> => ({
  ...newNode,
  ...(isHTMLNode(newNode) ? { content: await sanitizeHTML(newNode.content) } : {}),
  lastEdited: createTimestamp()
})

export type NodePatch<T extends NodeType> = (node: Node<T>) => NodeUpdate<T>
