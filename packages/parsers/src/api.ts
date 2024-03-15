import { isObject } from '@nodenogg.in/utils'
import type { DistributiveOmit, Node, NodeType } from '@nodenogg.in/schema'

export type ValidMimeType =
  | 'text/markdown'
  | 'text/plain'
  | 'text/html'
  | 'image/svg+xml'
  | 'application/json'

export const VALID_MIME_TYPES: ValidMimeType[] = [
  'text/markdown',
  'text/plain',
  'text/html',
  'image/svg+xml',
  'application/json'
]

type WithRequired<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>

export type ParsedNode<T extends NodeType = NodeType> = WithRequired<
  DistributiveOmit<Node<T>, 'lastEdited'>,
  'type' | 'content'
>

export type FileParser = (file: string) => Promise<ParsedNode>

export const isParsedNodeType = <T extends NodeType>(
  node: unknown,
  type: T
): node is ParsedNode<T> => isObject(node) && 'type' in node && node.type === type
