import { picklist, is } from 'valibot'
import { nodeSchema, type NewNode, type Node, type NodeReference } from './core.schema'
import { type ViewType, viewTypes } from './views.schema'

export const isHTMLNode = (node: Node | NewNode): node is Node<'html'> => node.type === 'html'
export const isConnectionNode = (node: Node | NewNode): node is Node<'connection'> =>
  node.type === 'connection'
export const isEmojiNode = (node: Node | NewNode): node is Node<'emoji'> => node.type === 'emoji'

export const isHTMLNodeReference = (node: NodeReference<'html'>): node is NodeReference<'html'> =>
  isHTMLNode(node[1])

export const isConnectionNodeReference = (
  node: NodeReference
): node is NodeReference<'connection'> => isConnectionNode(node[1])

export const isEmojiNodeReference = (node: NodeReference): node is NodeReference<'emoji'> =>
  isEmojiNode(node[1])

export const isValidView = (view: string): view is ViewType => is(picklist(viewTypes), view)

export const isNode = (n: unknown): n is Node => is(nodeSchema, n)

export const isNodeReference = (n: [string, unknown]) => isNode(n[1])
