import { is } from 'valibot'
import { isArray } from '@nodenogg.in/utils'
import { nodeSchema, type NewNode, type Node, type NodeReference, NodeType } from './core.schema'

export const isHTMLNode = (node: Node | NewNode): node is Node<'html'> => node.type === 'html'

export const isConnectionNode = (node: Node | NewNode): node is Node<'connection'> =>
  node.type === 'connection'

export const isEmojiNode = (node: Node | NewNode): node is Node<'emoji'> => node.type === 'emoji'

export const isNode = (n: unknown): n is Node => is(nodeSchema, n)

export const isNodeReference = (n: [string, unknown]): n is NodeReference => isNode(n[1])

export const isNodeType = <T extends string & NodeType>(node: unknown, type: T): node is Node<T> =>
  isNode(node) && node.type === type

export const isNodeReferenceType = <T extends string & NodeType>(
  n: unknown,
  type: T
): n is NodeReference<T> => isArray(n) && isNodeType(n[1], type)
