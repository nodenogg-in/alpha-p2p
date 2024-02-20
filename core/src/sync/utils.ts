import { DistributiveOmit, createTimestamp, isArray } from '../utils'
import type { NewNode, Node } from '../schema/core.schema'

type Update<T extends Node> = Partial<DistributiveOmit<T, 'lastEdited'>> & { type: T['type'] }

export type NodeUpdate = [string, Update<Node>]

export const isNodeUpdate = (u: NodeUpdate | NodeUpdate[]): u is NodeUpdate =>
  isArray(u) && u.length === 2 && typeof u[0] === 'string'

export const updateNode = <T extends Node>(existing: T, update: Update<T>): T => {
  const result: T = {
    lastEdited: createTimestamp(),
    ...existing
  }
  for (const [k, v] of Object.entries(update)) {
    result[k] = v
  }

  return result
}

export const createNode = (newNode: NewNode): Node => ({
  ...newNode,
  lastEdited: createTimestamp()
})
