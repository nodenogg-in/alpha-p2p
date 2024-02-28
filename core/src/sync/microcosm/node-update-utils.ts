import { type DistributiveOmit, type NewNode, type Node, isHTMLNode } from '../../schema'
import { createTimestamp, isArray, merge, sanitizeHTML } from '../../utils'

type Update<T extends Node> = Partial<DistributiveOmit<T, 'lastEdited'>> & { type: T['type'] }

export type NodeUpdate = [string, Update<Node>]

export const isNodeUpdate = (u: NodeUpdate | NodeUpdate[]): u is NodeUpdate =>
  isArray(u) && u.length === 2 && typeof u[0] === 'string'

export const updateNode = <T extends Node>(existing: T, update: Update<T>): T => {
  const result: T = {
    ...existing
  }
  merge(result, update as Partial<T>)

  result.lastEdited = createTimestamp()
  return result
}

export const createNode = (newNode: NewNode): Node => ({
  ...newNode,
  ...(isHTMLNode(newNode) ? { content: sanitizeHTML(newNode.content) } : {}),
  lastEdited: createTimestamp()
})
