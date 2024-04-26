import { isNodeType, type Node, type NodeType } from '../node.schema'

export const getNodesByType = <T extends NodeType | undefined = undefined>(
  nodes: Node[],
  type?: T
) => {
  if (!type) {
    return nodes as T extends undefined ? Node[] : never
  } else {
    return nodes.filter((node: Node) => isNodeType(node[1], type)) as Node<typeof type>[]
  }
}
