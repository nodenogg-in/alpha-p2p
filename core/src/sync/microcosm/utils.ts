import { isArray } from '../../utils'
import { Node } from '../schema'

type Update<T extends Node> = Partial<T> & { type: T['type'] }

export type NodeUpdate = [string, Update<Node>]

// export type HTMLNodeUpdate = Update<HTMLNode>
// export type ConnectionNodeUpdate = Update<ConnectionNode>
// export type EmojiNodeUpdate = Update<EmojiNode>

export const isNodeUpdate = (u: NodeUpdate | NodeUpdate[]): u is NodeUpdate =>
  isArray(u) && u.length === 2 && typeof u[0] === 'string'

export const updateNode = <T extends Node>(existing: T, update: Update<T>): T => {
  const result: T = { ...existing }
  for (const [k, v] of Object.entries(update)) {
    result[k] = v
  }
  return result
}
