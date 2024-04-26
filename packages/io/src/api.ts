import type { Node, NodeType } from '@nodenogg.in/microcosm'

export type ParsedNode<T extends NodeType> = Partial<Node<T>> & { type: T }

export type FileParser<T extends NodeType = NodeType> = (file: string) => Promise<ParsedNode<T>>

export type Serializer = (file: Node) => Promise<string>
