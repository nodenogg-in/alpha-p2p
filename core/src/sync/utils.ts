import { createTimestamp, isArray } from '../utils'
import type { DistributiveOmit, NewNode, Node } from '../schema'

type Update<T extends Node> = Partial<DistributiveOmit<T, 'lastEdited'>> & { type: T['type'] }

export type NodeUpdate = [string, Update<Node>]

export const isNodeUpdate = (u: NodeUpdate | NodeUpdate[]): u is NodeUpdate =>
  isArray(u) && u.length === 2 && typeof u[0] === 'string'

export const updateNode = <T extends Node>(existing: T, update: Update<T>): T => {
  const result: T = {
    ...existing
  }
  for (const [k, v] of Object.entries(update)) {
    result[k] = v
  }

  result.lastEdited = createTimestamp()
  return result
}

export const createNode = (newNode: NewNode): Node => ({
  ...newNode,
  lastEdited: createTimestamp()
})
