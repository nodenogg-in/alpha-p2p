import type { Node, NodeType } from '@nodenogg.in/microcosm'
import { type WithRequired } from '@figureland/typekit'

export type ParsedNode<T extends NodeType = NodeType> = WithRequired<Partial<Node<T>>, 'type'>

export type FileParser = (file: string) => Promise<ParsedNode>

export type Serializer = (file: Node) => Promise<string>
