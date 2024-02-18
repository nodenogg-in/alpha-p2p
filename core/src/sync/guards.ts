import { ConnectionNode, EmojiNode, HTMLNode, Node, NodeReference } from './schema'

export const isHTMLNode = (node: Node): node is HTMLNode => node.type === 'html'
export const isConnectionNode = (node: Node): node is ConnectionNode => node.type === 'connection'
export const isEmojiNode = (node: Node): node is EmojiNode => node.type === 'emoji'

export const isHTMLNodeReference = (node: NodeReference): node is NodeReference<HTMLNode> =>
  isHTMLNode(node[1])

export const isConnectionNodeReference = (
  node: NodeReference
): node is NodeReference<ConnectionNode> => isConnectionNode(node[1])

export const isEmojiNodeReference = (node: NodeReference): node is NodeReference<EmojiNode> =>
  isEmojiNode(node[1])
