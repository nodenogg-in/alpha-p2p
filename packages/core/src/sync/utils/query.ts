import { isNodeType, type NodeReference, type NodeType } from '@nodenogg.in/schema'

export const getNodesByType = <T extends NodeType | undefined = undefined>(
  nodes: NodeReference[],
  type?: T
) => {
  if (!type) {
    return nodes as T extends undefined ? NodeReference[] : never
  } else {
    return nodes.filter((node: NodeReference) => isNodeType(node[1], type)) as NodeReference<
      typeof type
    >[]
  }
}
