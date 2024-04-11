import type { Node, NodeType } from '@nodenogg.in/microcosm'
import { isObject, type DistributiveOmit, type WithRequired } from '@figureland/toolkit'

export type ParsedNode<T extends NodeType = NodeType> = WithRequired<
  DistributiveOmit<Node<T>, 'lastEdited'>,
  'type' | 'content'
>

export type FileParser = (file: string) => Promise<ParsedNode>

export const isParsedNodeType = <T extends NodeType>(
  node: unknown,
  type: T
): node is ParsedNode<T> => isObject(node) && 'type' in node && node.type === type

export type Serializer = (file: Node) => Promise<string>
