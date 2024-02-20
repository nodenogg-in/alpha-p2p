import type { Node, NodeReference } from '../schema/core.schema'

export const isHTMLNode = (node: Node): node is Node<'html'> => node.type === 'html'
export const isConnectionNode = (node: Node): node is Node<'connection'> =>
  node.type === 'connection'
export const isEmojiNode = (node: Node): node is Node<'emoji'> => node.type === 'emoji'

export const isHTMLNodeReference = (node: NodeReference<'html'>): node is NodeReference<'html'> =>
  isHTMLNode(node[1])

export const isConnectionNodeReference = (
  node: NodeReference
): node is NodeReference<'connection'> => isConnectionNode(node[1])

export const isEmojiNodeReference = (node: NodeReference): node is NodeReference<'emoji'> =>
  isEmojiNode(node[1])
